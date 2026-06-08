let images = [];
let startIndex = 0;
let cards = [];

/* FIXED SLOT MAP */
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

  setInterval(next, 2500);
});

/* CREATE DOM ONCE */
function createCards(){

  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  for(let i=0;i<7;i++){
    const img = document.createElement("img");
    img.className = "card";
    stack.appendChild(img);
  }

  cards = document.querySelectorAll(".card");
}

/* RENDER BASED ON INDEX OFFSET */
function render(){

  for(let i=0;i<7;i++){

    const imgIndex = (startIndex + i) % images.length;

    const card = cards[i];
    const s = slots[i];

    card.src = images[imgIndex];

    card.style.transform = `translateX(${s.x}px) scale(${s.scale})`;
    card.style.filter = `grayscale(${s.gray})`;

    card.style.zIndex = 10 - Math.abs(3 - i);
  }
}

/* 🔥 STABLE ROTATION */
function next(){

  startIndex = (startIndex + 1) % images.length;

  render();
}
