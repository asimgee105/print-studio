@php($sceneKind=match($sceneService->slug??''){'stickers-vinyl'=>'vinyl','illuminated-signs'=>'sign','large-format-printing'=>'roll','uv-flatbed-printing'=>'flatbed','decorative-displays'=>'display','installation-fabrication'=>'install','indoor-printing'=>'interior',default=>'roll'})
@php($isCompact=$compact??false)
<div class="service-scene {{ $isCompact?'scene-compact':'scene-full' }}" data-service-scene="{{ $sceneKind }}" role="group" data-scene-label="{{ __('site.animation_for') }}" aria-label="{{ __('site.animation_for') }} {{ $sceneService?->text('title')??__('site.services') }}" @if(!$isCompact) data-model-stage @endif>
    <div class="scene-drawing" role="img" aria-label="{{ __('site.animation_for') }} {{ $sceneService?->text('title')??__('site.services') }}">
        <div class="scene-ground" aria-hidden="true"></div><div class="scene-grid" aria-hidden="true"></div>
        <div class="craft-model" aria-hidden="true">
            <div class="print-machine"><div class="machine-foot foot-one"></div><div class="machine-foot foot-two"></div><div class="machine-bed"></div><div class="printed-sheet"><span></span><span></span><span></span></div><div class="machine-beam"><span></span><span></span><span></span></div><div class="print-head"><i></i></div><div class="feed-roller"></div><div class="ink-indicators"><i></i><i></i><i></i></div></div>
            <div class="sign-model"><div class="sign-wall"></div><div class="sign-letters"><span>A</span><span>a</span><i>✦</i></div><div class="sign-subline"></div></div>
            <div class="display-model"><div class="display-base"></div><div class="display-board board-back"></div><div class="display-board board-front"><span>✦</span></div><div class="display-disc"></div></div>
            <div class="install-model"><div class="install-wall"></div><div class="mount mount-one"></div><div class="mount mount-two"></div><div class="install-panel"><span>↗</span></div><div class="install-tool"></div></div>
            <div class="interior-model"><div class="room-floor"></div><div class="room-wall wall-left"></div><div class="room-wall wall-right"></div><div class="wall-art art-one"></div><div class="wall-art art-two"></div><div class="room-plinth"></div></div>
        </div>
    </div>
    @if(!$isCompact)<div class="model-canvas" aria-hidden="true"></div><div class="model-toolbar"><span>{{ __('site.illustrative_animation') }}</span><div><button type="button" data-model-rotate="-1" aria-label="{{ __('site.rotate_left') }}">↶</button><button type="button" data-model-pause data-pause="{{ __('site.pause_animation') }}" data-play="{{ __('site.play_animation') }}" aria-label="{{ __('site.pause_animation') }}" aria-pressed="false">Ⅱ</button><button type="button" data-model-rotate="1" aria-label="{{ __('site.rotate_right') }}">↷</button></div></div>@endif
</div>
