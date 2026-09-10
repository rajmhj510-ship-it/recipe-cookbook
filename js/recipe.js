```js
const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file") || "");

const BASE_URL = window.location.pathname.includes("recipe-cookbook")
  ? "/recipe-cookbook/"
  : "./";

/* =========================================================
   SAFE TEXT
========================================================= */

function safeText(value) {
  if (typeof value === "string") {
    return value;
  }

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
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   LOAD RECIPE
========================================================= */

async function loadRecipe() {
  try {
    /* -------------------------------------------------------
       CHECK RECIPE FILE
    ------------------------------------------------------- */

    if (!file) {
      throw new Error("Recipe file missing");
    }


    /* -------------------------------------------------------
       BUILD RECIPE URL
    ------------------------------------------------------- */

    const url = file.startsWith("http")
      ? file
      : BASE_URL + file;


    /* -------------------------------------------------------
       FETCH RECIPE
    ------------------------------------------------------- */

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();


    /* =======================================================
       HERO SECTION
    ======================================================= */

    document.getElementById("title").textContent =
      data.title || "Recipe";

    document.getElementById("category").textContent =
      data.category || "";

    document.getElementById("description").textContent =
      data.description || "";

    document.getElementById("time").textContent =
      data.time || "";

    document.getElementById("difficulty").textContent =
      data.difficulty || "";


    /* -------------------------------------------------------
       HERO IMAGE
    ------------------------------------------------------- */

    if (data.image) {
      document.getElementById("hero").style.backgroundImage =
        `url("${data.image}")`;
    }


    /* =======================================================
       INGREDIENTS
    ======================================================= */

    const ingredientsElement =
      document.getElementById("ingredients");

    if (Array.isArray(data.ingredients)) {
      ingredientsElement.innerHTML = `
        <div class="section">

          <h3>Ingredients</h3>

          ${data.ingredients
            .map((group) => {

              const groupTitle = group.title
                ? `<h4>${escapeHtml(safeText(group.title))}</h4>`
                : "";

              const items = (group.items || [])
                .map((item) => {
                  return `
                    <li class="ingredient-item">
                      <label>
                        <input
                          type="checkbox"
                          class="ingredient-check"
                        >

                        <span>
                          ${escapeHtml(safeText(item))}
                        </span>
                      </label>
                    </li>
                  `;
                })
                .join("");

              return `
                ${groupTitle}

                <ul>
                  ${items}
                </ul>
              `;
            })
            .join("")}

        </div>
      `;
    }


    /* =======================================================
       INSTRUCTIONS
    ======================================================= */

    const instructionsElement =
      document.getElementById("instructions");


    /* -------------------------------------------------------
       GROUPED INSTRUCTIONS
    ------------------------------------------------------- */

    if (Array.isArray(data.instruction)) {
      instructionsElement.innerHTML = `
        <div class="section">

          <h3>Instructions</h3>

          ${data.instruction
            .map((block) => {

              const blockTitle = block.title
                ? `<h4>${escapeHtml(safeText(block.title))}</h4>`
                : "";

              const steps = (block.steps || [])
                .map((step) => {
                  return `
                    <div class="step">
                      ${escapeHtml(safeText(step))}
                    </div>
                  `;
                })
                .join("");

              return `
                ${blockTitle}
                ${steps}
              `;
            })
            .join("")}

        </div>
      `;
    }


    /* -------------------------------------------------------
       SIMPLE STEPS FORMAT
    ------------------------------------------------------- */

    else if (Array.isArray(data.steps)) {
      instructionsElement.innerHTML = `
        <div class="section">

          <h3>Instructions</h3>

          ${data.steps
            .map((step) => {
              return `
                <div class="step">
                  ${escapeHtml(safeText(step))}
                </div>
              `;
            })
            .join("")}

        </div>
      `;
    }


    /* =======================================================
       SERVING SUGGESTIONS
    ======================================================= */

    const servingElement =
      document.getElementById("servingsuggestions");

    if (
      data.servingSuggestions &&
      Array.isArray(data.servingSuggestions.items) &&
      data.servingSuggestions.items.length > 0
    ) {
      servingElement.innerHTML = `
        <div class="section">

          <h3>
            ${escapeHtml(
              safeText(
                data.servingSuggestions.title ||
                "Serving Suggestions"
              )
            )}
          </h3>

          <ul>

            ${data.servingSuggestions.items
              .map((item) => {
                return `
                  <li>
                    ${escapeHtml(safeText(item))}
                  </li>
                `;
              })
              .join("")}

          </ul>

        </div>
      `;
    }


    /* =======================================================
       CHEF TIPS
    ======================================================= */

    const tipsElement =
      document.getElementById("tips");

    if (
      Array.isArray(data.chefTips) &&
      data.chefTips.length > 0
    ) {
      tipsElement.innerHTML = `
        <div class="section">

          <h3>Chef Tips</h3>

          <ul>

            ${data.chefTips
              .map((tip) => {
                return `
                  <li>
                    ${escapeHtml(safeText(tip))}
                  </li>
                `;
              })
              .join("")}

          </ul>

        </div>
      `;
    }


    /* =======================================================
       STEP CLICK / COMPLETION
    ======================================================= */

    document.querySelectorAll(".step").forEach((step) => {
      step.addEventListener("click", () => {
        step.classList.toggle("done");
      });
    });

  } catch (error) {

    /* =======================================================
       ERROR HANDLING
    ======================================================= */

    console.error("Recipe loading error:", error);

    document.body.innerHTML = `
      <h2
        style="
          padding: 40px;
          font-family: Arial, sans-serif;
        "
      >
        Recipe failed to load ❌
      </h2>
    `;
  }
}


/* =========================================================
   START
========================================================= */

loadRecipe();
```
