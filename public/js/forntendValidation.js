document.addEventListener("DOMContentLoaded", () => {
    // Get all inputs
    const titleInput = document.querySelector("input[name='listing[title]']");
    const descInput = document.querySelector("input[name='listing[description]']");
    const fileInput = document.querySelector("input[name='listing[image][filename]']");
    const urlInput = document.querySelector("input[name='listing[image][url]']");
    const priceInput = document.querySelector("input[name='listing[price]']");
    const countryInput = document.querySelector("input[name='listing[country]']");
    const locationInput = document.querySelector("input[name='listing[location]']");

    // Validation functions
    const validators = {
        title: (data) => data.trim().length >= 3,
        description: (data) => data.trim().length >= 10,
        filename: (data) => data.trim() !== "",
        url: (data) => /^https:\/\/.+/i.test(data),
        // url: (data) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(data),
        // url: (data) => /^\/?images\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(data),
        // url: (data) => {
        //     const isUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(data);
        //     const isLocalPath = /^\/?images\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(data);
        //     return isUrl || isLocalPath;
        // },
        price: (data) => /^[0-9]+(\.[0-9]{1,2})?$/.test(data) && Number(data) > 0,
        country: (data) => /^[A-Za-z\s]+$/.test(data) && data.trim().length >= 2,
        location: (data) => data.trim().length >= 2
    };

    // Function to toggle classes
    function applyValidation(input, isValid) {
        if (isValid) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        }
    }

    // Add listeners
    titleInput.addEventListener("keyup", () => applyValidation(titleInput, validators.title(titleInput.value)));
    descInput.addEventListener("keyup", () => applyValidation(descInput, validators.description(descInput.value)));
    fileInput.addEventListener("keyup", () => applyValidation(fileInput, validators.filename(fileInput.value)));
    urlInput.addEventListener("keyup", () => applyValidation(urlInput, validators.url(urlInput.value)));
    priceInput.addEventListener("keyup", () => applyValidation(priceInput, validators.price(priceInput.value)));
    countryInput.addEventListener("keyup", () => applyValidation(countryInput, validators.country(countryInput.value)));
    locationInput.addEventListener("keyup", () => applyValidation(locationInput, validators.location(locationInput.value)));
});