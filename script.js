let mode = "words"; let text = ""; let startTime = null;

const words = [ "speed","typing","keyboard","focus","react","javascript","accuracy","practice","flow","clean","code","build","system","design","modern","interface", "development","engine","performance","algorithm","function","variable","object","array","string","boolean","loop","condition","event","listener", "state","component","render","hook","effect","context","module","export","import","async","await","promise","thread","process","memory", "network","server","client","database","query","response","request","api","json","html","css","frontend","backend","fullstack","debug" ];

const sentences = [ "focus on accuracy before speed", "practice every day to improve typing skills", "clean code leads to better performance", "consistency builds mastery over time", "slow is smooth and smooth is fast" ];

const display = document.getElementById("textDisplay"); const input = document.getElementById("input"); const wpmEl = document.getElementById("wpm"); const accEl = document.getElementById("acc"); const canvas = document.getElementById("graph"); const ctx = canvas.getContext("2d");

let historyWPM = []; let historyACC = [];

// gamification let xp = Number(localStorage.getItem("xp") || 0); let level = Number(localStorage.getItem("level") || 1); let weakWords = JSON.parse(localStorage.getItem("weakWords") || "{}");

let caretIndex = 0;

function setMode(m){ mode = m; resetTest(); }

function generate(){ if(mode === "words"){ text = Array.from({length: 30}, () => words[Math.floor(Math.random()*words.length)]).join(" "); } else if(mode === "sentences"){ text = sentences[Math.floor(Math.random()*sentences.length)]; } else { text = words[Math.floor(Math.random()*words.length)]; }

caretIndex = 0; renderText(); }

function renderText(){ display.innerHTML = text.split("").map((c,i)=> <span class='char' id='c${i}'>${c}</span> ).join(""); }

generate();

input.addEventListener("input", () => { if(!startTime) startTime = Date.now();

let typed = input.value; let chars = display.querySelectorAll("span");

let correct = 0; let wordErrors = {}; let currentWord = ""; let wordIndex = 0;

for(let i=0;i<chars.length;i++){ let c = chars[i];

if(typed[i] == null){ c.style.color = "#666"; } else if(typed[i] === c.innerText){ c.style.color = "#4ade80"; correct++; } else { c.style.color = "#ef4444"; currentWord += text[i]; if(text[i] === " "){ wordErrors[currentWord.trim()] = (wordErrors[currentWord.trim()] || 0) + 1; currentWord = ""; } } if(text[i] === " ") wordIndex++; 

}

let acc = typed.length ? Math.floor((correct/typed.length)*100) : 100; let time = (Date.now()-startTime)/60000 || 1;

let wpm = Math.floor((correct/5)/time); let raw = Math.floor((typed.length/5)/time);

wpmEl.innerText = wpm; accEl.innerText = acc;

historyWPM.push(wpm); historyACC.push(acc);

drawGraph();

// XP system xp += Math.floor(wpm/10); if(xp > level*100){ level++; xp = 0; }

localStorage.setItem("xp", xp); localStorage.setItem("level", level);

// weak words tracking Object.keys(wordErrors).forEach(w=>{ weakWords[w] = (weakWords[w]||0)+1; });

localStorage.setItem("weakWords", JSON.stringify(weakWords));

if(typed === text) setTimeout(resetTest, 800); });

function resetTest(){ input.value = ""; startTime = null; historyWPM = []; historyACC = []; generate(); }

function drawGraph(){ ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.strokeStyle="#1a1a1a"; for(let i=0;i<10;i++){ ctx.beginPath(); ctx.moveTo(0,i12); ctx.lineTo(600,i12); ctx.stroke(); }

function smooth(data){ return data.map((v,i,a)=>(a[i-1]+v)/2 || v); }

let w = smooth(historyWPM); let a = smooth(historyACC);

ctx.beginPath(); ctx.strokeStyle="cyan"; w.forEach((v,i)=>ctx.lineTo(i*5,120-v)); ctx.stroke();

ctx.beginPath(); ctx.strokeStyle="lime"; a.forEach((v,i)=>ctx.lineTo(i*5,120-v)); ctx.stroke(); }

