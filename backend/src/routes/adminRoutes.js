const router = require('express').Router();
const { authMiddleware, permit } = require("../middlewares/authMiddleware");
const adminCtrl = require("../controllers/adminController");


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

module.exports = router;
