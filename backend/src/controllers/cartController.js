const Cart = require("../models/Cart");
const Product = require("../models/Product"); // 🚨 CRITICAL: Needed to verify products exist

// GET 
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items
      .filter(item => item.product != null) // Filter out deleted 'ghost' products
      .map(item => ({
        _id: item._id,
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        restaurant: item.product.restaurant, 
      }));

    res.json({ items: formattedItems });

  } catch (err){
    console.error("[SYS.ERR] Cart fetch error:", err);
    res.status(500).json({ message: "Error fetching cart data" });
  }
};

// POST
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

  
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found in databank" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Return normalized response
    const populatedCart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price")
      .lean();

    const items = populatedCart.items
      .filter(item => item.product != null)
      .map((item) => ({
        _id: item._id,
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

    res.json({ items });

  } catch (error) {
    console.error("[SYS.ERR] addToCart failure:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};  


// DELETE
exports.removeFromCart = async (req, res) => {
  try { 
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
      ? populatedCart.items
          .filter(item => item.product != null) // Protect against null mappings
          .map((item) => ({
            _id: item._id,
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          }))
      : [];

    res.json({ items });

  } catch (error) {
    console.error("[SYS.ERR] removeFromCart failure:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};