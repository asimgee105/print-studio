const scenes = [...document.querySelectorAll('[data-service-scene]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const variants = { 'stickers-vinyl': 'vinyl', 'illuminated-signs': 'sign', 'large-format-printing': 'roll', 'uv-flatbed-printing': 'flatbed', 'decorative-displays': 'display', 'installation-fabrication': 'install', 'indoor-printing': 'interior' };
let modulePromise;
function loadModel(scene) {
    if (scene.dataset.modelLoaded || !scene.hasAttribute('data-model-stage')) return;
    scene.dataset.modelLoaded = 'true';
    modulePromise ??= import('./service-models.js');
    modulePromise.then(module => module.createServiceModel(scene)).catch(() => { scene.dataset.modelLoaded = 'fallback'; });
}
function observeScene(scene, visible) {
    scene.classList.toggle('scene-active', visible);
    scene.dispatchEvent(new CustomEvent('studio:visibility', { detail: { visible } }));
    if (visible) loadModel(scene);
}
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => observeScene(entry.target, entry.isIntersecting)), { threshold: .08 });
    scenes.forEach(scene => observer.observe(scene));
} else { scenes.forEach(scene => observeScene(scene, true)); }
document.addEventListener('visibilitychange', () => {
    scenes.forEach(scene => {
        scene.classList.toggle('tab-hidden', document.hidden);
        scene.dispatchEvent(new CustomEvent('studio:tab', { detail: { hidden: document.hidden } }));
    });
});
scenes.forEach(scene => {
    scene.querySelector('[data-model-pause]')?.addEventListener('click', event => {
        const paused = scene.classList.toggle('scene-paused');
        const button = event.currentTarget;
        button.textContent = paused ? '▶' : 'Ⅱ';
        button.setAttribute('aria-pressed', String(paused));
        button.setAttribute('aria-label', paused ? button.dataset.play : button.dataset.pause);
        scene.dispatchEvent(new CustomEvent('studio:pause', { detail: { paused } }));
    });
    scene.querySelectorAll('[data-model-rotate]').forEach(button => button.addEventListener('click', () => {
        const direction = Number(button.dataset.modelRotate);
        const drawing = scene.querySelector('.craft-model');
        const angle = Number(scene.dataset.fallbackAngle ?? -27) + direction * 20;
        scene.dataset.fallbackAngle = String(angle);
        if (!scene.classList.contains('webgl-ready')) drawing.style.rotate = `y ${angle + 27}deg`;
        scene.dispatchEvent(new CustomEvent('studio:rotate', { detail: { direction } }));
    }));
});
const lab = document.querySelector('.service-lab');
if (lab) {
    const scene = lab.querySelector('[data-model-stage]');
    lab.querySelectorAll('.lab-menu a').forEach(link => {
        const slug = new URL(link.href).pathname.split('/').pop();
        function choose() {
            const kind = variants[slug] ?? 'roll';
            if (scene.dataset.serviceScene === kind) return;
            scene.dataset.serviceScene = kind;
            scene.setAttribute('aria-label', `${scene.dataset.sceneLabel} ${link.textContent.trim()}`);
            scene.querySelector('.scene-drawing').setAttribute('aria-label', scene.getAttribute('aria-label')); 
            lab.querySelectorAll('.lab-menu a').forEach(item => item.classList.toggle('is-selected', item === link));
            scene.dispatchEvent(new CustomEvent('studio:scene', { detail: { kind } }));
        }
        link.addEventListener('pointerenter', choose);
        link.addEventListener('focus', choose);
    });
}
