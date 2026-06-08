let images = [];
let cards = [];

const slots = [
  { x: -400, scale: 0.75, gray: 0.9 }, // L3
  { x: -270, scale: 0.85, gray: 0.75 }, // L2
  { x: -140, scale: 0.95, gray: 0.6 }, // L1
  { x: 0,    scale: 1.25, gray: 0 },   // CENTER
  { x: 140,  scale: 0.95, gray: 0.6 }, // R1
  { x: 270,  scale: 0.85, gray: 0.75 }, // R2
  { x: 400,  scale: 0.75, gray: 0.9 }  // R3
];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = data.slice(0,7).map(r => r.image);

  createCards();
  render();

  setInterval(rotate, 2500);
});

/* CREATE ONCE */
function createCards(){

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

/* RENDER POSITIONS */
function render(){

  cards.forEach((card, i) => {
    const s = slots[i];

    card.style.transform = `translateX(${s.x}px) scale(${s.scale})`;
    card.style.filter = `grayscale(${s.gray})`;

    card.style.zIndex = 10 - Math.abs(3 - i);
  });
}

/* ROTATION (CLEAN + SAFE) */
function rotate(){

  images.unshift(images.pop()); // circular shift
  createCards();
  render();
}
