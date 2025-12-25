import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const [deliveryAddress, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();

    try {
      await api.post("/orders/checkout", {
        restaurant: import.meta.env.VITE_RESTAURANT_ID,
        deliveryAddress,
        phone,
        paymentMethod: "cod"
      });

      // navigate to orders or confirmation page on success
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "checkour failed");
    }
  }; 

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>

      <form onSumbit={handleCheckout}>
        <input
          className="form-control mb-3"
          placeholder="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button className="btn btn-primary w-100">
          Place Order
        </button>
      </form>
    </div>
  );
}