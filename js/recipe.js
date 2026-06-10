const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file"));

const BASE_PATH = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

function renderIngredients(ingredients) {
	if (!Array.isArray(ingredients)) return "";

	return ingredients.map(section => `
		<div class="section">
			<h3>${section.title || "Ingredients"}</h3>
			<ul>
				${(section.items || [])
					.map(item => `<li>${String(item)}</li>`)
					.join("")}
			</ul>
		</div>
	`).join("");
}

function renderSteps(instruction) {
	if (!Array.isArray(instruction)) return "";

	return `
		<div class="section">
			<h3>Steps</h3>
			${instruction.map(sec => `
				<div class="step-group">
					<h4>${sec.title || ""}</h4>
					${(sec.steps || [])
						.map(step => `<div class="step">${String(step)}</div>`)
						.join("")}
				</div>
			`)
			.join("")}
		</div>
	`;
}

async function loadRecipe() {
	try {
		if (!file) throw new Error("No file provided in URL");

		const url = BASE_PATH + file;

		const res = await fetch(url);
		if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

		const data = await res.json();

		/* ================= HERO ================= */
		document.getElementById("hero").style.backgroundImage =
			`url(${data.image || ""})`;

		/* ================= TITLE ================= */
		document.getElementById("title").textContent = data.title || "";

		/* ================= CONTENT ================= */
		const content = document.getElementById("content");

		content.innerHTML =
			renderIngredients(data.ingredients) +
			renderSteps(data.instruction || data.steps);

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
