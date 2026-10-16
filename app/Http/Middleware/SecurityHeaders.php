<?php
namespace App\Http\Middleware;
use Closure;
class SecurityHeaders {public function handle($request,Closure $next){$response=$next($request);$response->headers->set('X-Content-Type-Options','nosniff');$response->headers->set('X-Frame-Options','SAMEORIGIN');$response->headers->set('Referrer-Policy','strict-origin-when-cross-origin');$response->headers->set('Permissions-Policy','camera=(), microphone=(), geolocation=()');if($request->is('admin*'))$response->headers->set('Cache-Control','no-store, private');return $response;}}
