document.addEventListener("DOMContentLoaded", () => {
// =========================
// STATE
// =========================

let recipes = [];
let selectedCategory = "all";
let searchQuery = "";

// =========================
// ELEMENTS
// =========================

const recipeList = document.getElementById("recipeList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");

// =========================
// LOAD ALL RECIPE FILES
// =========================

async function loadRecipes() {
try {
const indexResponse = await fetch("./data/index.json");

```
  if (!indexResponse.ok) {
    throw new Error("Failed to load data/index.json");
  }

  const categories = await indexResponse.json();

  if (!Array.isArray(categories)) {
    throw new Error("Invalid index.json format");
  }

  const recipeArrays = await Promise.all(
    categories.map(async (category) => {
      try {
        const response = await fetch(category.file);

        if (!response.ok) {
          console.warn(`Cannot load recipe file: ${category.file}`);
          return [];
        }

        const data = await response.json();

        return Array.isArray(data) ? data : [];
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


  // =========================
  // RESTORE SAVED CATEGORY
  // =========================

  const savedCategory =
    sessionStorage.getItem("selectedCategory");

  if (savedCategory) {
    selectedCategory = savedCategory;
  }


  // Update active category button
  updateActiveFilter();

  // Display recipes
  applyFilters();

} catch (error) {
  console.error("Recipe loading error:", error);

  recipeList.innerHTML = `
    <p class="recipe-error">
      Failed to load recipes. Please try again later.
    </p>
  `;
}
```

}

// =========================
// UPDATE ACTIVE FILTER
// =========================

function updateActiveFilter() {
filterButtons.forEach((button) => {
const category =
button.dataset.cat?.toLowerCase();

```
  button.classList.toggle(
    "active",
    category === selectedCategory.toLowerCase()
  );
});
```

}

// =========================
// RENDER RECIPE GRID
// =========================

function render(recipeListData) {
recipeList.innerHTML = "";

```
// No results
if (!recipeListData.length) {
  recipeList.innerHTML = `
    <p class="no-recipes">
      No recipes found.
    </p>
  `;

  return;
}


// Create recipe cards
recipeListData.forEach((recipe, index) => {
  const card = document.createElement("article");

  card.className = "explore-card";

  // Staggered card animation
  card.style.animationDelay = `${index * 40}ms`;


  // =========================
  // IMAGE
  // =========================

  const image = document.createElement("img");

  image.src =
    recipe.image || "assets/images/placeholder.png";

  image.alt = recipe.title || "Recipe";

  image.loading = "lazy";
  image.decoding = "async";

  image.onerror = () => {
    image.onerror = null;
    image.src = "assets/images/placeholder.png";
  };


  // =========================
  // CARD CONTENT
  // =========================

  const content = document.createElement("div");

  content.className = "card-content";


  // Recipe title
  const title = document.createElement("h3");

  title.textContent =
    recipe.title || "Untitled Recipe";


  // Card footer
  const footer = document.createElement("div");

  footer.className = "card-footer";


  // Category
  const category = document.createElement("span");

  category.className = "recipe-category";

  category.textContent =
    recipe.category || "Recipe";


  // Recipe ID
  const recipeId = document.createElement("span");

  recipeId.className = "recipe-id";

  recipeId.textContent =
    `#${recipe.id ?? ""}`;


  // Assemble footer
  footer.appendChild(category);
  footer.appendChild(recipeId);


  // Assemble content
  content.appendChild(title);
  content.appendChild(footer);


  // Assemble card
  card.appendChild(image);
  card.appendChild(content);


  // =========================
  // OPEN RECIPE
  // =========================

  card.addEventListener("click", () => {
    sessionStorage.setItem(
      "selectedCategory",
      selectedCategory
    );

    if (!recipe.file) {
      console.error(
        "Recipe file is missing:",
        recipe
      );

      return;
    }

    window.location.href =
      `recipe.html?file=${encodeURIComponent(recipe.file)}`;
  });


  // Keyboard accessibility
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");

  card.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      card.click();
    }
  });


  recipeList.appendChild(card);
});
```

}

// =========================
// FILTER LOGIC
// =========================

function applyFilters() {
let filteredRecipes = [...recipes];

```
// =========================
// CATEGORY FILTER
// =========================

if (
  selectedCategory &&
  selectedCategory.toLowerCase() !== "all"
) {
  filteredRecipes = filteredRecipes.filter((recipe) => {
    return (
      recipe.category &&
      recipe.category.toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  });
}


// =========================
// SEARCH FILTER
// =========================

const query = searchQuery.trim().toLowerCase();

if (query) {
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
      .filter(
        (value) =>
          value !== null &&
          value !== undefined
      )
      .some((value) =>
        String(value)
          .toLowerCase()
          .includes(query)
      );
  });
}


// =========================
// RENDER RESULTS
// =========================

render(filteredRecipes);
```

}

// =========================
// SEARCH
// =========================

if (searchInput) {
searchInput.addEventListener("input", (event) => {
searchQuery = event.target.value;

```
  applyFilters();
});
```

}

// =========================
// CATEGORY BUTTONS
// =========================

filterButtons.forEach((button) => {
button.addEventListener("click", () => {

```
  // Remove active state
  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
  });


  // Activate selected button
  button.classList.add("active");


  // Update selected category
  selectedCategory =
    button.dataset.cat || "all";


  // Save selection
  sessionStorage.setItem(
    "selectedCategory",
    selectedCategory
  );


  // Apply filters
  applyFilters();
});
```

});

// =========================
// INITIALIZE
// =========================

loadRecipes();
});
