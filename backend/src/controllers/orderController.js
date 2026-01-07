const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

//calculate total & snapshot product info
const buildOrderItems = async (items) => {
  const productIds = items.map(i => i.product);
  const products = await Product.find({ _id: { $in: productIds } }).lean();

  const productMap = new Map();
  products.forEach(p => productMap.set(String(p._id), p));

  let orderItems = [];
  let total = 0;

  for (const item of items) {
    const prod = productMap.get(String(item.product));
    if (!prod) {
      throw new Error(`Product not found: ${item.product}`);
    }
    const qty = item.quantity || 1;
    const linePrice = prod.price * qty;

    orderItems.push({
      product: prod._id,
      name: prod.name,
      price: prod.price,
      quantity: qty
    });

    total += linePrice;
  }

  return { orderItems, total };
};


//checkout from cart
const checkoutFromCart = async (req, res, next) => {
  try {
    const { restaurant, deliveryAddress, phone, paymentMethod } = req.body;

    if (!restaurant || !deliveryAddress || !phone) {
      return res.status(400).json({ message: 'Missing checkout fields' });
    }

    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalPrice = 0;

    const orderItems = cart.items.map(item => {
      const lineTotal = item.product.price * item.quantity;
      totalPrice += lineTotal;

      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      };
    });

    const order = await Order.create({
      user: req.user._id,
      restaurant,
      items: orderItems,
      totalPrice,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      deliveryAddress,
      phone
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { restaurant, items, paymentMethod, deliveryAddress, phone } = req.body;

    if (!restaurant || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'restaurant and items are required' });
    }

    if (!deliveryAddress || !phone) {
      return res.status(400).json({ message: 'deliveryAddress and phone are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurant)) {
      return res.status(400).json({ message: 'Invalid restaurant id' });
    }

    const { orderItems, total } = await buildOrderItems(items);

    const order = await Order.create({
      user: req.user._id,
      restaurant,
      items: orderItems,
      totalPrice: total,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      deliveryAddress,
      phone
    });

    // delete cart ONLY after success
    await Cart.findOneAndDelete({ user: req.user._id });

    return res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (err) {
    next(err);
  }
};


const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name')
      .populate('user', 'name email')
      .lean();

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // users can only see their own orders; admins/restaurant can see all
    if (
      String(order.user._id) !== String(req.user._id) &&
      req.user.role !== 'admin' &&
      req.user.role !== 'Restaurant'
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(order);
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('restaurant', 'name')
      .lean();
    return res.json(orders);
  } catch (err) {
    next(err);
  }
};

const listOrders = async (req, res, next) => {
  try {
    const filter = {};

    // Restaurant sees only its orders
    if (req.user.role === 'Restaurant') {
      filter.restaurant = req.user.restaurant; // 👈 IMPORTANT
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name phone")
      .populate("restaurant", "name")
      .lean();

    res.json(orders);
  } catch (err) {
    next(err);
  }
};


const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'accepted',
      'preparing',
      'on_the_way',
      'delivered',
      'cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Admin OR restaurant owner
    if (
      req.user.role === 'Restaurant' &&
      String(order.restaurant) !== String(req.user.restaurant)
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        message: `Order already ${order.status}`
      });
    }

    order.status = status;
    await order.save();

    // Emit socket event (non-blocking)
    const io = req.app.get('io');
    if (io) {
      io.to(order._id.toString()).emit('orderUpdated', {
        orderId: order._id,
        status: order.status
      });
    }

    return res.json({
      message: 'Order status updated',
      order
    });
  } catch (err) {
    next(err);
  }
};


// marks order as paid 
const markPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // user can mark their own order paid; admin can mark any
    if (
      String(order.user) !== String(req.user._id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    order.paymentStatus = 'paid';
    await order.save();

    return res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  listOrders,
  updateOrderStatus,
  markPaid,
  checkoutFromCart
};
