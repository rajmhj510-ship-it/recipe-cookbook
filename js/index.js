let allRecipes = [];
let heroImages = [];
let heroIndex = 0;
let activeCategory = "All";

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  allRecipes = await res.json();

  buildHeroImages(allRecipes);
  startHeroStack();

  renderFilters();
  renderRecipes(allRecipes);

  document.getElementById("search").addEventListener("input", filterRecipes);
});

/* HERO IMAGES */
function buildHeroImages(recipes){
  heroImages = [...new Set(recipes.map(r => r.image).filter(Boolean))];
  startHeroStack();
}

/* 7 STACK HERO */
function startHeroStack(){

  const layers = [
    document.getElementById("bg0"),
    document.getElementById("bg1"),
    document.getElementById("bg2"),
    document.getElementById("bg3"),
    document.getElementById("bg4"),
    document.getElementById("bg5"),
    document.getElementById("bg6"),
  ];

  function update(){

    for(let i=0;i<7;i++){
      const img = heroImages[(heroIndex + i) % heroImages.length];
      layers[i].style.backgroundImage = `url('${img}')`;
    }

    heroIndex = (heroIndex + 1) % heroImages.length;
  }

  update();
  setInterval(update, 3500);
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

/* OPEN RECIPE */
function openRecipe(file){
  window.location.href = "recipe.html?file=" + encodeURIComponent(file);
}
