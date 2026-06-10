const params = new URLSearchParams(window.location.search);
const file = params.get("file");

async function loadRecipe() {
	try {
		if (!file) throw new Error("No file provided");

		// FIX: ALWAYS FORCE ROOT-RELATIVE PATH
		const url = "./" + file;

		console.log("Fetching:", url);

		const res = await fetch(url);

		if (!res.ok) {
			throw new Error("HTTP " + res.status);
		}

		const data = await res.json();

		/* HERO IMAGE */
		document.getElementById("hero").style.backgroundImage =
			`url(${data.image})`;

		/* TITLE */
		document.getElementById("title").textContent = data.title;

		/* CONTENT */
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

		document.getElementById("content").innerHTML =
			`<div class="section" style="color:red;">${err.message}</div>`;
	}
}

loadRecipe();
