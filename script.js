let mode = "words";
let text = "";
let startTime = null;

const words = [
  "speed","typing","keyboard","focus","react","javascript","accuracy","practice","flow","clean","code","build","system","design","modern"
];

const sentences = [
  "focus on accuracy before speed",
  "practice every day to improve typing",
  "clean code leads to better performance",
  "consistency builds mastery over time"
];

// DOM
const display = document.getElementById("textDisplay");
const input = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("acc");
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

let historyWPM = [];
let historyACC = [];

// INIT
function setMode(m) {
  mode = m;
  resetTest();
}

function generate() {
  if (mode === "words") {
    text = Array.from({ length: 30 }, () =>
      words[Math.floor(Math.random() * words.length)]
    ).join(" ");
  } 
  else if (mode === "sentences") {
    text = sentences[Math.floor(Math.random() * sentences.length)];
  } 
  else {
    text = words[Math.floor(Math.random() * words.length)];
  }

  display.innerHTML = text
    .split("")
    .map(c => `<span>${c}</span>`)
    .join("");
}

generate();

// INPUT
input.addEventListener("input", () => {
  if (!startTime) startTime = Date.now();

  const typed = input.value;
  const chars = display.querySelectorAll("span");

  let correct = 0;

  chars.forEach((c, i) => {
    if (!typed[i]) c.style.color = "#666";
    else if (typed[i] === c.innerText) {
      c.style.color = "#4ade80";
      correct++;
    } else {
      c.style.color = "#ef4444";
    }
  });

  const time = Math.max((Date.now() - startTime) / 60000, 0.01);

  const wpm = Math.floor((correct / 5) / time);
  const acc = typed.length
    ? Math.floor((correct / typed.length) * 100)
    : 100;

  wpmEl.innerText = wpm;
  accEl.innerText = acc;

  historyWPM.push(wpm);
  historyACC.push(acc);

  drawGraph();

  if (typed === text) setTimeout(resetTest, 700);
});

// RESET
function resetTest() {
  input.value = "";
  startTime = null;
  historyWPM = [];
  historyACC = [];
  generate();
}

// GRAPH
function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = historyWPM;
  const a = historyACC;

  const gradientW = ctx.createLinearGradient(0,0,600,0);
  gradientW.addColorStop(0,"#3b82f6");
  gradientW.addColorStop(1,"#22d3ee");

  const gradientA = ctx.createLinearGradient(0,0,600,0);
  gradientA.addColorStop(0,"#22c55e");
  gradientA.addColorStop(1,"#a3e635");

  ctx.beginPath();
  ctx.strokeStyle = gradientW;
  w.forEach((v,i)=>ctx.lineTo(i*5,120-v));
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = gradientA;
  a.forEach((v,i)=>ctx.lineTo(i*5,120-v));
  ctx.stroke();
}