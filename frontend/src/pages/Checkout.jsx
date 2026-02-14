import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const navigate = useNavigate();

  const handleStripeCheckout = async () => {
    try {

      const res = await api.post("/payment/create-checkout-session");

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment Failed");
    }
  };

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/orders/cart");
        setCart(res.data.items || []);

        // assume all items are from the same restaurant
        if(res.data.items?.length > 0) {
          setRestaurantId(res.data.items[0].productId);
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
      return alert("Address and phone are required");
    }

    try {
      setSubmitting(true);

      const res = await api.post("/orders/checkout", {
        restaurant: restaurantId,
        deliveryAddress,
        phone,
        paymentMethod: "cod",
      });

      alert("Order placed succesfully");
      navigate(`/orders/${res.data.order._id}`);
    }catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p classname="m-4">Loading...</p>;

  if (cart.length === 0) {
    return <p className="m-4">Your cart is empty</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>

      {/* Order summary */}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total: ₹{totalAmount}</h4>

      {/* Address */}
      <div className="mt-4">
        <label className="form-label">Delivery Address</label>
        <textarea
          className="form-control"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className="mt-3">
        <label className="form-label">Phone</label>
        <input
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success mt-4"
        onClick={handleCheckout}
        disabled={submitting}
      >
        {submitting ? "Placing Order..." : "Place Order"}

      <button
        className="btn btn-primary"
        onClick={handleStripeCheckout}
      >
        Pay with Card
      </button>    
      </button>
    </div>
  );
}