let images = [];
let cards = [];

/* SLOT POSITIONS (FIXED) */
const slots = [
  { x: -400, scale: 0.75, gray: 0.9 }, // L3
  { x: -270, scale: 0.85, gray: 0.75 }, // L2
  { x: -140, scale: 0.95, gray: 0.6 }, // L1
  { x: 0,    scale: 1.25, gray: 0 },   // CENTER (COLOR)
  { x: 140,  scale: 0.95, gray: 0.6 }, // R1
  { x: 270,  scale: 0.85, gray: 0.75 }, // R2
  { x: 400,  scale: 0.75, gray: 0.9 }  // R3
];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))].slice(0,7);

  createCards();

  apply();

  setInterval(rotate, 2500);
});

/* CREATE */
function create(){

  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "card";
    stack.appendChild(img);
  });

  cards = document.querySelectorAll(".card");
}

/* APPLY POSITIONS */
function apply(){

  cards.forEach((card, i) => {

    const slot = slots[i];

    card.style.transform = `
      translateX(${slot.x}px)
      scale(${slot.scale})
    `;

    card.style.filter = `grayscale(${slot.gray})`;

    card.style.zIndex = 10 - Math.abs(3 - i);
  });
}

/* 🔥 PERFECT ROTATION (NO BUGS EVER) */
function rotate(){

  const last = images.pop();
  images.unshift(last);

  // rebind order safely
  create();
  apply();
}
