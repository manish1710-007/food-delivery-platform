const Product = require('../models/Product');
const mongoose = require('mongoose');


const list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.restaurant) {
      // validate/convert restaurant id to ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.query.restaurant)) {
        return res.status(400).json({ message: 'Invalid restaurant id' });
      }
      filter.restaurant = req.query.restaurant;
    }
    if (req.query.q) {
      // escape user input for regex
      const q = String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: q, $options: 'i' };
    }

    const products = await Product.find(filter).lean();
    return res.json(products);
  } catch (err) {
    next(err);
  }
};


const getOne = async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id).lean();
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    return res.json(prod);
  } catch (err) {
    next(err);
  }
};


const create = async (req, res, next) => {
  try {
    const { restaurant, name, description, price, image, category } = req.body;
    if (!restaurant || !name || price == null) {
      return res.status(400).json({ message: 'restaurant, name, price are required' });
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
    next(err);
  }
};


const update = async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });

    Object.assign(prod, req.body);
    await prod.save();
    return res.json(prod);
  } catch (err) {
    next(err);
  }
};


const remove = async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });

    await prod.deleteOne();
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };
