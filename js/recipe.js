const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file") || "");

const BASE_URL = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

/* ================= SAFE TEXT ================= */
function safeText(val) {
	if (typeof val === "string") return val;
	if (typeof val === "number") return String(val);
	if (val && typeof val === "object") {
		return val.text || val.step || val.name || JSON.stringify(val);
	}
	return "";
}

/* ================= LOAD ================= */
async function loadRecipe() {
	try {
		if (!file) throw new Error("No recipe file in URL");

		const url = file.startsWith("http")
			? file
			: BASE_URL + file;

		const res = await fetch(url);
		if (!res.ok) throw new Error("HTTP " + res.status);

		const data = await res.json();

		/* ================= TITLE ================= */
		document.getElementById("title").textContent = data.title || "";

		/* ================= HERO ================= */
		document.getElementById("hero").style.backgroundImage =
			data.image ? `url(${data.image})` : "none";

		/* ================= INGREDIENTS ================= */
		const ingEl = document.getElementById("ingredients");

		if (Array.isArray(data.ingredients)) {
			ingEl.innerHTML = `
				<div class="section">
					<h3>Ingredients</h3>
					${data.ingredients.map(group => `
						<h4>${group.title || ""}</h4>
						<ul>
							${(group.items || [])
								.map(i => `<li>${safeText(i)}</li>`)
								.join("")}
						</ul>
					`).join("")}
				</div>
			`;
		}

		/* ================= INSTRUCTIONS (FULL FLEXIBLE) ================= */
		const insEl = document.getElementById("instructions");

		if (Array.isArray(data.instruction)) {
			insEl.innerHTML = `
				<div class="section">
					<h3>Instructions</h3>
					${data.instruction.map(block => `
						<h4>${block.title || ""}</h4>
						${(block.steps || [])
							.map(step => `<div class="step">${safeText(step)}</div>`)
							.join("")}
					`).join("")}
				</div>
			`;
		}
		else if (Array.isArray(data.steps)) {
			insEl.innerHTML = `
				<div class="section">
					<h3>Instructions</h3>
					${data.steps.map(s => `
						<div class="step">${safeText(s)}</div>
					`).join("")}
				</div>
			`;
		}

		/* ================= CHEF TIPS ================= */
		const tipsEl = document.getElementById("tips");

		if (Array.isArray(data.chefTips)) {
			tipsEl.innerHTML = `
				<div class="section">
					<h3>Chef Tips</h3>
					<ul>
						${data.chefTips.map(t => `<li>${safeText(t)}</li>`).join("")}
					</ul>
				</div>
			`;
		}

		/* ================= STEP TOGGLE ================= */
		document.querySelectorAll(".step").forEach(step => {
			step.addEventListener("click", () => {
				step.classList.toggle("done");
			});
		});

	} catch (err) {
		console.error(err);
		document.getElementById("title").textContent = "Recipe failed ❌";
	}
}

loadRecipe();
