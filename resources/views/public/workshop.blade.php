@extends('layouts.public',['title'=>__('site.workshop')])
@section('content')<section class="section page-head"><p class="eyebrow">{{ __('site.production') }}</p><h1>{{ __('site.workshop') }}</h1><p>{{ __('site.work_body') }}</p></section><section class="section">@include('components.videos')</section>@include('components.cta')@endsection
