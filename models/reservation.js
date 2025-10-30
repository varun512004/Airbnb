const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkin: {
        type: Date,
        required: true
    },
    checkout: {
        type: Date,
        required: true
    },
    nights: {
        type: Number,
        required: true
    },
    guests: {
        type: Number,
        default: 1
    },
    basePerNight: {        // price per night before GST
        type: Number,
        required: true
    },
    subtotal: {            // basePerNight * nights (before GST)
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    totalPrice: {          // subtotal + gst
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Reservation", reservationSchema);