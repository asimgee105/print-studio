/** Real workshop clips presented in a CSS perspective stage, with one active stream. */
export function initializeHero(root) {
    const slides = [...root.querySelectorAll('[data-hero-slide]')];
    if (!slides.length) return;

    const videos = slides.map(slide => slide.querySelector('video'));
    const buttons = [...root.querySelectorAll('[data-hero-go]')];
    const toggle = root.querySelector('[data-hero-toggle]');
    const icon = root.querySelector('[data-play-icon]');
    const counter = root.querySelector('[data-hero-index]');
    const caption = root.querySelector('[data-hero-caption]');
    const status = root.querySelector('[data-hero-status]');
    const stage = root.querySelector('[data-hero-stage]');
    const deck = root.querySelector('.depth-deck');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let active = 0;
    let visible = false;
    let wantsPlayback = !reducedMotion.matches;
    let autoAdvance = !reducedMotion.matches;
    let firstLoad = true;
    let tiltFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let swipeStart = null;
    let switchToken = 0;

    function updateToggle(playing) {
        toggle.setAttribute('aria-label', playing ? root.dataset.pauseLabel : root.dataset.playLabel);
        toggle.setAttribute('aria-pressed', String(playing));
        icon.textContent = playing ? 'Ⅱ' : '▶';
    }

    function attachSource(video) {
        if (!video.getAttribute('src')) {
            video.src = video.dataset.src;
            video.load();
        }
    }

    function pauseAll() {
        videos.forEach(video => video.pause());
        updateToggle(false);
    }

    async function playActive() {
        if (!visible || document.hidden || !wantsPlayback) return;
        const video = videos[active];
        const token = switchToken;
        attachSource(video);
        video.muted = true;
        video.defaultMuted = true;
        try {
            if (video.ended) video.currentTime = 0;
            await video.play();
            if (token !== switchToken || !visible || document.hidden || !wantsPlayback) {
                // A stale play promise must never pause the newly active stream.
                if (video !== videos[active] || !visible || document.hidden || !wantsPlayback) video.pause();
                return;
            }
            status.textContent = '';
            firstLoad = false;
        } catch (error) {
            if (token !== switchToken || error.name === 'AbortError') return;
            updateToggle(false);
            // Browser autoplay policy is expected; explicit Play remains usable.
            status.textContent = error.name === 'NotAllowedError' ? root.dataset.reducedLabel : root.dataset.errorLabel;
        }
    }

    function selectSlide(index, userInitiated = false) {
        active = (index + slides.length) % slides.length;
        switchToken += 1;
        pauseAll();
        slides.forEach((slide, position) => {
            const offset = (position - active + slides.length) % slides.length;
            const slot = offset === 0 ? 'active' : offset === 1 ? 'next' : offset === slides.length - 1 ? 'previous' : 'hidden';
            slide.dataset.slot = slot;
            slide.setAttribute('aria-hidden', String(position !== active));
            slide.inert = position !== active;
            videos[position].tabIndex = -1;
            buttons[position].setAttribute('aria-current', String(position === active));
            buttons[position].style.setProperty('--progress', '0%');
        });
        counter.textContent = String(active + 1).padStart(2, '0');
        caption.textContent = slides[active].dataset.title;
        status.textContent = '';
        if (userInitiated) {
            wantsPlayback = true;
            autoAdvance = !reducedMotion.matches;
        }
        const video = videos[active];
        // Reset a revisited clip. Inactive clips keep their decoded poster, but no stream plays.
        if (video.readyState >= 1) video.currentTime = 0;
        if (wantsPlayback) void playActive();
    }

    videos.forEach((video, index) => {
        video.controls = false;
        video.loop = false;
        video.addEventListener('playing', () => {
            if (index !== active || !visible || document.hidden || !wantsPlayback) {
                video.pause();
                return;
            }
            updateToggle(true);
            status.textContent = '';
        });
        video.addEventListener('pause', () => {
            if (index === active) updateToggle(false);
        });
        video.addEventListener('timeupdate', () => {
            if (index !== active || !Number.isFinite(video.duration) || !video.duration) return;
            buttons[index].style.setProperty('--progress', `${Math.min(100, video.currentTime / video.duration * 100)}%`);
        });
        video.addEventListener('ended', () => {
            if (index !== active) return;
            updateToggle(false);
            if (wantsPlayback && autoAdvance && visible && !document.hidden && slides.length > 1) selectSlide(active + 1);
        });
        video.addEventListener('waiting', () => {
            if (index === active && wantsPlayback) status.textContent = root.dataset.loadingLabel;
        });
        video.addEventListener('error', () => {
            if (index === active) {
                status.textContent = root.dataset.errorLabel;
                updateToggle(false);
            }
        });
    });

    root.querySelector('[data-hero-previous]').addEventListener('click', () => selectSlide(active - 1, true));
    root.querySelector('[data-hero-next]').addEventListener('click', () => selectSlide(active + 1, true));
    buttons.forEach((button, index) => button.addEventListener('click', () => selectSlide(index, true)));
    toggle.addEventListener('click', () => {
        const video = videos[active];
        if (!video.paused && !video.ended) {
            wantsPlayback = false;
            autoAdvance = false;
            pauseAll();
        } else {
            wantsPlayback = true;
            autoAdvance = !reducedMotion.matches;
            void playActive();
        }
    });

    // Keyboard navigation is confined to carousel controls, never the page's links/forms.
    root.addEventListener('keydown', event => {
        if (!event.target.closest('[data-hero-go],.reel-controls')) return;
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const rtl = document.documentElement.dir === 'rtl';
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : active + ((event.key === 'ArrowRight') !== rtl ? 1 : -1);
        selectSlide(next, true);
        buttons[active].focus();
    });
    root.addEventListener('focusin', () => { autoAdvance = false; });

    function resetTilt() {
        if (tiltFrame) cancelAnimationFrame(tiltFrame);
        tiltFrame = 0;
        deck.style.setProperty('--tilt-x', '0deg');
        deck.style.setProperty('--tilt-y', '0deg');
    }
    stage.addEventListener('pointermove', event => {
        if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
        const bounds = stage.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 7;
        pointerY = -((event.clientY - bounds.top) / bounds.height - .5) * 5;
        if (tiltFrame) return;
        tiltFrame = requestAnimationFrame(() => {
            deck.style.setProperty('--tilt-y', `${pointerX.toFixed(2)}deg`);
            deck.style.setProperty('--tilt-x', `${pointerY.toFixed(2)}deg`);
            tiltFrame = 0;
        });
    });
    stage.addEventListener('pointerleave', resetTilt);
    stage.addEventListener('touchstart', event => {
        if (event.touches.length === 1) swipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    stage.addEventListener('touchend', event => {
        if (!swipeStart || !event.changedTouches.length) return;
        const deltaX = event.changedTouches[0].clientX - swipeStart.x;
        const deltaY = event.changedTouches[0].clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) selectSlide(active + (deltaX < 0 ? 1 : -1), true);
    }, { passive: true });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            if (visible) {
                if (wantsPlayback) void playActive();
            } else {
                pauseAll();
                resetTilt();
            }
        }, { threshold: .12 }).observe(stage);
    } else {
        visible = true;
    }
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { pauseAll(); resetTilt(); }
        else if (visible && wantsPlayback) void playActive();
    });
    // A visitor starting a workshop clip must not have it interrupted by the hero resuming.
    document.addEventListener('play', event => {
        if (event.target instanceof HTMLVideoElement && !videos.includes(event.target)) {
            wantsPlayback = false;
            autoAdvance = false;
            pauseAll();
        }
    }, true);
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
            wantsPlayback = false;
            autoAdvance = false;
            pauseAll();
            resetTilt();
            status.textContent = root.dataset.reducedLabel;
        }
    });
    if (reducedMotion.matches && firstLoad) status.textContent = root.dataset.reducedLabel;
    selectSlide(0);
    if (reducedMotion.matches) status.textContent = root.dataset.reducedLabel;
}

document.querySelectorAll('[data-hero-slider]').forEach(initializeHero);
