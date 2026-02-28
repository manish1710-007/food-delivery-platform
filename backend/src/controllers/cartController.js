const Cart = require("../models/Cart");

// GET /orders/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items.map(item => {
      if (!item.product) return null; // Skip if product was deleted
      return {
        _id: item._id,
        productId: item.product._id,
        name: item.product.price,
        price: item.product.price,
        quantity: item.quantity,
        restaurant: item.product.restaurant, // Include restaurant reference
      };
    }).filter(item => item !== null);

    res.json({ items: formattedItems });

    } catch (err){
      console.error("Cart fetch error:", err);
      res.status(500).json({ message: "Error fetching cart" });
    }
  };

// POST /orders/cart
exports.addToCart = async (req, res) => {
  try {
      const { productId, quantity = 1 } = req.body;

      console.log(" AddToCart input:", { productId, quantity, userId: req.user._id });

      if (!productId) {
        return res.status(400).json({ message: "productId required" });
      }

      let cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        console.log(" creating new cart");
        cart = await Cart.create({
          user: req.user._id,
          items: [],
        });
      }

      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        console.log(" Updating quantity");
        existingItem.quantity += quantity;
      } else {
        console.log(" Pushing new item");
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
      console.log(" cart saved successfully.");

      // return normalized response
      const populatedCart = await Cart.findOne({ user: req.user._id })
        .populate("items.product", "name price")
        .lean();

      const items = populatedCart.items.filter(item => item.product != null).map((item) => ({
        _id: item._id,
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      console.log(" Sending response items count:", items.length);
      res.json({ items });
    } catch (error) {
      console.error(" Error in addToCart:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
};  

// DELETE /orders/cart/:itemId
exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    (i) => i._id.toString() !== req.params.itemId
  );

  await cart.save();

  const populatedCart = await Cart.findOne({ user: req.user._id })
    .populate("items.product", "name price")
    .lean();

  const items = populatedCart
    ? populatedCart.items.map((item) => ({
        _id: item._id,
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }))
    : [];

  res.json({ items });
};
