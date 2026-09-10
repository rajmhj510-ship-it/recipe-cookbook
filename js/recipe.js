document.addEventListener("DOMContentLoaded", () => {
// =========================
// GET RECIPE FILE
// =========================

const params = new URLSearchParams(window.location.search);
const file = params.get("file") || "";

// =========================
// BASE URL
// =========================

const BASE_URL = window.location.pathname.includes("recipe-cookbook")
? "/recipe-cookbook/"
: "./";

// =========================
// SAFE TEXT
// =========================

function safeText(value) {
if (typeof value === "string") {
return value;
}

```
if (typeof value === "number") {
  return String(value);
}

if (value && typeof value === "object") {
  return (
    value.text ||
    value.step ||
    value.name ||
    value.description ||
    ""
  );
}

return "";
```

}

// =========================
// HTML ESCAPE
// =========================

function escapeHTML(value) {
return safeText(value)
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");
}

// =========================
// LOAD RECIPE
// =========================

async function loadRecipe() {
try {
if (!file) {
throw new Error("Recipe file is missing.");
}

```
  // Build recipe URL
  const url = file.startsWith("http")
    ? file
    : BASE_URL + file;


  // Fetch recipe JSON
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to load recipe: HTTP ${response.status}`
    );
  }


  const data = await response.json();


  // =========================
  // HERO CONTENT
  // =========================

  const hero = document.getElementById("hero");
  const title = document.getElementById("title");
  const category = document.getElementById("category");
  const description = document.getElementById("description");
  const time = document.getElementById("time");
  const difficulty = document.getElementById("difficulty");


  if (title) {
    title.textContent = data.title || "Recipe";
  }

  if (category) {
    category.textContent = data.category || "";
  }

  if (description) {
    description.textContent = data.description || "";
  }

  if (time) {
    time.textContent = data.time || "";
  }

  if (difficulty) {
    difficulty.textContent = data.difficulty || "";
  }


  // =========================
  // HERO IMAGE
  // =========================

  if (hero && data.image) {
    hero.style.backgroundImage =
      `url("${data.image}")`;
  }


  // =========================
  // INGREDIENTS
  // =========================

  const ingredientsElement =
    document.getElementById("ingredients");


  if (
    ingredientsElement &&
    Array.isArray(data.ingredients)
  ) {
    ingredientsElement.innerHTML = `
      <div class="section">

        <h3>Ingredients</h3>

        ${data.ingredients
          .map((group) => {

            const groupTitle = group?.title
              ? `<h4>${escapeHTML(group.title)}</h4>`
              : "";

            const items = Array.isArray(group?.items)
              ? group.items
              : [];

            return `
              ${groupTitle}

              <ul>
                ${items
                  .map((item) => `
                    <li class="ingredient-item">
                      <label>
                        <input
                          type="checkbox"
                          class="ingredient-check"
                        >

                        <span>
                          ${escapeHTML(item)}
                        </span>
                      </label>
                    </li>
                  `)
                  .join("")}
              </ul>
            `;
          })
          .join("")}

      </div>
    `;
  }


  // =========================
  // INSTRUCTIONS
  // =========================

  const instructionsElement =
    document.getElementById("instructions");


  if (
    instructionsElement &&
    Array.isArray(data.instruction)
  ) {
    instructionsElement.innerHTML = `
      <div class="section">

        <h3>Instructions</h3>

        ${data.instruction
          .map((block) => {

            const blockTitle = block?.title
              ? `<h4>${escapeHTML(block.title)}</h4>`
              : "";

            const steps = Array.isArray(block?.steps)
              ? block.steps
              : [];

            return `
              ${blockTitle}

              ${steps
                .map(
                  (step, index) => `
                    <div
                      class="step"
                      data-step="${index + 1}"
                      tabindex="0"
                      role="button"
                      aria-label="Mark step ${index + 1} as complete"
                    >
                      ${escapeHTML(step)}
                    </div>
                  `
                )
                .join("")}
            `;
          })
          .join("")}

      </div>
    `;
  }


  // =========================
  // FALLBACK STEPS
  // =========================

  else if (
    instructionsElement &&
    Array.isArray(data.steps)
  ) {
    instructionsElement.innerHTML = `
      <div class="section">

        <h3>Instructions</h3>

        ${data.steps
          .map(
            (step, index) => `
              <div
                class="step"
                data-step="${index + 1}"
                tabindex="0"
                role="button"
                aria-label="Mark step ${index + 1} as complete"
              >
                ${escapeHTML(step)}
              </div>
            `
          )
          .join("")}

      </div>
    `;
  }


  // =========================
  // SERVING SUGGESTIONS
  // =========================

  const servingElement =
    document.getElementById("servingsuggestions");


  const servingSuggestions =
    data.servingSuggestions;


  if (
    servingElement &&
    servingSuggestions &&
    Array.isArray(servingSuggestions.items) &&
    servingSuggestions.items.length > 0
  ) {
    const servingTitle =
      servingSuggestions.title ||
      "Serving Suggestions";

    servingElement.innerHTML = `
      <div class="section">

        <h3>
          ${escapeHTML(servingTitle)}
        </h3>

        <ul>
          ${servingSuggestions.items
            .map(
              (item) => `
                <li>
                  ${escapeHTML(item)}
                </li>
              `
            )
            .join("")}
        </ul>

      </div>
    `;
  }


  // =========================
  // CHEF TIPS
  // =========================

  const tipsElement =
    document.getElementById("tips");


  if (
    tipsElement &&
    Array.isArray(data.chefTips) &&
    data.chefTips.length > 0
  ) {
    tipsElement.innerHTML = `
      <div class="section">

        <h3>Chef Tips</h3>

        <ul>
          ${data.chefTips
            .map(
              (tip) => `
                <li>
                  ${escapeHTML(tip)}
                </li>
              `
            )
            .join("")}
        </ul>

      </div>
    `;
  }


  // =========================
  // STEP INTERACTION
  // =========================

  setupStepInteractions();

} catch (error) {
  console.error("Recipe loading error:", error);

  showRecipeError();
}
```

}

// =========================
// STEP CLICK / KEYBOARD
// =========================

function setupStepInteractions() {
const steps =
document.querySelectorAll(".step");

```
steps.forEach((step) => {

  // Mouse / touch
  step.addEventListener("click", () => {
    toggleStep(step);
  });


  // Keyboard
  step.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      toggleStep(step);
    }
  });

});
```

}

// =========================
// TOGGLE STEP
// =========================

function toggleStep(step) {
step.classList.toggle("done");

```
const completed =
  step.classList.contains("done");

step.setAttribute(
  "aria-pressed",
  String(completed)
);
```

}

// =========================
// ERROR MESSAGE
// =========================

function showRecipeError() {
document.body.innerHTML = ` <main class="recipe-error-page">

```
    <h2>
      Recipe failed to load ❌
    </h2>

    <p>
      The recipe could not be loaded.
      Please go back and try again.
    </p>

    <button
      type="button"
      onclick="history.back()"
    >
      ← Back to Recipes
    </button>

  </main>
`;
```

}

// =========================
// START
// =========================

loadRecipe();
});
