const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true 
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true 
    },
    items: {
      type: [OrderItemSchema],
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card'],
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: [
        'pending',
        'accepted',
        'preparing',
        'on_the_way',
        'delivered',
        'cancelled'
      ],
      default: 'pending',
      index: true
    },

    // Stripe Telemetry
    stripeSessionId: { type: String, index: true },
    stripePaymentIntentId: String,
    paidAt: Date,

    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// MIDDLEWARE: AUTO-SET PAID_AT
OrderSchema.pre('save', function(next) {
  if (this.isModified('paymentStatus') && this.paymentStatus === 'paid') {
    this.paidAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);