@php($heroVideos=$videos->sortBy(fn($video)=>str_contains($video->path,'illuminated')?0:1)->values()->take(4))
<section class="cinema-hero" data-hero-slider role="region" aria-roledescription="carousel" aria-label="{{ __('site.hero_gallery') }}" data-play-label="{{ __('site.play') }}" data-pause-label="{{ __('site.pause_video') }}" data-loading-label="{{ __('site.video_loading') }}" data-error-label="{{ __('site.video_error') }}" data-reduced-label="{{ __('site.motion_note') }}">
    <div class="hero-atmosphere" aria-hidden="true"><span class="atmosphere-orb orb-cyan"></span><span class="atmosphere-orb orb-amber"></span><span class="hero-grid"></span></div>
    <div class="cinema-main">
        <div class="cinema-copy">
            <p class="studio-kicker"><span class="status-light" aria-hidden="true"></span>{{ __('site.eyebrow') }}</p>
            <h1 class="lines">{{ $homepage?->text('title')??__('site.hero_title') }}</h1>
            <p class="cinema-intro">{{ $homepage?->text('body')??__('site.hero_body') }}</p>
            @if(!empty($settings['city']))<p class="cinema-location">⌖ {{ $settings['city'] }}</p>@endif
            <div class="cinema-actions"><a class="btn cinema-primary" href="{{ route('quote',['locale'=>$lang]) }}">{{ __('site.quote') }}<span aria-hidden="true">↗</span></a><a class="cinema-secondary" href="{{ route('workshop',['locale'=>$lang]) }}"><span class="round-play" aria-hidden="true">▶</span>{{ __('site.watch') }}</a></div>
            <div class="hero-service-pills">@foreach($services->take(3) as $service)<a href="{{ url('/'.$lang.'/services/'.$service->slug) }}"><span aria-hidden="true">✦</span>{{ $service->text('title') }}</a>@endforeach</div>
            <a class="hero-concept-link" href="{{ route('preview',['locale'=>$lang]) }}"><span class="mini-sign" aria-hidden="true">Aa</span><span>{{ __('site.preview') }}<small>{{ __('site.try_materials') }}</small></span><span aria-hidden="true">↗</span></a>
        </div>
        <div class="cinema-showcase">
            <div class="showcase-topline"><span><i aria-hidden="true"></i>{{ __('site.real_workshop') }}</span><span class="reel-counter" dir="ltr"><b data-hero-index>01</b><span>/ {{ str_pad($heroVideos->count(),2,'0',STR_PAD_LEFT) }}</span></span></div>
            <div class="video-theatre" data-hero-stage>
                <div class="theatre-orbit orbit-one" aria-hidden="true"></div><div class="theatre-orbit orbit-two" aria-hidden="true"></div>
                <div class="stage-platform" aria-hidden="true"></div>
                <div class="depth-deck">
                    @forelse($heroVideos as $video)
                    <article class="reel-card" data-hero-slide data-slot="{{ $loop->first?'active':($loop->index===1?'next':($loop->last?'previous':'hidden')) }}" data-title="{{ $video->text('caption') }}" data-poster="{{ asset($video->poster) }}" aria-hidden="{{ $loop->first?'false':'true' }}" aria-label="{{ $loop->iteration }} / {{ $heroVideos->count() }} · {{ $video->text('caption') }}" @if(!$loop->first) inert @endif>
                        <div class="reel-top"><span class="reel-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>STUDIO / {{ str_pad($loop->iteration,2,'0',STR_PAD_LEFT) }}</span><span class="reel-record" aria-hidden="true">●</span></div>
                        <div class="reel-screen"><video data-src="{{ asset($video->path) }}" poster="{{ asset($video->poster) }}" width="478" height="850" preload="none" playsinline muted controls aria-label="{{ $video->text('caption') }}" tabindex="{{ $loop->first?'0':'-1' }}"></video><div class="reel-sheen" aria-hidden="true"></div></div>
                        <div class="reel-bottom"><span>{{ __('site.production') }}</span><span aria-hidden="true">↗</span></div>
                    </article>
                    @empty<div class="empty-reel"><span aria-hidden="true">Y↗</span><p>{{ __('site.empty') }}</p></div>@endforelse
                </div>
                @if($heroVideos->isNotEmpty())<div class="floating-stamp stamp-top" aria-hidden="true"><span>✦</span><div>{{ __('site.print_in_motion') }}<small>PRINT / SIGN / INSTALL</small></div></div><a class="floating-stamp stamp-bottom" href="{{ route('preview',['locale'=>$lang]) }}"><span class="stamp-symbol" aria-hidden="true">◈</span><div>{{ __('site.preview') }}<small>{{ __('site.try_materials') }}</small></div><span aria-hidden="true">↗</span></a>@endif
            </div>
            @if($heroVideos->isNotEmpty())<div class="reel-toolbar"><div class="reel-caption"><span class="caption-marker" aria-hidden="true"></span><div><small>{{ __('site.now_showing') }}</small><p data-hero-caption>{{ $heroVideos->first()->text('caption') }}</p></div></div><div class="reel-controls"><button type="button" data-hero-previous aria-label="{{ __('site.previous_video') }}"><span aria-hidden="true">←</span></button><button type="button" data-hero-toggle aria-label="{{ __('site.play') }}" aria-pressed="false"><span data-play-icon aria-hidden="true">▶</span></button><button type="button" data-hero-next aria-label="{{ __('site.next_video') }}"><span aria-hidden="true">→</span></button></div></div><p class="hero-video-status" role="status" aria-live="polite" data-hero-status></p>@endif
        </div>
    </div>
    @if($heroVideos->isNotEmpty())<div class="reel-navigation" aria-label="{{ __('site.choose_video') }}">@foreach($heroVideos as $video)<button type="button" data-hero-go="{{ $loop->index }}" aria-label="{{ __('site.play') }}: {{ $video->text('caption') }}" aria-current="{{ $loop->first?'true':'false' }}"><span class="reel-tab-number" dir="ltr">{{ str_pad($loop->iteration,2,'0',STR_PAD_LEFT) }}</span><img src="{{ asset($video->poster) }}" alt="" width="44" height="56" loading="{{ $loop->first?'eager':'lazy' }}"><span class="reel-tab-label">{{ $video->text('caption') }}</span><span class="reel-tab-arrow" aria-hidden="true">↗</span><span class="reel-track" aria-hidden="true"><i></i></span></button>@endforeach</div>@endif
    <noscript><p class="hero-noscript"><a href="{{ route('workshop',['locale'=>$lang]) }}">{{ __('site.watch') }} ↗</a></p></noscript>
</section>
