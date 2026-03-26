const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET 
const list = async (req, res, next) => {
  try {
    const q = {};
    
    if (req.query.cuisine) {
      q.cuisine = { $in: [req.query.cuisine] };
    }
    
    if (req.query.q) {
      // Escape regex to prevent injection
      const searchStr = String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      q.name = { $regex: searchStr, $options: 'i' };
    }

    const restaurants = await Restaurant.find({ ...q, status: "approved" });
    
    return res.json(restaurants);
  } catch (err) {
    console.error("[SYS.ERR] Restaurant directory query failed:", err);
    next(err);
  }
};


// GET
const getOne = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid node ID format' });
    }

    const rest = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!rest) return res.status(404).json({ message: 'Restaurant not found in databank' });

    let menu = [];
    try {
      menu = await Product.find({ restaurant: rest._id }).limit(500).lean();
    } catch (e) {
      console.warn(`[SYS.WARN] Could not fetch menu for ${rest._id}`);
      menu = [];
    }

    return res.json({ restaurant: rest, menu });
  } catch (err) {
    console.error("[SYS.ERR] Restaurant fetch failed:", err);
    next(err);
  }
};

// POST
const create = async (req, res, next) => {
  try {
    const { name, address, phone, cuisine, image, location, description } = req.body;
    
    if (!name) return res.status(400).json({ message: 'Restaurant name is required' });

    const owner = req.user ? req.user._id : null; 
    
    const status = req.user && req.user.role === 'Admin' ? 'approved' : 'pending';

    const rest = await Restaurant.create({
      owner,
      name,
      description, 
      address,
      phone: phone || "N/A", 
      image,
      cuisine: cuisine ? (Array.isArray(cuisine) ? cuisine : [cuisine]) : ["General"], 
      location: location || undefined,
      status
    });

    res.status(201).json(rest);
  } catch (err) {
    console.error("[SYS.ERR] Restaurant creation failed:", err);
    next(err);
  }
};


// PUT/PATCH
const update = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid node ID format' });
    }

    const rest = await Restaurant.findById(req.params.id);
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });

    // Role verification
    if (req.user && req.user.role === 'Restaurant' && String(rest.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not have clearance for this node' });
    }

    const { name, address, phone, cuisine, image, location } = req.body;
    
    if (name !== undefined) rest.name = name;
    if (address !== undefined) rest.address = address;
    if (phone !== undefined) rest.phone = phone;
    if (image !== undefined) rest.image = image;
    if (location !== undefined) rest.location = location;
    if (cuisine !== undefined) {
      rest.cuisine = Array.isArray(cuisine) ? cuisine : (cuisine ? [cuisine] : []);
    }

    await rest.save();
    return res.json(rest);
  } catch (err) {
    console.error("[SYS.ERR] Restaurant update failed:", err);
    next(err);
  }
};


// DELETE
const remove = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid node ID format' });
    }

    const rest = await Restaurant.findById(req.params.id);
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });

    if (req.user && req.user.role === 'Restaurant' && String(rest.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: Unauthorized deletion attempt' });
    }

    try {
      await Product.deleteMany({ restaurant: rest._id });
    } catch (e) {
      console.warn(`[SYS.WARN] Failed to purge products for ${rest._id}`);
    }

    await rest.deleteOne();
    return res.json({ message: `[${rest.name}] and all associated data purged from the mainframe.` });
  } catch (err) {
    console.error("[SYS.ERR] Restaurant deletion failed:", err);
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };