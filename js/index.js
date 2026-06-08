let allRecipes = [];
let heroImages = [];
let heroIndex = 0;
let activeCategory = "All";
let heroInterval = null;

/* STATE */
let appOpened = false;
let lastScrollY = 0;

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("./data/index.json");
  allRecipes = await res.json();

  buildHeroImages(allRecipes);
  startHeroSlider();

  renderFilters();
  renderRecipes(allRecipes);

  document.getElementById("search").addEventListener("input", filterRecipes);

  window.addEventListener("scroll", handleScroll);
  lastScrollY = window.scrollY;
});


/* HERO IMAGES */
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


/* SCROLL DETECTION (UP + DOWN) */
function handleScroll() {

  const currentY = window.scrollY;
  const hero = document.getElementById("heroSlide");

  const goingDown = currentY > lastScrollY;
  const goingUp = currentY < lastScrollY;

  const appSection = document.getElementById("appSection");
  const appTop = appSection.getBoundingClientRect().top;

  /* 🔽 SCROLL DOWN → ENTER APP */
  if (goingDown && appTop <= 120 && !appOpened) {
    openApp();
  }

  /* 🔼 SCROLL UP → RETURN HERO */
  if (goingUp && currentY < 100 && appOpened) {
    closeApp();
  }

  lastScrollY = currentY;
}


/* OPEN APP (HIDE HERO) */
function openApp() {
  appOpened = true;

  if (heroInterval) clearInterval(heroInterval);

  const hero = document.getElementById("heroSlide");

  hero.style.transition = "0.6s ease";
  hero.style.opacity = "0";
  hero.style.transform = "translateY(-50px)";

  setTimeout(() => {
    hero.style.display = "none";
  }, 500);
}


/* CLOSE APP (RESTORE HERO) */
function closeApp() {
  appOpened = false;

  const hero = document.getElementById("heroSlide");

  hero.style.display = "flex";

  setTimeout(() => {
    hero.style.opacity = "1";
    hero.style.transform = "translateY(0)";
  }, 50);

  startHeroSlider();
}


/* BUTTON SCROLL */
function goToApp() {
  document.getElementById("appSection")
    .scrollIntoView({ behavior: "smooth" });

  setTimeout(() => openApp(), 600);
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


/* RENDER */
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
