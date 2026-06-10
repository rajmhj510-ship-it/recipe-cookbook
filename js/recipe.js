const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file"));

/* ================= BASE PATH FIX ================= */
const BASE_PATH = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

function formatIngredient(i) {
	if (typeof i === "object") {
		return `${i.name || ""}${i.quantity ? " - " + i.quantity : ""}`;
	}
	return i;
}

function formatStep(s) {
	if (typeof s === "object") {
		return s.text || "";
	}
	return s;
}

async function loadRecipe() {
	try {
		if (!file) throw new Error("No file provided in URL");

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
		document.getElementById("title").textContent = data.title || "";

		/* ================= CONTENT ================= */
		document.getElementById("content").innerHTML = `
			<div class="section">
				<h3>Ingredients</h3>
				<ul>
					${(data.ingredients || [])
						.map(i => `<li>${formatIngredient(i)}</li>`)
						.join("")}
				</ul>
			</div>

			<div class="section">
				<h3>Steps</h3>
				<div>
					${(data.steps || [])
						.map(s => `<div class="step">${formatStep(s)}</div>`)
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
