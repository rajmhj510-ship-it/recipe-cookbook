
(() => {

"use strict";


/* ==========================================
   ELEMENTS
========================================== */

const track =
    document.querySelector(".carousel-track");


const leftArrow =
    document.querySelector(".nav-arrow.left");


const rightArrow =
    document.querySelector(".nav-arrow.right");


const titleEl =
    document.querySelector(".hero-recipe-title");


const metaEl =
    document.querySelector(".recipe-meta");


const scrollBtn =
    document.querySelector(".scroll-down");


const exploreSection =
    document.getElementById("explore");


/* ==========================================
   STATE
========================================== */

let carouselRecipes = [];

let carouselCards = [];

let currentIndex = 0;

let isAnimating = false;

let autoSlide = null;

let eventsAttached = false;


const AUTO_TIME = 3000;


const BASE_PATH =
    window.location.pathname.includes("recipe-cookbook")
        ? "/recipe-cookbook/"
        : "./";


const isRecipePage =
    window.location.pathname.includes("recipe.html");



/* ==========================================
   RECEIVE DATA FROM HOME.JS

   home.js calls:

   window.initCarousel(recipes)

========================================== */


window.initCarousel = function(recipes){


    if(!track)
        return;


    if(!recipes || !recipes.length)
        return;


    carouselRecipes =
        [...recipes];


    createCarousel();


    updateCarousel(0);


    if(!isRecipePage)
        startAutoSlide();


};



/* ==========================================
   CREATE CAROUSEL
========================================== */


function createCarousel(){


    if(!track)
        return;


    track.innerHTML = "";


    carouselRecipes.forEach((recipe,index)=>{


        const card =
            document.createElement("div");


        card.className =
            "card";



        const image =
            recipe.image
                ? BASE_PATH + recipe.image
                : BASE_PATH +
                  "assets/images/logo.png";



        card.innerHTML = `

            <img

                src="${image}"

                alt="${recipe.title}"

                loading="eager"

                onerror="
                this.src='${BASE_PATH}assets/images/logo.png'
                "

            >

        `;



        card.addEventListener(
            "click",
            ()=>{


                if(index === currentIndex){


                    window.location.href =

                        BASE_PATH +

                        "recipe.html?file=" +

                        encodeURIComponent(
                            recipe.file
                        );


                    return;

                }



                updateCarousel(index);


            }
        );


        track.appendChild(card);


    });



    carouselCards =
        [
            ...track.querySelectorAll(".card")
        ];



    attachCarouselEvents();


}



/* ==========================================
   EVENTS
========================================== */


function attachCarouselEvents(){


    if(eventsAttached)
        return;



    const container =
        document.querySelector(
            ".carousel-container"
        );



    container?.addEventListener(

        "mouseenter",

        stopAutoSlide

    );



    container?.addEventListener(

        "mouseleave",

        startAutoSlide

    );



    eventsAttached = true;


}



/* ==========================================
   UPDATE CAROUSEL
========================================== */


function updateCarousel(index){


    if(

        isAnimating ||

        !carouselCards.length

    )

        return;



    isAnimating = true;



    currentIndex =

        (

            index +

            carouselRecipes.length

        )

        %

        carouselRecipes.length;




    carouselCards.forEach(
        (card,i)=>{


            const offset =

                (

                    i -

                    currentIndex +

                    carouselRecipes.length

                )

                %

                carouselRecipes.length;



            card.className =
                "card";



            switch(offset){


                case 0:

                    card.classList.add(
                        "center"
                    );

                    break;



                case 1:

                    card.classList.add(
                        "right-1"
                    );

                    break;



                case 2:

                    card.classList.add(
                        "right-2"
                    );

                    break;



                case carouselRecipes.length - 1:

                    card.classList.add(
                        "left-1"
                    );

                    break;



                case carouselRecipes.length - 2:

                    card.classList.add(
                        "left-2"
                    );

                    break;



                default:


                    card.classList.add(
                        "hidden"
                    );


            }


        }

    );



    const recipe =
        carouselRecipes[currentIndex];



    if(titleEl)

        titleEl.textContent =
            recipe.title;



    if(metaEl)

        metaEl.textContent =

            `${recipe.time} • ${recipe.difficulty}`;



    setTimeout(()=>{

        isAnimating = false;

    },700);



}



/* ==========================================
   AUTO SLIDE
========================================== */


function startAutoSlide(){


    if(isRecipePage)
        return;



    stopAutoSlide();



    autoSlide =

        setInterval(()=>{


            updateCarousel(
                currentIndex + 1
            );


        },AUTO_TIME);


}



function stopAutoSlide(){


    if(!autoSlide)
        return;



    clearInterval(autoSlide);


    autoSlide = null;


}



/* ==========================================
   VISIBILITY
========================================== */


document.addEventListener(
    "visibilitychange",
    ()=>{


        if(document.hidden)

            stopAutoSlide();


        else

            startAutoSlide();


    }
);



/* ==========================================
   SCROLL BUTTON
========================================== */


scrollBtn?.addEventListener(
    "click",
    ()=>{


        exploreSection?.scrollIntoView({

            behavior:"smooth"

        });


    }
);



/* ==========================================
   STOP WHEN EXPLORE VISIBLE
========================================== */


window.addEventListener(
    "scroll",
    ()=>{


        if(!exploreSection)
            return;



        const rect =

            exploreSection.getBoundingClientRect();



        const visible =

            rect.top < window.innerHeight &&

            rect.bottom > 0;



        if(visible)

            stopAutoSlide();


        else

            startAutoSlide();



    }
);




/* ==========================================
   ARROWS
========================================== */


leftArrow?.addEventListener(
    "click",
    ()=>{


        updateCarousel(
            currentIndex - 1
        );


    }
);



rightArrow?.addEventListener(
    "click",
    ()=>{


        updateCarousel(
            currentIndex + 1
        );


    }
);




/* ==========================================
   KEYBOARD
========================================== */


document.addEventListener(
    "keydown",
    e=>{


        if(e.key === "ArrowLeft")

            updateCarousel(
                currentIndex - 1
            );



        if(e.key === "ArrowRight")

            updateCarousel(
                currentIndex + 1
            );


    }
);



})();
