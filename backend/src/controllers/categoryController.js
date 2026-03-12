const Category = require("../models/Category");


// POST
exports.createCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: "Category name is required for registry" });
        }

        const category = await Category.create(req.body);
        res.status(201).json(category);

    } catch(err) {
        console.error("[SYS.ERR] Category creation failed:", err);
        res.status(500).json({ message: "Failed to write category to databank" });
    }
};


// GET 
exports.getCategories = async (req, res) => {
    try { 
        const categories = await Category.find({
            isActive: true
        }).sort({ createdAt: -1 }); 

        res.json(categories);

    } catch (err) {
        console.error("[SYS.ERR] Category fetch failed:", err);
        res.status(500).json({ message: "Error fetching categories from databank" });
    }
};


// DELETE
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found in registry" });
        }

        res.json({ message: `[${deletedCategory.name}] purged from databank` });

    } catch (err) {
        console.error("[SYS.ERR] Category deletion failed:", err);
        res.status(500).json({ message: "Error purging category" });
    }
};