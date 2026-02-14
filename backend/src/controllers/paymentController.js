const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.createCheckoutSession = async (req, res) => {
    try{

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty"});
        }

        const lineItems = cart.items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product.name,
            },
            unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,    
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
        metadata: { userId: req.user._id.toString() },
    });

    res.json({
        url: session.url,
    });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Stripe session failed"
        });
    }
}; 