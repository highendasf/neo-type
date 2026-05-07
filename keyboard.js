const keyboard = document.getElementById("keyboard");
const input = document.getElementById("input");

function toggleKeyboard() {
  keyboard.classList.toggle("hidden");

  if (!keyboard.dataset.built) {
    buildKeyboard();
    keyboard.dataset.built = "true";
  }
}

function buildKeyboard() {
  const keys = [
    "q","w","e","r","t","y","u","i","o","p",
    "a","s","d","f","g","h","j","k","l",
    "z","x","c","v","b","n","m",
    "space","back"
  ];

  keyboard.innerHTML = "";

  keys.forEach(k => {
    const key = document.createElement("div");
    key.className = "key";

    key.innerText = k === "space" ? "␠" : k;

    key.onclick = () => handleKey(k);

    keyboard.appendChild(key);
  });
}

function handleKey(k) {
  if (k === "back") {
    input.value = input.value.slice(0, -1);
  } 
  else if (k === "space") {
    input.value += " ";
  } 
  else {
    input.value += k;
  }

  input.dispatchEvent(new Event("input"));
}