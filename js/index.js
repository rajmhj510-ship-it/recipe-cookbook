let images = [];
let order = [];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  order = images.slice(0, 7);

  render();

  setInterval(rotateWave, 3000);
});

/* RENDER */
function render(){

  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  order.forEach(img => {
    const el = document.createElement("img");
    el.src = img;
    el.className = "card";
    stack.appendChild(el);
  });

  applyPositions();
}

/* APPLY POSITIONS */
function applyPositions(){

  const cards = document.querySelectorAll(".card");

  const layout = ["l3","l2","l1","center","r1","r2","r3"];

  cards.forEach((card,i)=>{
    card.className = "card";
    card.classList.add(layout[i]);
  });
}

/* 🌊 WAVE ROTATION (STAGGERED) */
function rotateWave(){

  const cards = document.querySelectorAll(".card");

  const steps = [
    [0,1], // L3 → L2
    [1,2], // L2 → L1
    [2,3], // L1 → CENTER
    [3,4], // CENTER → R1
    [4,5], // R1 → R2
    [5,6], // R2 → R3
    [6,0]  // R3 → L3
  ];

  let delay = 0;

  steps.forEach(([from,to])=>{
    setTimeout(()=>{

      // swap images
      const temp = order[to];
      order[to] = order[from];
      order[from] = temp;

      applyPositions();

    }, delay);

    delay += 180; // 👈 stagger timing (wave effect)
  });
}
