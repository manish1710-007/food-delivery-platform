const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: [true, 'Product name is required'] },
  description: {
    type: String,
    default: ''
  },  
  price: { type: Number, required: [true, 'Price is required'], min: 0 },

  image: {
    type: String, // cloudinary URL
  },
  
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Pizza', 'Burger', 'Salad', 'Other'],
    ref: "Category",
    required: true
  },

  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
