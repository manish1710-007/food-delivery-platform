const Order = require("../models/Order");

const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const topRestaurants = await Order.aggregate([
      {
        $group: {
          _id: "$restaurant",
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name")
      .populate("restaurant", "name");

    res.json({
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      ordersByStatus,
      topRestaurants,
      recentOrders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics error" });
  }
};

const listUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

const listRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

const listOrders = async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("restaurant", "name");
  res.json(orders);
};

const stats = async (req, res) => {
  res.json({ message: "Admin stats placeholder" });
};

module.exports = {
  getAnalytics,
  stats,
  listUsers,
  listRestaurants,
  listOrders
};
