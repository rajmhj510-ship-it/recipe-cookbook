```js
/* =====================================================
   GET RECIPE FILE
===================================================== */

const params = new URLSearchParams(window.location.search);

const file = decodeURIComponent(
    params.get("file") || ""
);


/* =====================================================
   BASE URL
===================================================== */

const BASE_URL = window.location.pathname.includes("recipe-cookbook")
    ? "/recipe-cookbook/"
    : "./";


/* =====================================================
   SAFE TEXT
===================================================== */

function safeText(val) {

    if (typeof val === "string") {
        return val;
    }

    if (typeof val === "number") {
        return String(val);
    }

    if (val && typeof val === "object") {

        return (
            val.text ||
            val.step ||
            val.name ||
            val.description ||
            ""
        );
    }

    return "";
}


/* =====================================================
   LOAD RECIPE
===================================================== */

async function loadRecipe() {

    try {

        if (!file) {
            throw new Error("Recipe file missing");
        }


        /* Build recipe URL */

        const url = file.startsWith("http")
            ? file
            : BASE_URL + file;


        /* Fetch JSON */

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("HTTP " + res.status);
        }


        const data = await res.json();


        /* =================================================
           HERO INFORMATION
        ================================================= */

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


        /* =================================================
           RECIPE IMAGE
        ================================================= */

        const recipeImage =
            document.getElementById("recipeImage");


        if (data.image && recipeImage) {

            recipeImage.src = data.image;

            recipeImage.alt =
                data.title || "Recipe";


            recipeImage.onerror = function () {

                this.onerror = null;

                this.src =
                    "assets/images/placeholder.png";

            };
        }


        /* =================================================
           BLURRED HERO BACKGROUND
        ================================================= */

        const heroBackground =
            document.querySelector(".hero-background");


        if (data.image && heroBackground) {

            heroBackground.style.backgroundImage =
                `url("${data.image}")`;

        }


        /* =================================================
           INGREDIENTS
        ================================================= */

        const ingEl =
            document.getElementById("ingredients");


        if (
            Array.isArray(data.ingredients) &&
            ingEl
        ) {

            ingEl.innerHTML = `

                <div class="section">

                    <h3>Ingredients</h3>

                    ${data.ingredients.map(group => `

                        ${
                            group.title
                                ? `<h4>${safeText(group.title)}</h4>`
                                : ""
                        }

                        <ul>

                            ${(group.items || [])
                                .map(item => `

                                    <li class="ingredient-item">

                                        <label>

                                            <input
                                                type="checkbox"
                                                class="ingredient-check"
                                            >

                                            <span>
                                                ${safeText(item)}
                                            </span>

                                        </label>

                                    </li>

                                `)
                                .join("")}

                        </ul>

                    `)
                    .join("")}

                </div>
            `;
        }


        /* =================================================
           INSTRUCTIONS
        ================================================= */

        const insEl =
            document.getElementById("instructions");


        if (
            Array.isArray(data.instruction) &&
            insEl
        ) {

            insEl.innerHTML = `

                <div class="section">

                    <h3>Instructions</h3>

                    ${data.instruction.map(block => `

                        ${
                            block.title
                                ? `<h4>${safeText(block.title)}</h4>`
                                : ""
                        }

                        ${(block.steps || [])
                            .map(step => `

                                <div class="step">

                                    ${safeText(step)}

                                </div>

                            `)
                            .join("")}

                    `)
                    .join("")}

                </div>
            `;
        }

        else if (
            Array.isArray(data.steps) &&
            insEl
        ) {

            insEl.innerHTML = `

                <div class="section">

                    <h3>Instructions</h3>

                    ${data.steps
                        .map(step => `

                            <div class="step">

                                ${safeText(step)}

                            </div>

                        `)
                        .join("")}

                </div>
            `;
        }


        /* =================================================
           SERVING SUGGESTIONS
        ================================================= */

        const servingEl =
            document.getElementById(
                "servingsuggestions"
            );


        if (
            data.servingSuggestions &&
            Array.isArray(
                data.servingSuggestions.items
            ) &&
            data.servingSuggestions.items.length &&
            servingEl
        ) {

            servingEl.innerHTML = `

                <div class="section">

                    <h3>
                        ${
                            safeText(
                                data.servingSuggestions.title ||
                                "Serving Suggestions"
                            )
                        }
                    </h3>

                    <ul>

                        ${data.servingSuggestions.items
                            .map(item => `

                                <li>
                                    ${safeText(item)}
                                </li>

                            `)
                            .join("")}

                    </ul>

                </div>
            `;
        }


        /* =================================================
           CHEF TIPS
        ================================================= */

        const tipsEl =
            document.getElementById("tips");


        if (
            Array.isArray(data.chefTips) &&
            data.chefTips.length &&
            tipsEl
        ) {

            tipsEl.innerHTML = `

                <div class="section">

                    <h3>Chef Tips</h3>

                    <ul>

                        ${data.chefTips
                            .map(tip => `

                                <li>
                                    ${safeText(tip)}
                                </li>

                            `)
                            .join("")}

                    </ul>

                </div>
            `;
        }


        /* =================================================
           INGREDIENT CHECKBOXES
        ================================================= */

        document
            .querySelectorAll(".ingredient-check")
            .forEach(check => {

                check.addEventListener(
                    "change",
                    () => {

                        const text =
                            check
                                .nextElementSibling;

                        if (!text) return;


                        if (check.checked) {

                            text.style.opacity =
                                "0.5";

                            text.style.textDecoration =
                                "line-through";

                        }
                        else {

                            text.style.opacity =
                                "1";

                            text.style.textDecoration =
                                "none";
                        }

                    }
                );

            });


        /* =================================================
           STEP CLICK
        ================================================= */

        document
            .querySelectorAll(".step")
            .forEach(step => {

                step.addEventListener(
                    "click",
                    () => {

                        step.classList.toggle(
                            "done"
                        );

                    }
                );

            });


    }
    catch (err) {

        console.error(
            "Recipe loading error:",
            err
        );


        document.body.innerHTML = `

            <h2
                style="
                    padding:40px;
                    font-family:Arial;
                "
            >

                Recipe failed to load ❌

            </h2>

        `;
    }
}


/* =====================================================
   WHATSAPP STYLE SCROLL HEADER
===================================================== */

function setupScrollAnimation() {

    const hero =
        document.getElementById("hero");


    if (!hero) return;


    let ticking = false;


    function updateHeader() {

        const scrollY =
            window.scrollY;


        /*
         * Start compact header
         * after scrolling 120px.
         */

        if (scrollY > 120) {

            hero.classList.add(
                "scrolled"
            );

        }
        else {

            hero.classList.remove(
                "scrolled"
            );

        }


        ticking = false;
    }


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateHeader
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    /* Initial state */

    updateHeader();
}


/* =====================================================
   START
===================================================== */

loadRecipe();

setupScrollAnimation();
```
