// Prevent selecting past dates
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin').setAttribute('min', today);
document.getElementById('checkout').setAttribute('min', today);

// Make checkout at least 1 day after checkin
document.getElementById('checkin').addEventListener('change', function() {
    const checkinDate = new Date(this.value);
    checkinDate.setDate(checkinDate.getDate() + 1);
    document.getElementById('checkout').setAttribute('min', checkinDate.toISOString().split('T')[0]);
});

let guestCount = 1;
const maxGuests = 5; // You can change this limit if you want

const guestCountDisplay = document.getElementById("guestCount");
const guestInput = document.getElementById("guests");
const decreaseBtn = document.getElementById("decreaseGuests");
const increaseBtn = document.getElementById("increaseGuests");

increaseBtn.addEventListener("click", () => {
    if (guestCount < maxGuests) {
        guestCount++;
        guestCountDisplay.textContent = guestCount;
        guestInput.value = guestCount;
        updatePrice();
    }
});

decreaseBtn.addEventListener("click", () => {
    if (guestCount > 1) {
        guestCount--;
        guestCountDisplay.textContent = guestCount;
        guestInput.value = guestCount;
        updatePrice();
    }
});