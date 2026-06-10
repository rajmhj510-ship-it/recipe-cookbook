const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file") || "");

/* ================= BASE PATH (GitHub + Local safe) ================= */
const BASE_PATH = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

/* ================= SAFE TEXT ================= */
function safe(val) {
	if (typeof val === "string" || typeof val === "number") return val;
	if (typeof val === "object" && val !== null) {
		return val.text || val.step || val.title || val.name || JSON.stringify(val);
	}
	return "";
}

/* ================= LOAD ================= */
async function loadRecipe() {
	try {
		if (!file) throw new Error("No file provided");

		const url = BASE_PATH + file;
		console.log("Fetching:", url);

		const res = await fetch(url);
		if (!res.ok) throw new Error("HTTP " + res.status);

		const data = await res.json();

		console.log("RECIPE DATA:", data);

		/* ================= HERO ================= */
		const hero = document.getElementById("hero");
		if (hero) hero.style.backgroundImage = `url(${data.image || ""})`;

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
							.map(i => `<li>${safe(i)}</li>`)
							.join("")}
					</ul>
				</div>
			`).join("");
		}

		/* ================= STEPS NORMALIZER ================= */
		let steps = [];

		// Case 1: flat steps
		if (Array.isArray(data.steps)) {
			steps = data.steps;
		}

		// Case 2: instruction format (your main format)
		else if (Array.isArray(data.instruction)) {
			data.instruction.forEach(block => {
				if (Array.isArray(block.steps)) {
					block.steps.forEach(s => {
						steps.push(`${block.title ? block.title + " - " : ""}${safe(s)}`);
					});
				}
			});
		}

		/* ================= STEPS HTML ================= */
		let stepsHTML = "";

		if (steps.length > 0) {
			stepsHTML = `
				<div class="section">
					<h3>Steps</h3>
					${steps.map(s => `
						<div class="step">${s}</div>
					`).join("")}
				</div>
			`;
		}

		/* ================= RENDER ================= */
		document.getElementById("content").innerHTML =
			ingredientsHTML + stepsHTML;

		/* ================= CLICK TOGGLE ================= */
		setTimeout(() => {
			document.querySelectorAll(".step").forEach(step => {
				step.addEventListener("click", () => {
					step.classList.toggle("done");
				});
			});
		}, 50);

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
