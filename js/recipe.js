const ALLOWED = [];

async function init() {
	const raw = new URLSearchParams(location.search).get("file");
	const file = decodeURIComponent(raw || "");

	const list = await fetch("data/index.json").then(r => r.json());

	list.forEach(r => ALLOWED.push(r.file));

	if (!ALLOWED.includes(file)) {
		document.body.innerHTML = "<h2>Access denied ❌</h2>";
		return;
	}

	const recipe = await fetch(file).then(r => r.json());

	document.getElementById("hero").style.backgroundImage =
		`url('${recipe.image}')`;

	document.getElementById("title").textContent = recipe.title;

	document.getElementById("content").innerHTML =
		recipe.ingredients.map(g =>
			`<div class="section">
				<h3>${g.title}</h3>
				<ul>${g.items.map(i => `<li>${i}</li>`).join("")}</ul>
			</div>`
		).join("") +

		recipe.instruction.map(s =>
			`<div class="section">
				<h3>${s.title}</h3>
				${s.steps.map(step =>
					`<div class="step" onclick="this.classList.toggle('done')">${step}</div>`
				).join("")}
			</div>`
		).join("") +

		`<div class="section">
			<h3>Chef Tips</h3>
			<ul>${(recipe.chefTips || []).map(t => `<li>${t}</li>`).join("")}</ul>
		</div>`;
}

init();
