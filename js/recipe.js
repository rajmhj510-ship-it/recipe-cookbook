const params = new URLSearchParams(window.location.search);
const file = params.get("file");

async function loadRecipe() {
	try {
		if (!file) throw new Error("Missing recipe file");

		const url = new URL(file, window.location.href).href;

		const res = await fetch(url);

		if (!res.ok) throw new Error("Failed to load recipe");

		const data = await res.json();

		document.getElementById("hero").style.backgroundImage =
			`url(${data.image})`;

		document.getElementById("title").textContent = data.title;

		document.getElementById("content").innerHTML = `
			<div class="section">
				<h3>Ingredients</h3>
				<ul>
					${(data.ingredients || []).map(i => `<li>${i}</li>`).join("")}
				</ul>
			</div>

			<div class="section">
				<h3>Steps</h3>
				<div>
					${(data.steps || []).map(s => `<div class="step">${s}</div>`).join("")}
				</div>
			</div>
		`;

		document.querySelectorAll(".step").forEach(step => {
			step.onclick = () => step.classList.toggle("done");
		});

	} catch (err) {
		console.error(err);

		document.getElementById("title").textContent =
			"Recipe failed to load ❌";

		document.getElementById("content").innerHTML = `
			<div class="section">
				<p style="color:red;">${err.message}</p>
			</div>
		`;
	}
}

loadRecipe();
