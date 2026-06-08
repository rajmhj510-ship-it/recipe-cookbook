let images = [];
let order = [];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  order = images.slice(0, 7);

  createCards();
  applyPositions();

  setInterval(rotateLeftFlow, 2500);
});

/* CREATE ONCE */
function createCards(){

  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  order.forEach(img=>{
    const el = document.createElement("img");
    el.src = img;
    el.className = "card";
    stack.appendChild(el);
  });
}

/* APPLY POSITIONS */
function applyPositions(){

  const cards = document.querySelectorAll(".card");

  const layout = [
    "l3",
    "l2",
    "l1",
    "center",
    "r1",
    "r2",
    "r3"
  ];

  cards.forEach((card,i)=>{
    card.className = "card";
    card.classList.add(layout[i]);
  });
}

/* ✅ CORRECT FLOW ROTATION */
function rotateLeftFlow(){

  // L3 → L2 → L1 → CENTER → R1 → R2 → R3 → L3

  const last = order.pop();
  order.unshift(last);

  applyPositions();
}
