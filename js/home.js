let recipes = [];

async function loadRecipes() {
	try {
		const res = await fetch("./data/index.json");
		if (!res.ok) throw new Error("Failed to load index");

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
	let timer = null;

	// CREATE CARDS
	recipes.forEach(r => {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `<img src="${r.image}" alt="${r.title}">`;

		card.onclick = () => {
			window.location.href = `recipe.html?file=${encodeURIComponent(r.file)}`;
		};

		track.appendChild(card);
	});

	const cards = document.querySelectorAll(".card");

	function update(index) {
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
		titleEl.textContent = r.title;
		metaEl.textContent = `${r.time} • ${r.difficulty}`;
	}

	function autoplay() {
		clearInterval(timer);
		timer = setInterval(() => {
			update(currentIndex + 1);
		}, 15000); // ✅ RESTORED
	}

	leftBtn.onclick = () => { update(currentIndex - 1); autoplay(); };
	rightBtn.onclick = () => { update(currentIndex + 1); autoplay(); };

	scrollBtn.onclick = () => {
		hero.style.display = "none";
	};

	update(0);
	autoplay();
}
