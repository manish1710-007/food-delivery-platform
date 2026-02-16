const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Cart = require("../models/Cart");
const Order = require("../models/Order");

exports.createCheckoutSession = async (req, res) => {
  try {

    const { deliveryAddress, phone, restaurant } = req.body;

    if (!deliveryAddress || !phone || !restaurant) {
      return res.status(400).json({
        message: "Missing checkout fields"
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    // Build order items
    let totalPrice = 0;

    const orderItems = cart.items.map(item => {

      totalPrice += item.product.price * item.quantity;

      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      };
    });

    // ✅ Create Order FIRST
    const order = await Order.create({

      user: req.user._id,

      restaurant,

      items: orderItems,

      totalPrice,

      paymentMethod: "card",

      paymentStatus: "pending",

      deliveryAddress,

      phone

    });

    // Stripe line items
    const lineItems = orderItems.map(item => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      line_items: lineItems,

      mode: "payment",

      success_url:
        `${process.env.CLIENT_URL}/order-success/${order._id}`,

      cancel_url:
        `${process.env.CLIENT_URL}/checkout`,

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

    console.error(err);

    res.status(500).json({

      message: "Stripe session failed"

    });

  }
};

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

    console.error("Webhook signature failed:", err.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Payment success
  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const orderId = session.metadata.orderId;

    try {

      const order = await Order.findById(orderId);

      if (!order) {
        console.error("Order not found:", orderId);
        return res.json({ received: true });
      }

      order.paymentStatus = "paid";

      order.status = "accepted";

      await order.save();

      console.log("Order marked paid:", orderId);

      // Socket emit (optional)
      const io = req.app.get("io");

      if (io) {
        io.to(orderId).emit("orderUpdated", {
          orderId,
          status: order.status,
          paymentStatus: order.paymentStatus
        });
      }

    } catch (err) {
      console.error("Webhook DB error:", err);
    }
  }

  res.json({ received: true });
};

