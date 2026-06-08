let images = [];
let index = 0;

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  render();
  setInterval(rotate, 2500);
});

/* BUILD STACK */
function render(){

  const stack = document.getElementById("stack");
  stack.innerHTML = "";

  for(let i=0;i<7;i++){
    const img = document.createElement("img");
    img.src = images[(index + i) % images.length];
    img.className = "card";
    stack.appendChild(img);
  }

  applyPositions();
}

/* APPLY FIXED POSITIONS (NO RANDOM) */
function applyPositions(){

  const cards = document.querySelectorAll(".card");

  cards.forEach((card,i)=>{

    card.className = "card";

    if(i === 3) card.classList.add("center");

    else if(i === 2) card.classList.add("l1");
    else if(i === 1) card.classList.add("l2");
    else if(i === 0) card.classList.add("l3");

    else if(i === 4) card.classList.add("r1");
    else if(i === 5) card.classList.add("r2");
    else if(i === 6) card.classList.add("r3");
  });
}

/* ROTATE LEFT → RIGHT SHIFT */
function rotate(){
  index = (index + 1) % images.length;
  render();
}
