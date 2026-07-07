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
   LOAD RECIPES
========================================== */

async function loadRecipes() {

    try {

        const response = await fetch("data/index.json");

        if (!response.ok)
            throw new Error(`HTTP ${response.status}`);

        recipes = await response.json();

        if (!Array.isArray(recipes))
            recipes = [];

        if (!recipes.length)
            return;

        createCarousel();

        updateCarousel(0);

        if (!isRecipePage)
            startAutoSlide();

    }

    catch (error) {

        console.error("Failed to load recipes:", error);

    }

}

loadRecipes();

/* ==========================================
   CREATE CAROUSEL
========================================== */

function createCarousel() {

    if (!track) return;

    track.innerHTML = "";

    recipes.forEach((recipe, index) => {

        const card = document.createElement("div");

        card.className = "card";

        card.dataset.index = index;

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

    const container =
        document.querySelector(".carousel-container");

    if (container) {

        container.addEventListener("mouseenter", stopAutoSlide);

        container.addEventListener("mouseleave", startAutoSlide);

    }

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

    updateInfo();

    setTimeout(() => {

        isAnimating = false;

    }, 700);

}

/* ==========================================
   UPDATE INFO
========================================== */

function updateInfo() {

    const recipe = recipes[currentIndex];

    if (!recipe) return;

    titleEl.style.opacity = "0";
    metaEl.style.opacity = "0";

    setTimeout(() => {

        titleEl.textContent = recipe.title;

        metaEl.textContent =
            `${recipe.time} • ${recipe.difficulty}`;

        titleEl.style.opacity = "1";
        metaEl.style.opacity = "1";

    }, 180);

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

    if (document.hidden) {

        stopAutoSlide();

    }

    else {

        startAutoSlide();

    }

});

/* ==========================================
   SCROLL
========================================== */

if (scrollBtn && exploreSection) {

    scrollBtn.addEventListener("click", () => {

        exploreSection.scrollIntoView({

            behavior: "smooth"

        });

    });

}

/* ==========================================
   STOP DURING EXPLORE
========================================== */

window.addEventListener("scroll", () => {

    if (!exploreSection)
        return;

    const rect =
        exploreSection.getBoundingClientRect();

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
