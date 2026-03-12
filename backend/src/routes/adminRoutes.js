const router = require('express').Router();
const { authMiddleware, permit } = require("../middlewares/authMiddleware");
const adminCtrl = require("../controllers/adminController");
const upload = require("../middlewares/upload");

// GLOBAL ADMIN LOCK

router.use(authMiddleware, permit("admin"));


// RESTAURANT MANAGEMENT
router.get("/restaurants", adminCtrl.listRestaurants);
router.post("/restaurants", adminCtrl.createRestaurant);
router.get("/restaurants/pending", adminCtrl.getPendingRestaurants);
router.get("/restaurants/:id", adminCtrl.getRestaurantById);
router.put("/restaurants/:id", adminCtrl.updateRestaurant);
router.delete("/restaurants/:id", adminCtrl.deleteRestaurant);

// Status & Approval Toggles
router.patch("/restaurants/:id/status", adminCtrl.updateRestaurantStatus);
router.patch("/restaurants/:id/toggle-active", adminCtrl.toggleRestaurantActive);
router.patch("/restaurants/:id/approve", adminCtrl.approveRestaurant); // Legacy support

// PRODUCT MANAGEMENT
router.get("/products", adminCtrl.getAllProducts);

router.post("/products", upload.single("image"), adminCtrl.createProductWithImage)
router.post("/products/basic", adminCtrl.createProduct);


// USER & ORDER MANAGEMENT
router.get("/users", adminCtrl.listUsers);
router.patch("/users/:id/role", adminCtrl.updateUserRole);
router.get("/orders", adminCtrl.listOrders);

// ANALYTICS & STATS
router.get("/stats", adminCtrl.stats);
router.get("/analytics", adminCtrl.getAnalytics);
router.get("/payment-analytics", adminCtrl.getPaymentAnalytics);
router.get("/analytics/export", adminCtrl.exportAnalyticsToCSV);

module.exports = router;