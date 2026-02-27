import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext"; // Add this to clear the badge!

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // Start as true
  const [submitting, setSubmitting] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const navigate = useNavigate();
  const { fetchCartCount } = useCart(); // Bring in the global cart fetcher

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/orders/cart");
        const items = res.data.items || [];
        setCart(items);

        // Safely extract the restaurant ID whether the backend nests it or not
        if(items.length > 0) {
          const restId = items[0].restaurant?._id || items[0].restaurant || items[0].product?.restaurant;
          setRestaurantId(restId);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const handleCheckout = async () => {
    if (!deliveryAddress || !phone) {
      return alert("Delivery address and phone number are required!");
    }
    if (!restaurantId) {
      return alert("Error: Could not identify the restaurant for this order.");
    }

    try {
      setSubmitting(true);

      const res = await api.post("/orders/checkout", {
        restaurant: restaurantId,
        deliveryAddress,
        phone,
        paymentMethod: "cod",
      });

      // Clear the cart badge in the navbar
      fetchCartCount(); 

      alert("Order placed successfully! 🎉");
      // Fallback to /orders/my if the backend doesn't send the specific order back
      navigate(`/orders/${res.data.order?._id || 'my'}`); 
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripeCheckout = async () => {
    try {
      const res = await api.post("/payment/create-checkout-session");
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment Failed");
    }
  };

  if (loading) return (
      <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-danger" />
      </div>
  );

  if (cart.length === 0) {
    return (
        <div className="container mt-5 text-center">
            <h3>Your cart is empty</h3>
            <button className="btn btn-danger mt-3 rounded-pill" onClick={() => navigate("/")}>Go back to Menu</button>
        </div>
    );
  }

  return (
    <div className="container py-5" style={{maxWidth: "800px"}}>
      <h2 className="fw-bold mb-4">Secure Checkout</h2>

      {/* Order summary Card */}
      <div className="card custom-card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h5 className="fw-bold border-bottom pb-3 mb-3">Order Summary</h5>
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0">
                <thead className="text-muted small border-bottom">
                <tr>
                    <th>Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Price</th>
                </tr>
                </thead>
                <tbody>
                {cart.map((item) => (
                    <tr key={item._id} className="border-bottom border-secondary border-opacity-10">
                    <td className="py-3 fw-semibold">{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end fw-bold">₹{item.price * item.quantity}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
              <h5 className="fw-bold mb-0">Total to Pay:</h5>
              <h4 className="fw-bold text-danger mb-0">₹{totalAmount}</h4>
          </div>
      </div>

      {/* Delivery Details Card */}
      <div className="card custom-card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h5 className="fw-bold border-bottom pb-3 mb-3">Delivery Details</h5>
          
          <div className="mb-3">
            <label className="form-label fw-semibold small">Delivery Address</label>
            <textarea
              className="form-control bg-light border-0"
              rows="3"
              placeholder="123 Food Street, Apt 4B..."
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold small">Phone Number</label>
            <input
              className="form-control bg-light border-0"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
      </div>

      {/* Action Buttons (Un-nested!) */}
      <div className="d-flex flex-column flex-md-row gap-3 mt-4">
        <button
            className="btn btn-success btn-lg rounded-pill px-5 shadow-sm fw-bold flex-grow-1"
            onClick={handleCheckout}
            disabled={submitting}
        >
            {submitting ? "Placing Order..." : "Cash on Delivery"}
        </button>

        <button
            className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm fw-bold flex-grow-1"
            onClick={handleStripeCheckout}
        >
            Pay with Card 💳
        </button>    
      </div>
    </div>
  );
}