let recipes = [];

/* ================= LOAD ================= */
async function loadRecipes() {
	try {
		const res = await fetch("./data/index.json");
		if (!res.ok) throw new Error("Failed index.json");

		recipes = await res.json();

		/* INIT MODULES */
		initCarousel(recipes);
		initExplore();

	} catch (err) {
		console.error(err);
	}
}

loadRecipes();

/* ================= EXPLORE ================= */
function initExplore() {

	const list = document.getElementById("recipeList");
	const search = document.getElementById("search");
	const buttons = document.querySelectorAll(".filters button");

	let activeCat = "all";

	function render(data) {
		list.innerHTML = "";

		data.forEach(r => {
			const card = document.createElement("div");
			card.className = "explore-card";

			card.innerHTML = `
				<img src="${r.image}">
				<h3>${r.title}</h3>
				<p>${r.category}</p>
			`;

			card.onclick = () => {
				window.location.href =
					`recipe.html?file=${encodeURIComponent(r.file)}`;
			};

			list.appendChild(card);
		});
	}

	function filter() {
		let filtered = recipes;

		if (activeCat !== "all") {
			filtered = filtered.filter(r => r.category === activeCat);
		}

		const q = search.value.toLowerCase();

		if (q) {
			filtered = filtered.filter(r =>
				r.title.toLowerCase().includes(q)
			);
		}

		render(filtered);
	}

	search.addEventListener("input", filter);

	buttons.forEach(btn => {
		btn.onclick = () => {
			buttons.forEach(b => b.classList.remove("active"));
			btn.classList.add("active");
			activeCat = btn.dataset.cat;
			filter();
		};
	});

	render(recipes);
}
