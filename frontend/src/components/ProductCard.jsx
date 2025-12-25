import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const auth = useAuth(); // safer than destructuring

  const addToCart = async () => {
    try {
      setLoading(true);

      await api.post("/orders/cart", {
        productId: product._id,
        quantity: 1,
      });

      // refresh navbar cart count if implemented
      if (auth.refreshCartCount) {
        await auth.refreshCartCount();
      }

      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Login required");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h6>{product.name}</h6>
        <p>₹{product.price}</p>

        <button
          className="btn btn-success btn-sm"
          onClick={addToCart}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
