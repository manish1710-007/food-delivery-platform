const router = require('express').Router();
const { authMiddleware, permit, requireApprovedRestaurant } = require('../middlewares/authMiddleware');
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');


// GLOBAL PROTECTION
router.use(authMiddleware, permit("restaurant"), requireApprovedRestaurant);

// RESTAURANT PROFILE MANAGEMENT

// GET My Restaurant Profile
router.get("/my", async (req, res) => {
    const restaurant = await Restaurant.findById(req.user.restaurant);
    res.json(restaurant);       
});

// UPDATE My Restaurant Profile
router.put("/my", async (req, res) => {
    const { name, address, phone, image, cuisine, location } = req.body;
    
    const restaurant = await Restaurant.findByIdAndUpdate(
        req.user.restaurant,
        { name, address, phone, image, cuisine, location },
        { new: true, runValidators: true }
    );
    res.json(restaurant);       
});

// MENU / PRODUCT MANAGEMENT

// GET My Menu
router.get("/menu", async (req, res) => {
    const items = await Product.find({ restaurant: req.user.restaurant });
    res.json(items);       
});

// ADD Item to Menu
router.post("/menu", async (req, res) => {
    const item = await Product.create({
        ...req.body,
        restaurant: req.user.restaurant
    });
    res.status(201).json(item);
});

// UPDATE Item in Menu
router.put("/menu/:id", async (req, res) => {

    const item = await Product.findOneAndUpdate(
        { _id: req.params.id, restaurant: req.user.restaurant }, 
        req.body, 
        { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: "Product not found or unauthorized" });
    res.json(item);
});

// DELETE Item from Menu
router.delete("/menu/:id", async (req, res) => {

    const item = await Product.findOneAndDelete({ 
        _id: req.params.id, 
        restaurant: req.user.restaurant 
    });

    if (!item) return res.status(404).json({ message: "Product not found or unauthorized" });
    res.json({ message: "Item purged from the menu registry." });
});

module.exports = router;