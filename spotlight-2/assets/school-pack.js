/* Fixed revision pack: Part 1, through page 21. */
(()=>{'use strict';
const nav=document.querySelector('nav[aria-label="Режимы"]');if(!nav)return;
const style=document.createElement('style');style.textContent=`
.sp-pack[hidden]{display:none}.sp-pack{background:linear-gradient(135deg,#fff0c6,#e8edff);padding:clamp(16px,4vw,32px);border-radius:28px;margin:20px 0}.sp-pack h2{margin:0;font-size:clamp(26px,5vw,36px)}.sp-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:0;list-style:none;counter-reset:sp}.sp-card{background:#fff;border-radius:22px;padding:20px;min-width:0;box-shadow:0 4px 0 #dadbe9;counter-increment:sp}.sp-card h3{font-size:18px;margin:0 0 14px}.sp-card h3:before{content:counter(sp) '. ';color:#704cc0}.sp-card input,.sp-card select{font:inherit;max-width:100%;padding:12px;border:2px solid #9c91ba;border-radius:12px;background:#fff}.sp-card input{width:100%}.sp-card select{margin:4px}.sp-pattern{font-size:24px;font-weight:bold;letter-spacing:3px}.sp-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.sp-btn{padding:12px 16px;border-radius:13px;background:#e8ddff;color:#382653;min-height:44px}.sp-btn.primary{background:#6445a4;color:white}.sp-status{min-height:24px;margin-bottom:0;font-weight:bold}.sp-ok{color:#23633c}.sp-error{color:#9c3e28}.sp-bank,.sp-built{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.sp-built{min-height:52px;border:2px dashed #b6a1d6;border-radius:12px;padding:8px}.sp-pack details{background:#fff;border-radius:18px;padding:18px;margin-top:20px}.sp-pack summary{cursor:pointer;font-weight:bold;min-height:44px}.sp-total{font-size:20px;font-weight:bold}.sp-card button:disabled{opacity:.45;cursor:default}@media(max-width:650px){.sp-list{grid-template-columns:1fr}.sp-card{padding:16px}}`;
document.head.append(style);
const make=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
const btn=(text,fn)=>{const b=make('button',text);b.type='button';b.className='sp-btn';b.onclick=fn;return b};
const panel=make('section');panel.id='school-pack';panel.className='sp-pack';panel.hidden=true;panel.setAttribute('aria-label','Комплект из 10 заданий по школьным принадлежностям');nav.after(panel);
const open=btn('🌈 Комплект: 10 заданий',()=>{setMode('school-pack');document.querySelector('#exercise-hub')?.setAttribute('hidden','');document.querySelector('#writing-panel')?.classList.add('hidden');panel.hidden=false;open.classList.add('active');open.setAttribute('aria-pressed','true');if('speechSynthesis' in window)window.SpotlightAudio.stop();heading.focus();});open.className='pill';open.id='open-school-pack';open.setAttribute('aria-pressed','false');
nav.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{panel.hidden=true;open.classList.remove('active');open.setAttribute('aria-pressed','false')}));nav.append(open);
const heading=make('h2','🎒 Собираемся в школу!');heading.tabIndex=-1;panel.append(heading,make('p','10 коротких заданий · 10–15 минут. Вспомни слова и фразу This is my … . Сначала выполни самостоятельно, затем проверь себя.'));
const total=make('p','Выполнено верно: 0 из 10');total.className='sp-total';total.setAttribute('role','status');panel.append(total);
const list=make('ol');list.className='sp-list';panel.append(list);
const tasks=[
{title:'Вставь букву: ручка',pattern:'p_n',answer:'e',label:'Пропущенная буква в слове pen'},
{title:'Вставь две буквы: книга',pattern:'b__k',answer:'oo',label:'Две пропущенные буквы в слове book'},
{title:'Собери слово «карандаш»',pieces:['c','p','l','e','n','i'],answer:'pencil'},
{title:'Вставь букву: рабочая тетрадь',pattern:'wor_book',answer:'k',label:'Пропущенная буква в слове workbook'},
{title:'Выбери правильное написание',choices:['pencil','pensil'],answer:'pencil'},
{title:'Подбери строчные буквы к заглавным',match:true,answer:'p b w'},
{title:'Допиши начало слова «это»',pattern:'__is',choices:['th','ht'],answer:'th'},
{title:'Составь: «Это моя ручка»',pieces:['my','pen','This','is'],phrase:true,answer:'This is my pen.'},
{title:'Составь: «Это моя книга»',pieces:['book','is','This','my'],phrase:true,answer:'This is my book.'},
{title:'Закончи: «Это моя рабочая тетрадь»',pattern:'This is my ________.',answer:'workbook',label:'Название рабочей тетради по-английски'}
];
const normalize=s=>s.normalize('NFKC').trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ').toLowerCase();
const states=[],checks=[];const update=()=>{total.textContent=`Выполнено верно: ${states.filter(Boolean).length} из 10`;};
tasks.forEach((t,i)=>{states[i]=false;const card=make('li');card.className='sp-card';card.append(make('h3',t.title));list.append(card);if(t.pattern){const p=make('p',t.pattern);p.className='sp-pattern';p.lang='en';card.append(p)}const status=make('p','');status.className='sp-status';status.setAttribute('role','status');let get;
const changed=()=>{states[i]=false;status.textContent='';status.className='sp-status';update()};
if(t.pieces){let order=[];const built=make('div'),bank=make('div');built.className='sp-built';built.setAttribute('aria-live','polite');built.setAttribute('aria-label','Составленный ответ');bank.className='sp-bank';const paint=()=>{built.replaceChildren();bank.replaceChildren();if(!order.length)built.append(make('span','Нажимай на буквы или слова ниже'));order.forEach((n,k)=>built.append(btn(t.pieces[n],()=>{order.splice(k,1);changed();paint()})));t.pieces.forEach((piece,n)=>{const b=btn(piece,()=>{order.push(n);changed();paint()});b.lang='en';b.disabled=order.includes(n);bank.append(b)});};get=()=>order.map(n=>t.pieces[n]).join(t.phrase?' ':'');paint();card.append(built,bank,btn('⌫ Очистить',()=>{order=[];changed();paint()}));
}else if(t.match){const selects=['P','B','W'].map(cap=>{const label=make('label',cap+' → '),s=make('select');s.setAttribute('aria-label','Строчная буква для '+cap);['','w','p','b'].forEach(v=>{const o=make('option',v||'Выбери');o.value=v;s.append(o)});s.onchange=changed;label.append(s);card.append(label);return s});get=()=>selects.map(s=>s.value).join(' ');
}else if(t.choices){const wrap=make('div');t.choices.forEach(value=>{const label=make('label'),input=make('input');input.type='radio';input.name='sp-'+i;input.value=value;input.style.width='auto';input.onchange=changed;label.style.cssText='display:inline-flex;gap:8px;align-items:center;padding:12px';label.append(input,make('span',value));wrap.append(label)});card.append(wrap);get=()=>wrap.querySelector('input:checked')?.value||'';
}else{const input=make('input');input.type='text';input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','none');input.setAttribute('aria-label',t.label);input.lang='en';input.oninput=changed;card.append(input);get=()=>input.value;input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check()}};}
function check(){const value=get();const ok=normalize(value)===normalize(t.answer);states[i]=ok;status.className='sp-status '+(ok?'sp-ok':'sp-error');status.textContent=ok?'⭐ Верно!':!value.trim()?'Сначала выполни задание.':'Попробуй ещё раз. Сверь буквы и их порядок.';update();return ok;}
checks.push(check);const actions=make('div');actions.className='sp-actions';actions.append(btn('✓ Проверить',check));card.append(actions,status);
});
const actions=make('div');actions.className='sp-actions';const checkAll=btn('✓ Проверить все задания',()=>{checks.forEach(check=>check())});checkAll.classList.add('primary');actions.append(checkAll);panel.append(actions,make('p','Самопроверка: исправленные слова напиши ещё раз по памяти. В предложении начинай This с заглавной буквы и ставь точку.'));
const answers=make('details'),summary=make('summary','🔑 Ответы для взрослого');answers.append(summary);const keys=make('ol');['e → pen','oo → book','pencil','k → workbook','pencil','P — p; B — b; W — w','th → this','This is my pen.','This is my book.','workbook → This is my workbook.'].forEach(answer=>{const li=make('li',answer);li.lang='en';keys.append(li)});answers.append(keys);panel.append(answers);
if(location.hash==='#school-pack')open.click();
})();
