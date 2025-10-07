document.addEventListener("DOMContentLoaded", () => {
    // Get all inputs
    const form = document.querySelector("form.needs-validation");
    const titleInput = document.querySelector("input[name='listing[title]']");
    const descInput = document.querySelector("input[name='listing[description]']");
    const urlInput = document.querySelector("input[name='listing[image][url]']");
    const priceInput = document.querySelector("input[name='listing[price]']");
    const countryInput = document.querySelector("input[name='listing[country]']");
    const locationInput = document.querySelector("input[name='listing[location]']");

    // Validation functions
    const validators = {
        title: (data) => data.trim().length >= 3,
        description: (data) => data.trim().length >= 10,
        filename: (data) => data.trim() !== "",
        url: (data) => {
            const isUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(data);
            const isLocalPath = /^\/?images\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(data);
            return isUrl || isLocalPath;
        },
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
    [titleInput, descInput, urlInput, priceInput, countryInput, locationInput].forEach(input => {
        input.addEventListener("input", () => {
            const fieldName = input.name.split("[").pop().replace("]", "");
            if (validators[fieldName]) {
                applyValidation(input, validators[fieldName](input.value));
            }
        });
    });

    form.addEventListener("submit", (e) => {
        let valid = true;
        if (!validators.title(titleInput.value)) valid = false;
        if (!validators.description(descInput.value)) valid = false;
        if (!validators.url(urlInput.value)) valid = false;
        if (!validators.price(priceInput.value)) valid = false;
        if (!validators.country(countryInput.value)) valid = false;
        if (!validators.location(locationInput.value)) valid = false;

        // Apply classes
        applyValidation(titleInput, validators.title(titleInput.value));
        applyValidation(descInput, validators.description(descInput.value));
        applyValidation(urlInput, validators.url(urlInput.value));
        applyValidation(priceInput, validators.price(priceInput.value));
        applyValidation(countryInput, validators.country(countryInput.value));
        applyValidation(locationInput, validators.location(locationInput.value));

        if (!valid) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});