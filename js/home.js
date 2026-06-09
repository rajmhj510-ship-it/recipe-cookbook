let recipes = [];

async function loadRecipes() {
	const res = await fetch("data/index.json");
	recipes = await res.json();
	initCarousel();
}

loadRecipes();

function initCarousel() {
	const track = document.querySelector(".carousel-track");
	const titleEl = document.querySelector(".recipe-title");
	const metaEl = document.querySelector(".recipe-meta");

	const leftBtn = document.querySelector(".nav-arrow.left");
	const rightBtn = document.querySelector(".nav-arrow.right");

	const hero = document.querySelector("#hero");
	const scrollBtn = document.querySelector(".scroll-down");

	let currentIndex = 0;
	let isAnimating = false;
	let autoPlayTimer = null;

	/* CREATE CARDS */
	recipes.forEach((recipe) => {
		const card = document.createElement("div");
		card.classList.add("card");

		card.innerHTML = `<img src="${recipe.image}" alt="${recipe.title}">`;

		card.addEventListener("click", () => {
			// 🔥 IMPORTANT FIX: USE file from index.json
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

			card.classList.remove("center","left-1","left-2","right-1","right-2","hidden");

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

		setTimeout(() => isAnimating = false, 800);
	}

	function startAutoPlay() {
		clearInterval(autoPlayTimer);
		autoPlayTimer = setInterval(() => {
			updateCarousel(currentIndex + 1);
		}, 15000);
	}

	leftBtn.addEventListener("click", () => {
		updateCarousel(currentIndex - 1);
		startAutoPlay();
	});

	rightBtn.addEventListener("click", () => {
		updateCarousel(currentIndex + 1);
		startAutoPlay();
	});

	scrollBtn.addEventListener("click", () => {
		hero.style.opacity = "0";
		hero.style.pointerEvents = "none";
	});

	window.addEventListener("scroll", () => {
		if (window.scrollY < 100) {
			hero.style.opacity = "1";
			hero.style.pointerEvents = "auto";
		}
	});

	const carousel = document.querySelector(".carousel-container");

	carousel.addEventListener("mouseenter", () => clearInterval(autoPlayTimer));
	carousel.addEventListener("mouseleave", startAutoPlay);

	updateCarousel(0);
	startAutoPlay();
}
