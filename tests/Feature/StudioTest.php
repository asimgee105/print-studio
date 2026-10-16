<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\{Storage,Mail,Hash};
use App\Models\{Entry,Inquiry,User,Setting,Attachment,Quotation};
class StudioTest extends TestCase {
 use RefreshDatabase;
 protected function setUp():void{parent::setUp();$this->seed();}
 private function payload(array $changes=[]):array{return array_replace(['name'=>'Test Customer','phone'=>'+966500000001','city'=>'Riyadh','area'=>'Test Area','service'=>'stickers-vinyl','unit'=>'cm','quantity'=>2,'usage'=>'indoor','installation'=>'1','description'=>'Please quote window graphics for a shop.','consent'=>'1'],$changes);}
 private function user(string $role='admin'):User{return User::factory()->create(['role'=>$role]);}
 public function test_public_pages_render_in_both_locales_without_fake_contact_buttons():void{
 foreach(['ar','en'] as $locale){foreach(['','/services','/products','/projects','/workshop','/preview','/quote','/about','/contact','/faq','/privacy','/services/stickers-vinyl','/projects/dimensional-signs'] as $path)$this->get('/'.$locale.$path)->assertOk();$this->get('/'.$locale)->assertSee('dir="'.($locale==='ar'?'rtl':'ltr').'"',false)->assertDontSee('https://wa.me/')->assertDontSee('href="tel:',false);}
 $this->get('/')->assertRedirect('/ar');$this->get('/fr')->assertNotFound();$this->get('/sitemap.xml')->assertOk()->assertSee('/ar/services/stickers-vinyl');
 }
 public function test_quote_is_saved_with_private_artwork_and_configuration():void{
 Storage::fake('local');$config=['text'=>'متجري','font'=>'sans','color'=>'#8ee8de','material'=>'acrylic','depth'=>.2,'illuminated'=>true,'wall'=>'charcoal'];$response=$this->post('/ar/quote',$this->payload(['configuration'=>json_encode($config),'uploads'=>[UploadedFile::fake()->createWithContent('reference.pdf',"%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF")]]));$response->assertRedirect('/ar/quote')->assertSessionHas('reference');$inquiry=Inquiry::firstOrFail();$this->assertSame('متجري',$inquiry->configuration['text']);$this->assertCount(1,$inquiry->attachments);Storage::disk('local')->assertExists($inquiry->attachments->first()->path);$this->assertDatabaseHas('status_histories',['inquiry_id'=>$inquiry->id,'status'=>'New']);
 }
 public function test_validation_rejects_missing_consent_and_executable_upload():void{
 $this->post('/en/quote',$this->payload(['consent'=>null]))->assertSessionHasErrors('consent');$this->post('/en/quote',$this->payload(['uploads'=>[UploadedFile::fake()->createWithContent('malware.php','<?php echo "unsafe";')]]))->assertSessionHasErrors('uploads.0');$this->assertDatabaseCount('inquiries',0);
 }
 public function test_validation_rejects_spam_and_draft_services():void{
 $this->post('/en/quote',$this->payload(['website'=>'https://spam.test']))->assertSessionHasErrors('website');$this->post('/en/quote',$this->payload(['service'=>'vinyl-material']))->assertStatus(422);$this->assertDatabaseCount('inquiries',0);
 }
 public function test_email_failure_does_not_lose_inquiry():void{
 Setting::updateOrCreate(['key'=>'notification_email'],['value'=>'owner@example.test']);Mail::shouldReceive('raw')->once()->andThrow(new \RuntimeException('SMTP unavailable'));$this->post('/en/quote',$this->payload())->assertSessionHas('reference');$this->assertDatabaseHas('inquiries',['notification_status'=>'failed']);
 }
 public function test_admin_and_artwork_require_authentication_and_staff_role():void{
 $inquiry=Inquiry::create($this->payload(['reference'=>'RFQ-TEST']));$attachment=$inquiry->attachments()->create(['path'=>'inquiries/test.pdf','name'=>'test.pdf','mime'=>'application/pdf']);$this->get('/admin')->assertRedirect('/admin/login');$this->get('/admin/attachments/'.$attachment->id)->assertRedirect('/admin/login');$this->actingAs($this->user('customer'))->get('/admin')->assertForbidden();$this->actingAs($this->user('staff'))->get('/admin/settings')->assertForbidden();
 Storage::fake('local');Storage::disk('local')->put($attachment->path,'private artwork');$this->actingAs($this->user('staff'))->get('/admin/attachments/'.$attachment->id)->assertDownload('test.pdf');
 }
 public function test_staff_can_record_status_history_and_build_quotation_with_exact_totals():void{
 $inquiry=Inquiry::create($this->payload(['reference'=>'RFQ-TOTALS']));$this->actingAs($this->user('staff'))->post('/admin/inquiries/'.$inquiry->id,['status'=>'Contacted','notes'=>'Call customer','assigned_to'=>null])->assertSessionHasNoErrors();$this->assertDatabaseHas('status_histories',['inquiry_id'=>$inquiry->id,'status'=>'Contacted']);
 $data=['items'=>[['description'=>'Signage','quantity'=>3,'price'=>'10.25']],'discount'=>'1.00','delivery'=>'5.00','installation'=>'2.00','tax_rate'=>'15','valid_until'=>now()->addDays(14)->format('Y-m-d'),'terms'=>'Payment after approval'];
 $this->post('/admin/inquiries/'.$inquiry->id.'/quotations',$data)->assertSessionHasNoErrors();$quote=Quotation::firstOrFail();$this->assertSame(3075,$quote->subtotal_cents);$this->assertSame(3675,$quote->total_cents);$this->assertSame(0,$quote->tax_cents);
 Setting::updateOrCreate(['key'=>'tax_enabled'],['value'=>'1']);$this->post('/admin/inquiries/'.$inquiry->id.'/quotations',$data)->assertSessionHasNoErrors();$this->assertSame(4226,Quotation::latest('id')->first()->total_cents);
 foreach(['ar','en'] as $l)$this->get('/admin/quotations/'.$quote->id.'/'.$l)->assertOk();$this->get('/admin/inquiries/'.$inquiry->id)->assertOk();
 }
 public function test_discount_cannot_exceed_subtotal():void{
 $inquiry=Inquiry::create($this->payload(['reference'=>'RFQ-DISCOUNT']));$this->actingAs($this->user())->post('/admin/inquiries/'.$inquiry->id.'/quotations',['items'=>[['description'=>'Sign','quantity'=>1,'price'=>'10.00']],'discount'=>11,'delivery'=>0,'installation'=>0,'tax_rate'=>0,'valid_until'=>now()->addDay()->format('Y-m-d'),'terms'=>'Test terms'])->assertSessionHasErrors('discount');$this->assertDatabaseCount('quotations',0);
 }
 public function test_admin_content_changes_appear_publicly_and_scripts_are_escaped():void{
 $entry=Entry::where('slug','stickers-vinyl')->firstOrFail();$this->actingAs($this->user())->post('/admin/content/service',['id'=>$entry->id,'slug'=>$entry->slug,'title_ar'=>'خدمة جديدة','title_en'=>'Updated service','body_ar'=>'تفاصيل الخدمة الجديدة','body_en'=>'<script>alert(1)</script>','sort_order'=>0,'published'=>1])->assertSessionHasNoErrors();$this->get('/en/services/'.$entry->slug)->assertSee('Updated service')->assertSee('&lt;script&gt;',false)->assertDontSee('<script>alert(1)</script>',false);
 }
 public function test_admin_screens_and_authentication():void{
 $user=$this->user();$this->post('/admin/login',['email'=>$user->email,'password'=>'incorrect'])->assertSessionHasErrors('email');$user->update(['password'=>Hash::make('TestingPassword123!')]);$this->post('/admin/login',['email'=>$user->email,'password'=>'TestingPassword123!'])->assertRedirect('/admin');foreach(['','/content/service','/content/product','/content/project','/content/page','/content/faq','/content/package','/settings','/media','/users'] as $path)$this->get('/admin'.$path)->assertOk();$this->post('/admin/logout')->assertRedirect('/admin/login');$this->assertGuest();
 }

 public function test_unapproved_media_stays_private_until_an_admin_publishes_it():void{
 Storage::fake('local');Storage::fake('public');$this->actingAs($this->user());$file=UploadedFile::fake()->createWithContent('sample.jpg',file_get_contents(public_path('media/roll-print-production.jpg')));$data=['caption_ar'=>'تجربة','caption_en'=>'Test sample','alt_ar'=>'صورة تجربة','alt_en'=>'Test image'];$this->post('/admin/media',$data+['file'=>$file])->assertSessionHasNoErrors();$media=\App\Models\Media::where('caption->en','Test sample')->firstOrFail();$this->assertSame('local',$media->disk);Storage::disk('local')->assertExists($media->path);$oldPath=$media->path;$this->get('/admin/media/'.$media->id.'/file')->assertOk();$this->post('/admin/media/'.$media->id,$data+['approved'=>1])->assertSessionHasNoErrors();$media->refresh();$this->assertSame('public',$media->disk);Storage::disk('local')->assertMissing($oldPath);Storage::disk('public')->assertExists(preg_replace('#^storage/#','',$media->path));$this->post('/admin/media/'.$media->id,$data)->assertSessionHasNoErrors();$media->refresh();$this->assertSame('local',$media->disk);Storage::disk('local')->assertExists($media->path);
 }
 public function test_homepage_and_footer_content_can_be_edited():void{
 Entry::where('slug','home')->first()->update(['title'=>['en'=>'Custom studio heading','ar'=>'عنوان خاص']]);Entry::where('slug','footer')->first()->update(['body'=>['en'=>'Custom footer line','ar'=>'نص خاص']]);$this->get('/en')->assertSee('Custom studio heading')->assertSee('Custom footer line');
 }
 public function test_broken_dimensions_and_untrusted_configuration_are_rejected():void{
 $this->post('/en/quote',$this->payload(['width'=>100]))->assertSessionHasErrors('height');$this->post('/en/quote',$this->payload(['configuration'=>json_encode(['text'=>'Sign','font'=>'unsafe','color'=>'red','material'=>'metal','depth'=>200,'illuminated'=>true,'wall'=>'charcoal'])]))->assertSessionHasErrors(['font','color','depth']);$this->assertDatabaseCount('inquiries',0);
 }
 public function test_inquiry_rate_limit_blocks_excess_requests():void{
 for($i=0;$i<12;$i++)$this->post('/en/quote',[])->assertStatus(302);$this->post('/en/quote',[])->assertStatus(429);
 }
}
