const Listing = require("../models/listing");
const Reservation = require("../models/reservation");

// Step 1 — Show confirmation page (billing summary)
module.exports.reservationDetails = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/");
    }

    const { checkin, checkout, guests } = req.body;
    // validate
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    if (isNaN(checkinDate) || isNaN(checkoutDate) || checkoutDate <= checkinDate) {
        req.flash("error", "Invalid dates. Checkout must be after check-in.");
        return res.redirect(`/${id}`);
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkoutDate - checkinDate) / msPerDay);

    const guestCount = Math.max(1, Number(guests) || 1);
    const base = Number(listing.price) || 0;
    const surcharge = base * 0.2 * Math.max(0, guestCount - 1);
    const basePerNight = Number((base + surcharge).toFixed(2));

    const subtotal = Number((basePerNight * nights).toFixed(2));
    const gst = Number((subtotal * 0.18).toFixed(2));
    const totalPrice = Number((subtotal + gst).toFixed(2));

    // Pass a reservationData object to the view (not saved yet)
    const reservationData = {
        checkin: checkinDate,
        checkout: checkoutDate,
        guests: guestCount,
        nights,
        basePerNight,
        subtotal,
        gst,
        totalPrice
    };

    res.render("reservations/confirmReservation.ejs", { listing, reservationData });
    };

    // Step 2 — Confirm reservation (save to DB)
    module.exports.confirmReservation = async (req, res) => {
    try {
        const { id } = req.params; // listing id
        const listing = await Listing.findById(id);
        if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/");
        }

        // read hidden fields from the form
        const { checkin, checkout, guests, nights, basePerNight, subtotal, gst, totalPrice, name, email, phone } = req.body;

        // Create reservation record
        const reservation = new Reservation({
        listing: listing._id,
        user: req.user._id,
        checkin: new Date(checkin),
        checkout: new Date(checkout),
        nights: Number(nights),
        guests: Number(guests),
        basePerNight: Number(basePerNight),
        subtotal: Number(subtotal),
        gst: Number(gst),
        totalPrice: Number(totalPrice)
        });

        await reservation.save();

        // optional: add ref to listing (if you added reservations array)
        listing.reservations = listing.reservations || [];
        listing.reservations.push(reservation._id);
        await listing.save();

        req.flash("success", "Reservation confirmed!");
        res.redirect(`/${listing._id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not confirm reservation.");
        res.redirect("/");
    }
};