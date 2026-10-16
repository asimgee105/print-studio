<?php
namespace App\Http\Controllers;
use App\Models\{Inquiry,Entry,Setting};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Storage,Mail,Log};
use Illuminate\Support\Str;
class InquiryController extends Controller {
 public function create(){return view('public.quote',['services'=>Entry::where('type','service')->where('published',true)->get(),'products'=>Entry::where('type','product')->where('published',true)->get()]);}
 public function store(Request $request){
 $data=$request->validate(['name'=>'required|string|max:120','company'=>'nullable|string|max:160','phone'=>['required','string','max:30','regex:/^[+0-9 ()-]{7,30}$/'],'email'=>'nullable|email|max:190','city'=>'required|string|max:100','area'=>'required|string|max:150','service'=>'required|string|exists:entries,slug','product'=>'nullable|string|exists:entries,slug','width'=>'nullable|required_with:height|numeric|min:0.01|max:100000','height'=>'nullable|required_with:width|numeric|min:0.01|max:100000','unit'=>'required|in:mm,cm,m','quantity'=>'required|integer|min:1|max:100000','usage'=>'required|in:indoor,outdoor','installation'=>'required|boolean','requested_date'=>'nullable|date|after_or_equal:today','description'=>'required|string|min:10|max:10000','consent'=>'required|accepted','website'=>'prohibited','uploads'=>'nullable|array|max:5','uploads.*'=>'file|mimes:jpg,jpeg,png,webp,pdf|extensions:jpg,jpeg,png,webp,pdf|max:10240','configuration'=>'nullable|json|max:10000','basket'=>'nullable|json|max:12000']);
 abort_unless(Entry::where('type','service')->where('published',true)->where('slug',$data['service'])->exists(),422);
 if(!empty($data['product']))abort_unless(Entry::where('type','product')->where('published',true)->where('slug',$data['product'])->exists(),422);
 $config=json_decode($data['configuration']??'null',true);if($config){validator($config,['text'=>'required|string|max:60','font'=>'required|in:sans,serif','color'=>'required|regex:/^#[0-9a-fA-F]{6}$/','material'=>'required|in:matte,metal,acrylic','depth'=>'required|numeric|between:0.05,0.6','illuminated'=>'required|boolean','wall'=>'required|in:charcoal,stone,sand'])->validate();$config=\Illuminate\Support\Arr::only($config,['text','font','color','material','depth','illuminated','wall']);}
 $basket=json_decode($data['basket']??'null',true);if($basket){validator(['items'=>$basket],['items'=>'array|max:20','items.*.slug'=>'required|string|max:100','items.*.title'=>'required|string|max:200'])->validate();}
 $paths=[];
 try{$inquiry=DB::transaction(function()use($data,$request,$config,$basket,&$paths){$payload=\Illuminate\Support\Arr::except($data,['uploads','website','configuration','basket']);$payload['reference']='RFQ-'.now()->format('ymd').'-'.strtoupper(Str::random(8));$payload['configuration']=$config;$payload['basket']=$basket;$payload['consent']=true;$inquiry=Inquiry::create($payload);foreach($request->file('uploads',[]) as $file){$path=$file->store('inquiries','local');$paths[]=$path;$inquiry->attachments()->create(['path'=>$path,'name'=>$file->getClientOriginalName(),'mime'=>$file->getMimeType()]);}$inquiry->histories()->create(['status'=>'New']);return $inquiry;});}catch(\Throwable $e){Storage::disk('local')->delete($paths);throw $e;}
 $email=Setting::get('notification_email');if(filter_var($email,FILTER_VALIDATE_EMAIL)){try{Mail::raw('New inquiry '.$inquiry->reference.'. Sign into the admin panel to review.',fn($message)=>$message->to($email)->subject('New quotation request'));$inquiry->update(['notification_status'=>in_array(config('mail.default'),['log','array'],true)?'logged_only':'sent']);}catch(\Throwable $e){$inquiry->update(['notification_status'=>'failed']);Log::warning('Inquiry saved; mail failed',['inquiry_id'=>$inquiry->id]);}}
 return redirect()->route('quote',['locale'=>app()->getLocale()])->with('reference',$inquiry->reference);
 }
}
