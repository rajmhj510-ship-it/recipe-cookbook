let recipes = [];
let filteredRecipes = [];
let currentIndex = 0;
let cards = [];

let currentCategory = "All";
let searchText = "";

async function loadRecipes() {
	try {
		const res = await fetch("./data/index.json");
		if (!res.ok) throw new Error("Failed to load index");

		recipes = await res.json();
		filteredRecipes = recipes;

		initUI();
		renderCarousel();

	} catch (err) {
		console.error(err);
		document.querySelector(".recipe-title").textContent =
			"Failed to load recipes ❌";
	}
}

loadRecipes();

/* =========================
   INIT UI
========================= */

function initUI() {
	const searchInput = document.getElementById("searchInput");
	const buttons = document.querySelectorAll(".filter-btn");

	searchInput.addEventListener("input", (e) => {
		searchText = e.target.value;
		applyFilters();
	});

	buttons.forEach(btn => {
		btn.addEventListener("click", () => {
			buttons.forEach(b => b.classList.remove("active"));
			btn.classList.add("active");

			currentCategory = btn.dataset.category;
			applyFilters();
		});
	});

	document.querySelector(".nav-arrow.left").onclick = () => update(currentIndex - 1);
	document.querySelector(".nav-arrow.right").onclick = () => update(currentIndex + 1);
}

/* =========================
   FILTER LOGIC
========================= */

function applyFilters() {
	filteredRecipes = recipes.filter(r => {
		const matchCategory =
			currentCategory === "All" || r.category === currentCategory;

		const matchSearch =
			r.title.toLowerCase().includes(searchText.toLowerCase());

		return matchCategory && matchSearch;
	});

	renderCarousel();
}

/* =========================
   RENDER CAROUSEL
========================= */

function renderCarousel() {
	const track = document.querySelector(".carousel-track");
	track.innerHTML = "";

	currentIndex = 0;

	filteredRecipes.forEach(r => {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `<img src="${r.image}" alt="${r.title}">`;

		card.addEventListener("click", () => {
			window.location.href = `recipe.html?file=${encodeURIComponent(r.file)}`;
		});

		track.appendChild(card);
	});

	cards = document.querySelectorAll(".card");
	update(0);
}

/* =========================
   CAROUSEL UPDATE
========================= */

function update(i) {
	if (!cards.length) return;

	currentIndex = (i + cards.length) % cards.length;

	cards.forEach((c, idx) => {
		const offset = (idx - currentIndex + cards.length) % cards.length;

		c.className = "card";

		if (offset === 0) c.classList.add("center");
		else if (offset === 1) c.classList.add("right-1");
		else if (offset === 2) c.classList.add("right-2");
		else if (offset === cards.length - 1) c.classList.add("left-1");
		else if (offset === cards.length - 2) c.classList.add("left-2");
		else c.classList.add("hidden");
	});
}
