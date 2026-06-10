async function init() {
	try {

		// 1. get file safely
		const raw = new URLSearchParams(location.search).get("file") || "";
		const file = decodeURIComponent(raw).trim();

		// 2. load index (security + validation)
		const resIndex = await fetch("./data/index.json");
		if (!resIndex.ok) throw new Error("Index failed");

		const index = await resIndex.json();
		const allowed = index.map(i => i.file);

		if (!allowed.includes(file)) {
			document.body.innerHTML = "<h2>Access denied ❌</h2>";
			return;
		}

		// 3. load recipe
		const res = await fetch(file);
		if (!res.ok) throw new Error("Recipe not found");

		const r = await res.json();

		// 4. fallback safety
		const ingredients = r.ingredients || [];
		const instruction = r.instruction || [];
		const tips = r.chefTips || [];

		// 5. render
		document.getElementById("hero").style.backgroundImage =
			`url('${r.image || ""}')`;

		document.getElementById("title").textContent = r.title || "";

		document.getElementById("content").innerHTML = `

		<div class="section">
			<h2>🧂 Ingredients</h2>
			${ingredients.map(g => `
				<h3>${g.title || ""}</h3>
				<ul>
					${(g.items || []).map(i => `<li>${i}</li>`).join("")}
				</ul>
			`).join("")}
		</div>

		<div class="section">
			<h2>👨‍🍳 Instructions</h2>
			${instruction.map(s => `
				<h3>${s.title || ""}</h3>
				${(s.steps || []).map(step =>
					`<div class="step" onclick="this.classList.toggle('done')">${step}</div>`
				).join("")}
			`).join("")}
		</div>

		<div class="section">
			<h2>⭐ Tips</h2>
			<ul>
				${tips.map(t => `<li>${t}</li>`).join("")}
			</ul>
		</div>

		`;

	} catch (err) {
		console.error(err);
		document.body.innerHTML = "<h2>Failed to load recipe ❌</h2>";
	}
}

init();
