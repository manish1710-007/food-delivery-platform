const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product'); // to return menu on getOne (if product model exists)

// List restaurant (public) with optional filters: q (text), cuisine
const list = async (req, res, next) => {
  try {
    const q = {};
    if (req.query.cuisine) q.cuisine = { $in: [req.query.cuisine] };
    if (req.query.q) q.name = { $regex: req.query.q, $options: 'i' };

    const restaurant = await Restaurant.find({ status: "approved" });
    return res.json(restaurant);
  } catch (err) {
    next(err);
  }
};

// Get a single restaurant + its menu (public)
const getOne = async (req, res, next) => {
  try {
    const rest = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });

    let menu = [];
    try {
      menu = await Product.find({ restaurant: rest._id, available: true }).limit(500).lean();
    } catch (e) {
      // If product model or collection missing, ignore and return empty menu
      menu = [];
    }

    return res.json({ restaurant: rest, menu });
  } catch (err) {
    next(err);
  }
};

// Create a restaurant 
const create = async (req, res, next) => {
  try {
    const { name, address, phone, cuisine, image, location } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const owner = req.user ? req.user._id : null; // requires auth middleware
    const rest = await Restaurant.create({
      owner,
      name,
      address,
      phone,
      image,
      cuisine: Array.isArray(cuisine) ? cuisine : (cuisine ? [cuisine] : []),
      location: location || undefined
    });

    res.status(201).json(rest);
  } catch (err) {
    next(err);
  }
};

// Update restaurant 
const update = async (req, res, next) => {
  try {
    const rest = await Restaurant.findById(req.params.id);
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });

    // If the user is a 'Restaurant' role, ensure they own it
    if (req.user && req.user.role === 'Restaurant' && String(rest.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // apply updates
    Object.assign(rest, req.body);
    await rest.save();
    return res.json(rest);
  } catch (err) {
    next(err);
  }
};

// Delete restaurant 
const remove = async (req, res, next) => {
  try {
    const rest = await Restaurant.findById(req.params.id);
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });

    if (req.user && req.user.role === 'Restaurant' && String(rest.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // optional: remove products for this restaurant
    try {
      await Product.deleteMany({ restaurant: rest._id });
    } catch (e) {
      // ignore if Product doesn't exist
    }

    await rest.deleteOne();
    return res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };
