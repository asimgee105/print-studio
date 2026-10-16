<?php
namespace App\Http\Middleware;
use Closure;
class StudioLocale {public function handle($request,Closure $next){$locale=$request->route('locale');abort_unless(in_array($locale,['ar','en'],true),404);app()->setLocale($locale);return $next($request);}}
