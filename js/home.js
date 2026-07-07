/* ==========================================
   RENDER RECIPES
========================================== */

function renderRecipes(list) {

    if (!recipeList)
        return;

    recipeList.style.opacity = "0";
    recipeList.style.transform = "translateY(10px)";

    setTimeout(() => {

        recipeList.innerHTML = "";

        if (!list.length) {

            recipeList.innerHTML = `

                <p class="error">

                    No recipes found.

                </p>

            `;

        }

        else {

            const fragment =
                document.createDocumentFragment();
list.forEach((recipe,index) => {

    const card =
        createRecipeCard(recipe);

    card.style.animationDelay =
        `${index * 40}ms`;

    fragment.appendChild(card);

});

            recipeList.appendChild(fragment);

        }

        requestAnimationFrame(() => {

            recipeList.style.opacity = "1";
            recipeList.style.transform = "translateY(0)";

        });

    }, 200);

}
