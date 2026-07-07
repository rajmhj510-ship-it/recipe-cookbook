/* ==========================================
   GET RECIPE FILE
========================================== */

const params = new URLSearchParams(window.location.search);
const file = params.get("file");

/* ==========================================
   ELEMENTS
========================================== */

const hero = document.getElementById("hero");

const titleEl = document.getElementById("title");
const categoryEl = document.getElementById("category");
const descriptionEl = document.getElementById("description");
const timeEl = document.getElementById("time");
const difficultyEl = document.getElementById("difficulty");

const ingredientsEl = document.getElementById("ingredients");
const instructionsEl = document.getElementById("instructions");
const servingEl = document.getElementById("servingsuggestions");
const tipsEl = document.getElementById("tips");

/* ==========================================
   SAFE TEXT
========================================== */

function safeText(value) {

    if (value == null)
        return "";

    if (typeof value === "string")
        return value;

    if (typeof value === "number")
        return String(value);

    if (typeof value === "object")
        return (
            value.text ??
            value.step ??
            value.name ??
            value.description ??
            ""
        );

    return "";

}

/* ==========================================
   SECTION BUILDER
========================================== */

function createSection(title, content) {

    return `
        <div class="section">
            <h3>${title}</h3>
            ${content}
        </div>
    `;

}

/* ==========================================
   LIST BUILDER
========================================== */

function createList(items = []) {

    return `
        <ul>
            ${items
                .map(item => `<li>${safeText(item)}</li>`)
                .join("")}
        </ul>
    `;

}

/* ==========================================
   INGREDIENTS
========================================== */

function renderIngredients(data) {

    if (!Array.isArray(data))
        return;

    ingredientsEl.innerHTML = createSection(

        "Ingredients",

        data.map(group => `

            ${group.title ? `<h4>${group.title}</h4>` : ""}

            ${createList(group.items || [])}

        `).join("")

    );

}

/* ==========================================
   INSTRUCTIONS
========================================== */

function renderInstructions(recipe) {

    let html = "";

    if (Array.isArray(recipe.instruction)) {

        html = recipe.instruction.map(block => `

            ${block.title ? `<h4>${block.title}</h4>` : ""}

            ${(block.steps || []).map(step => `

                <div class="step">

                    ${safeText(step)}

                </div>

            `).join("")}

        `).join("");

    }

    else if (Array.isArray(recipe.steps)) {

        html = recipe.steps.map(step => `

            <div class="step">

                ${safeText(step)}

            </div>

        `).join("");

    }

    instructionsEl.innerHTML =
        createSection("Instructions", html);

}

/* ==========================================
   SERVING SUGGESTIONS
========================================== */

function renderServing(data) {

    if (!data?.items?.length)
        return;

    servingEl.innerHTML = createSection(

        data.title || "Serving Suggestions",

        createList(data.items)

    );

}

/* ==========================================
   CHEF TIPS
========================================== */

function renderTips(data) {

    if (!Array.isArray(data) || !data.length)
        return;

    tipsEl.innerHTML = createSection(

        "Chef Tips",

        createList(data)

    );

}

/* ==========================================
   STEP TOGGLE
========================================== */

function enableStepToggle() {

    document.querySelectorAll(".step").forEach(step => {

        step.addEventListener("click", () => {

            step.classList.toggle("done");

        });

    });

}

/* ==========================================
   LOAD RECIPE
========================================== */

async function loadRecipe() {

    try {

        if (!file)
            throw new Error("Recipe file missing.");

        const response = await fetch(file);

        if (!response.ok)
            throw new Error(`HTTP ${response.status}`);

        const recipe = await response.json();

        titleEl.textContent = recipe.title || "Recipe";

        categoryEl.textContent = recipe.category || "";

        descriptionEl.textContent =
            recipe.description || "";

        timeEl.textContent = recipe.time || "";

        difficultyEl.textContent =
            recipe.difficulty || "";

        if (recipe.image) {

            hero.style.backgroundImage =
                `url(${recipe.image})`;

        }

        renderIngredients(recipe.ingredients);

        renderInstructions(recipe);

        renderServing(recipe.servingSuggestions);

        renderTips(recipe.chefTips);

        enableStepToggle();

    }

    catch (error) {

        console.error(error);

        document.querySelector(".recipe-layout").innerHTML = `

            <div class="section">

                <h3>Recipe Not Found</h3>

                <p>
                    The requested recipe could not be loaded.
                </p>

            </div>

        `;

    }

}

loadRecipe();
