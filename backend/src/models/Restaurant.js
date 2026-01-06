const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  image: { type: String },
  cuisine: { type: [String], default: [] },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

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
  isOpen: { type: Boolean, default: true }
}, { timestamps: true });

// 2dsphere index for geo queries (like finding nearby restaurant)
restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);