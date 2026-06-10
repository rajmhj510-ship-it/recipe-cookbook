let recipes = [];

async function loadRecipes() {
	try {
		const res = await fetch("./data/index.json");
		if (!res.ok) throw new Error("Index load failed");

		recipes = await res.json();
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

	let currentIndex = 0;
	let timer;

	/* CREATE CARDS */
	recipes.forEach(r => {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `<img src="${r.image}" alt="${r.title}">`;

		card.addEventListener("click", () => {
			// FIXED SAFE URL
			window.location.href =
				`recipe.html?file=${encodeURIComponent(r.file)}`;
		});

		track.appendChild(card);
	});

	const cards = document.querySelectorAll(".card");

	function update(i) {
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

		const r = recipes[currentIndex];
		titleEl.textContent = r.title;
		metaEl.textContent = `${r.time} • ${r.difficulty}`;
	}

	/* 🔥 AUTO PLAY FIXED (15 SEC) */
	function startAuto() {
		clearInterval(timer);
		timer = setInterval(() => {
			update(currentIndex + 1);
		}, 15000);
	}

	leftBtn.onclick = () => {
		update(currentIndex - 1);
		startAuto();
	};

	rightBtn.onclick = () => {
		update(currentIndex + 1);
		startAuto();
	};

	scrollBtn.onclick = () => {
		hero.style.display = "none";

		// show tools section (future search/filter)
		document.querySelector(".hidden-tools").style.display = "block";
	};

	update(0);
	startAuto();
}
