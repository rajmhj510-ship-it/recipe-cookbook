let allRecipes = [];
let heroImages = [];
let heroIndex = 0;

/* LOAD DATA */
document.addEventListener("DOMContentLoaded", async () => {

  try {
    const res = await fetch("./data/index.json");
    allRecipes = await res.json();

    buildHeroImages(allRecipes);
    startHeroSlider();
    renderRecipes(allRecipes);

  } catch (err) {
    console.log("Error loading data:", err);
  }
});


/* AUTO BUILD HERO IMAGES FROM index.json */
function buildHeroImages(recipes) {

  heroImages = [...new Set(
    recipes
      .map(r => r.image)
      .filter(img => img && img.includes("assets/images"))
  )];

}


/* HERO SLIDER */
function startHeroSlider() {

  const hero = document.getElementById("heroSlide");
  if (!hero || heroImages.length === 0) return;

  function updateHero() {
    hero.style.backgroundImage = `url('${heroImages[heroIndex]}')`;

    heroIndex++;
    if (heroIndex >= heroImages.length) {
      heroIndex = 0;
    }
  }

  updateHero();
  setInterval(updateHero, 3000);
}


/* SCROLL DOWN */
function scrollDown() {
  const main = document.getElementById("main");
  main.style.display = "block";
  main.scrollIntoView({ behavior: "smooth" });
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
