/* ==========================================
   RECIPE COOKBOOK - HOME.JS
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const recipeList = document.getElementById("recipeList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");


/* ==========================================
   STATE
========================================== */

let recipes = [];
let selectedCategory = "all";
let searchQuery = "";


/* ==========================================
   BASE PATH
========================================== */

const BASE_PATH = window.location.pathname.includes("recipe-cookbook")
    ? "/recipe-cookbook/"
    : "./";


/* ==========================================
   LOAD RECIPES
========================================== */

async function loadRecipes() {

    try {

        console.log("Loading recipes...");


        /*
            Load category index

            data/index.json

            [
              {
                category:"Arabic",
                file:"data/arabic.json"
              }
            ]

        */

        const indexURL = BASE_PATH + "data/index.json";


        const indexResponse = await fetch(indexURL);


        if (!indexResponse.ok) {

            throw new Error(
                "Cannot load data/index.json"
            );

        }


        const categories = await indexResponse.json();



        /*
            Load every cuisine file

        */

        const recipeFiles = await Promise.all(

            categories.map(async category => {


                try {


                    const response =
                        await fetch(
                            BASE_PATH + category.file
                        );


                    if (!response.ok) {

                        console.error(
                            "Missing:",
                            category.file
                        );

                        return [];

                    }


                    const data =
                        await response.json();



                    return data.map(recipe => ({

                        ...recipe,

                        /*
                           Fix missing category
                        */

                        category:
                            recipe.category ||
                            category.category

                    }));


                }


                catch(error){

                    console.error(
                        category.file,
                        error
                    );

                    return [];

                }


            })

        );



        /*
            Combine all recipes
        */

        recipes =
            recipeFiles.flat();



        console.log(
            "Recipes loaded:",
            recipes.length
        );


        console.log(
            "First recipe:",
            recipes[0]
        );


        renderRecipes(recipes);



        /*
            Send data to carousel
            if carousel.js exists

        */

        if(typeof loadCarousel === "function"){

            loadCarousel(recipes);

        }


    }


    catch(error){

        console.error(error);


        recipeList.innerHTML = `

            <p class="error">
                Failed to load recipes ❌
            </p>

        `;

    }


}



/* ==========================================
   START
========================================== */


loadRecipes();





/* ==========================================
   CREATE RECIPE CARD
========================================== */


function createRecipeCard(recipe){


    const card =
        document.createElement("article");


    card.className =
        "explore-card";



    const title =
        recipe.title || "Unknown Recipe";


    const image =
        recipe.image ||
        "assets/images/logo.png";


    const category =
        recipe.category ||
        "Unknown";


    const id =
        recipe.id || "";



    card.innerHTML = `


        <img

            src="${BASE_PATH}${image}"

            alt="${title}"

            loading="lazy"

            onerror="
            this.src='${BASE_PATH}assets/images/logo.png'
            "

        >



        <div class="card-content">


            <h3>
                ${title}
            </h3>



            <div class="card-footer">


                <span class="recipe-category">

                    ${category}

                </span>



                <span class="recipe-id">

                    #${id}

                </span>


            </div>


        </div>


    `;



    card.addEventListener(
        "click",
        ()=>{


            if(!recipe.file){

                console.error(
                    "Recipe file missing",
                    recipe
                );

                return;

            }


            window.location.href =

            BASE_PATH +

            "recipe.html?file=" +

            encodeURIComponent(
                recipe.file
            );


        }
    );



    return card;


}





/* ==========================================
   RENDER RECIPES
========================================== */


function renderRecipes(list){


    if(!recipeList)
        return;



    recipeList.innerHTML="";



    if(list.length===0){


        recipeList.innerHTML = `

            <p class="error">

                No recipes found.

            </p>

        `;


        return;

    }



    const fragment =
        document.createDocumentFragment();



    list.forEach(recipe=>{


        fragment.appendChild(

            createRecipeCard(recipe)

        );


    });



    recipeList.appendChild(fragment);


}





/* ==========================================
   FILTER SYSTEM
========================================== */


function applyFilters(){



    const filtered =

        recipes.filter(recipe=>{


            const category =
                (
                    recipe.category || ""
                )
                .toLowerCase();



            const title =
                (
                    recipe.title || ""
                )
                .toLowerCase();




            const categoryMatch =

                selectedCategory === "all"

                ||

                category ===
                selectedCategory.toLowerCase();





            const searchMatch =


                searchQuery === ""

                ||

                title.includes(searchQuery)

                ||

                category.includes(searchQuery);



            return (

                categoryMatch

                &&

                searchMatch

            );


        });



    renderRecipes(filtered);


}





/* ==========================================
   SEARCH
========================================== */


if(searchInput){


    searchInput.addEventListener(
        "input",
        event=>{


            searchQuery =

            event.target.value
            .trim()
            .toLowerCase();



            applyFilters();


        }
    );


}





/* ==========================================
   CATEGORY BUTTONS
========================================== */


filterButtons.forEach(button=>{


    button.addEventListener(
        "click",
        ()=>{


            filterButtons.forEach(btn=>{

                btn.classList.remove(
                    "active"
                );

            });



            button.classList.add(
                "active"
            );



            selectedCategory =

                button.dataset.cat ||

                "all";



            applyFilters();


        }
    );


});
