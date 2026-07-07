/* ==========================================
   ELEMENTS
========================================== */

const track = document.querySelector(".carousel-track");
const leftArrow = document.querySelector(".nav-arrow.left");
const rightArrow = document.querySelector(".nav-arrow.right");

const titleEl = document.querySelector(".hero-recipe-title");
const metaEl = document.querySelector(".recipe-meta");

const scrollBtn = document.querySelector(".scroll-down");
const exploreSection = document.getElementById("explore");

/* ==========================================
   STATE
========================================== */

let recipes = [];
let cards = [];

let currentIndex = 0;
let isAnimating = false;

let autoSlide = null;

const AUTO_TIME = 3000;

const isRecipePage =
    window.location.pathname.includes("recipe.html");

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

        // Load every cuisine file in parallel
        const recipeArrays = await Promise.all(

            categories.map(async category => {

                const response = await fetch(category.file);

                if (!response.ok)
                    return [];

                return await response.json();

            })

        );

        // Merge into one array
        recipes = recipeArrays.flat();

        if (!recipes.length)
            return;

        createCarousel();

        updateCarousel(0);

        if (!isRecipePage)
            startAutoSlide();

    }

    catch (error) {

        console.error(error);

    }

}

loadRecipes();

/* ==========================================
   CREATE CAROUSEL
========================================== */

function createCarousel() {

    track.innerHTML = "";

    recipes.forEach((recipe, index) => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img
                src="${recipe.image}"
                alt="${recipe.title}"
                loading="lazy">
        `;

        card.addEventListener("click", () => {

            if (index === currentIndex) {

                window.location.href =
                    `recipe.html?file=${encodeURIComponent(recipe.file)}`;

                return;

            }

            updateCarousel(index);

        });

        track.appendChild(card);

    });

    cards = [...document.querySelectorAll(".card")];

    const container = document.querySelector(".carousel-container");

    container?.addEventListener("mouseenter", stopAutoSlide);
    container?.addEventListener("mouseleave", startAutoSlide);

}

/* ==========================================
   UPDATE
========================================== */

function updateCarousel(index) {

    if (isAnimating || !cards.length)
        return;

    isAnimating = true;

    currentIndex =
        (index + recipes.length) % recipes.length;

    cards.forEach((card, i) => {

        const offset =
            (i - currentIndex + recipes.length) %
            recipes.length;

        card.className = "card";

        switch (offset) {

            case 0:
                card.classList.add("center");
                break;

            case 1:
                card.classList.add("right-1");
                break;

            case 2:
                card.classList.add("right-2");
                break;

            case recipes.length - 1:
                card.classList.add("left-1");
                break;

            case recipes.length - 2:
                card.classList.add("left-2");
                break;

            default:
                card.classList.add("hidden");

        }

    });

    const recipe = recipes[currentIndex];

    titleEl.textContent = recipe.title;
    metaEl.textContent =
        `${recipe.time} • ${recipe.difficulty}`;

    setTimeout(() => {

        isAnimating = false;

    }, 700);

}

/* ==========================================
   AUTO SLIDE
========================================== */

function startAutoSlide() {

    if (isRecipePage)
        return;

    stopAutoSlide();

    autoSlide = setInterval(() => {

        updateCarousel(currentIndex + 1);

    }, AUTO_TIME);

}

function stopAutoSlide() {

    if (!autoSlide)
        return;

    clearInterval(autoSlide);

    autoSlide = null;

}

/* ==========================================
   PAGE VISIBILITY
========================================== */

document.addEventListener("visibilitychange", () => {

    if (document.hidden)
        stopAutoSlide();
    else
        startAutoSlide();

});

/* ==========================================
   SCROLL
========================================== */

scrollBtn?.addEventListener("click", () => {

    exploreSection?.scrollIntoView({

        behavior: "smooth"

    });

});

window.addEventListener("scroll", () => {

    if (!exploreSection)
        return;

    const rect = exploreSection.getBoundingClientRect();

    const visible =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

    if (visible)
        stopAutoSlide();
    else
        startAutoSlide();

});

/* ==========================================
   NAVIGATION
========================================== */

leftArrow?.addEventListener("click", () => {

    updateCarousel(currentIndex - 1);

});

rightArrow?.addEventListener("click", () => {

    updateCarousel(currentIndex + 1);

});

document.addEventListener("keydown", e => {

    if (e.key === "ArrowLeft")
        updateCarousel(currentIndex - 1);

    if (e.key === "ArrowRight")
        updateCarousel(currentIndex + 1);

});
