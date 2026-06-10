const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file") || "");

/* ================= BASE PATH FIX ================= */
const BASE_PATH = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

/* ================= SAFE TEXT ================= */
function safeText(val) {
	if (typeof val === "string") return val;
	if (typeof val === "number") return String(val);
	if (typeof val === "object" && val !== null) {
		return val.text || val.step || val.name || val.title || JSON.stringify(val);
	}
	return "";
}

/* ================= INGREDIENT FORMAT ================= */
function renderIngredients(data) {
	if (!Array.isArray(data.ingredients)) return "";

	return data.ingredients.map(section => `
		<div class="section">
			<h3>${section.title || "Ingredients"}</h3>
			<ul>
				${(section.items || [])
					.map(i => `<li>${safeText(i)}</li>`)
					.join("")}
			</ul>
		</div>
	`).join("");
}

/* ================= STEPS FORMAT ================= */
function renderSteps(data) {

	// Case 1: flat steps array
	if (Array.isArray(data.steps)) {
		return `
			<div class="section">
				<h3>Steps</h3>
				${data.steps.map(s => `
					<div class="step">${safeText(s)}</div>
				`).join("")}
			</div>
		`;
	}

	// Case 2: instruction format (your real structure)
	if (Array.isArray(data.instruction)) {
		return `
			<div class="section">
				<h3>Steps</h3>
				${data.instruction.map(block => `
					<div class="step-block">
						<h4>${block.title || ""}</h4>
						${(block.steps || []).map(s => `
							<div class="step">${safeText(s)}</div>
						`).join("")}
					</div>
				`).join("")}
			</div>
		`;
	}

	return "";
}

/* ================= MAIN LOAD ================= */
async function loadRecipe() {
	try {
		if (!file) throw new Error("No file provided in URL");

		const url = BASE_PATH + file;
		console.log("Fetching:", url);

		const res = await fetch(url);
		if (!res.ok) throw new Error("HTTP " + res.status);

		const data = await res.json();

		/* HERO */
		document.getElementById("hero").style.backgroundImage =
			`url(${data.image || ""})`;

		/* TITLE */
		document.getElementById("title").textContent = data.title || "";

		/* CONTENT */
		const html =
			renderIngredients(data) +
			renderSteps(data);

		document.getElementById("content").innerHTML = html;

		/* STEP CLICK */
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
