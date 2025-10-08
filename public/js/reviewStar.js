document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star-rating i");
    const ratingInput = document.getElementById("rating-value");

    // initialize first star
    ratingInput.value = 1;
    stars[0].classList.remove("fa-regular");
    stars[0].classList.add("fa-solid", "active", "text-warning");

    stars.forEach((star, index) => {

        // attach animationend listener once
        star.addEventListener("animationend", () => {
            star.classList.remove("animate");
        });

        star.addEventListener("click", () => {
            const rating = parseInt(star.getAttribute("data-value"));
            ratingInput.value = rating;

            // reset all stars
            stars.forEach((s) => {
                s.classList.remove("fa-solid", "active", "animate", "text-warning");
                s.classList.add("fa-regular");
            });

            // activate and animate up to clicked star
            for (let i = 0; i < rating; i++) {
                stars[i].classList.remove("fa-regular");
                stars[i].classList.add("fa-solid", "active", "text-warning", "animate");
            }
        });
    });
});