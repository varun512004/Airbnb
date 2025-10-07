const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
        filename: {
            type: String,
            default: "listingImage",
        },
        url: {
            type: String,
            default:
            "https://static.vecteezy.com/system/resources/thumbnails/031/695/903/small/a-modern-villa-showcasing-open-plan-living-spaces-and-a-private-bedroom-ai-generated-photo.jpg",
            set: (v) =>
                v && v.trim() !== ""
                ? v
                : "https://static.vecteezy.com/system/resources/thumbnails/031/695/903/small/a-modern-villa-showcasing-open-plan-living-spaces-and-a-private-bedroom-ai-generated-photo.jpg",
        },
    },
    price : Number,
    location : String,
    country : String,
    reviews : [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

listingSchema.pre("save", function (next) {
    if (!this.image.filename || this.image.filename === "listingImage") {
    this.image.filename = this.title.trim().toLowerCase().replace(/\s+/g, "_");
    }
    next();
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;