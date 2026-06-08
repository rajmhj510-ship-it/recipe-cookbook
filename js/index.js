let allRecipes = [];
let activeCategory = "All";

/* HERO BACKGROUND ROTATION (optional) */
const heroImages = [
  "assets/images/arabic/chicken-shawarma.png",
  "assets/images/chinese/kung-pao-chicken.png",
  "assets/images/indian/chicken-chettinad.png",
  "assets/images/mexican/chimichanga.png",
  "assets/images/nepali/jhol-momo.png",
  "assets/images/thai/pad-thai.png"
];

let heroIndex = 0;

function rotateHero(){
const hero = document.getElementById("hero");
if(!hero) return;

hero.style.backgroundImage = `url('${heroImages[heroIndex]}')`;

heroIndex++;
if(heroIndex >= heroImages.length) heroIndex = 0;
}

setInterval(rotateHero, 3000);
rotateHero();

/* ENTER APP (HIDE HERO COMPLETELY) */
function enterApp(){
document.getElementById("hero").style.display = "none";
document.getElementById("app").style.display = "block";
}

/* LOAD RECIPES */
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

/* SEARCH + FILTER */
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

function openRecipe(file){
window.location.href = "recipe.html?file=" + encodeURIComponent(file);
}
