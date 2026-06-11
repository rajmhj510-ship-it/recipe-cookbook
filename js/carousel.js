let recipes = [];
let currentIndex = 0;
let isAnimating = false;

const track = document.querySelector(".carousel-track");
const leftArrow = document.querySelector(".nav-arrow.left");
const rightArrow = document.querySelector(".nav-arrow.right");
const titleEl = document.querySelector(".hero-recipe-title");
const metaEl = document.querySelector(".recipe-meta");
const dotsContainer = document.querySelector(".dots");

let cards = [];
let dots = [];

/* ================= LOAD DATA ================= */
fetch("data/index.json")
	.then(res => res.json())
	.then(data => {
		recipes = Array.isArray(data) ? data : [data];
		createCarousel();
		updateCarousel(0);
	});

/* ================= CREATE CARDS ================= */
function createCarousel() {
	track.innerHTML = "";
	dotsContainer.innerHTML = "";

	recipes.forEach((recipe, i) => {

		const card = document.createElement("div");
		card.className = "card";
		card.dataset.index = i;

		card.innerHTML = `<img src="${recipe.image}" alt="${recipe.title}">`;

		card.addEventListener("click", () => updateCarousel(i));
		track.appendChild(card);

		const dot = document.createElement("div");
		dot.className = "dot";
		dot.addEventListener("click", () => updateCarousel(i));
		dotsContainer.appendChild(dot);
	});

	cards = document.querySelectorAll(".card");
	dots = document.querySelectorAll(".dot");
}

/* ================= UPDATE ================= */
function updateCarousel(newIndex) {
	if (isAnimating || recipes.length === 0) return;
	isAnimating = true;

	currentIndex = (newIndex + recipes.length) % recipes.length;

	cards.forEach((card, i) => {

		const offset = (i - currentIndex + recipes.length) % recipes.length;

		card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

		if (offset === 0) card.classList.add("center");
		else if (offset === 1) card.classList.add("right-1");
		else if (offset === 2) card.classList.add("right-2");
		else if (offset === recipes.length - 1) card.classList.add("left-1");
		else if (offset === recipes.length - 2) card.classList.add("left-2");
		else card.classList.add("hidden");
	});

	dots.forEach((dot, i) => {
		dot.classList.toggle("active", i === currentIndex);
	});

	titleEl.style.opacity = "0";
	metaEl.style.opacity = "0";

	setTimeout(() => {
		const r = recipes[currentIndex];

		titleEl.textContent = r.title;
		metaEl.textContent = `${r.time} • ${r.difficulty}`;

		titleEl.style.opacity = "1";
		metaEl.style.opacity = "1";
	}, 250);

	setTimeout(() => {
		isAnimating = false;
	}, 800);
}

/* ================= NAV ================= */
leftArrow.addEventListener("click", () => updateCarousel(currentIndex - 1));
rightArrow.addEventListener("click", () => updateCarousel(currentIndex + 1));

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
	if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
});
