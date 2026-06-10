let recipes = [];

async function loadRecipes() {
	const res = await fetch("./data/index.json");
	recipes = await res.json();

	initCarousel();
	initList();
}

loadRecipes();

/* ---------------- CAROUSEL ---------------- */

function initCarousel() {
	const track = document.querySelector(".carousel-track");
	const titleEl = document.querySelector(".recipe-title");
	const metaEl = document.querySelector(".recipe-meta");

	const leftBtn = document.querySelector(".nav-arrow.left");
	const rightBtn = document.querySelector(".nav-arrow.right");

	const hero = document.querySelector("#hero");
	const scrollBtn = document.querySelector(".scroll-down");

	let current = 0;
	let timer;

	recipes.forEach(r => {
		const card = document.createElement("div");
		card.className = "card";
		card.innerHTML = `<img src="${r.image}">`;

		card.onclick = () => {
			window.location.href = `recipe.html?file=${encodeURIComponent(r.file)}`;
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

		titleEl.textContent = recipes[current].title;
		metaEl.textContent = `${recipes[current].time} • ${recipes[current].difficulty}`;
	}

	function auto() {
		clearInterval(timer);
		timer = setInterval(() => update(current + 1), 15000);
	}

	leftBtn.onclick = () => { update(current - 1); auto(); };
	rightBtn.onclick = () => { update(current + 1); auto(); };

	scrollBtn.onclick = () => {
		document.getElementById("hero").style.display = "none";
		document.getElementById("controls").classList.remove("hidden");
	};

	update(0);
	auto();
}

/* ---------------- LIST + SEARCH + FILTER ---------------- */

function initList() {
	const list = document.getElementById("recipeList");
	const search = document.getElementById("search");
	const buttons = document.querySelectorAll(".filters button");

	let category = "all";
	let query = "";

	function render() {
		list.innerHTML = "";

		let filtered = recipes.filter(r => {
			return (
				(category === "all" || r.category === category) &&
				r.title.toLowerCase().includes(query.toLowerCase())
			);
		});

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

	search.addEventListener("input", e => {
		query = e.target.value;
		render();
	});

	buttons.forEach(b => {
		b.onclick = () => {
			category = b.dataset.cat;
			render();
		};
	});

	render();
}
