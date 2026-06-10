const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file"));

const BASE_PATH = window.location.pathname.includes("recipe-cookbook")
	? "/recipe-cookbook/"
	: "./";

function safeText(val) {
	if (typeof val === "string") return val;
	if (typeof val === "object") return val.text || val.step || val.name || JSON.stringify(val);
	return "";
}

async function loadRecipe() {
	try {
		if (!file) throw new Error("No file provided in URL");

		const url = BASE_PATH + file;
		console.log("Fetching:", url);

		const res = await fetch(url);
		if (!res.ok) throw new Error("HTTP " + res.status);

		const data = await res.json();

		/* ================= HERO ================= */
		const hero = document.getElementById("hero");
		if (hero) hero.style.backgroundImage = `url(${data.image})`;

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
							.map(i => `<li>${safeText(i)}</li>`)
							.join("")}
					</ul>
				</div>
			`).join("");
		}

		/* ================= STEPS ================= */
		let stepsHTML = "";

		if (Array.isArray(data.instruction)) {
			stepsHTML = `
				<div class="section">
					<h3>Steps</h3>
					${data.instruction.map(sec => `
						<div class="step-block">
							<h4>${sec.title || ""}</h4>
							${(sec.steps || [])
								.map(s => `<div class="step">${safeText(s)}</div>`)
								.join("")}
						</div>
					`).join("")}
				</div>
			`;
		}

		/* ================= RENDER ================= */
		document.getElementById("content").innerHTML =
			ingredientsHTML + stepsHTML;

		/* ================= CLICK TO TOGGLE ================= */
		document.querySelectorAll(".step").forEach(step => {
			step.addEventListener("click", () => {
				step.classList.toggle("done");
			});
		});

	} catch (err) {
		console.error(err);
		document.getElementById("title").textContent = "Recipe failed to load ❌";
		document.getElementById("content").innerHTML =
			`<div class="section" style="color:red;">${err.message}</div>`;
	}
}

loadRecipe();
