const params = new URLSearchParams(window.location.search);
const file = decodeURIComponent(params.get("file") || "");

const BASE_URL = window.location.pathname.includes("recipe-cookbook")
? "/recipe-cookbook/"
: "./";

function safeText(val) {
if (typeof val === "string") return val;
if (typeof val === "number") return String(val);

```
if (val && typeof val === "object") {
	return val.text || val.step || val.name || "";
}

return "";
```

}

async function loadRecipe() {

```
try {

	if (!file)
		throw new Error("Recipe file missing");

	const url = file.startsWith("http")
		? file
		: BASE_URL + file;

	const res = await fetch(url);

	if (!res.ok)
		throw new Error("HTTP " + res.status);

	const data = await res.json();

	document.getElementById("title").textContent =
		data.title || "Recipe";

	document.getElementById("category").textContent =
		data.category || "";

	document.getElementById("time").textContent =
		data.time || "";

	document.getElementById("difficulty").textContent =
		data.difficulty || "";

	const hero = document.getElementById("hero");

	if (data.image) {
		hero.style.backgroundImage =
			`url(${data.image})`;
	}

	/* INGREDIENTS */

	document.getElementById("ingredients").innerHTML = `
		<div class="section">
			<h3>Ingredients</h3>

			${(data.ingredients || []).map(group => `
				${group.title ? `<h4>${group.title}</h4>` : ""}

				<ul>
					${(group.items || []).map(item =>
						`<li>${safeText(item)}</li>`
					).join("")}
				</ul>
			`).join("")}
		</div>
	`;

	/* INSTRUCTIONS */

	document.getElementById("instructions").innerHTML = `
		<div class="section">
			<h3>Instructions</h3>

			${(data.instruction || []).map(block => `
				${block.title ? `<h4>${block.title}</h4>` : ""}

				${(block.steps || []).map(step =>
					`<div class="step">${safeText(step)}</div>`
				).join("")}
			`).join("")}
		</div>
	`;

	/* CHEF TIPS */

	if (Array.isArray(data.chefTips)) {

		document.getElementById("tips").innerHTML = `
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

	document.querySelectorAll(".step").forEach(step => {

		step.addEventListener("click", () => {
			step.classList.toggle("done");
		});

	});

}
catch (err) {

	console.error(err);

	document.body.innerHTML = `
		<h2 style="padding:40px;">
			Recipe failed to load
		</h2>
	`;
}
```

}

loadRecipe();
