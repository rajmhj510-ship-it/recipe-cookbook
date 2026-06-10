let recipes = [];

async function loadRecipes() {
	try {
		const res = await fetch("./data/index.json");
		if (!res.ok) throw new Error("Failed to load");

		recipes = await res.json();
		initCarousel();

	} catch (err) {
		console.error(err);
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

	const tools = document.querySelector(".tools-section");
	const search = document.getElementById("searchBar");
	const categoryBar = document.getElementById("categoryBar");
	const grid = document.getElementById("recipeGrid");

	let current = 0;
	let timer;

	let activeCategory = "all";
	let searchText = "";

	/* CREATE CARDS */
	recipes.forEach(r => {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `<img src="${r.image}">`;

		card.onclick = () => {
			window.location.href =
				`recipe.html?file=${encodeURIComponent(r.file)}`;
		};

		track.appendChild(card);
	});

	const cards = document.querySelectorAll(".card");

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

		const r = recipes[current];
		titleEl.textContent = r.title;
		metaEl.textContent = `${r.time} • ${r.difficulty}`;
	}

	function autoplay() {
		clearInterval(timer);
		timer = setInterval(() => update(current + 1), 15000);
	}

	leftBtn.onclick = () => { update(current - 1); autoplay(); };
	rightBtn.onclick = () => { update(current + 1); autoplay(); };

	/* SCROLL → SWITCH VIEW */
	scrollBtn.onclick = () => {
		hero.style.display = "none";
		tools.style.display = "block";
		renderCategories();
		renderGrid();
	};

	/* CATEGORY */
	function renderCategories() {
		const cats = ["all", ...new Set(recipes.map(r => r.category))];

		categoryBar.innerHTML = "";

		cats.forEach(cat => {
			const btn = document.createElement("button");
			btn.className = "category-btn";
			btn.textContent = cat;

			if (cat === activeCategory) btn.classList.add("active");

			btn.onclick = () => {
				activeCategory = cat;
				renderCategories();
				renderGrid();
			};

			categoryBar.appendChild(btn);
		});
	}

	/* GRID */
	function renderGrid() {
		grid.innerHTML = "";

		const filtered = recipes.filter(r => {
			const matchCat =
				activeCategory === "all" || r.category === activeCategory;

			const matchSearch =
				r.title.toLowerCase().includes(searchText.toLowerCase());

			return matchCat && matchSearch;
		});

		filtered.forEach(r => {
			const div = document.createElement("div");
			div.className = "grid-card";

			div.innerHTML = `
				<img src="${r.image}">
				<h4>${r.title}</h4>
				<p>${r.category}</p>
			`;

			div.onclick = () => {
				window.location.href =
					`recipe.html?file=${encodeURIComponent(r.file)}`;
			};

			grid.appendChild(div);
		});
	}

	/* LIVE SEARCH */
	search.addEventListener("input", e => {
		searchText = e.target.value;
		renderGrid();
	});

	update(0);
	autoplay();
}
