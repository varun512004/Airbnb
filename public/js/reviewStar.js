document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star-rating i");
    const ratingInput = document.getElementById("rating-value");

    ratingInput.value = 1;
    stars[0].classList.remove("fa-regular");
    stars[0].classList.add("fa-solid", "text-warning");
    stars.forEach((star) => {
        star.addEventListener("click", () => {
        const rating = parseInt(star.getAttribute("data-value"));
        ratingInput.value = rating;

        // reset all
        stars.forEach((s) => {
            s.classList.remove("fa-solid", "active");
            s.classList.add("fa-regular");
        });

        // activate up to clicked star
        for (let i = 0; i < rating; i++) {
            stars[i].classList.remove("fa-regular");
            stars[i].classList.add("fa-solid", "active");
        }
        });
    });
});