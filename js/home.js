let recipes = [];

async function loadRecipes() {
	try {
		const res = await fetch("data/index.json");
		if (!res.ok) throw new Error("Failed to load JSON");

		const data = await res.json();

		if (!Array.isArray(data)) throw new Error("Invalid JSON");

		recipes = data;
		initCarousel();

	} catch (err) {
		console.error(err);
		document.querySelector(".recipe-title").textContent =
			"Failed to load recipes ❌";
	}
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
	const carousel = document.querySelector(".carousel-container");

	let currentIndex = 0;
	let isAnimating = false;
	let timer = null;

	/* CREATE CARDS */
	recipes.forEach((r) => {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `<img src="${r.image}" alt="${r.title}">`;

		// SAFE NAVIGATION
		card.addEventListener("click", () => {
			const file = encodeURIComponent(r.file);
			window.location.href = `recipe.html?file=${file}`;
		});

		track.appendChild(card);
	});

	const cards = document.querySelectorAll(".card");

	function update(index) {
		if (isAnimating) return;
		isAnimating = true;

		currentIndex = (index + cards.length) % cards.length;

		cards.forEach((card, i) => {
			const offset = (i - currentIndex + cards.length) % cards.length;

			card.className = "card";

			if (offset === 0) card.classList.add("center");
			else if (offset === 1) card.classList.add("right-1");
			else if (offset === 2) card.classList.add("right-2");
			else if (offset === cards.length - 1) card.classList.add("left-1");
			else if (offset === cards.length - 2) card.classList.add("left-2");
			else card.classList.add("hidden");
		});

		const r = recipes[currentIndex];

		titleEl.textContent = r?.title || "";
		metaEl.textContent = `${r?.time || ""} • ${r?.difficulty || ""}`;

		setTimeout(() => (isAnimating = false), 700);
	}

	function autoplay() {
		clearInterval(timer);
		timer = setInterval(() => update(currentIndex + 1), 15000);
	}

	leftBtn.onclick = () => { update(currentIndex - 1); autoplay(); };
	rightBtn.onclick = () => { update(currentIndex + 1); autoplay(); };

	scrollBtn.onclick = () => {
		hero.style.opacity = "0";
		hero.style.pointerEvents = "none";
	};

	carousel.onmouseenter = () => clearInterval(timer);
	carousel.onmouseleave = autoplay;

	update(0);
	autoplay();
}
