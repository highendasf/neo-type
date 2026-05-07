let mode = "words";
let text = "";
let startTime = null;

const words = [
  "speed","typing","keyboard","focus","react","javascript","accuracy","practice","flow","clean","code","build","system","design","modern","interface",
  "development","engine","performance","algorithm","function","variable","object","array","string","boolean","loop","condition","event","listener",
  "state","component","render","hook","effect","context","module","export","import","async","await","promise","thread","process","memory",
  "network","server","client","database","query","response","request","api","json","html","css","frontend","backend","fullstack","debug"
];

const sentences = [
  "focus on accuracy before speed",
  "practice every day to improve typing skills",
  "clean code leads to better performance",
  "consistency builds mastery over time",
  "slow is smooth and smooth is fast"
];

// DOM
const display = document.getElementById("textDisplay");
const input = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("acc");
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

// DATA
let historyWPM = [];
let historyACC = [];

// GAMIFICATION
let xp = Number(localStorage.getItem("xp") || 0);
let level = Number(localStorage.getItem("level") || 1);
let weakWords = JSON.parse(localStorage.getItem("weakWords") || "{}");

// ======================
// INIT
// ======================
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

  renderText();
}

// ======================
// RENDER TEXT
// ======================
function renderText() {
  display.innerHTML = text
    .split("")
    .map((c, i) => `<span id="c${i}">${c}</span>`)
    .join("");
}

generate();

// ======================
// INPUT LOGIC
// ======================
input.addEventListener("input", () => {
  if (!startTime) startTime = Date.now();

  const typed = input.value;
  const chars = display.querySelectorAll("span");

  let correct = 0;

  // accuracy + coloring
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];

    if (!typed[i]) {
      c.style.color = "#666";
    } 
    else if (typed[i] === c.innerText) {
      c.style.color = "#4ade80";
      correct++;
    } 
    else {
      c.style.color = "#ef4444";
    }
  }

  // time safe check
  const time = Math.max((Date.now() - startTime) / 60000, 0.01);

  const wpm = Math.floor((correct / 5) / time);
  const raw = Math.floor((typed.length / 5) / time);

  const acc = typed.length
    ? Math.floor((correct / typed.length) * 100)
    : 100;

  // UI
  wpmEl.innerText = wpm;
  accEl.innerText = acc;

  // graph
  historyWPM.push(wpm);
  historyACC.push(acc);

  drawGraph();

  // ======================
  // GAMIFICATION SYSTEM
  // ======================

  xp += Math.floor(wpm / 10);

  if (xp >= level * 100) {
    level++;
    xp = 0;
  }

  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);

  // weak word tracking (simple)
  const wordsTyped = typed.split(" ");
  wordsTyped.forEach((w, i) => {
    if (w !== text.split(" ")[i]) {
      weakWords[w] = (weakWords[w] || 0) + 1;
    }
  });

  localStorage.setItem("weakWords", JSON.stringify(weakWords));

  // completion
  if (typed === text) {
    setTimeout(resetTest, 700);
  }
});

// ======================
// RESET
// ======================
function resetTest() {
  input.value = "";
  startTime = null;
  historyWPM = [];
  historyACC = [];
  generate();
}

// ======================
// GRAPH
// ======================
function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // grid
  ctx.strokeStyle = "#1a1a1a";
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 12);
    ctx.lineTo(600, i * 12);
    ctx.stroke();
  }

  function smooth(data) {
    return data.map((v, i, arr) => {
      const prev = arr[i - 1] || v;
      return (prev + v) / 2;
    });
  }

  const wpmLine = smooth(historyWPM);
  const accLine = smooth(historyACC);

  // WPM
  ctx.beginPath();
  ctx.strokeStyle = "cyan";
  wpmLine.forEach((v, i) => {
    ctx.lineTo(i * 5, 120 - v);
  });
  ctx.stroke();

  // ACC
  ctx.beginPath();
  ctx.strokeStyle = "lime";
  accLine.forEach((v, i) => {
    ctx.lineTo(i * 5, 120 - v);
  });
  ctx.stroke();
}