import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import fontData from 'three/examples/fonts/helvetiker_regular.typeface.json';

const font = new Font(fontData);
/** Procedural illustrative models: no machine specifications are implied. */
export function createServiceModel(root) {
    const container = root.querySelector('.model-canvas');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.25 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = innerWidth > 760;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 80);
    camera.position.set(8, 6.3, 10);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.target.set(0, 1.5, 0);
    orbit.enablePan = false;
    orbit.enableDamping = false;
    renderer.domElement.style.touchAction = 'pan-y';
    orbit.enableZoom = innerWidth > 760;
    orbit.minDistance = 7;
    orbit.maxDistance = 19;
    orbit.maxPolarAngle = Math.PI * .49;
    const ambient = new THREE.HemisphereLight('#dbf6ff', '#354967', 2.7);
    const key = new THREE.DirectionalLight('#fff0db', 4.5);
    key.position.set(4, 9, 6);
    key.castShadow = innerWidth > 760;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.left = -7; key.shadow.camera.right = 7;
    key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
    const rim = new THREE.DirectionalLight('#70d8f5', 2.8);
    rim.position.set(-6, 5, -4);
    scene.add(ambient, key, rim);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(7, 48), new THREE.MeshStandardMaterial({ color: '#14283e', roughness: .75, metalness: .1 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -.05; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(14, 20, '#427c9e', '#24405a');
    grid.position.y = -.04; grid.material.transparent = true; grid.material.opacity = .2; scene.add(grid);
    const group = new THREE.Group(); scene.add(group);
    const textures = [];
    let moving = {}, modelTime = 0, frame = 0, lastTime = 0, failed = false;
    let visible = root.classList.contains('scene-active');
    let paused = root.classList.contains('scene-paused');
    let dirty = true;

    function material(color, extra = {}) {
        return new THREE.MeshStandardMaterial({ color, roughness: .4, metalness: .25, ...extra });
    }
    function box(parent, size, position, color, extra) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, extra));
        mesh.position.set(...position); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    }
    function cylinder(parent, radius, length, position, color) {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 24), material(color, { metalness: .55 }));
        mesh.rotation.z = Math.PI / 2; mesh.position.set(...position); mesh.castShadow = true; parent.add(mesh); return mesh;
    }
    function printTexture() {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
        const ctx = canvas.getContext('2d'); ctx.fillStyle = '#edf8fc'; ctx.fillRect(0, 0, 512, 512);
        const colors = ['#35b9d5', '#ee8db0', '#f0bc78', '#86dcd0'];
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = colors[i]; ctx.beginPath(); ctx.arc(55 + i * 133, 180 + (i % 2) * 140, 130, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#153b58'; ctx.fillRect(45, 38, 170, 12); ctx.fillRect(45, 65, 100, 5);
        const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture); return texture;
    }
    function clear() {
        group.traverse(object => {
            object.geometry?.dispose();
            if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(item => item.dispose());
        });
        group.clear(); textures.splice(0).forEach(texture => texture.dispose()); moving = {}; group.rotation.set(0, 0, 0);
    }
    function printer(kind) {
        box(group, [5.5, .48, 2.7], [0, 1.6, 0], '#314f6d');
        [-2.1, 2.1].forEach(x => {
            box(group, [.35, 1.3, .5], [x, .7, -.6], '#243b54');
            box(group, [.8, .18, 1.5], [x, .1, -.2], '#1c3045');
        });
        box(group, [5.8, .65, .65], [0, 2.6, -.5], '#486b88');
        box(group, [4.7, .08, .15], [0, 2.5, -.1], '#8fc6dc', { metalness: .8 });
        const paper = box(group, [3.9, .035, 2.7], [0, 1.87, .6], '#ffffff', { map: printTexture(), roughness: .75 });
        const head = box(group, [.72, .6, .65], [-1.8, 2.45, -.1], '#7edce9');
        box(head, [.4, .05, .45], [0, -.33, 0], kind === 'flatbed' ? '#b2a0ff' : '#83e9ef', { emissive: kind === 'flatbed' ? '#8267f1' : '#4bcce5', emissiveIntensity: .7 });
        ['#5ee0ed', '#ef88b5', '#f2ce81'].forEach((color, i) => box(group, [.22, .36, .3], [-2.25 + i * .32, 3.05, -.5], color));
        if (kind !== 'flatbed') {
            moving.roller = cylinder(group, .28, 4.1, [0, 1.65, 1.5], '#aed8e5');
            cylinder(group, .38, 4.1, [0, 1.1, -.85], '#c0e0e5');
        } else {
            box(group, [5.7, .3, 3.7], [0, 1.25, .3], '#1e344c');
        }
        if (kind === 'vinyl') {
            const decal = box(group, [1.15, .04, 1], [.65, 1.96, 1.15], '#f3c98c');
            decal.rotation.z = -.07; moving.decal = decal;
        }
        moving.head = head; moving.paper = paper;
    }
    function sign() {
        box(group, [6.4, 3.8, .22], [0, 2, -.65], '#22364e', { roughness: .85 });
        const geometry = new TextGeometry('Aa', { font, size: 2, depth: .3, curveSegments: 6, bevelEnabled: true, bevelThickness: .025, bevelSize: .02, bevelSegments: 2 });
        geometry.computeBoundingBox(); const bounds = geometry.boundingBox; geometry.translate(-(bounds.max.x + bounds.min.x) / 2, 0, 0);
        const letters = new THREE.Mesh(geometry, [material('#b5f6ff', { emissive: '#68daef', emissiveIntensity: .5, metalness: .5 }), material('#427594', { metalness: .8 })]);
        letters.position.set(0, 1.35, -.15); letters.castShadow = true; group.add(letters);
        box(group, [3.8, .035, .05], [0, .9, -.4], '#83c5dd');
        moving.letters = letters;
    }
    function displays() {
        cylinder(group, .15, 5.2, [0, .2, 0], '#385c79').rotation.set(0, 0, Math.PI / 2);
        const arch = new THREE.Shape(); arch.moveTo(-1, 0); arch.lineTo(-1, 2.5); arch.absarc(0, 2.5, 1, Math.PI, 0, true); arch.lineTo(1, 0); arch.closePath();
        const texture = printTexture();
        const panel = new THREE.Mesh(new THREE.ExtrudeGeometry(arch, { depth: .14, bevelEnabled: false }), [material('#ffffff', { map: texture }), material('#5d7892')]);
        panel.position.set(-1.35, .35, -.4); panel.rotation.y = .1; panel.castShadow = true; group.add(panel);
        const second = panel.clone(); second.geometry = panel.geometry.clone(); second.material = [material('#f3bfce', { map: texture }), material('#6c617d')]; second.position.set(1.1, .35, .35); second.scale.setScalar(.85); second.rotation.y = -.13; group.add(second);
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(.65, .65, .16, 40), material('#f5c587')); disc.rotation.x = Math.PI / 2; disc.position.set(-1.9, .8, .9); group.add(disc);
        moving.panel = second; moving.disc = disc;
    }
    function installation() {
        box(group, [6.2, 4.2, .25], [0, 2.1, -.65], '#70869a', { roughness: .95 });
        [-1.85, 1.85].forEach(x => box(group, [.13, .13, .2], [x, 2.9, -.45], '#ecc289', { metalness: .8 }));
        const panel = new THREE.Group();
        box(panel, [4.5, 2.4, .2], [0, 0, 0], '#2f7795', { metalness: .4 });
        box(panel, [3.5, .08, .05], [0, -.5, .13], '#a9f0ef');
        box(panel, [.14, 1, .06], [0, .2, .14], '#abf4f0').rotation.z = -.7;
        panel.position.set(0, 2.25, .3); group.add(panel);
        const tool = new THREE.Group(); box(tool, [.65, .35, .3], [0, 0, 0], '#e8b679'); box(tool, [.23, .55, .2], [-.1, -.3, 0], '#9d754d'); tool.position.set(2, 2.5, 1.3); group.add(tool);
        moving.panel = panel; moving.tool = tool;
    }
    function interior() {
        box(group, [6, .15, 4], [0, .08, 0], '#69879c');
        box(group, [6, 3.7, .18], [0, 1.95, -1.7], '#bed2dc', { roughness: .95 });
        box(group, [.18, 3.7, 3.7], [-2.9, 1.95, 0], '#7a9cb3', { roughness: .95 });
        const texture = printTexture();
        const art = box(group, [1.55, 2.1, .09], [-1.15, 2.05, -1.5], '#ffffff', { map: texture });
        const art2 = box(group, [1.55, 2.1, .09], [1.05, 2.05, -1.5], '#ffffff', { map: texture });
        box(group, [1.1, .7, .9], [.6, .5, .7], '#82bdcb');
        moving.art = art; moving.art2 = art2;
    }
    function rebuild() {
        clear(); const kind = root.dataset.serviceScene;
        if (kind === 'sign') sign(); else if (kind === 'display') displays(); else if (kind === 'install') installation(); else if (kind === 'interior') interior(); else printer(kind);
        modelTime = 0; dirty = true; requestFrame();
    }
    function update(time) {
        const kind = root.dataset.serviceScene;
        if (moving.head) moving.head.position.x = Math.sin(time * 1.6) * 1.8;
        if (moving.paper) moving.paper.position.z = .6 + Math.sin(time * .7) * (kind === 'flatbed' ? .32 : .14);
        if (moving.roller) moving.roller.rotation.x = time * .5;
        if (moving.decal) { moving.decal.rotation.x = Math.sin(time) * .2; moving.decal.position.y = 1.98 + Math.max(0, Math.sin(time)) * .18; }
        if (moving.letters) moving.letters.material[0].emissiveIntensity = .3 + (Math.sin(time * 1.3) + 1) * .38;
        if (kind === 'display') { moving.panel.position.y = .35 + Math.sin(time * .9) * .08; moving.disc.rotation.z = Math.sin(time * .7) * .12; }
        if (kind === 'install') { const offset = (Math.sin(time * .85) + 1) / 2; moving.panel.position.z = -.25 + offset * 1.1; moving.tool.position.set(2, 1.6 + offset, .6 + offset); }
        if (moving.art) { moving.art.position.z = -1.5 + (Math.sin(time) + 1) * .12; moving.art2.position.z = -1.5 + (Math.cos(time) + 1) * .12; }
    }
    function canAnimate() { return !paused && !reduced.matches && !document.documentElement.classList.contains('motion-paused'); }
    function render(timestamp) {
        frame = 0;
        if (!visible || document.hidden || failed) { lastTime = 0; return; }
        if (canAnimate()) {
            const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, .05) : 0;
            modelTime += delta; update(modelTime); dirty = true;
        }
        lastTime = timestamp;
        if (dirty) { renderer.render(scene, camera); dirty = false; }
        if (canAnimate()) requestFrame();
    }
    function requestFrame() { if (!frame && visible && !document.hidden && !failed) frame = requestAnimationFrame(render); }
    function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    function theme() {
        const light = document.documentElement.dataset.theme === 'light';
        floor.material.color.set(light ? '#dbe9ef' : '#14283e');
        ambient.intensity = light ? 3.4 : 2.7;
        grid.material.color.set(light ? '#648a9c' : '#427c9e');
        dirty = true; requestFrame();
    }
    orbit.addEventListener('change', () => { dirty = true; requestFrame(); });
    root.addEventListener('studio:visibility', event => { visible = event.detail.visible; visible ? requestFrame() : stop(); });
    root.addEventListener('studio:tab', event => { event.detail.hidden ? stop() : requestFrame(); });
    root.addEventListener('studio:pause', event => { paused = event.detail.paused; dirty = true; requestFrame(); });
    root.addEventListener('studio:rotate', event => { group.rotation.y += event.detail.direction * .28; dirty = true; requestFrame(); });
    root.addEventListener('studio:scene', rebuild);
    document.addEventListener('studio:theme', theme);
    document.addEventListener('studio:motion', () => { dirty = true; requestFrame(); });
    reduced.addEventListener('change', () => { dirty = true; requestFrame(); });
    new ResizeObserver(() => {
        const bounds = container.getBoundingClientRect(); if (!bounds.width || !bounds.height) return;
        renderer.setSize(bounds.width, bounds.height, false); camera.aspect = bounds.width / bounds.height; camera.updateProjectionMatrix(); dirty = true; requestFrame();
    }).observe(container);
    renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); failed = true; stop(); root.classList.remove('webgl-ready'); renderer.domElement.hidden = true; });
    container.append(renderer.domElement); root.classList.add('webgl-ready'); rebuild(); theme(); orbit.update(); requestFrame();
}
