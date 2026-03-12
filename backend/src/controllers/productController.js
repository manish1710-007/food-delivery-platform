const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET
const list = async (req, res, next) => {
  try {
    const filter = {};
    
    if (req.query.restaurant) {
      // Validate restaurant id to prevent CastErrors
      if (!mongoose.Types.ObjectId.isValid(req.query.restaurant)) {
        return res.status(400).json({ message: 'Invalid restaurant ID format' });
      }
      filter.restaurant = req.query.restaurant;
    }
    
    if (req.query.q) {
      // Escape user input to prevent regex injection attacks
      const q = String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: q, $options: 'i' };
    }

    const products = await Product.find(filter).lean();
    return res.json(products);
    
  } catch (err) {
    console.error("[SYS.ERR] Product list query failed:", err);
    next(err);
  }
};


// GET 
const getOne = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const prod = await Product.findById(req.params.id).lean();
    
    if (!prod) return res.status(404).json({ message: 'Product not found in databank' });
    
    return res.json(prod);
    
  } catch (err) {
    console.error("[SYS.ERR] Product fetch failed:", err);
    next(err);
  }
};


// POST
const create = async (req, res, next) => {
  try {
    const { restaurant, name, description, price, image, category } = req.body;
    
    if (!restaurant || !name || price == null) {
      return res.status(400).json({ message: 'Restaurant, name, and price are required parameters' });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurant)) {
      return res.status(400).json({ message: 'Invalid restaurant ID format' });
    }

    const prod = await Product.create({
      restaurant,
      name,
      description,
      price,
      image,
      category
    });

    return res.status(201).json(prod);
    
  } catch (err) {
    console.error("[SYS.ERR] Product creation failed:", err);
    next(err);
  }
};

// PUT/PATCH /
const update = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found in databank' });

  
    const { name, description, price, image, category } = req.body;
    
    if (name !== undefined) prod.name = name;
    if (description !== undefined) prod.description = description;
    if (price !== undefined) prod.price = price;
    if (image !== undefined) prod.image = image;
    if (category !== undefined) prod.category = category;

    await prod.save();
    return res.json(prod);
    
  } catch (err) {
    console.error("[SYS.ERR] Product update failed:", err);
    next(err);
  }
};


// DELETE
const remove = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found in databank' });

    await prod.deleteOne();
    return res.json({ message: `[${prod.name}] successfully purged from the registry.` });
    
  } catch (err) {
    console.error("[SYS.ERR] Product deletion failed:", err);
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };