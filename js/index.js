let images = [];
let order = [];

document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  // take first 7 images
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

    if(i === 3) el.classList.add("center");

    else if(i === 2) el.classList.add("l1");
    else if(i === 1) el.classList.add("l2");
    else if(i === 0) el.classList.add("l3");

    else if(i === 4) el.classList.add("r1");
    else if(i === 5) el.classList.add("r2");
    else if(i === 6) el.classList.add("r3");

    stack.appendChild(el);
  });
}

/* ROTATION LOGIC */
/*
L3 → L2 → L1 → CENTER → R1 → R2 → R3 → L3
*/
function rotate(){
  const last = order.pop();
  order.unshift(last);
  render();
}
