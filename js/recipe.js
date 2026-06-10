const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file") || "");

/* ================= BASE PATH ================= */
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

		/* ================= HERO ================= */
		const hero = document.getElementById("hero");
		if (hero && data.image) {
			hero.style.backgroundImage = `url(${data.image})`;
		}

		/* ================= INGREDIENTS ================= */
		const ingredientsHTML = (data.ingredients || [])
			.map(section => `
				<div class="section">
					<h3>${section.title || "Ingredients"}</h3>
					<ul>
						${(section.items || [])
							.map(i => `<li>${safeText(i)}</li>`)
							.join("")}
					</ul>
				</div>
			`)
			.join("");

		document.getElementById("ingredients").innerHTML = ingredientsHTML;

		/* ================= INSTRUCTIONS ================= */
		const instructionHTML = (data.instruction || [])
			.map(block => `
				<div class="section">
					<h3>${block.title || "Instruction"}</h3>
					${(block.steps || [])
						.map(s => `<div class="step">${safeText(s)}</div>`)
						.join("")}
				</div>
			`)
			.join("");

		document.getElementById("instructions").innerHTML = instructionHTML;

		/* ================= CHEF TIPS ================= */
		const tipsHTML = data.chefTips?.length
			? `
				<div class="section">
					<h3>Chef Tips</h3>
					<ul>
						${data.chefTips.map(t => `<li>${safeText(t)}</li>`).join("")}
					</ul>
				</div>
			`
			: "";

		document.getElementById("tips").innerHTML = tipsHTML;

		/* ================= STEP CLICK ================= */
		document.querySelectorAll(".step").forEach(step => {
			step.addEventListener("click", () => {
				step.classList.toggle("done");
			});
		});

	} catch (err) {
		console.error(err);

		document.getElementById("title").textContent =
			"Recipe failed to load ❌";

		document.getElementById("ingredients").innerHTML = "";
		document.getElementById("instructions").innerHTML = "";
		document.getElementById("tips").innerHTML = `
			<div class="section" style="color:red;">
				${err.message}
			</div>
		`;
	}
}

loadRecipe();
