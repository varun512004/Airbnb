let taxSwitch = document.getElementById("switchCheckDefault");
if(taxSwitch){
    taxSwitch.addEventListener("click", () => {
        let taxInfo = document.getElementsByClassName("tax-info-gst-info");
        let taxIncluded = document.getElementsByClassName("tax-info-included-info");
        let priceElements = document.querySelectorAll(".price-amount");

        for (let i = 0; i < priceElements.length; i++) {
            let el = priceElements[i];
            let basePrice = parseFloat(el.getAttribute("data-base-price")); // stored original price

            if (taxSwitch.checked) {
                // Add 18% GST
                let finalPrice = Math.round(basePrice * 1.18);
                el.textContent = finalPrice.toLocaleString("en-IN");
                taxInfo[i].style.display = "none";
                taxIncluded[i].style.display = "inline";
            } else {
                // Show base price
                el.textContent = basePrice.toLocaleString("en-IN");
                taxInfo[i].style.display = "inline";
                taxIncluded[i].style.display = "none";
            }
        }
    });
}