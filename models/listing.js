const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/thumbnails/031/695/903/small/a-modern-villa-showcasing-open-plan-living-spaces-and-a-private-bedroom-ai-generated-photo.jpg"
        },
    price : Number,
    location : String,
    country : String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;