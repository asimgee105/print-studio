import './theme.js';
import './service-scenes.js';
import './hero-slider.js';
import Alpine from 'alpinejs';
window.Alpine=Alpine;Alpine.start();
const read=(key,fallback=null)=>{try{return JSON.parse(sessionStorage.getItem(key))??fallback}catch{return fallback}};
const write=(key,value)=>{try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}};
document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()})));
document.querySelectorAll('[data-basket-slug]').forEach(button=>button.addEventListener('click',()=>{let basket=read('studio-basket',[]);if(!basket.some(i=>i.slug===button.dataset.basketSlug))basket.push({slug:button.dataset.basketSlug,title:button.dataset.basketTitle});write('studio-basket',basket.slice(0,20));button.textContent=button.dataset.added}));
const quoteForm=document.getElementById('quote-form');
if(quoteForm){
 const configInput=document.getElementById('configuration'),summary=document.getElementById('config-summary');
 const saved=configInput.value?(()=>{try{return JSON.parse(configInput.value)}catch{return null}})():read('studio-sign');
 if(saved){configInput.value=JSON.stringify(saved);summary.hidden=false;summary.querySelector('code').textContent=[saved.text,saved.material,saved.color].join(' · ')}
 document.getElementById('clear-config').addEventListener('click',()=>{configInput.value='';write('studio-sign',null);summary.hidden=true});
 const basketInput=document.getElementById('basket'),container=document.getElementById('basket-summary');
 let items=basketInput.value?(()=>{try{return JSON.parse(basketInput.value)}catch{return []}})():read('studio-basket',[]);
 const render=()=>{container.replaceChildren();basketInput.value=items.length?JSON.stringify(items):'';if(!items.length)return;const title=document.createElement('h3');title.textContent=container.dataset.label;container.append(title);const list=document.createElement('ul');items.forEach((item,index)=>{const li=document.createElement('li'),span=document.createElement('span'),button=document.createElement('button');span.textContent=item.title;button.type='button';button.textContent=container.dataset.remove;button.addEventListener('click',()=>{items.splice(index,1);write('studio-basket',items);render()});li.append(span,button);list.append(li)});container.append(list)};render();
}
if(document.getElementById('sign-builder'))import('./sign-preview.js').catch(()=>{document.getElementById('render-status').textContent=document.getElementById('sign-builder').dataset.fallback});
