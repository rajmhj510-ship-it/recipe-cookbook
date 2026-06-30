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
		return val.text || val.step || val.name || val.description || "";
	}

	return "";
}

/* ================= LOAD RECIPE ================= */
async function loadRecipe() {
	try {
		if (!file) throw new Error("Recipe file missing");

		const url = file.startsWith("http")
			? file
			: BASE_URL + file;

		const res = await fetch(url);
		if (!res.ok) throw new Error("HTTP " + res.status);

		const data = await res.json();

		/* HERO */
		document.getElementById("title").textContent = data.title || "Recipe";
		document.getElementById("category").textContent = data.category || "";
		document.getElementById("description").textContent = data.description || "";
		document.getElementById("time").textContent = data.time || "";
		document.getElementById("difficulty").textContent = data.difficulty || "";

		if (data.image) {
			document.getElementById("hero").style.backgroundImage =
				`url(${data.image})`;
		}

		/* INGREDIENTS */
		const ingEl = document.getElementById("ingredients");

		if (Array.isArray(data.ingredients)) {
			ingEl.innerHTML = `
				<div class="section">
					<h3>Ingredients</h3>
					${data.ingredients.map(group => `
						${group.title ? `<h4>${group.title}</h4>` : ""}
						<ul>
							${(group.items || [])
								.map(i => `<li>${safeText(i)}</li>`)
								.join("")}
						</ul>
					`).join("")}
				</div>
			`;
		}

		/* INSTRUCTIONS */
		const insEl = document.getElementById("instructions");

		if (Array.isArray(data.instruction)) {
			insEl.innerHTML = `
				<div class="section">
					<h3>Instructions</h3>
					${data.instruction.map(block => `
						${block.title ? `<h4>${block.title}</h4>` : ""}
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
					${data.steps.map(step =>
						`<div class="step">${safeText(step)}</div>`
					).join("")}
				</div>
			`;
		}

		/* TIPS */
		const serveEl = document.getElementById("servingsuggestions");

if (data.servingSuggestions?.length > 0) {
	serveEl.innerHTML = `
		<div class="section">
			<h3>Serving Suggestions</h3>
			<ul>
				${data.servingSuggestions
					.map(s => `<li>${safeText(s)}</li>`)
					.join("")}
			</ul>
		</div>
	`;
} else {
	serveEl.innerHTML = ""; // hide if not available
}
		const tipsEl = document.getElementById("tips");

		if (Array.isArray(data.chefTips) && data.chefTips.length) {
			tipsEl.innerHTML = `
				<div class="section">
					<h3>Chef Tips</h3>
					<ul>
						${data.chefTips.map(t =>
							`<li>${safeText(t)}</li>`
						).join("")}
					</ul>
				</div>
			`;
		}

		/* STEP CLICK */
		document.querySelectorAll(".step").forEach(step => {
			step.addEventListener("click", () => {
				step.classList.toggle("done");
			});
		});

	} catch (err) {
		console.error(err);

		document.body.innerHTML = `
			<h2 style="padding:40px;font-family:Arial;">
				Recipe failed to load ❌
			</h2>
		`;
	}
}

loadRecipe();
