const params = new URLSearchParams(window.location.search);
const file = params.get("file");

async function loadRecipe() {
	try {
		const res = await fetch(file);
		const data = await res.json();

		document.getElementById("hero").style.backgroundImage =
			`url(${data.image})`;

		document.getElementById("title").textContent = data.title;

		const container = document.getElementById("content");

		container.innerHTML = `
			<div class="section">
				<h3>Ingredients</h3>
				<ul>
					${data.ingredients.map(i => `<li>${i}</li>`).join("")}
				</ul>
			</div>

			<div class="section">
				<h3>Steps</h3>
				<div id="steps">
					${data.steps.map((s, i) =>
						`<div class="step" data-i="${i}">${s}</div>`
					).join("")}
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
	}
}

loadRecipe();
