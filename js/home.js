/* ==========================================
   RECIPE COOKBOOK - HOME.JS
========================================== */

(() => {

"use strict";

/* ==========================================
   ELEMENTS
========================================== */

const recipeList =
    document.getElementById("recipeList");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filters button");

/* ==========================================
   STATE
========================================== */

let homeRecipes = [];

let selectedCategory = "all";

let searchQuery = "";

/* ==========================================
   BASE PATH
========================================== */

const BASE_PATH =
    window.location.pathname.includes("recipe-cookbook")
        ? "/recipe-cookbook/"
        : "./";

/* ==========================================
   SKELETON LOADER
========================================== */

function showSkeleton(count = 12) {

    if (!recipeList)
        return;

    recipeList.innerHTML = "";

    const fragment =
        document.createDocumentFragment();

    for (let i = 0; i < count; i++) {

        const card =
            document.createElement("article");

        card.className =
            "explore-card skeleton-card";

        card.innerHTML = `

            <div class="skeleton-image"></div>

            <div class="card-content">

                <div class="skeleton-title"></div>

                <div class="skeleton-footer">

                    <div class="skeleton-chip"></div>

                    <div class="skeleton-chip small"></div>

                </div>

            </div>

        `;

        fragment.appendChild(card);

    }

    recipeList.appendChild(fragment);

}

/* ==========================================
   LOAD RECIPES
========================================== */

async function loadHomeRecipes() {

    showSkeleton();

    try {

        const indexResponse =
            await fetch(
                BASE_PATH + "data/index.json"
            );

        if (!indexResponse.ok) {

            throw new Error(
                "Unable to load data/index.json"
            );

        }

        const categories =
            await indexResponse.json();

        const recipeArrays =
            await Promise.all(

                categories.map(async category => {

                    try {

                        const response =
                            await fetch(
                                BASE_PATH +
                                category.file
                            );

                        if (!response.ok) {

                            console.warn(
                                "Missing file:",
                                category.file
                            );

                            return [];

                        }

                        const data =
                            await response.json();

                        return data.map(recipe => ({

                            ...recipe,

                            category:
                                recipe.category ??
                                category.category

                        }));

                    }

                    catch (error) {

                        console.error(error);

                        return [];

                    }

                })

            );

        homeRecipes =
            recipeArrays.flat();

        renderRecipes(homeRecipes);

        if (
            typeof loadCarousel ===
            "function"
        ) {

            loadCarousel(homeRecipes);

        }

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

/* ==========================================
   CREATE RECIPE CARD
========================================== */

function createRecipeCard(recipe) {

    const card =
        document.createElement("article");

    card.className =
        "explore-card";

    const image =
        recipe.image
            ? BASE_PATH + recipe.image
            : BASE_PATH +
              "assets/images/logo.png";

    card.innerHTML = `

        <img

            src="${image}"

            alt="${recipe.title}"

            loading="lazy"

            onerror="this.src='${BASE_PATH}assets/images/logo.png'"

        >

        <div class="card-content">

            <h3>

                ${recipe.title}

            </h3>

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

    card.addEventListener(
        "click",
        () => {

            if (!recipe.file)
                return;

            window.location.href =
                BASE_PATH +
                "recipe.html?file=" +
                encodeURIComponent(
                    recipe.file
                );

        }
    );

    return card;

}

/* ==========================================
   RENDER RECIPES
========================================== */

function renderRecipes(list) {

    if (!recipeList)
        return;

    recipeList.style.opacity = "0";

    recipeList.style.transform =
        "translateY(12px)";

    setTimeout(() => {

        recipeList.innerHTML = "";

        if (!list.length) {

            recipeList.innerHTML = `

                <p class="error">

                    No recipes found.

                </p>

            `;

        }

        else {

            const fragment =
                document.createDocumentFragment();

            list.forEach(recipe => {

                fragment.appendChild(

                    createRecipeCard(recipe)

                );

            });

            recipeList.appendChild(fragment);

        }

        requestAnimationFrame(() => {

            recipeList.style.opacity = "1";

            recipeList.style.transform =
                "translateY(0)";

        });

    }, 150);

}
   /* ==========================================
   APPLY FILTERS
========================================== */

function applyFilters() {

    const filteredRecipes =
        homeRecipes.filter(recipe => {

            const category =
                (recipe.category || "")
                    .toLowerCase();

            const title =
                (recipe.title || "")
                    .toLowerCase();

            const matchesCategory =

                selectedCategory === "all"

                ||

                category ===
                selectedCategory.toLowerCase();

            const matchesSearch =

                searchQuery === ""

                ||

                title.includes(searchQuery)

                ||

                category.includes(searchQuery);

            return (

                matchesCategory

                &&

                matchesSearch

            );

        });

    renderRecipes(filteredRecipes);

}

/* ==========================================
   SEARCH
========================================== */

if (searchInput) {

    searchInput.addEventListener(

        "input",

        event => {

            searchQuery =

                event.target.value
                    .trim()
                    .toLowerCase();

            applyFilters();

        }

    );

}

/* ==========================================
   CATEGORY BUTTONS
========================================== */

filterButtons.forEach(button => {

    button.addEventListener(

        "click",

        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            button.classList.add(
                "active"
            );

            selectedCategory =

                button.dataset.cat ||

                "all";

            applyFilters();

        }

    );

});

/* ==========================================
   START
========================================== */

loadHomeRecipes();

})();
