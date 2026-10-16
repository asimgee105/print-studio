<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{PublicController,InquiryController,AdminController};
Route::get('/',fn()=>redirect('/ar'));
Route::get('/sitemap.xml',[PublicController::class,'sitemap']);
Route::get('/admin/login',[AdminController::class,'login'])->name('login');
Route::post('/admin/login',[AdminController::class,'authenticate'])->middleware('throttle:login');
Route::middleware(['auth','can:staff'])->prefix('admin')->group(function(){
 Route::post('/logout',[AdminController::class,'logout']);Route::get('/',[AdminController::class,'dashboard']);
 Route::get('/inquiries/{inquiry}',[AdminController::class,'inquiry']);Route::post('/inquiries/{inquiry}',[AdminController::class,'updateInquiry']);
 Route::get('/attachments/{attachment}',[AdminController::class,'download']);Route::post('/inquiries/{inquiry}/quotations',[AdminController::class,'quote']);Route::get('/quotations/{quotation}/{locale}',[AdminController::class,'printQuote'])->whereIn('locale',['ar','en']);
 Route::middleware('can:admin')->group(function(){
 Route::get('/content/{type}',[AdminController::class,'content'])->whereIn('type',['service','product','project','page','faq','package']);Route::post('/content/{type}',[AdminController::class,'saveEntry'])->whereIn('type',['service','product','project','page','faq','package']);Route::post('/entries/{entry}/delete',[AdminController::class,'deleteEntry']);
 Route::get('/settings',[AdminController::class,'settings']);Route::post('/settings',[AdminController::class,'saveSettings']);Route::get('/media/{media}/file',[AdminController::class,'mediaFile']);Route::get('/media/{media}/poster',[AdminController::class,'mediaPoster']);Route::get('/media',[AdminController::class,'media']);Route::post('/media',[AdminController::class,'saveMedia']);Route::post('/media/{media}',[AdminController::class,'updateMedia']);Route::get('/users',[AdminController::class,'users']);Route::post('/users',[AdminController::class,'saveUser']);
 });
});
Route::prefix('{locale}')->whereIn('locale',['ar','en'])->middleware(\App\Http\Middleware\StudioLocale::class)->group(function(){
 Route::get('/',[PublicController::class,'home'])->name('home');Route::get('/quote',[InquiryController::class,'create'])->name('quote');Route::post('/quote',[InquiryController::class,'store'])->middleware('throttle:inquiry');
 Route::get('/preview',[PublicController::class,'preview'])->name('preview');Route::get('/workshop',[PublicController::class,'workshop'])->name('workshop');
 Route::get('/{section}',[PublicController::class,'page'])->whereIn('section',['services','products','projects','about','contact','faq','privacy']);
 Route::get('/{section}/{slug}',[PublicController::class,'detail'])->whereIn('section',['services','products','projects']);
});
