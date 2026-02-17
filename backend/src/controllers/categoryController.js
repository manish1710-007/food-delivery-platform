const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch(err){
        res.status(500).json({ message: err.message});
    }
};

exports.getCategories = async (req, res) => {

    const categories = await Category.find({
        isActive: true
    });

    res.json(categories);
};

exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(
        req.params.id   
    );

    res.json({ message: "Deleted" });
};