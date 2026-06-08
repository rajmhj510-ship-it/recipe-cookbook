let images = [];
let slots = [];

const layout = ["l3","l2","l1","center","r1","r2","r3"];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  slots = images.slice(0,7);

  createCards();
  render();

  setInterval(rotateSlots, 2500);
});

/* CREATE CARDS ONCE */
function createCards(){
  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  slots.forEach(img=>{
    const el = document.createElement("img");
    el.src = img;
    el.className = "card";
    stack.appendChild(el);
  });
}

/* APPLY POSITIONS (CRITICAL PART) */
function render(){

  const cards = document.querySelectorAll(".card");

  cards.forEach((card, i)=>{
    card.className = "card";
    card.classList.add(layout[i]);
  });
}

/* 🔥 TRUE SLOT ROTATION (FIXED LOGIC) */
function rotateSlots(){

  // move last slot to first (L3 becomes new image flow)
  slots.unshift(slots.pop());

  render();
}
