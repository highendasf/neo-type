let mode = "words";
let text = "";
let startTime = null;
let correct = 0;
let total = 0;

const words = ["hello", "world", "typing", "speed", "code", "javascript"];
const sentences = [
  "hello world this is a test",
  "typing speed improves with practice",
  "focus and consistency is key"
];

const display = document.getElementById("textDisplay");
const input = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("acc");
const graph = document.getElementById("graph");
const ctx = graph.getContext("2d");

let historyWPM = [];
let historyACC = [];

function setMode(m) {
  mode = m;
  resetTest();
}

function generateText() {
  if (mode === "words") {
    text = Array.from({length: 20}, () =>
      words[Math.floor(Math.random() * words.length)]
    ).join(" ");
  }

  if (mode === "sentences") {
    text = sentences[Math.floor(Math.random() * sentences.length)];
  }

  if (mode === "one") {
    text = words[Math.floor(Math.random() * words.length)];
  }

  display.innerText = text;
}

generateText();

input.addEventListener("input", () => {
  if (!startTime) startTime = Date.now();

  const typed = input.value;
  total = typed.length;

  correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === text[i]) correct++;
  }

  let acc = total === 0 ? 100 : Math.floor((correct / total) * 100);

  let time = (Date.now() - startTime) / 60000;
  let wpm = Math.floor((correct / 5) / time) || 0;

  wpmEl.innerText = wpm;
  accEl.innerText = acc;

  historyWPM.push(wpm);
  historyACC.push(acc);

  drawGraph();

  if (typed === text) {
    setTimeout(resetTest, 700);
  }
});

function resetTest() {
  input.value = "";
  startTime = null;
  correct = 0;
  total = 0;
  historyWPM = [];
  historyACC = [];
  generateText();
  drawGraph();
}

function drawGraph() {
  ctx.clearRect(0, 0, graph.width, graph.height);

  ctx.beginPath();
  ctx.strokeStyle = "cyan";

  historyWPM.forEach((v, i) => {
    ctx.lineTo(i * 5, 150 - v);
  });

  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "lime";

  historyACC.forEach((v, i) => {
    ctx.lineTo(i * 5, 150 - v);
  });

  ctx.stroke();
}