<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\{Gate,RateLimiter,View};
use Illuminate\Cache\RateLimiting\Limit;
use App\Models\{Setting,Inquiry,User};
class AppServiceProvider extends ServiceProvider {
 public function register():void{}
 public function boot():void{
 Gate::policy(Inquiry::class,\App\Policies\InquiryPolicy::class);
 Gate::define('admin',fn(User $u)=>$u->role==='admin');Gate::define('staff',fn(User $u)=>in_array($u->role,['admin','staff'],true));
 RateLimiter::for('login',fn($r)=>Limit::perMinute(5)->by($r->ip().'|'.strtolower((string)$r->input('email'))));
 RateLimiter::for('inquiry',fn($r)=>Limit::perHour(12)->by($r->ip()));
 View::composer(['layouts.*','public.*'],function($view){$view->with('settings',Setting::pluck('value','key')->all())->with('lang',app()->getLocale())->with('footerContent',\App\Models\Entry::where('type','page')->where('slug','footer')->where('published',true)->first());});
 }
}
