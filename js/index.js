let images = [];
let order = [];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  order = images.slice(0, 7);

  createCards();
  applyPositions();

  setInterval(rotate, 2600);
});

/* CREATE ONCE ONLY (IMPORTANT FIX) */
function createCards(){

  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  order.forEach(img => {
    const el = document.createElement("img");
    el.src = img;
    el.className = "card";
    stack.appendChild(el);
  });
}

/* APPLY POSITIONS WITHOUT RECREATING */
function applyPositions(){

  const cards = document.querySelectorAll(".card");

  const layout = ["l3","l2","l1","center","r1","r2","r3"];

  cards.forEach((card,i)=>{
    card.classList.remove("l3","l2","l1","center","r1","r2","r3");

    // stagger effect ONLY (visual)
    setTimeout(()=>{
      card.classList.add(layout[i]);
    }, i * 80);
  });
}

/* REAL SMOOTH ROTATION */
function rotate(){

  // shift data
  const last = order.pop();
  order.unshift(last);

  // re-map WITHOUT DOM rebuild
  const cards = document.querySelectorAll(".card");

  // rotate DOM order logically
  cards.forEach((card, i) => {
    card.style.order = i;
  });

  applyPositions();
}
