let recipes = [];
let selectedCategory = "all";
let searchQuery = "";

/* ================= ELEMENTS ================= */
const recipeList = document.getElementById("recipeList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");

/* ================= LOAD DATA ================= */
fetch("/recipe-cookbook/data/index.json")
	.then(res => res.json())
	.then(data => {
		recipes = Array.isArray(data) ? data : [];
		render(recipes);
	})

/* ================= RENDER ================= */
function render(list) {
	recipeList.innerHTML = "";

	if (list.length === 0) {
		recipeList.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No recipes found</p>`;
		return;
	}

	list.forEach(recipe => {
		const card = document.createElement("div");
		card.className = "explore-card";

		card.innerHTML = `
			<img src="${recipe.image}" alt="${recipe.title}">
			<h3>${recipe.title}</h3>
			<p>${recipe.category}</p>
		`;

		card.addEventListener("click", () => {
			window.location.href = `recipe.html?file=${encodeURIComponent(recipe.file)}`;
		});

		recipeList.appendChild(card);
	});
}

/* ================= APPLY FILTERS ================= */
function applyFilters() {
	let filtered = recipes;

	// CATEGORY
	if (selectedCategory !== "all") {
		filtered = filtered.filter(r => r.category === selectedCategory);
	}

	// SEARCH
	if (searchQuery.trim() !== "") {
		filtered = filtered.filter(r =>
			r.title.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}

	render(filtered);
}

/* ================= SEARCH ================= */
searchInput.addEventListener("input", (e) => {
	searchQuery = e.target.value;
	applyFilters();
});

/* ================= CATEGORY ================= */
filterButtons.forEach(btn => {
	btn.addEventListener("click", () => {

		filterButtons.forEach(b => b.classList.remove("active"));
		btn.classList.add("active");

		selectedCategory = btn.dataset.cat;
		applyFilters();
	});
});
