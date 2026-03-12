const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required for registry"],
        unique: true,
        trim: true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() 
    },

    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000" // Fallback data
    },

    description: {
        type: String,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true
    }

}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// VIRTUAL: PRODUCT COUNT
module.exports = mongoose.model("Category", categorySchema);