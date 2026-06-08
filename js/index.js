let allRecipes = [];
let activeCategory = "All";
let appOpened = false;

/* SCROLL AUTO TRIGGER */
window.addEventListener("scroll", () => {
if (appOpened) return;

if (window.scrollY > window.innerHeight * 0.6) {
openApp();
}
});

/* BUTTON CLICK SCROLL */
function scrollToApp(){
openApp();
}

/* OPEN APP (COMMON FUNCTION) */
function openApp(){
if (appOpened) return;

appOpened = true;

/* smooth hero exit */
document.getElementById("hero").style.transition = "0.5s";
document.getElementById("hero").style.opacity = "0";
document.getElementById("hero").style.transform = "translateY(-60px)";

setTimeout(() => {
document.getElementById("hero").style.display = "none";
document.getElementById("app").style.display = "block";
window.scrollTo({ top: 0, behavior: "smooth" });
}, 400);
}

/* LOAD DATA */
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

function openRecipe(file){
window.location.href = "recipe.html?file=" + encodeURIComponent(file);
}
