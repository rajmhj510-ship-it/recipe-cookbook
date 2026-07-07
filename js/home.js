/* ==========================================
   ELEMENTS
========================================== */

const recipeList = document.getElementById("recipeList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");

/* ==========================================
   STATE
========================================== */

let recipes = [];
let selectedCategory = "all";
let searchQuery = "";

/* ==========================================
   LOAD ALL RECIPES
========================================== */

async function loadRecipes() {

    try {

        // Load master index
        const indexResponse = await fetch("data/index.json");

        if (!indexResponse.ok)
            throw new Error("Cannot load index.json");

        const categories = await indexResponse.json();

        // Load all cuisine files
        const recipeArrays = await Promise.all(

            categories.map(async category => {

                const response = await fetch(category.file);

                if (!response.ok)
                    return [];

                return await response.json();

            })

        );

        // Merge recipes
        recipes = recipeArrays.flat();

        renderRecipes(recipes);

    }

    catch (error) {

        console.error(error);

        recipeList.innerHTML = `
            <p class="error">
                Failed to load recipes.
            </p>
        `;

    }

}

loadRecipes();

/* ==========================================
   RENDER
========================================== */

function renderRecipes(list) {

    recipeList.innerHTML = "";

    if (!list.length) {

        recipeList.innerHTML = `
            <p class="error">
                No recipes found.
            </p>
        `;

        return;

    }

    const fragment = document.createDocumentFragment();

    list.forEach(recipe => {

        fragment.appendChild(createRecipeCard(recipe));

    });

    recipeList.appendChild(fragment);

}

/* ==========================================
   CREATE CARD
========================================== */

function createRecipeCard(recipe) {

    const card = document.createElement("article");

    card.className = "explore-card";

    card.innerHTML = `

        <img
            src="${recipe.image}"
            alt="${recipe.title}"
            loading="lazy">

        <div class="card-content">

            <h3>${recipe.title}</h3>

            <div class="card-footer">

                <span class="recipe-category">
                    ${recipe.category}
                </span>

                <span class="recipe-id">
                    #${recipe.id}
                </span>

            </div>

        </div>

    `;

    card.addEventListener("click", () => {

        window.location.href =
            `recipe.html?file=${encodeURIComponent(recipe.file)}`;

    });

    return card;

}

/* ==========================================
   FILTER
========================================== */

function applyFilters() {

    const filtered = recipes.filter(recipe => {

        const categoryMatch =

            selectedCategory === "all" ||

            recipe.category.toLowerCase() ===
            selectedCategory.toLowerCase();

        const searchMatch =

            searchQuery === "" ||

            recipe.title.toLowerCase().includes(searchQuery) ||

            recipe.category.toLowerCase().includes(searchQuery);

        return categoryMatch && searchMatch;

    });

    renderRecipes(filtered);

}

/* ==========================================
   SEARCH
========================================== */

searchInput?.addEventListener("input", e => {

    searchQuery = e.target.value.trim().toLowerCase();

    applyFilters();

});

/* ==========================================
   CATEGORY
========================================== */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedCategory = button.dataset.cat;

        applyFilters();

    });

});
