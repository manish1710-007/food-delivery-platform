import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const fetchCart = async () => {
    try {
      const res = await api.get("/orders/cart");
      setCart(res.data.items ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Cart component mounted");
    fetchCart();
  }, []);

  const checkout = async () => {
    try {
      const restaurantId = cart.length > 0 ? cart[0].restaurant : null;

      if (!restaurantId) {
        alert("Hold up! We couldn't figure out which restaurant this order is for.");
        return;
      }
      await api.post("/orders/checkout", { 
        restaurant: restaurantId 
      });

      fetchCartCount(); // Update cart count in Navbar

      alert("Order placed successfully! 🎉");
      navigate("/orders"); 
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/orders/cart/${id}`);
      setCart((prev) => prev.filter((item) => item._id !== id));

      fetchCartCount(); // Update cart count in Navbar

    } catch {
      alert("Failed to remove item");
    }
  };

  const itemTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  // Adding a dummy delivery fee for UI realism (Set to 0 if cart is empty)
  const deliveryFee = cart.length > 0 ? 49 : 0; 
  const grandTotal = itemTotal + deliveryFee;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger rounded-4 shadow-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-5">
      <h2 className="fw-bold mb-4">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        //  EMPTY STATE 
        <div className="text-center py-5 bg-light rounded-4 border border-dashed">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
            alt="Empty Cart" 
            width="120" 
            className="mb-3 opacity-50"
          />
          <h4 className="fw-bold text-muted">Your cart is empty!</h4>
          <p className="text-muted mb-4">Looks like you haven't added anything delicious yet.</p>
          <Link to="/" className="btn btn-danger btn-lg rounded-pill px-4">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        //  CART LAYOUT 
        <div className="row g-4">
          
          {/* Left Side: Cart Items */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">Items ({cart.length})</h5>
              </div>
              <div className="card-body p-0">
                {cart.map((item, index) => (
                  <div 
                    key={item._id} 
                    className={`d-flex align-items-center justify-content-between p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}
                  >
                    {/* Item Info */}
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-3 d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px", fontSize: "24px" }}>
                        🍔 {/* Placeholder icon, replace with item.image if your backend has it */}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{item.name}</h6>
                        <p className="text-muted small mb-0">₹{item.price} x {item.quantity}</p>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="text-end">
                      <h6 className="fw-bold mb-2">₹{item.price * item.quantity}</h6>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: "20px" }}>
              <div className="card-body p-4">
                <h5 className="fw-bold border-bottom pb-3 mb-4">Order Summary</h5>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Item Total</span>
                  <span className="fw-semibold">₹{itemTotal}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Delivery Fee</span>
                  <span className="fw-semibold text-success">+ ₹{deliveryFee}</span>
                </div>

                <div className="d-flex justify-content-between mb-4">
                  <span className="text-muted">Platform Fee</span>
                  <span className="fw-semibold">Free</span>
                </div>

                <div className="border-top pt-3 mb-4 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Grand Total</h5>
                  <h4 className="fw-bold text-danger mb-0">₹{grandTotal}</h4>
                </div>

                <button
                  className="btn btn-danger btn-lg w-100 rounded-3 shadow-sm fw-bold"
                  onClick={checkout}
                >
                  Proceed to Checkout
                </button>
                <p className="text-center text-muted small mt-3 mb-0">
                  <i className="bi bi-shield-lock"></i> Secure Checkout
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}