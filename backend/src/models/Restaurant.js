const mongoose = require('mongoose');

const restaurantchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  image: { type: String },
  cuisine: { type: [String], default: [] },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
    
      default: [0, 0] // [longitude, latitude]
    }
  },
  isOpen: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// 2dsphere index for geo queries (like finding nearby restaurant)
restaurantchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantchema);