let recipes = [];
let current = 0;
let cards = [];
let timer;
let exploreActive = false;

async function loadRecipes() {
	const res = await fetch("./data/index.json");
	recipes = await res.json();

	initCarousel();
	initExplore();
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
		timer = setInterval(() => update(current + 1), 15000);
	}

	leftBtn.onclick = () => { update(current - 1); autoplay(); };
	rightBtn.onclick = () => { update(current + 1); autoplay(); };

	scrollBtn.onclick = () => {
		document.getElementById("hero").style.opacity = "0";

		setTimeout(() => {
			document.getElementById("hero").style.display = "none";
			document.getElementById("explore").classList.remove("hidden");

			document.getElementById("explore")
				.scrollIntoView({ behavior: "smooth" });

			exploreActive = true;
		}, 400);
	};

	update(0);
	autoplay();
}

/* ================= RESTORE ON SCROLL UP ================= */

window.addEventListener("scroll", () => {
	if (window.scrollY < 50 && exploreActive) {

		const hero = document.getElementById("hero");

		hero.style.display = "flex";
		setTimeout(() => hero.style.opacity = "1", 50);

		document.getElementById("explore").classList.add("hidden");

		exploreActive = false;
	}
});

/* ================= EXPLORE ================= */

function initExplore() {
	const search = document.getElementById("search");
	const buttons = document.querySelectorAll(".filters button");
	const list = document.getElementById("recipeList");

	let category = "all";
	let text = "";

	search.oninput = e => {
		text = e.target.value.toLowerCase();
		render();
	};

	buttons.forEach(b => {
		b.onclick = () => {
			buttons.forEach(x => x.classList.remove("active"));
			b.classList.add("active");
			category = b.dataset.cat;
			render();
		};
	});

	function render() {
		list.innerHTML = "";

		const filtered = recipes.filter(r =>
			(category === "all" || r.category === category) &&
			r.title.toLowerCase().includes(text)
		);

		filtered.forEach(r => {
			const div = document.createElement("div");
			div.className = "recipe-card";

			div.innerHTML = `
				<img src="${r.image}">
				<div>
					<strong>${r.title}</strong><br>
					<small>${r.category}</small>
				</div>
			`;

			div.onclick = () => {
				window.location.href = `recipe.html?file=${encodeURIComponent(r.file)}`;
			};

			list.appendChild(div);
		});
	}

	render();
}
