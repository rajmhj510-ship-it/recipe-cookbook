document.addEventListener("DOMContentLoaded", () => {

let recipes = [];
let selectedCategory = "all";
let searchQuery = "";

/* ================= ELEMENTS ================= */
const recipeList = document.getElementById("recipeList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");

/* ================= LOAD DATA ================= */
fetch("./data/index.json")
	.then(res => {
		if (!res.ok) throw new Error("HTTP " + res.status);
		return res.json();
	})
	.then(data => {
		recipes = Array.isArray(data) ? data : [];
		render(recipes);
	})
	.catch(err => {
		console.error("JSON ERROR:", err);
		recipeList.innerHTML =
			"<p style='text-align:center'>Failed to load recipes</p>";
	});

/* ================= RENDER GRID ================= */
function render(list) {
	recipeList.innerHTML = "";

	if (!list.length) {
		recipeList.innerHTML =
			"<p style='text-align:center; grid-column:1/-1;'>No recipes found</p>";
		return;
	}

	list.forEach(recipe => {
		const card = document.createElement("div");
		card.className = "explore-card";

		card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}">

    <div class="card-content">
        <h3>${recipe.title}</h3>

        <div class="card-footer">
            <span class="recipe-category">${recipe.category}</span>
            <span class="recipe-id">#${recipe.id}</span>
        </div>
    </div>
`;

		card.addEventListener("click", () => {
			window.location.href =
				`recipe.html?file=${encodeURIComponent(recipe.file)}`;
		});

		recipeList.appendChild(card);
	});
}

/* ================= FILTER LOGIC ================= */
function applyFilters() {

	let filtered = recipes;

	// CATEGORY FILTER
	if (selectedCategory !== "all") {
		filtered = filtered.filter(r =>
			r.category &&
			r.category.toLowerCase() === selectedCategory.toLowerCase()
		);
	}

	// SEARCH FILTER
	if (searchQuery.trim()) {
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

/* ================= CATEGORY BUTTONS ================= */
filterButtons.forEach(btn => {
	btn.addEventListener("click", () => {

		filterButtons.forEach(b => b.classList.remove("active"));
		btn.classList.add("active");

		selectedCategory = btn.dataset.cat;
		applyFilters();
	});
});

});
