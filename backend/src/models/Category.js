const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    image: {
        type: String,
    },

    description: {
        type: String,
    },

    isActive: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);