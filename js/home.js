```javascript
document.addEventListener("DOMContentLoaded", () => {
    // ================= ELEMENTS =================

    const recipeList = document.getElementById("recipeList");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filters button");

    // ================= STATE =================

    let recipes = [];
    let selectedCategory = "all";
    let searchQuery = "";

    // ================= LOAD ALL CATEGORY FILES =================

    async function loadRecipes() {
        try {
            const indexRes = await fetch("./data/index.json");

            if (!indexRes.ok) {
                throw new Error("Failed to load index.json");
            }

            const categories = await indexRes.json();

            const recipeArrays = await Promise.all(
                categories.map(async (category) => {
                    try {
                        const res = await fetch(category.file);

                        if (!res.ok) {
                            console.warn(
                                `Cannot load recipe file: ${category.file}`
                            );
                            return [];
                        }

                        return await res.json();
                    } catch (error) {
                        console.warn(
                            `Error loading ${category.file}:`,
                            error
                        );
                        return [];
                    }
                })
            );

            // Combine all recipe arrays
            recipes = recipeArrays.flat();

            // Sort recipes by ID
            recipes.sort((a, b) => Number(a.id) - Number(b.id));

            // ================= RESTORE CATEGORY =================

            const savedCategory =
                sessionStorage.getItem("selectedCategory");

            if (savedCategory) {
                selectedCategory = savedCategory;
            }

            // Update active category button
            filterButtons.forEach((button) => {
                button.classList.toggle(
                    "active",
                    button.dataset.cat.toLowerCase() ===
                        selectedCategory.toLowerCase()
                );
            });

            // Apply filters and render recipes
            applyFilters();
        } catch (error) {
            console.error("Failed to load recipes:", error);

            recipeList.innerHTML = `
                <p style="text-align: center; grid-column: 1 / -1;">
                    Failed to load recipes
                </p>
            `;
        }
    }

    // ================= RENDER RECIPE GRID =================

    function render(recipeArray) {
        recipeList.innerHTML = "";

        if (!recipeArray.length) {
            recipeList.innerHTML = `
                <p style="text-align: center; grid-column: 1 / -1;">
                    No recipes found
                </p>
            `;
            return;
        }

        recipeArray.forEach((recipe, index) => {
            const card = document.createElement("div");

            card.className = "explore-card";
            card.style.animationDelay = `${index * 40}ms`;

            card.innerHTML = `
                <img
                    src="${recipe.image}"
                    alt="${recipe.title || "Recipe"}"
                    loading="lazy"
                    decoding="async"
                    onerror="this.onerror=null; this.src='assets/images/placeholder.png';"
                >

                <div class="card-content">
                    <h3>${recipe.title || "Untitled Recipe"}</h3>

                    <div class="card-footer">
                        <span class="recipe-category">
                            ${recipe.category || "Uncategorized"}
                        </span>

                        <span class="recipe-id">
                            #${recipe.id}
                        </span>
                    </div>
                </div>
            `;

            // Open recipe page when card is clicked
            card.addEventListener("click", () => {
                sessionStorage.setItem(
                    "selectedCategory",
                    selectedCategory
                );

                window.location.href =
                    `recipe.html?file=${encodeURIComponent(recipe.file)}`;
            });

            recipeList.appendChild(card);
        });
    }

    // ================= FILTER LOGIC =================

    function applyFilters() {
        let filteredRecipes = [...recipes];

        // ================= CATEGORY FILTER =================

        if (selectedCategory.toLowerCase() !== "all") {
            filteredRecipes = filteredRecipes.filter((recipe) => {
                return (
                    recipe.category &&
                    recipe.category.toLowerCase() ===
                        selectedCategory.toLowerCase()
                );
            });
        }

        // ================= SEARCH FILTER =================

        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();

            filteredRecipes = filteredRecipes.filter((recipe) => {
                const searchableValues = [
                    recipe.title,
                    recipe.category,
                    recipe.description,
                    recipe.time,
                    recipe.difficulty,
                    recipe.id
                ];

                return searchableValues
                    .filter((value) => value !== undefined && value !== null)
                    .some((value) =>
                        String(value).toLowerCase().includes(query)
                    );
            });
        }

        render(filteredRecipes);
    }

    // ================= SEARCH =================

    searchInput.addEventListener("input", (event) => {
        searchQuery = event.target.value;

        applyFilters();
    });

    // ================= CATEGORY BUTTONS =================

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Remove active class from all buttons
            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            // Activate clicked button
            button.classList.add("active");

            // Update selected category
            selectedCategory = button.dataset.cat;

            // Save category
            sessionStorage.setItem(
                "selectedCategory",
                selectedCategory
            );

            // Apply filters
            applyFilters();
        });
    });

    // ================= INITIALIZE =================

    loadRecipes();
});
```
