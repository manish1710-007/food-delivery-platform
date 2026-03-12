const { Parser } = require("json2csv");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

const Product = require("../models/Product");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2; 


// RESTAURANTS
const createRestaurant = async (req, res) => {
  try {
    const { name, description, image, address, phone, owner } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Restaurant name is required" });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      image,
      address,
      phone,
      owner,
      status: "approved", // admin auto-approval
      isActive: true
    });

    res.status(201).json({ message: "Restaurant created successfully", restaurant });
  } catch (err) {
    console.error("Create restaurant error:", err);
    res.status(500).json({ message: "Failed to create restaurant" });
  }
};
  
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant){
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.isApproved = true;
    await restaurant.save();

    res.json({ message: "Restaurant approved", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};

const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: "pending" }).populate("owner", "name email");
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending restaurants" });
  }
};

const updateRestaurantStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    
    restaurant.approvedAt = new Date();
    restaurant.approvedBy = req.user._id;

    await restaurant.save();

    res.json({ message: `Restaurant ${status}`, restaurant });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

const listRestaurants = async (req, res) => {
  try{
    const restaurants = await Restaurant.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("owner", "name email");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant updated successfully", restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update Failed" });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Deletion Failed" });
  }
};

const toggleRestaurantActive = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();
    res.json({ message: "Restaurant status toggled", restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Toggle failed" });
  }
};


// PRODUCTS
const createProduct = async (req, res) => {
  try {
    const { restaurant, name, price, category } = req.body;

    if (!restaurant || !name || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({ restaurant, name, price, category });

    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("restaurant", "name").sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const createProductWithImage = async (req, res) => {
  try {
    const { name, price, restaurant, category } = req.body;

    if (!name || !price || !restaurant) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let imageUrl = "";

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: "food-products" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Image upload failed" });
          }
          imageUrl = result.secure_url;

          const product = await Product.create({
            name, price, restaurant, category, image: imageUrl
          });

          res.status(201).json({ message: "Product created with image", product });
        }
      );
      uploadResult.end(req.file.buffer);
    } else {
      const product = await Product.create({ name, price, restaurant, category });
      res.status(201).json({ message: "Product created (no image)", product });
    }
  } catch (err){
    console.error(err);
    res.status(500).json({ message: "Product creation failed" });
  }
};


// USERS & ORDERS
const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ["user", "restaurant", "admin"];

    if (!allowed.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("restaurant", "name");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


// ANALYTICS & EXPORTS
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


const getPaymentAnalytics = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
    ]);

    const revenueByDay = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const paymentMethods = await Order.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.revenue || 0,
      revenueByDay,
      paymentMethods
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics error" });
  }
};

const exportAnalyticsToCSV = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("restaurant", "name").lean();

    const csvData = orders.map((o) => ({
      OrderID: o._id,
      UserName: o.user?.name || "N/A",
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
    res.status(500).json({ message: "CSV export failed" });
  }
};  

const stats = async (req, res) => {
  res.json({ message: "Admin stats placeholder" });
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
  getAllProducts,
  createProductWithImage,
  getPaymentAnalytics,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantActive
};