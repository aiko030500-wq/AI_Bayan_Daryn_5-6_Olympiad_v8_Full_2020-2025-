/* 📖 Reading (загрузка из папки data/) */
let rYear = 2020;
let readingTasks = {
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

async function loadReading() {
  try {
    const res = await fetch(`data/reading_${rYear}.txt`);
    const text = await res.text();
    const d = readingTasks[rYear];
    $("readingTask").innerHTML =
      `<b>${rYear}</b>:<br><div class='card' style='background:#0b1535'>${text}</div><hr>` +
      d.map((t,i)=>`<p>${t.q}</p>`+t.o.map(o=>`<label class='option'><input type='radio' name='r${i}' value='${o}'> ${o}</label>`).join("")).join("") +
      `<br><button onclick='checkReading()'>Проверить</button>`;
  } catch(e) {
    $("readingTask").innerHTML = `<p>Не найден файл data/reading_${rYear}.txt</p>`;
  }
}

function checkReading(){
  const d = readingTasks[rYear];
  let correct = 0;
  d.forEach((t,i)=>{
    const ch=document.querySelector(`input[name=r${i}]:checked`);
    if(ch&&ch.value===t.a){correct++;ch.parentElement.classList.add("correct");}
    else if(ch){ch.parentElement.classList.add("wrong");}
  });
  saveResult("Reading "+rYear,correct+" / "+d.length);
  if(correct>=3)addStar();
  alert("Результат: "+correct+" / "+d.length);
  rYear=rYear<2025?rYear+1:2020;
  setTimeout(loadReading,800);
}

loadReading();
