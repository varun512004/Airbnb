const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    // optional: save an icon class to render in UI (e.g. "fa-solid fa-fire")
    iconClass: {
        type: String,
    },
});

module.exports = mongoose.model("Category", categorySchema);