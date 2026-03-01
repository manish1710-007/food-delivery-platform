import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
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

  useEffect(() => { fetchCart(); }, []);

  const checkout = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    navigate("/checkout");
  };

  const removeItem = async (id) => {
    setRemovingId(id);
    try {
      await api.delete(`/orders/cart/${id}`);
      setCart((prev) => prev.filter((item) => item._id !== id));
      fetchCartCount();
    } catch {
      alert("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 49 : 0;
  const grandTotal = itemTotal + deliveryFee;

  const foodEmojis = ["🍔", "🍕", "🌮", "🍜", "🍱", "🥗", "🍛", "🌯"];
  const getEmoji = (name = "") => foodEmojis[name.charCodeAt(0) % foodEmojis.length];

  /*  Loading  */
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="d-flex flex-column align-items-center justify-content-center cart-loading gap-3">
          <div className="cart-spinner" />
          <p className="mb-0 small cart-muted">Loading your cart…</p>
        </div>
      </>
    );
  }

  /*  Error  */
  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 cart-error-screen">
          <span style={{ fontSize: "2rem" }}>⚠️</span>
          <p className="mb-0 small fw-semibold">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">
        <div className="container" style={{ maxWidth: 1040 }}>

          {/* Header*/}
          <div className="d-flex align-items-center gap-3 mb-5">
            <h1 className="cart-title mb-0">Your Cart</h1>
            {cart.length > 0 && (
              <span className="cart-badge badge rounded-pill text-uppercase">
                {cart.length} item{cart.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            /*  Empty state*/
            <div className="empty-state text-center rounded-4 border py-5 px-4">
              <div className="mb-3" style={{ fontSize: 64, filter: "grayscale(0.3)" }}>🛒</div>
              <h2 className="empty-title mb-2">Nothing here yet</h2>
              <p className="cart-muted mb-4">Add some delicious food to get started</p>
              <Link to="/" className="browse-btn d-inline-flex align-items-center gap-2 text-decoration-none rounded-3 px-4 py-3 fw-bold">
                Browse Restaurants
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

          ) : (
            /* Cart layout*/
            <div className="row g-4 align-items-start">

              {/* Left — Items */}
              <div className="col-lg-8">
                <p className="panel-label text-uppercase mb-2">Order Items</p>

                <div className="items-list rounded-4 overflow-hidden border">
                  {cart.map((item, index) => (
                    <div
                      key={item._id}
                      className={`cart-item d-flex align-items-center gap-3 px-4 py-3 ${removingId === item._id ? "removing" : ""}`}
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Emoji tile */}
                      <div className="item-emoji d-flex align-items-center justify-content-center rounded-3 flex-shrink-0">
                        {getEmoji(item.name)}
                      </div>

                      {/* Name + meta */}
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="item-name fw-semibold text-truncate">{item.name}</div>
                        <div className="item-meta small">₹{item.price} × {item.quantity}</div>
                      </div>

                      {/* Price + remove */}
                      <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                        <span className="item-total fw-bold">₹{item.price * item.quantity}</span>
                        <button
                          className="remove-btn btn btn-sm rounded-pill px-3 text-uppercase fw-semibold"
                          onClick={() => removeItem(item._id)}
                          disabled={removingId === item._id}
                        >
                          {removingId === item._id ? "…" : "Remove"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Summary */}
              <div className="col-lg-4">
                <div className="position-sticky" style={{ top: 24 }}>
                  <p className="panel-label text-uppercase mb-2">Order Summary</p>

                  <div className="summary-card rounded-4 border p-4">

                    {/* Fee rows */}
                    <div className="d-flex flex-column gap-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center summary-row">
                        <span>Item Total</span>
                        <span className="fw-semibold">₹{itemTotal}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center summary-row">
                        <span>Delivery Fee</span>
                        <span className="fw-semibold fee-positive">+ ₹{deliveryFee}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center summary-row">
                        <span>Platform Fee</span>
                        <span className="fw-semibold fee-free">Free</span>
                      </div>
                    </div>

                    <hr className="summary-divider my-0 mb-3" />

                    {/* Grand total */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <span className="summary-total-label fw-bold">Grand Total</span>
                      <span className="total-amount">₹{grandTotal}</span>
                    </div>

                    {/* CTA */}
                    <button
                      className="checkout-btn btn w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 fw-bold"
                      onClick={checkout}
                    >
                      Proceed to Checkout
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>

                    {/* Secure note */}
                    <div className="d-flex align-items-center justify-content-center gap-2 mt-3 secure-note">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Secure & encrypted checkout
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ══════════════════════════════════
     CSS VARIABLE TOKENS
     ThemeToggle sets data-theme="dark"|"light" on <html>
  ══════════════════════════════════ */
  :root,
  [data-theme="light"] {
    --ct-bg-page:        #f7f6f3;
    --ct-bg-card:        #ffffff;
    --ct-bg-emoji:       #f5f3ef;
    --ct-border:         #e8e6e1;
    --ct-border-item:    #f0ede8;
    --ct-text-primary:   #111111;
    --ct-text-secondary: #555555;
    --ct-text-muted:     #999999;
    --ct-text-micro:     #aaaaaa;
    --ct-badge-bg:       #111111;
    --ct-badge-text:     #ffffff;
    --ct-btn-bg:         #111111;
    --ct-btn-text:       #ffffff;
    --ct-green:          #2e7d32;
    --ct-red:            #e53935;
    --ct-red-dark:       #c0392b;
    --ct-shadow-card:    0 2px 16px rgba(0,0,0,0.04);
    --ct-shadow-btn:     0 4px 20px rgba(0,0,0,0.15);
    --ct-shadow-btn-hv:  0 8px 28px rgba(229,57,53,0.3);
    --ct-spinner-track:  #f0ede8;
    --ct-item-hover:     #fafaf8;
    --ct-remove-border:  #e0ddd8;
  }

  [data-theme="dark"] {
    --ct-bg-page:        #0f0f0f;
    --ct-bg-card:        #1a1a1a;
    --ct-bg-emoji:       #252525;
    --ct-border:         #2a2a2a;
    --ct-border-item:    #222222;
    --ct-text-primary:   #f0efe9;
    --ct-text-secondary: #9a9a9a;
    --ct-text-muted:     #666666;
    --ct-text-micro:     #555555;
    --ct-badge-bg:       #f0efe9;
    --ct-badge-text:     #111111;
    --ct-btn-bg:         #f0efe9;
    --ct-btn-text:       #111111;
    --ct-green:          #4caf50;
    --ct-red:            #ef5350;
    --ct-red-dark:       #e53935;
    --ct-shadow-card:    0 2px 24px rgba(0,0,0,0.35);
    --ct-shadow-btn:     0 4px 20px rgba(0,0,0,0.4);
    --ct-shadow-btn-hv:  0 8px 28px rgba(239,83,80,0.35);
    --ct-spinner-track:  #2a2a2a;
    --ct-item-hover:     #202020;
    --ct-remove-border:  #333333;
  }

  /* ── Page shell ── */
  .cart-page {
    min-height: 100vh;
    background: var(--ct-bg-page);
    font-family: 'DM Sans', sans-serif;
    padding: 48px 0 80px;
    transition: background 0.2s;
  }

  /* ── Header ── */
  .cart-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 800;
    color: var(--ct-text-primary);
    letter-spacing: -0.04em;
  }

  .cart-badge {
    background: var(--ct-badge-bg) !important;
    color: var(--ct-badge-text) !important;
    font-size: 0.68rem !important;
    letter-spacing: 0.06em;
    padding: 5px 12px !important;
  }

  /* ── Panel label ── */
  .panel-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--ct-text-muted);
  }

  /* ── Items list card ── */
  .items-list {
    background: var(--ct-bg-card);
    border-color: var(--ct-border) !important;
    box-shadow: var(--ct-shadow-card);
  }

  /* ── Single cart row ── */
  .cart-item {
    border-bottom: 1px solid var(--ct-border-item);
    transition: background 0.15s;
    animation: slideIn 0.3s ease both;
  }
  .cart-item:last-child { border-bottom: none; }
  .cart-item:hover { background: var(--ct-item-hover); }
  .cart-item.removing { opacity: 0.4; pointer-events: none; transition: opacity 0.2s; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Emoji tile */
  .item-emoji {
    width: 52px;
    height: 52px;
    background: var(--ct-bg-emoji);
    font-size: 24px;
  }

  /* Item text */
  .item-name {
    font-size: 0.95rem;
    color: var(--ct-text-primary);
    line-height: 1.3;
  }
  .item-meta {
    font-size: 0.8rem;
    color: var(--ct-text-muted);
  }

  /* Item price */
  .item-total {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    color: var(--ct-text-primary);
  }

  /* Remove button — extends Bootstrap .btn.btn-sm */
  .remove-btn {
    background: transparent !important;
    border: 1px solid var(--ct-remove-border) !important;
    color: var(--ct-red-dark) !important;
    font-size: 0.68rem !important;
    letter-spacing: 0.06em;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s !important;
  }
  .remove-btn:hover:not(:disabled) {
    background: var(--ct-red-dark) !important;
    border-color: var(--ct-red-dark) !important;
    color: #fff !important;
  }

  /* ── Summary card — extends Bootstrap .card ── */
  .summary-card {
    background: var(--ct-bg-card) !important;
    border-color: var(--ct-border) !important;
    box-shadow: var(--ct-shadow-card);
  }

  /* Fee rows */
  .summary-row {
    font-size: 0.9rem;
    color: var(--ct-text-secondary);
  }
  .summary-row span:last-child { color: var(--ct-text-primary); }
  .fee-positive { color: var(--ct-green) !important; }
  .fee-free     { color: var(--ct-green) !important; }

  /* Divider */
  .summary-divider {
    border-color: var(--ct-border-item) !important;
    opacity: 1 !important;
  }

  /* Grand total label */
  .summary-total-label {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    color: var(--ct-text-primary);
  }

  .total-amount {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--ct-red);
    letter-spacing: -0.03em;
  }

  /* Checkout CTA — extends Bootstrap .btn */
  .checkout-btn {
    background: var(--ct-btn-bg) !important;
    color: var(--ct-btn-text) !important;
    border: none !important;
    padding: 15px 20px !important;
    font-family: 'Syne', sans-serif !important;
    font-size: 0.95rem !important;
    letter-spacing: 0.01em;
    box-shadow: var(--ct-shadow-btn);
    transition: all 0.2s !important;
  }
  .checkout-btn:hover {
    background: var(--ct-red) !important;
    color: #fff !important;
    transform: translateY(-1px);
    box-shadow: var(--ct-shadow-btn-hv) !important;
  }
  .checkout-btn:active { transform: translateY(0) !important; }

  /* Secure note */
  .secure-note {
    font-size: 0.75rem;
    color: var(--ct-text-micro);
  }

  /* ── Empty state ── */
  .empty-state {
    background: var(--ct-bg-card) !important;
    border-color: var(--ct-border) !important;
  }
  .empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--ct-text-primary);
    letter-spacing: -0.03em;
  }

  /* Browse button — standalone link-button */
  .browse-btn {
    background: var(--ct-btn-bg);
    color: var(--ct-btn-text) !important;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    box-shadow: var(--ct-shadow-btn);
    transition: all 0.2s;
  }
  .browse-btn:hover {
    background: var(--ct-red) !important;
    color: #fff !important;
    transform: translateY(-1px);
    box-shadow: var(--ct-shadow-btn-hv);
  }

  /* ── Loading screen ── */
  .cart-loading {
    min-height: 60vh;
    background: var(--ct-bg-page);
  }
  .cart-muted { color: var(--ct-text-muted); }

  .cart-spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--ct-spinner-track);
    border-top-color: var(--ct-red);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Error screen ── */
  .cart-error-screen {
    min-height: 50vh;
    color: var(--ct-red-dark);
    font-family: 'DM Sans', sans-serif;
    background: var(--ct-bg-page);
  }
`;