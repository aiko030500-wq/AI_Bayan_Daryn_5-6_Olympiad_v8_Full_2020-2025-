let stars = Number(localStorage.getItem("stars") || 0);
let journal = JSON.parse(localStorage.getItem("journal") || "[]");
let sections = ["home","listening","reading","use","writing","chat","journal"];
let current = 0;
updateStars(); renderJournal();

function $(id){return document.getElementById(id);}
function show(id){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");current=sections.indexOf(id);}
function goHome(){show("home");}
function goPrev(){current=(current-1+sections.length)%sections.length;show(sections[current]);}
function goNext(){current=(current+1)%sections.length;show(sections[current]);}

function updateStars(){$("stars").textContent=stars;localStorage.setItem("stars",stars);}
function addStar(){stars++;updateStars();}
function saveResult(section,result){const r={section,result,date:new Date().toLocaleString()};journal.push(r);localStorage.setItem("journal",JSON.stringify(journal));renderJournal();}
function renderJournal(){$("jbody").innerHTML=journal.length?journal.map(r=>`<tr><td>${r.section}</td><td>${r.result}</td><td>${r.date}</td></tr>`).join(""):`<tr><td colspan=3>Нет записей</td></tr>`;}

function checkPIN(){const v=$("pin").value;if(v==="1402"){show("home");}else if(v==="9998"){show("journal");}else alert("Неверный PIN");}

/* 🎧 Listening */
const listeningQ=[
{y:2020,q:"Who is speaking in the audio?",a:"Teacher",o:["Student","Teacher","Doctor","Driver"]},
{y:2021,q:"What is the weather mentioned?",a:"Rainy",o:["Sunny","Rainy","Snowy","Windy"]},
{y:2022,q:"Where is the boy going?",a:"School",o:["Park","Shop","School","Beach"]},
{y:2023,q:"What colour is the car?",a:"Red",o:["Red","Blue","Green","Black"]},
{y:2024,q:"What time is it?",a:"Eight o’clock",o:["Seven","Eight o’clock","Nine","Ten"]},
{y:2025,q:"What animal do they talk about?",a:"Dog",o:["Cat","Dog","Horse","Bird"]}
];
let liIndex=0;loadListening();
function loadListening(){const q=listeningQ[liIndex];
$("listeningTask").innerHTML=`<b>${q.y}</b>: ${q.q}<br>`+q.o.map(x=>`<label class='option'><input type='radio' name='lop' value='${x}'> ${x}</label>`).join("")+`<br><button onclick='checkListening()'>Проверить</button>`;}
function checkListening(){
const ch=document.querySelector("input[name=lop]:checked");if(!ch){alert("Выберите ответ");return;}
const ok=ch.value===listeningQ[liIndex].a;
document.querySelectorAll(".option").forEach(e=>e.classList.remove("correct","wrong"));
if(ok){ch.parentElement.classList.add("correct");addStar();saveResult("Listening "+listeningQ[liIndex].y,"⭐ +1");alert("Верно! ⭐");}
else{ch.parentElement.classList.add("wrong");saveResult("Listening "+listeningQ[liIndex].y,"0");alert("Неверно");}
liIndex=(liIndex+1)%listeningQ.length;setTimeout(loadListening,800);}

/* 📖 Reading */
const readingQ={
2020:{text:"Tom likes reading books about animals. He often goes to the zoo with his parents.",tasks:[
{q:"What does Tom like?",a:"Reading books about animals",o:["Playing games","Reading books about animals","Drawing pictures","Watching TV"]},
{q:"Where does Tom go?",a:"To the zoo",o:["To the park","To the zoo","To the cinema","To the shop"]},
{q:"Who goes with him?",a:"His parents",o:["His friends","His parents","His teacher","His sister"]},
{q:"What animal theme does he like?",a:"Animals",o:["Robots","Cars","Animals","History"]}]},
2021:{text:"Ann lives in a big city. Every morning she takes the bus to school.",tasks:[
{q:"Where does Ann live?",a:"In a big city",o:["In a small village","In a big city","In a forest","By the sea"]},
{q:"How does Ann go to school?",a:"By bus",o:["By car","By bike","By bus","On foot"]},
{q:"What time of day does she go?",a:"Morning",o:["Evening","Morning","Afternoon","Night"]},
{q:"What is her name?",a:"Ann",o:["Mary","Kate","Ann","Liz"]}]},
2022:{text:"John’s favourite subject is English. He likes to speak and read in English.",tasks:[
{q:"What is John’s favourite subject?",a:"English",o:["Maths","English","Science","Music"]},
{q:"What does he like to do?",a:"Speak and read",o:["Run","Speak and read","Draw","Play football"]},
{q:"Is English his favourite subject?",a:"Yes",o:["Yes","No","Maybe","Not sure"]},
{q:"What does he not like?",a:"None stated",o:["Reading","Speaking","None stated","Drawing"]}]},
2023:{text:"Kate has a cat named Snow. It is white and likes milk.",tasks:[
{q:"What is the cat’s name?",a:"Snow",o:["Black","Snow","Milk","Cat"]},
{q:"What colour is the cat?",a:"White",o:["Black","White","Grey","Brown"]},
{q:"What does the cat like?",a:"Milk",o:["Water","Milk","Fish","Bread"]},
{q:"Whose cat is it?",a:"Kate’s",o:["Tom’s","Kate’s","Mary’s","John’s"]}]},
2024:{text:"Mike and his friends play football after school every day.",tasks:[
{q:"When do they play?",a:"After school",o:["Before school","After school","During lessons","At night"]},
{q:"What do they play?",a:"Football",o:["Basketball","Football","Tennis","Chess"]},
{q:"Who plays with Mike?",a:"His friends",o:["His teacher","His parents","His friends","His sister"]},
{q:"How often do they play?",a:"Every day",o:["Sometimes","Never","Every day","Once a week"]}]},
2025:{text:"Sara is preparing for the English Olympiad. She studies every evening.",tasks:[
{q:"What is Sara preparing for?",a:"English Olympiad",o:["Math Olympiad","English Olympiad","Art Contest","Science Fair"]},
{q:"When does she study?",a:"Every evening",o:["Morning","Afternoon","Every evening","Weekend"]},
{q:"What subject does she study?",a:"English",o:["Kazakh","English","Maths","History"]},
{q:"What is her name?",a:"Sara",o:["Lina","Sara","Kate","Anna"]}]}
};
let rYear=2020;loadReading();
function loadReading(){
const d=readingQ[rYear];
$("readingTask").innerHTML=`<b>${rYear}</b>: ${d.text}<hr>`+d.tasks.map((t,i)=>`<p>${t.q}</p>`+t.o.map(o=>`<label class='option'><input type='radio' name='r${i}' value='${o}'> ${o}</label>`).join("")).join("")+`<br><button onclick='checkReading()'>Проверить</button>`;
}
function checkReading(){
const d=readingQ[rYear];let correct=0;
d.tasks.forEach((t,i)=>{
const ch=document.querySelector(`input[name=r${i}]:checked`);
if(ch&&ch.value===t.a){correct++;ch.parentElement.classList.add("correct");}else if(ch){ch.parentElement.classList.add("wrong");}
});
saveResult("Reading "+rYear,correct+" / "+d.tasks.length);
if(correct>=3)addStar();
alert("Результат: "+correct+" / "+d.tasks.length);
rYear=rYear<2025?rYear+1:2020;setTimeout(loadReading,800);
}

/* 🧩 Use of English */
const grammarQ={
2020:[
{q:"She ___ to school every day.",a:"goes",o:["go","goes","gone","going"]},
{q:"They ___ playing football now.",a:"are",o:["is","are","am","be"]},
{q:"I ___ a book yesterday.",a:"read",o:["reads","read","reading","will read"]},
{q:"He ___ English well.",a:"speaks",o:["speak","speaks","spoke","spoken"]}
],
2021:[
{q:"My mother ___ a teacher.",a:"is",o:["are","is","am","be"]},
{q:"We ___ to the park yesterday.",a:"went",o:["go","goes","went","going"]},
{q:"The cats ___ under the table.",a:"are",o:["is","am","are","was"]},
{q:"He ___ like coffee.",a:"doesn’t",o:["don’t","doesn’t","isn’t","didn’t"]}
],
2022:[
{q:"I ___ my homework.",a:"have done",o:["did","do","have done","doing"]},
{q:"They ___ in Astana.",a:"live",o:["lives","live","lived","living"]},
{q:"She ___ watching TV.",a:"is",o:["is","are","am","be"]},
{q:"We ___ English every day.",a:"study",o:["studies","study","studied","studying"]}
],
2023:[
{q:"There ___ three books on the table.",a:"are",o:["is","are","was","be"]},
{q:"My friend ___ play the guitar.",a:"can",o:["can","must","may","does"]},
{q:"He ___ his bike yesterday.",a:"rode",o:["ride","riding","rode","rides"]},
{q:"I ___ a movie last night.",a:"watched",o:["watch","watching","watches","watched"]}
],
2024:[
{q:"She ___ been to London.",a:"has",o:["have","has","had","having"]},
{q:"We ___ dinner now.",a:"are cooking",o:["cook","cooks","are cooking","cooked"]},
{q:"The sun ___ in the east.",a:"rises",o:["rise","rises","rose","raising"]},
{q:"I ___ you tomorrow.",a:"will see",o:["see","saw","will see","seen"]}
],
2025:[
{q:"My brother ___ football every Sunday.",a:"plays",o:["play","plays","played","playing"]},
{q:"They ___ already finished their work.",a:"have",o:["has","have","had","having"]},
{q:"The test ___ easy.",a:"was",o:["is","are","was","be"]},
{q:"She ___ a new phone next week.",a:"will buy",o:["buys","buy","will buy","bought"]}
]
};
let gYear=2020;loadGrammar();
function loadGrammar(){
const q=grammarQ[gYear];
$("useTask").innerHTML=`<b>${gYear}</b> Grammar<br>`+
q.map((t,i)=>`<p>${t.q}</p>`+t.o.map(o=>`<label class='option'><input type='radio' name='g${i}' value='${o}'> ${o}</label>`).join("")).join("")+
`<br><button onclick='checkGrammar()'>Проверить</button>`;
}
function checkGrammar(){
const q=grammarQ[gYear];let correct=0;
q.forEach((t,i)=>{
const ch=document.querySelector(`input[name=g${i}]:checked`);
if(ch&&ch.value===t.a){correct++;ch.parentElement.classList.add("correct");}else if(ch){ch.parentElement.classList.add("wrong");}
});
saveResult("Use of English "+gYear,correct+" / "+q.length);
if(correct>=3)addStar();
alert("Результат: "+correct+" / "+q.length);
gYear=gYear<2025?gYear+1:2020;setTimeout(loadGrammar,800);
}

/* ✍️ Writing */
function saveEssay(){
const text=$("essay").value.trim();
if(!text){alert("Пусто");return;}
saveResult("Writing","Отправлено");alert("Эссе сохранено!");
}

/* 🤖 Chat */
function chatSend(){
const text=$("chattext").value.trim();if(!text)return;
addMsg("user",text);
const ans="AI Bayan: попробуй определить грамматику, ключевые слова и тему. (offline)";
addMsg("ai",ans);
$("chattext").value="";
}
function addMsg(role,text){
const log=$("chatlog");const div=document.createElement("div");
div.textContent=(role==="user"?"Вы: ":"AI Bayan: ")+text;
log.appendChild(div);log.scrollTop=log.scrollHeight;
}
