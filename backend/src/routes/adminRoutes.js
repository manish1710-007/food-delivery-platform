const router = require('express').Router();
const { authMiddleware, permit } = require("../middlewares/authMiddleware");
const adminCtrl = require("../controllers/adminController");
const upload = require("../middlewares/upload");
router.use(authMiddleware, permit("admin"));

const Restaurant = require("../models/Restaurant");


// GET all restaurants
router.get(
  "/restaurants",
  authMiddleware,
  permit("admin"),
  adminCtrl.listRestaurants,
  async (req, res) => {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  }
);


// CREATE restaurant
router.post(
  "/restaurants",
  authMiddleware,
  permit("admin"),
  adminCtrl.createRestaurant,
  async (req, res) => {

    const restaurant = await Restaurant.create(req.body);

    res.json(restaurant);
  }
);


// UPDATE restaurant
router.put(
  "/restaurants/:id",
  authMiddleware,
  permit("admin"),
  async (req, res) => {

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(restaurant);
  }
);


// DELETE restaurant
router.delete(
  "/restaurants/:id",
  authMiddleware,
  permit("admin"),
  async (req, res) => {

    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  }
);

router.patch(
  "/restaurants/:id/toggle",
  authMiddleware,
  permit("admin"),
  adminCtrl.toggleRestaurantActive,
);

// Restaurants
router.post("/restaurants", adminCtrl.createRestaurant);
router.get("/restaurants", adminCtrl.getAllRestaurants);
router.patch("/restaurants/:id/approve", adminCtrl.approveRestaurant);

// Products
router.post("/products", adminCtrl.createProduct);
router.get("/products", adminCtrl.getAllProducts);

//Admin Analytics
router.get(
    "/analytics",
    authMiddleware,
    permit("admin"),
    adminCtrl.getAnalytics
);
//Manage Users

router.get("/stats", authMiddleware, permit("admin"), adminCtrl.stats);
router.get("/users", authMiddleware, permit("admin"), adminCtrl.listUsers);
router.get("/restaurants", authMiddleware, permit("admin"), adminCtrl.listRestaurants);
router.get("/orders", authMiddleware, permit("admin"), adminCtrl.listOrders);
router.get("/analytics/export", authMiddleware, permit("admin"), adminCtrl.exportAnalyticsToCSV);
router.patch("/users/:id/role", authMiddleware, permit("admin"), adminCtrl.updateUserRole);
router.get("/restaurants/pending", authMiddleware, permit("admin"), adminCtrl.getPendingRestaurants);
router.patch("/restaurants/:id/status", authMiddleware, permit("admin"), adminCtrl.updateRestaurantStatus);
router.post("/products", upload.single("image"), adminCtrl.createProductWithImage);
router.get("/payment-analytics", authMiddleware, permit("admin"), adminCtrl.getPaymentAnalytics);
router.get("/restaurants/:id", authMiddleware, permit("admin"), adminCtrl.getRestaurantById);
router.put("/restaurants/:id", authMiddleware, permit("admin"), adminCtrl.updateRestaurant);
router.delete("/restaurants/:id", authMiddleware, permit("admin"), adminCtrl.deleteRestaurant);
router.patch("/restaurants/:id/toggle-active", authMiddleware, permit("admin"), adminCtrl.toggleRestaurantActive);
module.exports = router;
