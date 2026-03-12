import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

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

      // Reverted to native alert, but with a terminal vibe!
      alert(`[SUCCESS] :: ${product.name} downloaded to cart!`);
    } catch (err) {
      alert(`[FATAL_ERR] :: ${err.response?.data?.message || "Login required to access databank."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="y2k-wire-card h-100 d-flex flex-column position-relative">
        {/* Decorative Sci-Fi UI Corners */}
        <div className="y2k-corner top-left"></div>
        <div className="y2k-corner top-right"></div>
        <div className="y2k-corner bottom-left"></div>
        <div className="y2k-corner bottom-right"></div>

        <div className="card-body d-flex flex-column flex-grow-1 p-3">
          {product.image ? (
            <div className="y2k-img-wrapper mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="y2k-product-img"
              />
              <div className="y2k-scanline-overlay"></div>
            </div>
          ) : (
            <div className="y2k-img-placeholder mb-3 d-flex justify-content-center align-items-center">
              <span>NO_IMG_DATA</span>
            </div>
          )}

          <h6 className="y2k-product-title mb-1">{product.name}</h6>
          
          <div className="mt-auto">
            <p className="y2k-product-price mb-3">
              <span className="text-muted">CREDITS: </span>₹{product.price}
            </p>

            <button
              className="y2k-btn-action w-100"
              onClick={addToCart}
              disabled={loading}
            >
              {loading ? "[ DOWNLOADING... ]" : "[ ADD_TO_CART ]"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  /* Main Card Container */
  .y2k-wire-card {
    background: rgba(10, 10, 18, 0.75);
    border: 1px solid rgba(0, 229, 255, 0.3);
    backdrop-filter: blur(8px);
    font-family: 'VT323', monospace;
    color: #fff;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .y2k-wire-card:hover {
    border-color: var(--cyan);
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.2), inset 0 0 15px rgba(0, 229, 255, 0.1);
    transform: translateY(-5px);
  }

  /* Decorative Reticle Corners */
  .y2k-corner {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid var(--cyan);
    z-index: 10;
    transition: all 0.3s ease;
  }
  
  .y2k-wire-card:hover .y2k-corner {
    border-color: #ff00ff; /* Shift to pink on hover */
    box-shadow: 0 0 8px #ff00ff;
  }

  .top-left { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .top-right { top: -1px; right: -1px; border-left: none; border-bottom: none; }
  .bottom-left { bottom: -1px; left: -1px; border-right: none; border-top: none; }
  .bottom-right { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  /* Image styling */
  .y2k-img-wrapper {
    position: relative;
    width: 100%;
    height: 160px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    overflow: hidden;
    background: #000;
  }

  .y2k-product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: contrast(1.2) saturate(1.2); 
    transition: transform 0.4s ease;
  }

  .y2k-wire-card:hover .y2k-product-img {
    transform: scale(1.05);
  }

  /* Scanline overlay specifically for the image */
  .y2k-scanline-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%, 
      rgba(0, 0, 0, 0.4) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 2;
  }

  .y2k-img-placeholder {
    width: 100%;
    height: 160px;
    border: 1px dashed rgba(255, 0, 255, 0.4);
    background: rgba(255, 0, 255, 0.05);
    color: #ff00ff;
    letter-spacing: 2px;
  }

  /* Typography */
  .y2k-product-title {
    font-size: 1.4rem;
    color: #fff;
    text-transform: uppercase;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    letter-spacing: 1px;
    line-height: 1.1;
  }

  .y2k-product-price {
    font-size: 1.3rem;
    color: #00ff88; 
    text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
    margin: 0;
  }

  /* Action Button */
  .y2k-btn-action {
    background: transparent;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    font-family: inherit;
    font-size: 1.2rem;
    padding: 6px 10px;
    cursor: pointer;
    transition: all 0.2s;
    text-shadow: 0 0 5px var(--cyan);
  }

  .y2k-btn-action:hover:not(:disabled) {
    background: var(--cyan);
    color: #010308;
    box-shadow: 0 0 15px var(--cyan);
    text-shadow: none;
  }

  .y2k-btn-action:disabled {
    border-color: #ff00ff;
    color: #ff00ff;
    text-shadow: 0 0 5px #ff00ff;
    cursor: not-allowed;
    animation: y2k-blink 1s infinite;
  }

  @keyframes y2k-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;