const router = require("express").Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const paymentCtrl = require("../controllers/paymentController");

// USER PAYMENT UPLINK

/**
 * @route   POST /api/payment/create-checkout-session
 * @desc    Initialize a Stripe session and return the redirect URL
 * @access  Private (User/Customer)
 */
router.post(
  "/create-checkout-session",
  authMiddleware,
  paymentCtrl.createCheckoutSession
);

module.exports = router;