let recipes = [];

let current = 0;
let cards = [];
let timer;

async function loadRecipes() {
	try {
		const res = await fetch("./data/index.json");
		if (!res.ok) throw new Error("Index load failed");

		recipes = await res.json();

		initCarousel();
		initExplore();

	} catch (err) {
		console.error(err);
		document.querySelector(".recipe-title").textContent =
			"Failed to load recipes ❌";
	}
}

loadRecipes();

/* ================= CAROUSEL ================= */

function initCarousel() {

	const track = document.querySelector(".carousel-track");
	const titleEl = document.querySelector(".recipe-title");
	const metaEl = document.querySelector(".recipe-meta");

	const leftBtn = document.querySelector(".nav-arrow.left");
	const rightBtn = document.querySelector(".nav-arrow.right");
	const scrollBtn = document.querySelector(".scroll-down");

	/* CREATE CARDS */
	recipes.forEach(r => {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `<img src="${r.image}">`;

		card.onclick = () => {
			window.location.href = `recipe.html?file=${encodeURIComponent(r.file)}`;
		};

		track.appendChild(card);
	});

	cards = document.querySelectorAll(".card");

	function update(i) {
		current = (i + cards.length) % cards.length;

		cards.forEach((c, idx) => {
			const offset = (idx - current + cards.length) % cards.length;

			c.className = "card";

			if (offset === 0) c.classList.add("center");
			else if (offset === 1) c.classList.add("right-1");
			else if (offset === 2) c.classList.add("right-2");
			else if (offset === cards.length - 1) c.classList.add("left-1");
			else if (offset === cards.length - 2) c.classList.add("left-2");
			else c.classList.add("hidden");
		});

		const r = recipes[current] || {};

		titleEl.textContent = r.title || "";
		metaEl.textContent = `${r.time || ""} • ${r.difficulty || ""}`;
	}

	function autoplay() {
		clearInterval(timer);
		timer = setInterval(() => {
			update(current + 1);
		}, 15000);
	}

	leftBtn.onclick = () => { update(current - 1); autoplay(); };
	rightBtn.onclick = () => { update(current + 1); autoplay(); };

	scrollBtn.onclick = () => {
		document.getElementById("hero").style.display = "none";
		document.getElementById("explore").classList.remove("hidden");
	};

	update(0);
	autoplay();
}

/* ================= EXPLORE (UNCHANGED STRUCTURE READY) ================= */

function initExplore() {
	// keep your existing explore logic here (already working)
}
