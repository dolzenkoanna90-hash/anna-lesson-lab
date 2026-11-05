'use strict';
const $=id=>document.getElementById(id);
const prompts=[
['HTML-игра по проверенной базе','Чтобы получить самостоятельный файл с объяснениями, а не только красивую обложку.',`Создай один самостоятельный HTML-файл для урока русского языка в 6 классе по теме «Архаизмы, историзмы, неологизмы».

Используй только проверенную базу, которую я вставлю ниже. Если данных не хватает или пример спорный, сначала укажи это. Не добавляй вымышленные словарные сведения.

Нужно: три уровня сложности; три варианта ответа в каждом задании, только один правильный; объяснение после ответа; подсказка; повтор ошибок; отдельные показатели первой попытки и освоения после повторения. Исключи повторное начисление баллов за двойное нажатие. Добавь ключи для учителя и сброс прогресса с подтверждением.

Сохраняй прогресс локально, но не блокируй игру при недоступном localStorage. Управление мышью, касанием и клавиатурой. Без CDN, внешних шрифтов, библиотек, API и сети. Пользовательский текст вставляй через textContent, а не innerHTML.

Оформление: глубокий изумруд, тёплый кремовый фон, золотые акценты, крупные читаемые заголовки. Контрастные варианты ответа. Стиль — литературная мастерская.

После кода дай список ручных проверок: неверный ответ, повтор, двойное нажатие, перезагрузка, пустое хранилище, запуск скачанного файла без интернета. Не утверждай, что проверки выполнены, если ты их не запускал.

Проверенная база заданий:
[ВСТАВЬТЕ ВОПРОСЫ, ВАРИАНТЫ, КЛЮЧИ И ПОЯСНЕНИЯ]`],
['Содержание перед оформлением','Чтобы сначала проверить учебный смысл и однозначность ответа.',`Подготовь проект 18 заданий для 6 класса по теме «Архаизмы, историзмы, неологизмы» на основе материалов ниже.

Три группы по шесть заданий: 1) значение и современная замена; 2) понимание слова в контексте; 3) объяснение классификации и исправление ошибочного рассуждения.

Для каждого задания дай вопрос, три правдоподобных варианта, один правильный ответ, краткое объяснение и подсказку без прямого ответа. Обоснуй, почему остальные варианты неверны. Не создавай задания с двумя возможными ответами.

Не объявляй любое слово о современной технике неологизмом. Для вывода о новизне нужны временная точка отсчёта и источник. «Незнакомое ученику» не равно «новое в языке». Спорные примеры пометь и предложи заменить. Не придумывай цитаты, словарные статьи и ссылки.

Сначала покажи содержание для проверки; код игры пока не пиши.

Основа и источники:
[ВСТАВЬТЕ ФРАГМЕНТ УЧЕБНИКА, СЛОВАРНЫЕ СТАТЬИ ИЛИ ПРОВЕРЕННЫЙ МАТЕРИАЛ]`],
['Проверка готового тренажёра','Чтобы найти ошибки в заданиях и поведении до урока.',`Проверь HTML-тренажёр ниже. Сначала перечисли только обнаруженные проблемы с указанием конкретного задания или участка кода и объясни последствие.

Содержание: один ли верный ответ; совпадает ли ключ с объяснением; хватает ли контекста; правильно ли различены архаизм и историзм; обосновано ли слово названо неологизмом относительно времени.

Поведение: двойное нажатие, повтор ошибок, переход без ответа, перезапуск, пустой набор, недоступный localStorage, изменение сохранённых данных, работа скачанного файла без интернета. Проверь видимость скрытых элементов: CSS не должен переопределять атрибут hidden.

Безопасность: введённый автором текст не должен исполняться как HTML или JavaScript. Проверь экспорт текста с кавычками, угловыми скобками и последовательностью </script>.

Не утверждай, что запускал браузер или тест, если этого не делал. Раздели подтверждённые ошибки и пункты для ручной проверки. Исправь подтверждённые ошибки, затем кратко опиши изменения.

Код:
[ВСТАВЬТЕ HTML]`],
['Показ создания для короткого видео','Чтобы зритель увидел результат и захотел попробовать сам.',`Подготовь сценарий короткого вертикального видео о создании мини-тренажёра в ручном конструкторе.

Покажи один реальный пример: «Какое слово является архаизмом?» Варианты: «Очи», «Музей», «Улица». Правильный — «Очи». Объяснение: «Очи — устаревшее название глаз. Предмет существует, а название изменилось: это архаизм».

Последовательность: заполнить вопрос и варианты; отметить правильный; добавить объяснение; открыть проверку; нажать неверный ответ; показать объяснение; скачать HTML и открыть полученный файл.

Для каждого кадра дай короткую надпись и конкретное действие на экране. Не имитируй работу ИИ, если конструктор собирает введённые автором задания. Не обещай время экономии без измерения. Не называй результат проверенным без фактической проверки.

Визуальный стиль: кремовый, глубокий изумруд, античное золото, выразительная книжная типографика. Крупный текст, один смысл на кадр. Финал: «Попробуйте на своём вопросе» и ссылка на конструктор.`]
];
prompts.forEach(([title,why,body],i)=>{const item=document.createElement('article');item.className='prompt';const n=document.createElement('div');n.className='prompt-number';n.textContent=String(i+1).padStart(2,'0');const box=document.createElement('div');const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=why;const d=document.createElement('details');const s=document.createElement('summary');s.textContent='Открыть промпт';const pre=document.createElement('pre');pre.textContent=body;const b=document.createElement('button');b.className='outline';b.textContent='Скопировать промпт';b.onclick=async()=>{try{await navigator.clipboard.writeText(body);b.textContent='Скопировано ✓'}catch(e){const t=document.createElement('textarea');t.value=body;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();b.textContent=ok?'Скопировано ✓':'Выделите текст и скопируйте вручную'}};d.append(s,pre,b);box.append(h,p,d);item.append(n,box);$('promptList').append(item)});
let blobPreview=null;function openFrame(src){$('gameFrame').src=src;$('gameDialog').showModal()}$('openGame').onclick=()=>openFrame('games/lexical-detective.html');$('closeDialog').onclick=()=>$('gameDialog').close();$('gameDialog').addEventListener('close',()=>{$('gameFrame').src='about:blank';if(blobPreview){URL.revokeObjectURL(blobPreview);blobPreview=null}});
let tasks=[];const KEY='anna-builder-v1';try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.tasks)){tasks=s.tasks.filter(t=>t&&typeof t.question==='string'&&Array.isArray(t.options)&&t.options.length===3&&t.options.every(x=>typeof x==='string')&&[0,1,2].includes(t.answer)&&typeof t.explain==='string').slice(0,30);if(typeof s.title==='string')$('trainerName').value=s.title.slice(0,100)}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify({title:$('trainerName').value,tasks}))}catch(e){$('builderNotice').textContent='Сохранение в браузере недоступно. Скачайте готовый файл перед закрытием страницы.'}}
function render(){const title=$('trainerName').value.trim()||'Мой тренажёр';$('previewName').textContent=title;$('taskList').replaceChildren();tasks.forEach((t,i)=>{const li=document.createElement('li');const text=document.createElement('span');text.textContent=t.question;const b=document.createElement('button');b.type='button';b.textContent='Удалить задание '+(i+1);b.onclick=()=>{tasks.splice(i,1);save();render()};li.append(text,b);$('taskList').append(li)});$('empty').hidden=tasks.length>0;$('downloadTrainer').disabled=$('previewTrainer').disabled=!tasks.length}
$('trainerName').addEventListener('input',()=>{save();render()});$('example').onclick=()=>{$('qText').value='Какое слово является архаизмом?';['Очи','Музей','Улица'].forEach((x,i)=>$('a'+i).value=x);$('correct').value='0';$('explain').value='Очи — устаревшее название глаз. Предмет существует, а название изменилось: это архаизм.';$('qText').focus()};
$('builderForm').onsubmit=e=>{e.preventDefault();if(tasks.length>=30){$('builderNotice').textContent='Достигнут предел: 30 заданий.';return}const question=$('qText').value.trim(),options=[0,1,2].map(i=>$('a'+i).value.trim()),explain=$('explain').value.trim();if(!question||!explain||options.some(s=>!s)){$('builderNotice').textContent='Заполните вопрос, все варианты и объяснение.';return}if(new Set(options.map(s=>s.toLocaleLowerCase('ru'))).size!==3){$('builderNotice').textContent='Варианты ответа должны различаться.';return}tasks.push({question,options,answer:+$('correct').value,explain});save();render();['qText','a0','a1','a2','explain'].forEach(id=>$(id).value='');$('builderNotice').textContent='Задание добавлено. Всего: '+tasks.length+'. Проверьте тренажёр перед скачиванием.'};
function runTrainer(){document.body.innerHTML='<main><p class="eyebrow">ИНТЕРАКТИВНАЯ МАСТЕРСКАЯ / АННА ЯКОВЛЕВНА</p><h1 id="title"></h1><p id="count"></p><h2 id="question"></h2><div id="options"></div><p id="feedback" role="status" hidden></p><button id="next" hidden>Далее →</button><button id="again" hidden>Пройти ещё раз</button><footer>Результат относится к этой попытке. Содержание заданий подготовлено автором тренажёра.</footer></main>';const $=id=>document.getElementById(id);$('title').textContent=TITLE;let pos=0,hits=0,answered=false;function render(){answered=false;$('count').textContent='Задание '+(pos+1)+' из '+DATA.length;$('question').textContent=DATA[pos].question;$('question').hidden=false;$('options').replaceChildren();$('feedback').hidden=true;$('next').hidden=true;$('again').hidden=true;DATA[pos].options.forEach((text,i)=>{let b=document.createElement('button');b.textContent=text;b.onclick=()=>{if(answered)return;answered=true;let d=DATA[pos],ok=i===d.answer;if(ok)hits++;[...$('options').children].forEach((el,j)=>{el.disabled=true;if(j===d.answer)el.className='correct';else if(j===i)el.className='incorrect'});$('feedback').textContent=(ok?'Верно. ':'Правильный ответ: '+d.options[d.answer]+'. ')+d.explain;$('feedback').hidden=false;$('next').hidden=false;$('next').textContent=pos===DATA.length-1?'Результат →':'Далее →'};$('options').append(b)})}$('next').onclick=()=>{if(!answered)return;pos++;if(pos<DATA.length)render();else{$('count').textContent='Верных ответов: '+hits+' из '+DATA.length;$('question').hidden=true;$('options').replaceChildren();$('feedback').hidden=true;$('next').hidden=true;$('again').hidden=false}};$('again').onclick=()=>{pos=0;hits=0;render()};render()}
const trainerCSS=`*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;background:#f7f2e7;color:#123f32;font:19px/1.6 Georgia,serif}main{max-width:800px;margin:auto;padding:35px 6vw}h1{font-size:40px;line-height:1.15;font-weight:400}h2{font-size:28px;font-weight:400;line-height:1.3}.eyebrow{font:10px/1.5 Arial;letter-spacing:2px;color:#947023}button{display:block;width:100%;text-align:left;padding:15px;margin:12px 0;background:transparent;border:1px solid #b5bda8;color:#123f32;font:17px/1.4 Arial;cursor:pointer}button:focus-visible{outline:3px solid #b38c45;outline-offset:3px}button:disabled{opacity:1;cursor:default}.correct{background:#d8ead9;border-color:#397b4c}.incorrect{background:#f3d9cf;border-color:#9e4f38}#next,#again{background:#123f32;color:#fff}#feedback{border-left:3px solid #b38c45;padding:15px;background:#eee7d6}footer{font:11px/1.6 Arial;margin-top:35px;border-top:1px solid #b38c45;padding-top:15px}`;
function trainerHtml(){const json=x=>JSON.stringify(x).replace(/</g,'\\u003c');const title=$('trainerName').value.trim()||'Мой тренажёр';return '<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))+'</title><style>'+trainerCSS+'</style><body><script>const DATA='+json(tasks)+';const TITLE='+json(title)+';('+runTrainer.toString()+')();</'+'script></body></html>'}
$('downloadTrainer').onclick=()=>{if(!tasks.length)return;const url=URL.createObjectURL(new Blob([trainerHtml()],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Moy_trenazher.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)};$('previewTrainer').onclick=()=>{if(!tasks.length)return;blobPreview=URL.createObjectURL(new Blob([trainerHtml()],{type:'text/html;charset=utf-8'}));openFrame(blobPreview)};render();
