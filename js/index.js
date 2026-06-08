let images = [];
let order = [];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  order = images.slice(0, 7);

  render();

  setInterval(rotate, 2500);
});

/* RENDER STACK */
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

/* APPLY POSITIONS (NO LOGIC CHANGE HERE) */
function applyPositions(){

  const cards = document.querySelectorAll(".card");

  const layout = ["l3","l2","l1","center","r1","r2","r3"];

  cards.forEach((card,i)=>{
    card.className = "card";

    // stagger visual animation only (NOT logic)
    setTimeout(()=>{
      card.classList.add(layout[i]);
    }, i * 60);
  });
}

/* ✅ FIXED ROTATION (NO SWAPPING, NO CENTER BREAK) */
function rotate(){

  // PURE CIRCULAR SHIFT ONLY
  const last = order.pop();
  order.unshift(last);

  // re-render with same structure
  render();
}
