const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true,
    index: true
  },
  
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true 
  },

  description: {
    type: String,
    default: '',
    trim: true
  },  

  price: { 
    type: Number, 
    required: [true, 'Price is required'], 
    min: [0, 'Price cannot be negative'] 
  },

  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000"
  },
  
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category",
    required: [true, 'Category assignment is required']
  },

  available: { 
    type: Boolean, 
    default: true,
    index: true 
  }
}, { 
  timestamps: true 
});


// MIDDLEWARE: CLEANUP LOGIC
module.exports = mongoose.model('Product', ProductSchema);