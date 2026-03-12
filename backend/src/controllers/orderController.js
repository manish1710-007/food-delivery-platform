const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');


// UTILS

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

// CONTROLLERS
const checkoutFromCart = async (req, res, next) => {
  try {
    const { deliveryAddress, phone, paymentMethod } = req.body;

    if (!deliveryAddress || !phone) {
      return res.status(400).json({ message: 'Delivery details missing' });
    }

    // Fetch cart with populated products
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const validItems = cart.items.filter(item => item.product != null);

    if (validItems.length === 0){
  
      await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });
      return res.status(400).json({ message: 'Items in cart are no longer available.' });
    }

    const restaurantId = validItems[0].product.restaurant;

    let totalPrice = 0;
    const orderItems = validItems.map(item => {
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
      restaurant: restaurantId,
      items: orderItems,
      totalPrice,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      deliveryAddress,
      phone
    });

    await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });

    return res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (err) {
    console.error("[SYS.ERR] Checkout Failed:", err);
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

    if (
      String(order.user._id) !== String(req.user._id) &&
      req.user.role !== 'admin' &&
      req.user.role !== 'Restaurant'
    ) {
      return res.status(403).json({ message: 'Forbidden access to order data' });
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
    const { status, paymentStatus, from, to, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (req.user.role === "Restaurant") {
      if (req.query.restaurant && mongoose.Types.ObjectId.isValid(req.query.restaurant)) {
        filter.restaurant = req.query.restaurant;
      }
    }

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    if (search && mongoose.Types.ObjectId.isValid(search)) {
      filter._id = search;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "name")
      .populate("restaurant", "name")
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      orders
    });

  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    
    if (req.user.role === 'Restaurant') {
      if (!req.user.restaurant || String(order.restaurant) !== String(req.user.restaurant)) {
         return res.status(403).json({ message: 'Forbidden: You do not own this order' });
      }
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: `Order already marked as ${order.status}` });
    }

    order.status = status;
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(order._id.toString()).emit('orderUpdated', {
        orderId: order._id,
        status: order.status
      });
    }

    return res.json({ message: 'Order status updated', order });
  } catch (err) {
    next(err);
  }
};

const markPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
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