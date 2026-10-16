<?php
namespace App\Http\Controllers;
use App\Models\{Entry,Media,Setting};
class PublicController extends Controller {
 public function home(){return view('public.home',['homepage'=>Entry::where('type','page')->where('slug','home')->where('published',true)->first(),'services'=>Entry::where('type','service')->where('published',true)->orderBy('sort_order')->get(),'projects'=>Entry::where('type','project')->where('published',true)->where('featured',true)->get(),'packages'=>Entry::where('type','package')->where('published',true)->get(),'faqs'=>Entry::where('type','faq')->where('published',true)->get(),'videos'=>Media::where('approved',true)->where('kind','video')->get()]);}
 public function page(string $locale,string $section){$types=['services'=>'service','products'=>'product','projects'=>'project','faq'=>'faq'];$entries=Entry::where('published',true)->where('type',$types[$section]??'page')->orderBy('sort_order')->get();$entry=isset($types[$section])?null:$entries->firstWhere('slug',$section);return view('public.page',compact('section','entries','entry'));}
 public function detail(string $locale,string $section,string $slug){$type=['services'=>'service','products'=>'product','projects'=>'project'][$section];$entry=Entry::where('type',$type)->where('slug',$slug)->where('published',true)->firstOrFail();return view('public.detail',compact('section','entry'));}
 public function workshop(){return view('public.workshop',['videos'=>Media::where('approved',true)->get()]);}
 public function preview(){return view('public.preview');}
 public function sitemap(){ $urls=[];foreach(['ar','en'] as $l){foreach(['','/services','/products','/projects','/workshop','/preview','/quote','/about','/contact','/faq','/privacy'] as $p)$urls[]=url('/'.$l.$p);foreach(Entry::where('published',true)->whereIn('type',['service','product','project'])->get() as $e)$urls[]=url('/'.$l.'/'.['service'=>'services','product'=>'products','project'=>'projects'][$e->type].'/'.$e->slug);}return response(view('sitemap',compact('urls')),200)->header('Content-Type','application/xml');}
}
