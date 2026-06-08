let allRecipes = [];
let heroImages = [];
let heroIndex = 0;

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  allRecipes = await res.json();

  buildHero(allRecipes);
  renderFilters();
  renderRecipes(allRecipes);

  document.getElementById("search").addEventListener("input", filterRecipes);
});

/* HERO BUILDER */
function buildHero(recipes){
  heroImages = [...new Set(recipes.map(r => r.image).filter(Boolean))];

  const stack = document.getElementById("stack");

  stack.innerHTML = heroImages.slice(0,7).map(img => `
    <img src="${img}">
  `).join("");

  startCarousel();
}

/* CAROUSEL */
function startCarousel(){

  const images = document.querySelectorAll("#stack img");

  function update(){

    images.forEach((img, i) => {

      img.className = "";

      const diff = (i - heroIndex + images.length) % images.length;

      if(diff === 0) img.classList.add("active");
      else if(diff === 1) img.classList.add("right");
      else if(diff === images.length - 1) img.classList.add("left");
      else img.classList.add("hidden");
    });

    heroIndex = (heroIndex + 1) % images.length;
  }

  update();
  setInterval(update, 3000);
}

/* SCROLL */
function goToApp(){
  document.getElementById("appSection")
    .scrollIntoView({ behavior: "smooth" });
}

/* FILTERS */
function renderFilters(){
  const categories = ["All", ...new Set(allRecipes.map(r => r.category))];

  document.getElementById("filters").innerHTML =
    categories.map(c => `
      <button onclick="setCategory(event,'${c}')">${c}</button>
    `).join("");
}

let activeCategory = "All";

function setCategory(e, cat){
  activeCategory = cat;

  document.querySelectorAll(".filters button")
    .forEach(b => b.classList.remove("active"));

  e.target.classList.add("active");

  filterRecipes();
}

/* SEARCH */
function filterRecipes(){
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = allRecipes.filter(r =>
    (activeCategory === "All" || r.category === activeCategory) &&
    r.title.toLowerCase().includes(search)
  );

  renderRecipes(filtered);
}

/* RENDER */
function renderRecipes(list){
  document.getElementById("list").innerHTML = list.map(r => `
    <div class="card" onclick="openRecipe('${r.file}')">
      <img src="${r.image}">
      <h3>${r.title}</h3>
      <small>${r.category}</small>
    </div>
  `).join("");
}

/* OPEN */
function openRecipe(file){
  window.location.href = "recipe.html?file=" + encodeURIComponent(file);
}
