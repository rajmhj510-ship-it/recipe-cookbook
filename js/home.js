document.addEventListener("DOMContentLoaded", () => {

let recipes = [];
let selectedCategory = "all";
let searchQuery = "";

/* ================= ELEMENTS ================= */
const recipeList = document.getElementById("recipeList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");

/* ================= LOAD ALL CATEGORY FILES ================= */

async function loadRecipes() {
    try {

        const indexRes = await fetch("./data/index.json");
        if (!indexRes.ok) throw new Error("Failed to load index.json");

        const categories = await indexRes.json();

        const recipeArrays = await Promise.all(
            categories.map(async category => {

                const res = await fetch(category.file);

                if (!res.ok) {
                    console.warn("Cannot load", category.file);
                    return [];
                }

                return await res.json();

            })
        );

        recipes = recipeArrays.flat();

        recipes.sort((a, b) => a.id - b.id);

        render(recipes);

    }
    catch (err) {

        console.error(err);

        recipeList.innerHTML =
            "<p style='text-align:center'>Failed to load recipes</p>";

    }
}

loadRecipes();

/* ================= RENDER GRID ================= */
function render(list) {
	recipeList.innerHTML = "";

	if (!list.length) {
		recipeList.innerHTML =
			"<p style='text-align:center; grid-column:1/-1;'>No recipes found</p>";
		return;
	}

	list.forEach((recipe, index) => {
		const card = document.createElement("div");
		card.className = "explore-card";
		card.style.animationDelay = `${index * 40}ms`;

card.innerHTML = `
    <img
        src="${recipe.image}"
        alt="${recipe.title}"
        loading="lazy"
        decoding="async"
		onerror="this.onerror=null;this.src='assets/images/placeholder.png';">

    <div class="card-content">
        <h3>${recipe.title}</h3>

        <div class="card-footer">
            <span class="recipe-category">${recipe.category}</span>
            <span class="recipe-id">#${recipe.id}</span>
        </div>
    </div>
`;

card.addEventListener("click", () => {

    sessionStorage.setItem("selectedCategory", selectedCategory);

    window.location.href =
        `recipe.html?file=${encodeURIComponent(recipe.file)}`;
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

    const q = searchQuery.trim().toLowerCase();

    filtered = filtered.filter(recipe => {

        return [

            recipe.title,
            recipe.category,
            recipe.description,
            recipe.time,
            recipe.difficulty,
            String(recipe.id)

        ]
        .filter(Boolean)
        .some(value =>
            value.toLowerCase().includes(q)
        );

    });

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
