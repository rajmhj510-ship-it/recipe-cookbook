let images = [];
let nodes = [];

// fixed visual slots
const positions = ["l3","l2","l1","center","r1","r2","r3"];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))].slice(0, 7);

  create();
  apply();

  setInterval(rotate, 2500);
});

/* CREATE ONCE */
function create(){

  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "card";
    stack.appendChild(img);
  });

  nodes = document.querySelectorAll(".card");
}

/* APPLY POSITIONS (SOURCE OF TRUTH = INDEX MAP) */
function apply(){

  nodes.forEach((node, i) => {
    node.className = "card " + positions[i];
  });
}

/* 🔥 PERFECT ROTATION */
function rotate(){

  // rotate array
  const last = images.pop();
  images.unshift(last);

  apply();
}
