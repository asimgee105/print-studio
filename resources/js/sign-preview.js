import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {Font} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import sansData from 'three/examples/fonts/helvetiker_regular.typeface.json';
import serifData from 'three/examples/fonts/optimer_regular.typeface.json';
const root=document.getElementById('sign-builder'),container=document.getElementById('sign-canvas'),fallback=document.getElementById('static-sign'),status=document.getElementById('render-status');
const ids=['text','font','color','material','depth','light','wall'],controls=Object.fromEntries(ids.map(key=>[key,document.getElementById('sign-'+key)]));
const settings=()=>({text:controls.text.value.trim()||'YOUR BRAND',font:controls.font.value,color:controls.color.value,material:controls.material.value,depth:Number(controls.depth.value),illuminated:controls.light.checked,wall:controls.wall.value});
let saved;try{saved=JSON.parse(sessionStorage.getItem('studio-sign'))}catch{};
if(saved)ids.forEach(key=>{const value=key==='light'?saved.illuminated:saved[key];if(value!==undefined){if(key==='light')controls[key].checked=Boolean(value);else controls[key].value=value}});
let renderer,scene,camera,orbit,sign,wall,visible=true,frame=0,flatTexture=null;
let needsRender=true;
const fonts={sans:new Font(sansData),serif:new Font(serifData)},walls={charcoal:'#192b25',stone:'#606d66',sand:'#b6a287'};
function disposeGroup(group){if(!group)return;group.traverse(node=>{node.geometry?.dispose();if(node.material){for(const material of Array.isArray(node.material)?node.material:[node.material])material.dispose()}});scene.remove(group);if(flatTexture){flatTexture.dispose();flatTexture=null}}
function flatArtwork(config){
 const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=512;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,2048,512);const arabic=/[\u0600-\u06ff]/.test(config.text);ctx.direction=arabic?'rtl':'ltr';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=config.color;let size=220;const family=arabic?'StudioArabic, sans-serif':config.font==='serif'?'serif':'StudioSans, sans-serif';ctx.font=`600 ${size}px ${family}`;const measure=ctx.measureText(config.text).width;if(measure>1900){size*=1900/measure;ctx.font=`600 ${size}px ${family}`}if(config.illuminated){ctx.shadowColor=config.color;ctx.shadowBlur=24}ctx.fillText(config.text,1024,260);flatTexture=new THREE.CanvasTexture(canvas);flatTexture.colorSpace=THREE.SRGBColorSpace;return new THREE.Mesh(new THREE.PlaneGeometry(10,2.5),new THREE.MeshBasicMaterial({map:flatTexture,transparent:true,depthWrite:false}));
}
function rebuild(){
 const config=settings();fallback.textContent=config.text;fallback.style.color=config.color;fallback.style.textShadow=config.illuminated?`0 0 25px ${config.color}`:'none';
 if(!scene)return;disposeGroup(sign);sign=new THREE.Group();scene.add(sign);wall.material.color.set(walls[config.wall]);scene.background=new THREE.Color(walls[config.wall]);
 const latin=/^[\x20-\x7E]+$/.test(config.text);if(latin){const geometry=new TextGeometry(config.text,{font:fonts[config.font],size:1.4,depth:config.depth,curveSegments:6,bevelEnabled:true,bevelThickness:.025,bevelSize:.018,bevelSegments:2});geometry.computeBoundingBox();const box=geometry.boundingBox,width=box.max.x-box.min.x;geometry.translate(-(box.min.x+box.max.x)/2,-(box.min.y+box.max.y)/2,0);const scale=Math.min(1,10/width);const front=new THREE.MeshStandardMaterial({color:config.color,metalness:config.material==='metal'?.85:.1,roughness:config.material==='matte'?.85:.25,emissive:config.color,emissiveIntensity:config.illuminated?.55:0});const side=new THREE.MeshStandardMaterial({color:config.material==='metal'?'#7b8981':'#285046',metalness:.6,roughness:.35});const mesh=new THREE.Mesh(geometry,[front,side]);mesh.scale.setScalar(scale);sign.add(mesh)}else{const artwork=flatArtwork(config);artwork.position.z=.19;sign.add(artwork)}
 // A backing panel makes the scope of the non-Latin artwork explicit.
 const panel=new THREE.Mesh(new THREE.BoxGeometry(11.5,3.8,.18),new THREE.MeshStandardMaterial({color:'#18221e',roughness:.75}));panel.position.z=-.17;sign.add(panel);needsRender=true;
}
function stop(){if(frame){cancelAnimationFrame(frame);frame=0}}
function loop(){frame=0;if(!visible||document.hidden||!renderer)return;orbit.update();if(needsRender){renderer.render(scene,camera);needsRender=false}frame=requestAnimationFrame(loop)}
function start(){if(!frame&&renderer&&visible&&!document.hidden)frame=requestAnimationFrame(loop)}
try{
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.5:2));renderer.outputColorSpace=THREE.SRGBColorSpace;scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(2.6,1.4,16);orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=!matchMedia('(prefers-reduced-motion: reduce)').matches;orbit.enablePan=false;orbit.minDistance=8;orbit.maxDistance=25;orbit.maxPolarAngle=Math.PI*.7;orbit.addEventListener('change',()=>{needsRender=true});
 scene.add(new THREE.HemisphereLight('#e4fff3','#203529',2));const key=new THREE.DirectionalLight('#f7ead4',3);key.position.set(3,4,7);scene.add(key);const rim=new THREE.PointLight('#85dfc5',35,30);rim.position.set(-5,0,2);scene.add(rim);
 wall=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial({color:'#192b25',roughness:1}));wall.position.z=-.6;scene.add(wall);
 fallback.hidden=true;container.append(renderer.domElement);renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();fallback.hidden=false;renderer.domElement.hidden=true;status.textContent=root.dataset.fallback});
 new ResizeObserver(()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();needsRender=true;start()}).observe(container);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop()},{rootMargin:'100px'}).observe(container);
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 document.getElementById('reset-view').addEventListener('click',()=>{camera.position.set(2.6,1.4,16);orbit.target.set(0,0,0);orbit.update();needsRender=true;start()});
 document.fonts.ready.then(()=>{rebuild();start()});
}catch(error){status.textContent=root.dataset.fallback;renderer=null}
let delay;ids.forEach(key=>controls[key].addEventListener('input',()=>{clearTimeout(delay);delay=setTimeout(()=>{rebuild();start()},key==='text'?180:30)}));
// Save settings independently of WebGL. Screenshot export is intentionally not promised.
document.getElementById('attach-config').addEventListener('click',()=>{try{sessionStorage.setItem('studio-sign',JSON.stringify(settings()));location.href=root.dataset.quote}catch{status.textContent=root.dataset.fallback}});
rebuild();
