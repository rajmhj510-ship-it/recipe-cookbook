/* ================= GLOBAL DATA ================= */
let recipes = [];
let activeCategory = "all";
let currentIndex = 0;

/* ================= LOAD DATA ================= */
async function loadRecipes() {
	const res = await fetch("data/index.json");
	recipes = await res.json();

	initCarousel();
	initSearchAndFilters();
}

loadRecipes();

/* ================= CAROUSEL ================= */
function initCarousel() {
	const track = document.querySelector(".carousel-track");
	const titleEl = document.querySelector(".recipe-title");
	const metaEl = document.querySelector(".recipe-meta");

	const leftBtn = document.querySelector(".nav-arrow.left");
	const rightBtn = document.querySelector(".nav-arrow.right");

	const hero = document.querySelector("#hero");
	const searchSection = document.querySelector("#search-section");
	const scrollBtn = document.querySelector(".scroll-down");

	let isAnimating = false;
	let autoPlayTimer = null;

	/* CREATE CARDS */
	track.innerHTML = "";

	recipes.forEach((recipe, index) => {
		const card = document.createElement("div");
		card.classList.add("card");

		card.innerHTML = `<img src="${recipe.image}" alt="${recipe.title}">`;

		card.addEventListener("click", () => {
			window.location.href = `recipe.html?file=${recipe.file}`;
		});

		track.appendChild(card);
	});

	const cards = document.querySelectorAll(".card");

	function updateCarousel(newIndex) {
		if (isAnimating) return;
		isAnimating = true;

		currentIndex = (newIndex + cards.length) % cards.length;

		cards.forEach((card, i) => {
			const offset = (i - currentIndex + cards.length) % cards.length;

			card.classList.remove(
				"center",
				"left-1",
				"left-2",
				"right-1",
				"right-2",
				"hidden"
			);

			if (offset === 0) card.classList.add("center");
			else if (offset === 1) card.classList.add("right-1");
			else if (offset === 2) card.classList.add("right-2");
			else if (offset === cards.length - 1) card.classList.add("left-1");
			else if (offset === cards.length - 2) card.classList.add("left-2");
			else card.classList.add("hidden");
		});

		const r = recipes[currentIndex];
		titleEl.textContent = r.title;
		metaEl.textContent = `${r.time} • ${r.difficulty}`;

		setTimeout(() => {
			isAnimating = false;
		}, 800);
	}

	/* AUTO PLAY (30 sec if no click) */
	function startAutoPlay() {
		clearInterval(autoPlayTimer);

		autoPlayTimer = setInterval(() => {
			updateCarousel(currentIndex + 1);
		}, 30000); // ✅ 30 seconds
	}

	/* NAV */
	leftBtn.addEventListener("click", () => {
		updateCarousel(currentIndex - 1);
		startAutoPlay();
	});

	rightBtn.addEventListener("click", () => {
		updateCarousel(currentIndex + 1);
		startAutoPlay();
	});

	/* SCROLL */
	scrollBtn.addEventListener("click", () => {
		searchSection.scrollIntoView({ behavior: "smooth" });

		hero.style.opacity = "0";
		hero.style.pointerEvents = "none";
	});

	/* SHOW HERO AGAIN */
	window.addEventListener("scroll", () => {
		if (window.scrollY < 100) {
			hero.style.opacity = "1";
			hero.style.pointerEvents = "auto";
		}
	});

	/* PAUSE ON HOVER */
	const carousel = document.querySelector(".carousel-container");

	carousel.addEventListener("mouseenter", () => clearInterval(autoPlayTimer));
	carousel.addEventListener("mouseleave", startAutoPlay);

	/* INIT */
	updateCarousel(0);
	startAutoPlay();
}

/* ================= SEARCH + FILTER ================= */
function initSearchAndFilters() {
	const searchInput = document.getElementById("searchInput");
	const container = document.getElementById("searchResults");

	renderRecipes(recipes);

	/* SEARCH */
	searchInput.addEventListener("input", (e) => {
		const value = e.target.value.toLowerCase();

		let filtered = recipes.filter(r =>
			r.title.toLowerCase().includes(value)
		);

		if (activeCategory !== "all") {
			filtered = filtered.filter(r => r.category === activeCategory);
		}

		renderRecipes(filtered);
	});

	/* FILTER BUTTONS */
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("filter-btn")) {

			document.querySelectorAll(".filter-btn")
				.forEach(btn => btn.classList.remove("active"));

			e.target.classList.add("active");

			activeCategory = e.target.dataset.category;
			applyFilters();
		}
	});

	function applyFilters() {
		let filtered = recipes;

		if (activeCategory !== "all") {
			filtered = filtered.filter(r => r.category === activeCategory);
		}

		const searchValue = searchInput.value.toLowerCase();

		if (searchValue) {
			filtered = filtered.filter(r =>
				r.title.toLowerCase().includes(searchValue)
			);
		}

		renderRecipes(filtered);
	}

	function renderRecipes(data) {
		container.innerHTML = data.map(r => `
			<div class="card" onclick="openRecipe('${r.file}')">
				<img src="${r.image}" />
				<h3>${r.title}</h3>
				<small>${r.category} • ${r.time}</small>
			</div>
		`).join("");
	}
}

/* ================= NAV ================= */
function openRecipe(file) {
	window.location.href = `recipe.html?file=${file}`;
}
