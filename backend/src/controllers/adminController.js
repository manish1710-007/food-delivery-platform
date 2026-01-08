const { Parser } = require("json2csv");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");


// Restaurants 

const createRestaurant = async (req, res) => {
  const { name, address } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Restaurant name required" });
  }

  const restaurant = await Restaurant.create({
    name, 
    address,
    isApproved: false
  });

  res.status(201).json({
    message: "Restaurant created, pending approval",
  });
};

const getAllRestaurants = async (req, res) => {
  const restaurants = (await Restaurant.find()).sort({ createdAt: -1 });
  res.json(restaurants);
};

const approveRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant){
    return res.status(404).json({ message: "Restaurant not found" });
  }

  restaurant.isApproved = true;
  await restaurant.save();

  res.json({
    message: "Restaurant approved",
    restaurant
  });
};

// Products

const createProduct = async (req, res) => {
  const { restaurant, name, price, category } = req.body;

  if (!restaurant || !name || price == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const product = await Product.create({
    restaurant, 
    name, 
    price,
    category  
  });

  res.status(201).json({
    message: "Product added",
    product  
  });
};

const getAllProducts = async (req, res) => {
  const product = await Product.find().populate("restaurant", "name").sort({ createdAt: -1 });

  res.json(products);

};

// List pending restaurants
const getPendingRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find({ status: "pending" }).populate("owner", "name email");
  res.json(restaurants);
};

// Approve / Reject restaurant
 const updateRestaurantStatus = async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  restaurant.status = status;
  restaurant.approvedAt = new Date();
  restaurant.approvedBy = req.user._id;

  await restaurant.save();

  res.json({ 
    message: 'Restaurant ${status}',
    restaurant
  });
};

const exportAnalyticsToCSV = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("restaurant", "name").lean();

    const csvData = orders.map((o) => ({
      OrderID: o._id,
      UserName: o.user.name || "N/A",
      email: o.user?.email || "N/A",
      restaurant: o.restaurant?.name || "N/A",
      total: o.totalPrice,
      paymentStatus: o.paymentStatus,
      status: o.status,
      createdAt: o.createdAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("analytics.csv");
    return res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "CSV export failed"})
  }
};  

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

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const allowed = ["user", "restaurant", "admin"];

  if (!allowed.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true },
  ).select("-password");

  res.json(user);
};

module.exports = {
  getAnalytics,
  stats,
  listUsers,
  listRestaurants,
  listOrders,
  exportAnalyticsToCSV,
  updateUserRole,
  getPendingRestaurants,
  updateRestaurantStatus,
  createRestaurant,
  getAllRestaurants,
  approveRestaurant,
  createProduct,
  getAllProducts
};
