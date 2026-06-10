const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file"));

/* ================= BASE PATH FIX ================= */
/* Works on GitHub Pages + local server */
const BASE_PATH = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

async function loadRecipe() {
	try {
		if (!file) throw new Error("No file provided in URL");

		// SAFE PATH BUILD
		const url = BASE_PATH + file;

		console.log("Fetching recipe from:", url);

		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`HTTP Error: ${res.status}`);
		}

		const data = await res.json();

		/* ================= HERO ================= */
		document.getElementById("hero").style.backgroundImage =
			`url(${data.image})`;

		/* ================= TITLE ================= */
		document.getElementById("title").textContent = data.title;

		/* ================= CONTENT ================= */
		document.getElementById("content").innerHTML = `
			<div class="section">
				<h3>Ingredients</h3>
				<ul>
					${(data.ingredients || [])
						.map(i => `<li>${i}</li>`)
						.join("")}
				</ul>
			</div>

			<div class="section">
				<h3>Steps</h3>
				<div>
					${(data.steps || [])
						.map(s => `<div class="step">${s}</div>`)
						.join("")}
				</div>
			</div>
		`;

		/* ================= STEP TOGGLE ================= */
		document.querySelectorAll(".step").forEach(step => {
			step.addEventListener("click", () => {
				step.classList.toggle("done");
			});
		});

	} catch (err) {
		console.error(err);

		document.getElementById("title").textContent =
			"Recipe failed to load ❌";

		document.getElementById("content").innerHTML = `
			<div class="section" style="color:red;">
				${err.message}
			</div>
		`;
	}
}

loadRecipe();
