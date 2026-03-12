const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Cart = require("../models/Cart");
const Order = require("../models/Order");

exports.createCheckoutSession = async (req, res) => {
  try {
  
    const { deliveryAddress, phone } = req.body;

    if (!deliveryAddress || !phone) {
      return res.status(400).json({ message: "Missing checkout fields" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const validItems = cart.items.filter(item => item.product != null);
    
    if (validItems.length === 0) {
        await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });
        return res.status(400).json({ message: "Items in cart are no longer available." });
    }

    const restaurantId = validItems[0].product.restaurant;

    // Build order items
    let totalPrice = 0;
    const orderItems = validItems.map(item => {
      totalPrice += item.product.price * item.quantity;

      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      };
    });

    // Create Order FIRST
    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId, // Secure ID
      items: orderItems,
      totalPrice,
      paymentMethod: "card",
      paymentStatus: "pending",
      status: "pending",
      deliveryAddress,
      phone
    });

    // Clear the cart now that the official order exists in the mainframe
    await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });

    // Stripe line items
    const lineItems = orderItems.map(item => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name
        },
        // Prevent float precision crashes in Stripe
        unit_amount: Math.round(item.price * 100) 
      },
      quantity: item.quantity
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order-success/${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    res.json({
      url: session.url,
      orderId: order._id
    });

  } catch (err) {
    console.error("[SYS.ERR] Stripe session failed:", err);
    res.status(500).json({ message: "Payment gateway uplink failed" });
  }
};


// STRIPE WEBHOOK LISTENER
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[SYS.ERR] Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Payment success
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        console.error("[SYS.ERR] Order not found in database:", orderId);
        return res.json({ received: true });
      }

      order.paymentStatus = "paid";
      order.status = "accepted"; // Auto-accept paid orders

      await order.save();
      console.log(`[SYS.LOG] Order ${orderId} payment secured.`);

      // Socket emit to update frontend instantly
      const io = req.app.get("io");
      if (io) {
        io.to(orderId).emit("orderUpdated", {
          orderId,
          status: order.status,
          paymentStatus: order.paymentStatus
        });
      }

    } catch (err) {
      console.error("[SYS.ERR] Webhook DB error:", err);
    }
  }

  res.json({ received: true });
};