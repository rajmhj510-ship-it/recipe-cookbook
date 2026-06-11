let current = 0;
let cards = [];
let autoSlide;

/* ================= CAROUSEL ================= */

function initCarousel() {

	const track = document.querySelector(".carousel-track");
	const titleEl = document.querySelector(".hero-recipe-title");
	const metaEl = document.querySelector(".recipe-meta");

	const leftBtn = document.querySelector(".nav-arrow.left");
	const rightBtn = document.querySelector(".nav-arrow.right");
	const scrollBtn = document.querySelector(".scroll-down");

	recipes.forEach(r => {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `<img src="${r.image}" alt="${r.title}">`;

		card.onclick = () => {
			window.location.href =
				`recipe.html?file=${encodeURIComponent(r.file)}`;
		};

		track.appendChild(card);
	});

	cards = document.querySelectorAll(".card");

	function update(i) {
		current = (i + cards.length) % cards.length;

		cards.forEach((c, idx) => {
			const offset = (idx - current + cards.length) % cards.length;

			c.className = "card";

			if (offset === 0) c.classList.add("center");
			else if (offset === 1) c.classList.add("right-1");
			else if (offset === 2) c.classList.add("right-2");
			else if (offset === cards.length - 1) c.classList.add("left-1");
			else if (offset === cards.length - 2) c.classList.add("left-2");
			else c.classList.add("hidden");
		});

		const r = recipes[current];

		titleEl.textContent = r.title || "";
		metaEl.textContent = `${r.time || ""} • ${r.difficulty || ""}`;
	}

	leftBtn.onclick = () => update(current - 1);
	rightBtn.onclick = () => update(current + 1);

	scrollBtn.onclick = () => {
		document.getElementById("hero").style.display = "none";
		document.getElementById("explore").classList.remove("hidden");
	};

	update(0);
}
