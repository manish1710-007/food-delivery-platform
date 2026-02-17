const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },   // snapshot
  price: { type: Number, required: true },  // snapshot
  quantity: { type: Number, required: true, min: 1 }
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
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
      default: 'pending'
    },

    stripeSessionId: String,
    stripePaymentIntentId: String,
    paidAt: Date,

    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
