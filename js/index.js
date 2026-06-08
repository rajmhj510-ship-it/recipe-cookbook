let allRecipes = [];
let activeCategory = "All";

/* HERO IMAGES FROM ALL FOLDERS */
const heroImages = [
  "assets/images/arabic/chicken-shawarma.png",
  "assets/images/arabic/falafel.png",
  "assets/images/arabic/hummus.png",
  "assets/images/chinese/kung-pao-chicken.png",
  "assets/images/chinese/fish-szechuan-sauce.png",
  "assets/images/chinese/chili-oil.png",
  "assets/images/continental/pancakes.png",
  "assets/images/continental/fried-fish-with-tartar-sauce.png",
  "assets/images/indian/chicken-chettinad.png",
  "assets/images/italian/chicken-cacciatore.png",
  "assets/images/mexican/chimichanga.png",
  "assets/images/nepali/buff-steamed-momo.png",
  "assets/images/nepali/jhol-momo.png",
  "assets/images/thai/pad-thai.png"
];

let heroIndex = 0;

/* HERO SLIDER */
function updateHero(){
const hero = document.getElementById("heroSlide");
if(!hero) return;

hero.style.backgroundImage = `url('${heroImages[heroIndex]}')`;

heroIndex++;
if(heroIndex >= heroImages.length){
heroIndex = 0;
}
}

setInterval(updateHero, 3000);
updateHero();

/* SCROLL */
function scrollDown(){
document.getElementById("main").style.display = "block";
document.getElementById("main").scrollIntoView({behavior:"smooth"});
}

/* LOAD JSON */
document.addEventListener("DOMContentLoaded", async () => {

const res = await fetch("./data/index.json");
allRecipes = await res.json();

renderFilters();
renderRecipes(allRecipes);

document.getElementById("search").addEventListener("input", filterRecipes);
});

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

/* FILTER */
function filterRecipes(){
const search = document.getElementById("search").value.toLowerCase();

const filtered = allRecipes.filter(r =>
(activeCategory === "All" || r.category === activeCategory) &&
r.title.toLowerCase().includes(search)
);

renderRecipes(filtered);
}

/* RENDER CARDS */
function renderRecipes(list){
document.getElementById("list").innerHTML = list.map(r => `
<div class="card" onclick="openRecipe('${r.file}')">
<img src="${r.image}">
<h3>${r.title}</h3>
<small>${r.category}</small>
</div>
`).join("");
}

function openRecipe(file){
window.location.href = "recipe.html?file=" + encodeURIComponent(file);
}
