const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file"));

/* ================= BASE PATH FIX ================= */
const BASE_PATH = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

function formatIngredient(i) {
	if (typeof i === "object") {
		return i.name || i.title || JSON.stringify(i);
	}
	return i;
}

function formatStep(s) {
	if (typeof s === "object") {
		return s.text || s.step || JSON.stringify(s);
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

		/* ================= INGREDIENTS ================= */
		let ingredientsHTML = "";

		if (Array.isArray(data.ingredients)) {
			ingredientsHTML = data.ingredients.map(section => `
				<div class="section">
					<h3>${section.title || "Ingredients"}</h3>
					<ul>
						${(section.items || [])
							.map(i => `<li>${formatIngredient(i)}</li>`)
							.join("")}
					</ul>
				</div>
			`).join("");
		}

		/* ================= STEPS ================= */
		let stepsHTML = "";

		if (Array.isArray(data.steps)) {
			// flat format support
			stepsHTML = `
				<div class="section">
					<h3>Steps</h3>
					<div>
						${data.steps.map(s => `
							<div class="step">${formatStep(s)}</div>
						`).join("")}
					</div>
				</div>
			`;
		} 
		else if (Array.isArray(data.instruction)) {
			// your Pad Thai structure
			stepsHTML = `
				<div class="section">
					<h3>Steps</h3>
					${data.instruction.map(sec => `
						<div style="margin-bottom:10px;">
							<h4>${sec.title || ""}</h4>
							${(sec.steps || []).map(s => `
								<div class="step">${formatStep(s)}</div>
							`).join("")}
						</div>
					`).join("")}
				</div>
			`;
		}

		/* ================= RENDER ================= */
		document.getElementById("content").innerHTML =
			ingredientsHTML + stepsHTML;

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
