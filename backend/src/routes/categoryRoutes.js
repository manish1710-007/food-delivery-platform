const router = require("express").Router();

const {
    createCategory,
    getCategories,
    deleteCategory
} = require("../controllers/categoryController");

const { authMiddleware, permit } = require("../middlewares/authMiddleware");

router.get("/", getCategories);

router.post("/", authMiddleware, permit("admin"), createCategory);

router.delete("/:id", authMiddleware, permit("admin"), deleteCategory);

module.exports = router;