/* ========= AI Bayan Darýn 5–6 Olympiad App v9 (Web) ========= */
/* Состояние и базовые функции */
let stars = Number(localStorage.getItem("stars") || 0);
let journal = JSON.parse(localStorage.getItem("journal") || "[]");
const sections = ["home","listening","reading","use","writing","chat","journal"];
let current = 0;

function $(id){return document.getElementById(id);}
function show(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");
  current = sections.indexOf(id);
}
function goHome(){ show("home"); }
function goPrev(){ current=(current-1+sections.length)%sections.length; show(sections[current]); }
function goNext(){ current=(current+1)%sections.length; show(sections[current]); }

function updateStars(){ $("stars").textContent = stars; localStorage.setItem("stars", stars); }
function addStar(n=1){ stars += n; updateStars(); }

function saveResult(section, result){
  const r = { section, result, date: new Date().toLocaleString() };
  journal.push(r);
  localStorage.setItem("journal", JSON.stringify(journal));
  renderJournal();
}
function renderJournal(){
  $("jbody").innerHTML = journal.length
    ? journal.map(r=>`<tr><td>${r.section}</td><td>${r.result}</td><td>${r.date}</td></tr>`).join("")
    : `<tr><td colspan="3">Нет записей</td></tr>`;
}

/* ========= Вход (PIN) ========= */
/* Подсказка PIN на экране отсутствует. Коды: 1402 (вход), 9998 (журнал) */
function checkPIN(){
  const v = $("pin").value.trim();
  if(v === "1402"){ show("home"); }
  else if(v === "9998"){ show("journal"); }
  else { alert("Неверный PIN"); }
}

/* ========= Заставка и анимация звёздочек ========= */
window.addEventListener("load", ()=>{
  // Появление/скрытие заставки
  const splash = $("splash");
  setTimeout(()=>{ if(splash){ splash.style.display="none"; show("login"); } }, 3000);

  // Мягкий “звёздный дождь” на фоне
  function createStar(){
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random()*100 + "%";
    star.style.top = "-4px";
    star.style.animationDuration = (2 + Math.random()*3) + "s";
    document.getElementById("stars").appendChild(star);
    setTimeout(()=> star.remove(), 4000);
  }
  setInterval(createStar, 150);

  // Инициализация счётчиков и таблиц
  updateStars();
  renderJournal();

  // Предзагрузка первых экранов (можно не отображать сразу)
  loadListening();
  loadReading();   // подтянет data/reading_2020.txt
  loadGrammar();
});

/* ========= 🎧 Listening (2020–2025) ========= */
const listeningQ = [
  {y:2020,q:"Who is speaking in the audio?",a:"Teacher",o:["Student","Teacher","Doctor","Driver"]},
  {y:2021,q:"What is the weather mentioned?",a:"Rainy",o:["Sunny","Rainy","Snowy","Windy"]},
  {y:2022,q:"Where is the boy going?",a:"School",o:["Park","Shop","School","Beach"]},
  {y:2023,q:"What colour is the car?",a:"Red",o:["Red","Blue","Green","Black"]},
  {y:2024,q:"What time is it?",a:"Eight o’clock",o:["Seven","Eight o’clock","Nine","Ten"]},
  {y:2025,q:"What animal do they talk about?",a:"Dog",o:["Cat","Dog","Horse","Bird"]}
];
let liIndex = 0;

function loadListening(){
  const q = listeningQ[liIndex];
  $("listeningTask").innerHTML =
    `<b>${q.y}</b>: ${q.q}<br>` +
    q.o.map(x=>`<label class="option"><input type="radio" name="lop" value="${x}"> ${x}</label>`).join("") +
    `<br><button onclick="checkListening()">Проверить</button>`;
}

function checkListening(){
  const ch = document.querySelector('input[name="lop"]:checked');
  if(!ch){ alert("Выберите ответ"); return; }
  const ok = ch.value === listeningQ[liIndex].a;
  document.querySelectorAll(".option").forEach(e=>e.classList.remove("correct","wrong"));
  if(ok){
    ch.parentElement.classList.add("correct");
    addStar(1);
    saveResult("Listening "+listeningQ[liIndex].y, "⭐ +1");
    alert("Верно! ⭐");
  } else {
    ch.parentElement.classList.add("wrong");
    saveResult("Listening "+listeningQ[liIndex].y, "0");
    alert("Неверно");
  }
  liIndex = (liIndex+1) % listeningQ.length;
  setTimeout(loadListening, 800);
}

/* ========= 📖 Reading (тексты из data/reading_YYYY.txt) ========= */
/* Вопросы/ответы в коде, тексты — внешние файлы, чтобы легко менять. */
let rYear = 2020;
const readingTasks = {
  2020: [
    {q:"What does Tom like?",a:"Reading books about animals",o:["Playing games","Reading books about animals","Drawing pictures","Watching TV"]},
    {q:"Where does Tom go?",a:"To the zoo",o:["To the park","To the zoo","To the cinema","To the shop"]},
    {q:"Who goes with him?",a:"His parents",o:["His friends","His parents","His teacher","His sister"]},
    {q:"What animal theme does he like?",a:"Animals",o:["Robots","Cars","Animals","History"]}
  ],
  2021: [
    {q:"Where does Ann live?",a:"In a big city",o:["In a small village","In a big city","In a forest","By the sea"]},
    {q:"How does Ann go to school?",a:"By bus",o:["By car","By bike","By bus","On foot"]},
    {q:"What time of day does she go?",a:"Morning",o:["Evening","Morning","Afternoon","Night"]},
    {q:"What is her name?",a:"Ann",o:["Mary","Kate","Ann","Liz"]}
  ],
  2022: [
    {q:"What is John’s favourite subject?",a:"English",o:["Maths","English","Science","Music"]},
    {q:"What does he like to do?",a:"Speak and read",o:["Run","Speak and read","Draw","Play football"]},
    {q:"Is English his favourite subject?",a:"Yes",o:["Yes","No","Maybe","Not sure"]},
    {q:"What does he not like?",a:"None stated",o:["Reading","Speaking","None stated","Drawing"]}
  ],
  2023: [
    {q:"What is the cat’s name?",a:"Snow",o:["Black","Snow","Milk","Cat"]},
    {q:"What colour is the cat?",a:"White",o:["Black","White","Grey","Brown"]},
    {q:"What does the cat like?",a:"Milk",o:["Water","Milk","Fish","Bread"]},
    {q:"Whose cat is it?",a:"Kate’s",o:["Tom’s","Kate’s","Mary’s","John’s"]}
  ],
  2024: [
    {q:"When do they play?",a:"After school",o:["Before school","After school","During lessons","At night"]},
    {q:"What do they play?",a:"Football",o:["Basketball","Football","Tennis","Chess"]},
    {q:"Who plays with Mike?",a:"His friends",o:["His teacher","His parents","His friends","His sister"]},
    {q:"How often do they play?",a:"Every day",o:["Sometimes","Never","Every day","Once a week"]}
  ],
  2025: [
    {q:"What is Sara preparing for?",a:"English Olympiad",o:["Math Olympiad","English Olympiad","Art Contest","Science Fair"]},
    {q:"When does she study?",a:"Every evening",o:["Morning","Afternoon","Every evening","Weekend"]},
    {q:"What subject does she study?",a:"English",o:["Kazakh","English","Maths","History"]},
    {q:"What is her name?",a:"Sara",o:["Lina","Sara","Kate","Anna"]}
  ]
};

async function loadReading(){
  try{
    const res = await fetch(`data/reading_${rYear}.txt`);
    const text = await res.text();
    const d = readingTasks[rYear] || [];
    $("readingTask").innerHTML =
      `<b>${rYear}</b>:<br><div class="card" style="background:#0b1535">${text.replace(/\n/g,"<br>")}</div><hr>` +
      d.map((t,i)=>`<p>${t.q}</p>` + t.o.map(o=>`<label class="option"><input type="radio" name="r${i}" value="${o}"> ${o}</label>`).join("")).join("") +
      `<br><button onclick="checkReading()">Проверить</button>`;
  }catch(e){
    $("readingTask").innerHTML = `<p>Не найден файл <code>data/reading_${rYear}.txt</code></p>`;
  }
}

function checkReading(){
  const d = readingTasks[rYear] || [];
  let correct = 0;
  d.forEach((t,i)=>{
    const ch = document.querySelector(`input[name="r${i}"]:checked`);
    if(ch && ch.value===t.a){ correct++; ch.parentElement.classList.add("correct"); }
    else if(ch){ ch.parentElement.classList.add("wrong"); }
  });
  saveResult("Reading "+rYear, `${correct} / ${d.length}`);
  if(correct >= Math.ceil(d.length*0.75)) addStar(1); // >=75% — звезда
  alert(`Результат: ${correct} / ${d.length}`);
  rYear = (rYear < 2025) ? (rYear+1) : 2020;
  setTimeout(loadReading, 800);
}

/* ========= 🧩 Use of English (грамматика 2020–2025) ========= */
let gYear = 2020;
const grammarQ = {
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

function loadGrammar(){
  const q = grammarQ[gYear] || [];
  $("useTask").innerHTML =
    `<b>${gYear}</b> Grammar<br>` +
    q.map((t,i)=>`<p>${t.q}</p>` + t.o.map(o=>`<label class="option"><input type="radio" name="g${i}" value="${o}"> ${o}</label>`).join("")).join("") +
    `<br><button onclick="checkGrammar()">Проверить</button>`;
}

function checkGrammar(){
  const q = grammarQ[gYear] || [];
  let correct = 0;
  q.forEach((t,i)=>{
    const ch = document.querySelector(`input[name="g${i}"]:checked`);
    if(ch && ch.value===t.a){ correct++; ch.parentElement.classList.add("correct"); }
    else if(ch){ ch.parentElement.classList.add("wrong"); }
  });
  saveResult("Use of English "+gYear, `${correct} / ${q.length}`);
  if(correct >= Math.ceil(q.length*0.75)) addStar(1);
  alert(`Результат: ${correct} / ${q.length}`);
  gYear = (gYear < 2025) ? (gYear+1) : 2020;
  setTimeout(loadGrammar, 800);
}

/* ========= ✍️ Writing ========= */
function saveEssay(){
  const text = $("essay").value.trim();
  if(!text){ alert("Пусто"); return; }
  saveResult("Writing", "Отправлено");
  alert("Эссе сохранено!");
}

/* ========= 🤖 Chat (offline-советы) ========= */
function chatSend(){
  const t = $("chattext").value.trim(); if(!t) return;
  addMsg("user", t);
  const ans = "AI Bayan: найди ключевые слова, определи время (Past/Present/Future) и тему текста. (offline)";
  addMsg("ai", ans);
  $("chattext").value = "";
}
function addMsg(role,text){
  const log = $("chatlog");
  const div = document.createElement("div");
  div.textContent = (role==="user" ? "Вы: " : "AI Bayan: ") + text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
