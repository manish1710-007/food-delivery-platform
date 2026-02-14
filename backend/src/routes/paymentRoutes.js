const router = require("express").Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

const paymentCtrl =
  require("../controllers/paymentController");

router.post(
  "/create-checkout-session",
  authMiddleware,
  paymentCtrl.createCheckoutSession
);

module.exports = router;
