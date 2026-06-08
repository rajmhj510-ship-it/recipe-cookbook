let allRecipes = [];
let heroImages = [];
let heroIndex = 0;
let heroInterval;

let activeCategory = "All";

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

  await loadHeroImages();
  startHeroSlider();

  const res = await fetch("./data/index.json");
  allRecipes = await res.json();

  renderFilters();
  renderRecipes(allRecipes);

  document.getElementById("search").addEventListener("input", filterRecipes);
});


/* ======================
   HERO SYSTEM (AUTO)
====================== */

async function loadHeroImages() {
  try {
    const res = await fetch("./data/hero.json");
    heroImages = await res.json();
  } catch (e) {
    console.log("Hero load failed");
    heroImages = [];
  }
}

function updateHero() {
  const hero = document.getElementById("heroSlide");
  if (!hero || heroImages.length === 0) return;

  hero.style.backgroundImage = `url('${heroImages[heroIndex]}')`;

  heroIndex = (heroIndex + 1) % heroImages.length;
}

function startHeroSlider() {
  updateHero();
  heroInterval = setInterval(updateHero, 3000);
}


/* ======================
   SCROLL DOWN
====================== */

function scrollDown() {
  document.getElementById("main")
    .scrollIntoView({ behavior: "smooth" });
}


/* ======================
   FILTER SYSTEM
====================== */

function renderFilters() {
  const categories = ["All", ...new Set(allRecipes.map(r => r.category))];

  document.getElementById("filters").innerHTML =
    categories.map(c => `
      <button onclick="setCategory(event,'${c}')">${c}</button>
    `).join("");
}

function setCategory(e, cat) {
  activeCategory = cat;

  document.querySelectorAll(".filters button")
    .forEach(b => b.classList.remove("active"));

  e.target.classList.add("active");

  filterRecipes();
}


/* ======================
   SEARCH + FILTER
====================== */

function filterRecipes() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = allRecipes.filter(r =>
    (activeCategory === "All" || r.category === activeCategory) &&
    r.title.toLowerCase().includes(search)
  );

  renderRecipes(filtered);
}


/* ======================
   RENDER CARDS
====================== */

function renderRecipes(list) {
  document.getElementById("list").innerHTML = list.map(r => `
    <div class="card" onclick="openRecipe('${r.file}')">
      <img src="${r.image}">
      <h3>${r.title}</h3>
      <small>${r.category}</small>
    </div>
  `).join("");
}


/* ======================
   NAVIGATION
====================== */

function openRecipe(file) {
  window.location.href = "recipe.html?file=" + encodeURIComponent(file);
}
