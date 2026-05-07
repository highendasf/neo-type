const keyboard = document.getElementById("keyboard");

function buildKeyboard() {
  if (keyboard.dataset.built) return;

  const layout = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm"
  ];

  layout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.style.justifyContent = "center";

    row.split("").forEach(k => {
      const key = document.createElement("div");
      key.className = "key";
      key.innerText = k;
      key.style.pointerEvents = "none";
      key.style.opacity = "0.5";
      rowDiv.appendChild(key);
    });

    keyboard.appendChild(rowDiv);
  });

  const space = document.createElement("div");
  space.className = "key";
  space.innerText = "space";
  space.style.width = "60%";
  space.style.margin = "10px auto";
  space.style.opacity = "0.4";
  space.style.pointerEvents = "none";

  keyboard.appendChild(space);

  keyboard.dataset.built = "true";
}

function toggleKeyboard() {
  keyboard.classList.toggle("hidden");
  buildKeyboard();
}