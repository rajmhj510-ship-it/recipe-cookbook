let images = [];
let index = 0;

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  const data = await res.json();

  images = [...new Set(data.map(r => r.image))];

  buildRow();
  startStack();
});

/* BUILD ROW */
function buildRow(){
  const row = document.getElementById("stackRow");

  row.innerHTML = images.slice(0,7).map(img =>
    `<img src="${img}">`
  ).join("");
}

/* ROTATION */
function startStack(){

  const cards = document.querySelectorAll("#stackRow img");

  function update(){

    cards.forEach((card,i)=>{
      card.classList.toggle("active", i === index);
    });

    index = (index + 1) % cards.length;
  }

  update();
  setInterval(update, 2000);
}
