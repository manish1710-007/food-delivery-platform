const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'A restaurant must be linked to a system user (Owner)'],
    index: true
  },
  name: { 
    type: String, 
    required: [true, 'Restaurant name is required'],
    trim: true,
    index: true
  },
  description: { type: String, trim: true },
  address: { type: String, trim: true },
  phone: { type: String, trim: true },
  image: { 
    type: String, 
    default: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000" 
  },
  cuisine: { 
    type: [String], 
    default: [],
    set: (tags) => tags.map(t => t.toLowerCase().trim()) 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending",
    index: true
  },
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
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 2dsphere index for geo-spatial queries
restaurantSchema.index({ location: '2dsphere' });

// VIRTUAL: MENU UPLINK
restaurantSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'restaurant'
});

module.exports = mongoose.model('Restaurant', restaurantSchema);