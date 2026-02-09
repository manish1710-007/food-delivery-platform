const router = require('express').Router();
const { authMiddleware, permit } = require('../middlewares/authMiddleware');
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');

// Get my restaurant
router.put("/my", authMiddleware, permit("restaurant"), async (req, res) => {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    res.json(restaurant);       
});

// Update my restaurant
router.put("/my", authMiddleware, permit("restaurant"), async (req, res) => {
    const restaurant = await Restaurant.findOneAndUpdate(
        { owner: req.user._id },
        req.body,
        { new: true }
    );
    res.json(restaurant);       
});

// get my menu
router.get("/menu", authMiddleware, permit("restaurant"), async (req, res) => {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    const items = await Product.find({ restaurant: restaurant._id });
    res.json(items);       
});

// add item 
router.post("/menu", authMiddleware, permit("restaurant"), async (req, res) => {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    const item = await Product.create({
        ...req.body,
        restaurant: restaurant._id
    });
    res.status(201).json(item);
});

// update item
router.put("/menu/:id", authMiddleware, permit("restaurant"), async (req, res) => {
    const item = await Product.findOneAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
});

// delete item
router.delete("/menu/:id", authMiddleware, permit("restaurant"), async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
});

module.exports = router;    