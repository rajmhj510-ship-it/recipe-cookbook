let images = [];
let order = [];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  // ensure 7 items
  order = images.slice(0, 7);

  render();

  setInterval(rotate, 2500);
});

/* RENDER STACK */
function render(){

  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  order.forEach((img, i) => {

    const el = document.createElement("img");
    el.src = img;
    el.className = "card";
    stack.appendChild(el);
  });

  applyPositions();
}

/* APPLY POSITIONS + DEPTH */
function applyPositions(){

  const cards = document.querySelectorAll(".card");

  const classes = [
    "l3", "l2", "l1", "center", "r1", "r2", "r3"
  ];

  cards.forEach((card, i) => {

    // reset class first
    card.className = "card";

    setTimeout(() => {
      card.classList.add(classes[i]);
    }, i * 70); // 🔥 staggered smooth effect
  });
}

/* ROTATION (CIRCULAR SHIFT) */
function rotate(){

  const last = order.pop();
  order.unshift(last);

  render();
}
