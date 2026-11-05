/* Deterministic 10-task packs, restricted to the active section’s source cards. */
(()=>{'use strict';
const clean=s=>s.normalize('NFKC').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
const baseNormalize=s=>clean(s).replace(/[.!?]+$/,'').toLowerCase();
function build(deck){
 if(!Array.isArray(deck)||!deck.length)throw new TypeError('Spotlight revision requires a non-empty array of vocabulary cards.');
 for(const c of deck)if(!c||!c.rule&&(typeof c.en!=='string'||typeof c.ru!=='string'))throw new TypeError('Each vocabulary card must include English and Russian text.');
 const entries=deck.filter(c=>!c.rule&&!/[\/…]|\.{2,}/.test(c.en)).map(c=>({...c,en:clean(c.en)})).filter(c=>/^[a-zA-Z][a-zA-Z\s'.,!?-]*$/.test(c.en)&&c.ru);
 const items=entries.filter((c,i,a)=>a.findIndex(x=>x.en===c.en&&x.ru===c.ru)===i);if(!items.length)throw new Error('No usable vocabulary cards were found for Spotlight revision.');
 const words=items.filter(c=>!/[ !?.,]/.test(c.en)&&!c.en.includes("'"));const phrases=items.filter(c=>c.en.includes(' '));
 const pick=(a,n)=>(a.length?a:items)[n%(a.length||items.length)];
 const source=c=>({page:c.page,model:!!c.model,en:c.en});
 const gap=(c,count)=>{const en=c.en;const ids=Array.from(en.matchAll(/[a-z]/ig),m=>m.index);const positions=count===1?[ids[Math.floor(ids.length/2)]]:ids.filter((_,i)=>i===0||i===ids.length-1);return {title:'Вставь пропущенные буквы: '+c.ru,pattern:Array.from(en).map((x,i)=>positions.includes(i)?'_':x).join(''),answer:positions.map(i=>en[i]).join(''),label:'Пропущенные буквы по порядку',fullAnswer:en,source:source(c)}};
 const assemble=c=>{const phrase=c.en.includes(' ');const raw=phrase?c.en.replace(/[.!?]+$/,'').split(' '):Array.from(c.en);const pieces=[...raw.slice(1),raw[0]];return {title:(phrase?'Составь фразу: ':'Собери слово: ')+c.ru,pieces,phrase,answer:c.en,fullAnswer:c.en,source:source(c)}};
 const write=c=>({title:'Напиши по-английски: '+c.ru,answer:c.en,label:'Английское слово или фраза',fullAnswer:c.en,source:source(c),alternatives:items.filter(x=>x.ru===c.ru).map(x=>x.en)});
 const spelling=c=>{const ids=Array.from(c.en.matchAll(/[a-z]/ig),m=>m.index);const j=ids[Math.floor(ids.length/2)];const bad=(c.en.slice(0,j)+c.en.slice(j+1))||c.en+c.en;return {title:'Выбери правильное написание: '+c.ru,choices:[bad,c.en],answer:c.en,fullAnswer:c.en,source:source(c)}};
 const c=pick(words,4),letters=[...new Set(c.en.toLowerCase().replace(/[^a-z]/g,'').split(''))].slice(0,3);
 const match={title:'Подбери строчные буквы к заглавным',match:true,matchLetters:letters,answer:letters.join(' '),fullAnswer:letters.map(l=>l.toUpperCase()+' — '+l).join('; '),source:source(c)};
 const translate=pick(items,5),ruChoices=[...new Set(items.map(x=>x.ru))].filter(x=>x!==translate.ru).slice(0,2);let task9;
 if(ruChoices.length){task9={title:'Выбери перевод',pattern:translate.en,choices:[...ruChoices,translate.ru],answer:translate.ru,fullAnswer:translate.en+' — '+translate.ru,source:source(translate),translation:true}}else task9=write(translate);
 const tasks=[gap(pick(words,0),1),gap(pick(words,1),2),assemble(pick(words,2)),write(pick(words,3)),spelling(pick(words,4)),match,assemble(pick(phrases,0)),gap(pick(phrases,1),1),task9,write(pick(phrases,2))];
 // Letter Blends: use only the combination actually present in this section.
 const lesson=typeof activeLesson!=='undefined'?activeLesson:null;
 const blends=lesson?.id?.startsWith('blend-')?[lesson.id.slice(6)]:window.SpotlightPath==='/blends.html'?['sh','ch','th','ph']:[];
 const blendExample=items.flatMap(c=>blends.filter(b=>c.en.toLowerCase().includes(b)).map(b=>({c,b}))).at(0);
 if(blendExample){const {c,b}=blendExample,j=c.en.toLowerCase().indexOf(b);tasks[7]={title:'Вставь буквосочетание: '+c.ru,pattern:c.en.slice(0,j)+'__'+c.en.slice(j+2),answer:b,label:'Буквосочетание',fullAnswer:b+' → '+c.en,source:source(c)}}
 return tasks;
}
window.SpotlightRevision={build,normalize:baseNormalize};
// Catalogs intentionally have no active vocabulary deck.
if(/^\/part[12]\.html$/.test(window.SpotlightPath)&&typeof activeLesson!=='undefined'&&!activeLesson)return;
const vocabulary=window.SpotlightVocabularyDeck;
const deck=vocabulary?vocabulary.cards:typeof cards!=='undefined'?cards:undefined;
if(!Array.isArray(deck))throw new TypeError('Spotlight revision requires an array of vocabulary cards.');
const tasks=build(deck);if(!tasks.length||window.SpotlightPath==='/school.html')return;
const nav=document.querySelector('nav[aria-label="Режимы"]')||document.querySelector('.modes');if(!nav)return;
const style=document.createElement('style');style.textContent=`
.sp-pack[hidden]{display:none}.sp-pack{background:linear-gradient(135deg,#fff0c6,#e8edff);padding:clamp(16px,4vw,32px);border-radius:28px;margin:20px 0}.sp-pack h2{margin:0;font-size:clamp(26px,5vw,36px)}.sp-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:0;list-style:none;counter-reset:sp}.sp-card{background:#fff;border-radius:22px;padding:20px;min-width:0;box-shadow:0 4px 0 #dadbe9;counter-increment:sp}.sp-card h3{font-size:18px;margin:0 0 14px}.sp-card h3:before{content:counter(sp) '. ';color:#704cc0}.sp-card input,.sp-card select{font:inherit;max-width:100%;padding:12px;border:2px solid #9c91ba;border-radius:12px;background:#fff}.sp-card input{width:100%}.sp-card select{margin:4px}.sp-pattern{font-size:24px;font-weight:bold;letter-spacing:3px}.sp-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.sp-btn{padding:12px 16px;border-radius:13px;background:#e8ddff;color:#382653;min-height:44px}.sp-btn.primary{background:#6445a4;color:white}.sp-status{min-height:24px;margin-bottom:0;font-weight:bold}.sp-ok{color:#23633c}.sp-error{color:#9c3e28}.sp-bank,.sp-built{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.sp-built{min-height:52px;border:2px dashed #b6a1d6;border-radius:12px;padding:8px}.sp-pack details{background:#fff;border-radius:18px;padding:18px;margin-top:20px}.sp-pack summary{cursor:pointer;font-weight:bold;min-height:44px}.sp-total{font-size:20px;font-weight:bold}.sp-card button:disabled{opacity:.45;cursor:default}@media(max-width:650px){.sp-list{grid-template-columns:1fr}.sp-card{padding:16px}}`;
document.head.append(style);
const make=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
const btn=(text,fn)=>{const b=make('button',text);b.type='button';b.className='sp-btn';b.onclick=fn;return b};
const panel=make('section');panel.id='revision-pack';panel.className='sp-pack';panel.hidden=true;panel.setAttribute('aria-label','Комплект из 10 заданий к этому разделу');nav.after(panel);
const open=btn('🌈 Комплект: 10 заданий',()=>{if(typeof setMode==='function')setMode('revision-pack');else{document.querySelector('#cardsPanel').hidden=true;document.querySelector('#exercise').hidden=true;}document.querySelector('#exercise-hub')?.setAttribute('hidden','');document.querySelector('#writing-panel')?.classList.add('hidden');document.querySelectorAll('.ex-open').forEach(b=>b.classList.remove('active'));document.querySelector('#writing')?.classList.remove('active');nav.querySelectorAll('button').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});panel.hidden=false;open.classList.add('active');open.setAttribute('aria-pressed','true');if('speechSynthesis' in window)window.SpotlightAudio.stop();heading.focus();});open.className='pill';open.id='open-revision-pack';open.setAttribute('aria-pressed','false');
nav.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{panel.hidden=true;open.classList.remove('active');open.setAttribute('aria-pressed','false')}));nav.append(open);
const heading=make('h2','🌈 Комплект: 10 заданий');heading.tabIndex=-1;panel.append(heading,make('p','10 коротких заданий · 10–15 минут. Только слова и фразы этого раздела. Сначала выполни самостоятельно, затем проверь себя.'));
const total=make('p','Выполнено верно: 0 из 10');total.className='sp-total';total.setAttribute('role','status');panel.append(total);
const list=make('ol');list.className='sp-list';panel.append(list);
const normalize=baseNormalize;
const states=[],checks=[];const update=()=>{total.textContent=`Выполнено верно: ${states.filter(Boolean).length} из 10`;};
tasks.forEach((t,i)=>{states[i]=false;const card=make('li');card.className='sp-card';card.append(make('h3',t.title));list.append(card);if(t.source?.page){const cite=make('p',`📖 Часть ${window.SpotlightPath==='/part2.html'?2:1} · с. ${t.source.page}${t.source.model?' · по модели задания':''}`);cite.className='ex-note';card.append(cite)}if(t.pattern){const p=make('p',t.pattern);p.className='sp-pattern';p.lang='en';if(t.translation)p.style.letterSpacing='normal';card.append(p)}const status=make('p','');status.className='sp-status';status.setAttribute('role','status');let get;
const changed=()=>{states[i]=false;status.textContent='';status.className='sp-status';update()};
if(t.pieces){let order=[];const built=make('div'),bank=make('div');built.className='sp-built';built.setAttribute('aria-live','polite');built.setAttribute('aria-label','Составленный ответ');bank.className='sp-bank';const paint=()=>{built.replaceChildren();bank.replaceChildren();if(!order.length)built.append(make('span','Нажимай на буквы или слова ниже'));order.forEach((n,k)=>built.append(btn(t.pieces[n],()=>{order.splice(k,1);changed();paint()})));t.pieces.forEach((piece,n)=>{const b=btn(piece,()=>{order.push(n);changed();paint()});b.lang='en';b.disabled=order.includes(n);bank.append(b)});};get=()=>order.map(n=>t.pieces[n]).join(t.phrase?' ':'');paint();card.append(built,bank,btn('⌫ Очистить',()=>{order=[];changed();paint()}));
 }else if(t.match){const matchLetters=t.matchLetters;const selects=matchLetters.map(letter=>{const cap=letter.toUpperCase(),label=make('label',cap+' → '),select=make('select');select.setAttribute('aria-label','Строчная буква для '+cap);['',...matchLetters.slice().reverse()].forEach(v=>{const o=make('option',v||'Выбери');o.value=v;select.append(o)});select.onchange=changed;label.append(select);card.append(label);return select});get=()=>selects.map(select=>select.value).join(' ');
}else if(t.choices){const wrap=make('div');t.choices.forEach(value=>{const label=make('label'),input=make('input');input.type='radio';input.name='sp-'+i;input.value=value;input.style.width='auto';input.onchange=changed;label.style.cssText='display:inline-flex;gap:8px;align-items:center;padding:12px';label.append(input,make('span',value));wrap.append(label)});card.append(wrap);get=()=>wrap.querySelector('input:checked')?.value||'';
}else{const input=make('input');input.type='text';input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','none');input.setAttribute('aria-label',t.label);input.lang='en';input.oninput=changed;card.append(input);get=()=>input.value;input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check()}};}
function check(){const value=get();const ok=[t.answer,...(t.alternatives||[])].some(answer=>{const strictAnswer=vocabulary?.requireCapitalization&&t.fullAnswer===t.answer&&typeof answer==='string'&&/^[A-Z]/.test(answer);return strictAnswer?clean(value)[0]===clean(answer)[0]&&normalize(value)===normalize(answer):normalize(value)===normalize(answer)});states[i]=ok;status.className='sp-status '+(ok?'sp-ok':'sp-error');status.textContent=ok?'⭐ Верно!':!value.trim()?'Сначала выполни задание.':'Попробуй ещё раз. Сверь буквы и их порядок.';update();return ok;}
checks.push(check);const actions=make('div');actions.className='sp-actions';actions.append(btn('✓ Проверить',check));card.append(actions,status);
});
const actions=make('div');actions.className='sp-actions';const checkAll=btn('✓ Проверить все задания',()=>{checks.forEach(check=>check())});checkAll.classList.add('primary');actions.append(checkAll);panel.append(actions,make('p','Самопроверка: исправленные слова напиши ещё раз по памяти. В предложениях проверь заглавную букву и знак в конце. Имена, дни недели и месяцы пиши с заглавной буквы.'));
const answers=make('details'),summary=make('summary','🔑 Ответы для взрослого');answers.append(summary);const keys=make('ol');tasks.map(t=>t.fullAnswer).forEach(answer=>{const li=make('li',answer);li.lang='en';keys.append(li)});answers.append(keys);panel.append(answers);
if(location.hash==='#revision-pack')open.click();
})();
