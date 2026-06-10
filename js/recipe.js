const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file") || "");

/* ================= BASE PATH (GitHub Pages SAFE) ================= */
const BASE_URL = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

/* ================= HELPERS ================= */

function safeText(val) {
	if (typeof val === "string") return val;
	if (typeof val === "number") return String(val);
	if (typeof val === "object" && val !== null) {
		return val.text || val.step || val.name || JSON.stringify(val);
	}
	return "";
}

/* ================= LOAD RECIPE ================= */

async function loadRecipe() {
	try {
		if (!file) throw new Error("No recipe file in URL");

		const url = file.startsWith("http")
			? file
			: BASE_URL + file;

		console.log("Fetching:", url);

		const res = await fetch(url);
		if (!res.ok) throw new Error("HTTP " + res.status);

		const data = await res.json();

		/* ================= TITLE ================= */
		document.getElementById("title").textContent = data.title || "Recipe";

		/* ================= HERO (optional) ================= */
		const hero = document.getElementById("hero");
		if (hero && data.image) {
			hero.style.backgroundImage = `url(${data.image})`;
		}

		/* ================= INGREDIENTS ================= */
		let ingredientsHTML = "";

		if (Array.isArray(data.ingredients)) {
			ingredientsHTML = data.ingredients.map(section => `
				<div class="section">
					<h3>Ingredients - ${section.title || ""}</h3>
					<ul>
						${(section.items || [])
							.map(i => `<li>${safeText(i)}</li>`)
							.join("")}
					</ul>
				</div>
			`).join("");
		}

		/* ================= INSTRUCTION ================= */
		let instructionHTML = "";

		if (Array.isArray(data.instruction)) {
			instructionHTML = `
				<div class="section">
					<h3>Instruction</h3>
					${data.instruction.map(stepBlock => `
						<div class="step-block">
							<h4>${stepBlock.title || ""}</h4>
							${(stepBlock.steps || [])
								.map(s => `<div class="step">${safeText(s)}</div>`)
								.join("")}
						</div>
					`).join("")}
				</div>
			`;
		}

		/* ================= CHEF TIPS ================= */
		let tipsHTML = "";

		if (Array.isArray(data.chefTips)) {
			tipsHTML = `
				<div class="section">
					<h3>Chef Tips</h3>
					<ul>
						${data.chefTips.map(t => `<li>${safeText(t)}</li>`).join("")}
					</ul>
				</div>
			`;
		}

		/* ================= RENDER ================= */
		document.getElementById("content").innerHTML =
			ingredientsHTML + instructionHTML + tipsHTML;

		/* ================= STEP CLICK ================= */
		document.querySelectorAll(".step").forEach(step => {
			step.addEventListener("click", () => {
				step.classList.toggle("done");
			});
		});

	} catch (err) {
		console.error(err);

		document.getElementById("title").textContent = "Recipe failed to load ❌";

		document.getElementById("content").innerHTML = `
			<div class="section" style="color:red;">
				${err.message}
			</div>
		`;
	}
}

loadRecipe();
