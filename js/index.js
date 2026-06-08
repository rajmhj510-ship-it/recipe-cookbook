let allRecipes = [];
let heroImages = [];
let heroIndex = 0;
let activeCategory = "All";
let heroInterval = null;

let appOpened = false;

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  allRecipes = await res.json();

  buildHeroImages(allRecipes);
  startHeroSlider();

  renderFilters();
  renderRecipes(allRecipes);

  document.getElementById("search").addEventListener("input", filterRecipes);

  setupObserver();
});


/* HERO IMAGES FROM JSON */
function buildHeroImages(recipes) {
  heroImages = [...new Set(recipes.map(r => r.image).filter(Boolean))];
}


/* HERO SLIDER */
function startHeroSlider() {
  const hero = document.getElementById("heroSlide");
  if (!heroImages.length) return;

  function update() {
    hero.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
    heroIndex = (heroIndex + 1) % heroImages.length;
  }

  update();
  heroInterval = setInterval(update, 3000);
}


/* STABLE SCROLL SYSTEM */
function setupObserver() {
  const hero = document.getElementById("heroSlide");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        closeApp();
      } else {
        openApp();
      }
    });
  }, {
    threshold: 0.75
  });

  observer.observe(hero);
}


/* OPEN APP */
function openApp() {
  if (appOpened) return;
  appOpened = true;

  if (heroInterval) clearInterval(heroInterval);

  document.getElementById("heroSlide").classList.add("hide");
}


/* CLOSE APP */
function closeApp() {
  if (!appOpened) return;
  appOpened = false;

  document.getElementById("heroSlide").classList.remove("hide");

  startHeroSlider();
}


/* SCROLL BUTTON */
function goToApp() {
  document.getElementById("appSection")
    .scrollIntoView({ behavior: "smooth" });
}


/* FILTERS */
function renderFilters() {
  const categories = ["All", ...new Set(allRecipes.map(r => r.category))];

  document.getElementById("filters").innerHTML =
    categories.map(c => `
      <button onclick="setCategory(event,'${c}')">${c}</button>
    `).join("");
}


/* CATEGORY */
function setCategory(e, cat) {
  activeCategory = cat;

  document.querySelectorAll(".filters button")
    .forEach(b => b.classList.remove("active"));

  e.target.classList.add("active");

  filterRecipes();
}


/* SEARCH */
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
