let allRecipes = [];
let heroImages = [];
let heroIndex = 0;
let activeCategory = "All";

/* LOAD DATA */
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  allRecipes = await res.json();

  buildHeroImages(allRecipes);
  startHeroSlider();

  renderFilters();
  renderRecipes(allRecipes);

  document.getElementById("search").addEventListener("input", filterRecipes);
});


/* HERO IMAGES FROM index.json */
function buildHeroImages(recipes) {
  heroImages = [...new Set(recipes.map(r => r.image).filter(Boolean))];
}


/* HERO SLIDER */
function startHeroSlider() {
  const hero = document.getElementById("hero");
  if (!hero || heroImages.length === 0) return;

  function update() {
    hero.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
    heroIndex = (heroIndex + 1) % heroImages.length;
  }

  update();
  setInterval(update, 3000);
}


/* ENTER APP (HERO DISAPPEARS COMPLETELY) */
function enterApp() {
  document.getElementById("hero").style.display = "none";
  document.getElementById("main").style.display = "block";
}


/* FILTERS */
function renderFilters() {
  const categories = ["All", ...new Set(allRecipes.map(r => r.category))];

  document.getElementById("filters").innerHTML =
    categories.map(c => `
      <button onclick="setCategory(event,'${c}')">${c}</button>
    `).join("");
}


/* SET CATEGORY */
function setCategory(e, cat) {
  activeCategory = cat;

  document.querySelectorAll(".filters button")
    .forEach(b => b.classList.remove("active"));

  e.target.classList.add("active");

  filterRecipes();
}


/* SEARCH + FILTER */
function filterRecipes() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = allRecipes.filter(r =>
    (activeCategory === "All" || r.category === activeCategory) &&
    r.title.toLowerCase().includes(search)
  );

  renderRecipes(filtered);
}


/* RENDER RECIPES */
function renderRecipes(list) {
  document.getElementById("list").innerHTML = list.map(r => `
    <div class="card" onclick="openRecipe('${r.file}')">
      <img src="${r.image}">
      <h3>${r.title}</h3>
      <small>${r.category}</small>
    </div>
  `).join("");
}


/* OPEN RECIPE */
function openRecipe(file) {
  window.location.href = "recipe.html?file=" + encodeURIComponent(file);
}
