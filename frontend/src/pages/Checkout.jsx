import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [payMethod, setPayMethod] = useState(null); // 'cod' | 'card'

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/orders/cart");
        const items = res.data.items || [];
        setCart(items);
        if (items.length > 0) {
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

  const itemTotal  = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 49 : 0;
  const grandTotal  = itemTotal + deliveryFee;

  const handleCheckout = async () => {
    if (!deliveryAddress || !phone) return alert("Delivery address and phone number are required!");
    if (!restaurantId) return alert("Error: Could not identify the restaurant for this order.");
    try {
      setSubmitting(true);
      const res = await api.post("/orders/checkout", {
        restaurant: restaurantId,
        deliveryAddress,
        phone,
        paymentMethod: "cod",
      });
      fetchCartCount();
      alert("Order placed successfully! 🎉");
      navigate(`/orders/${res.data.order?._id || "my"}`);
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (!deliveryAddress || !phone) return alert("Delivery address and phone number are required!");
    if (!restaurantId) return alert("Error: Could not identify the restaurant for this order.");
    try {
      setSubmitting(true);
      const res = await api.post("/payment/create-checkout-session", {
        restaurant: restaurantId,
        deliveryAddress,
        phone,
      });
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.message || "Payment Failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const foodEmojis = ["🍔", "🍕", "🌮", "🍜", "🍱", "🥗", "🍛", "🌯"];
  const getEmoji = (name = "") => foodEmojis[name.charCodeAt(0) % foodEmojis.length];

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="d-flex flex-column align-items-center justify-content-center co-loading gap-3">
          <div className="co-spinner" />
          <p className="mb-0 small co-muted">Preparing checkout…</p>
        </div>
      </>
    );
  }

  /* ── Empty cart ── */
  if (cart.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="d-flex flex-column align-items-center justify-content-center co-loading gap-3 text-center">
          <div style={{ fontSize: 56, filter: "grayscale(0.3)" }}>🛒</div>
          <h2 className="co-title mb-0">Your cart is empty</h2>
          <p className="co-muted mb-2">Nothing to checkout yet</p>
          <button
            className="co-back-btn btn d-inline-flex align-items-center gap-2 rounded-3 fw-bold px-4 py-3"
            onClick={() => navigate("/")}
          >
            Browse Restaurants
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="co-page">
        <div className="container" style={{ maxWidth: 1040 }}>

          {/* ── Step indicator ── */}
          <div className="d-flex align-items-center mb-5 co-steps">
            {/* Step 1 — done */}
            <div className="d-flex flex-column align-items-center gap-1 co-step co-step-done">
              <div className="co-step-dot d-flex align-items-center justify-content-center rounded-circle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <span className="text-uppercase fw-semibold" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>Cart</span>
            </div>

            <div className="co-step-line flex-grow-1" />

            {/* Step 2 — active */}
            <div className="d-flex flex-column align-items-center gap-1 co-step co-step-active">
              <div className="co-step-dot d-flex align-items-center justify-content-center rounded-circle fw-bold">2</div>
              <span className="text-uppercase fw-bold" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>Checkout</span>
            </div>

            <div className="co-step-line flex-grow-1" />

            {/* Step 3 — pending */}
            <div className="d-flex flex-column align-items-center gap-1 co-step co-step-pending">
              <div className="co-step-dot d-flex align-items-center justify-content-center rounded-circle">3</div>
              <span className="text-uppercase fw-semibold" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>Confirm</span>
            </div>
          </div>

          {/* ── Page title ── */}
          <h1 className="co-title mb-4">Checkout</h1>

          {/* ── Two-column layout ── */}
          <div className="row g-4 align-items-start">

            {/* ── LEFT: Forms ── */}
            <div className="col-lg-8 d-flex flex-column gap-4">

              {/* Delivery Details */}
              <div className="co-card rounded-4 border p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="co-card-icon d-flex align-items-center justify-content-center rounded-3 flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <h2 className="co-card-title mb-0">Delivery Details</h2>
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label className="co-label d-block text-uppercase fw-bold mb-2">Delivery Address</label>
                  <textarea
                    className="co-input w-100 rounded-3"
                    rows="3"
                    placeholder="123 Food Street, Apt 4B, City…"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div className="mb-0">
                  <label className="co-label d-block text-uppercase fw-bold mb-2">Phone Number</label>
                  <div className="position-relative">
                    <span className="co-input-prefix position-absolute d-flex align-items-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                      </svg>
                    </span>
                    <input
                      className="co-input co-input-icon w-100 rounded-3"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="co-card rounded-4 border p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="co-card-icon d-flex align-items-center justify-content-center rounded-3 flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>
                    </svg>
                  </div>
                  <h2 className="co-card-title mb-0">Payment Method</h2>
                </div>

                <div className="d-flex flex-column gap-3">
                  {/* COD */}
                  <button
                    onClick={() => setPayMethod("cod")}
                    className={`co-pay-option d-flex align-items-center gap-3 rounded-3 border text-start ${payMethod === "cod" ? "selected" : ""}`}
                  >
                    <span className="co-pay-icon flex-shrink-0">💵</span>
                    <div className="d-flex flex-column gap-1 flex-grow-1">
                      <span className="co-pay-title fw-semibold">Cash on Delivery</span>
                      <span className="co-pay-sub">Pay when your order arrives</span>
                    </div>
                    <div className="co-pay-radio rounded-circle flex-shrink-0" />
                  </button>

                  {/* Card */}
                  <button
                    onClick={() => setPayMethod("card")}
                    className={`co-pay-option d-flex align-items-center gap-3 rounded-3 border text-start ${payMethod === "card" ? "selected" : ""}`}
                  >
                    <span className="co-pay-icon flex-shrink-0">💳</span>
                    <div className="d-flex flex-column gap-1 flex-grow-1">
                      <span className="co-pay-title fw-semibold">Pay with Card</span>
                      <span className="co-pay-sub">Visa, Mastercard, UPI & more</span>
                    </div>
                    <div className="co-pay-radio rounded-circle flex-shrink-0" />
                  </button>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="col-lg-4">
              <div className="position-sticky" style={{ top: 24 }}>
                <p className="co-panel-label text-uppercase mb-2">Order Summary</p>

                <div className="co-summary-card rounded-4 border p-4">

                  {/* Items list */}
                  <div className="d-flex flex-column gap-3 mb-3">
                    {cart.map((item) => (
                      <div key={item._id} className="d-flex align-items-center gap-2 co-summary-item">
                        <div className="co-summary-emoji d-flex align-items-center justify-content-center rounded-3 flex-shrink-0">
                          {getEmoji(item.name)}
                        </div>
                        <div className="d-flex align-items-baseline gap-1 flex-grow-1 overflow-hidden">
                          <span className="co-summary-name fw-semibold text-truncate">{item.name}</span>
                          <span className="co-summary-qty flex-shrink-0">× {item.quantity}</span>
                        </div>
                        <span className="co-summary-price fw-bold flex-shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="co-divider my-0 mb-3" />

                  {/* Fee rows */}
                  <div className="d-flex flex-column gap-2 mb-3">
                    <div className="d-flex justify-content-between co-fee-row">
                      <span>Item Total</span>
                      <span className="fw-semibold">₹{itemTotal}</span>
                    </div>
                    <div className="d-flex justify-content-between co-fee-row">
                      <span>Delivery</span>
                      <span className="fw-semibold co-fee-green">+ ₹{deliveryFee}</span>
                    </div>
                    <div className="d-flex justify-content-between co-fee-row">
                      <span>Platform Fee</span>
                      <span className="fw-semibold co-fee-green">Free</span>
                    </div>
                  </div>

                  <hr className="co-divider my-0 mb-3" />

                  {/* Grand total */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="co-grand-label fw-bold">Grand Total</span>
                    <span className="co-grand-amount">₹{grandTotal}</span>
                  </div>

                  {/* CTA */}
                  <button
                    className="co-place-btn btn w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 fw-bold"
                    disabled={submitting || !payMethod}
                    onClick={payMethod === "cod" ? handleCheckout : handleStripeCheckout}
                  >
                    {submitting ? (
                      <><div className="co-btn-spinner" /> Processing…</>
                    ) : !payMethod ? (
                      "Select a payment method"
                    ) : payMethod === "cod" ? (
                      <>Place Order <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                    ) : (
                      <>Pay ₹{grandTotal} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                    )}
                  </button>

                  {/* Secure note */}
                  <div className="d-flex align-items-center justify-content-center gap-2 mt-3 co-secure">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    256-bit SSL encrypted & secure
                  </div>
                </div>
              </div>
            </div>

          </div>
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
    --co-bg-page:       #f7f6f3;
    --co-bg-card:       #ffffff;
    --co-bg-input:      #faf9f7;
    --co-bg-icon:       #f5f3ef;
    --co-bg-pay:        #faf9f7;
    --co-bg-pay-sel:    #ffffff;
    --co-bg-pay-hover:  #f5f3ef;
    --co-border:        #e8e6e1;
    --co-border-input:  #ede9e3;
    --co-border-pay:    #ede9e3;
    --co-border-pay-sel:#111111;
    --co-text-primary:  #111111;
    --co-text-secondary:#555555;
    --co-text-muted:    #888888;
    --co-text-micro:    #bbbbbb;
    --co-step-dot-bg:   #f7f6f3;
    --co-step-dot-bd:   #dddddd;
    --co-step-dot-cl:   #cccccc;
    --co-step-line:     #e5e3df;
    --co-step-done-bg:  #e8f5e9;
    --co-step-done-bd:  #4caf50;
    --co-step-done-cl:  #4caf50;
    --co-step-act-bg:   #111111;
    --co-step-act-bd:   #111111;
    --co-step-act-cl:   #ffffff;
    --co-btn-bg:        #111111;
    --co-btn-text:      #ffffff;
    --co-btn-dis-bg:    #d8d5d0;
    --co-btn-dis-text:  #aaaaaa;
    --co-red:           #e53935;
    --co-green:         #4caf50;
    --co-shadow-card:   0 2px 16px rgba(0,0,0,0.04);
    --co-shadow-btn:    0 4px 20px rgba(0,0,0,0.15);
    --co-shadow-btn-hv: 0 8px 28px rgba(229,57,53,0.3);
    --co-focus-ring:    rgba(17,17,17,0.06);
    --co-spinner-track: #f0ede8;
    --co-pay-radio-bd:  #dddddd;
    --co-pay-radio-sel: #111111;
    --co-summary-emoji: #f5f3ef;
    --co-divider:       #f0ede8;
  }

  [data-theme="dark"] {
    --co-bg-page:       #0f0f0f;
    --co-bg-card:       #1a1a1a;
    --co-bg-input:      #151515;
    --co-bg-icon:       #252525;
    --co-bg-pay:        #151515;
    --co-bg-pay-sel:    #1f1f1f;
    --co-bg-pay-hover:  #1e1e1e;
    --co-border:        #2a2a2a;
    --co-border-input:  #2e2e2e;
    --co-border-pay:    #2e2e2e;
    --co-border-pay-sel:#f0efe9;
    --co-text-primary:  #f0efe9;
    --co-text-secondary:#9a9a9a;
    --co-text-muted:    #666666;
    --co-text-micro:    #555555;
    --co-step-dot-bg:   #1a1a1a;
    --co-step-dot-bd:   #3a3a3a;
    --co-step-dot-cl:   #555555;
    --co-step-line:     #2a2a2a;
    --co-step-done-bg:  #1a2e1a;
    --co-step-done-bd:  #4caf50;
    --co-step-done-cl:  #4caf50;
    --co-step-act-bg:   #f0efe9;
    --co-step-act-bd:   #f0efe9;
    --co-step-act-cl:   #111111;
    --co-btn-bg:        #f0efe9;
    --co-btn-text:      #111111;
    --co-btn-dis-bg:    #2a2a2a;
    --co-btn-dis-text:  #555555;
    --co-red:           #ef5350;
    --co-green:         #66bb6a;
    --co-shadow-card:   0 2px 24px rgba(0,0,0,0.4);
    --co-shadow-btn:    0 4px 20px rgba(0,0,0,0.5);
    --co-shadow-btn-hv: 0 8px 28px rgba(239,83,80,0.35);
    --co-focus-ring:    rgba(240,239,233,0.07);
    --co-spinner-track: #2a2a2a;
    --co-pay-radio-bd:  #444444;
    --co-pay-radio-sel: #f0efe9;
    --co-summary-emoji: #252525;
    --co-divider:       #222222;
  }

  /* ── Page ── */
  .co-page {
    min-height: 100vh;
    background: var(--co-bg-page);
    font-family: 'DM Sans', sans-serif;
    padding: 44px 0 80px;
    transition: background 0.2s;
  }

  /* ── Step indicator ── */
  .co-steps { margin-bottom: 36px; }

  .co-step-dot {
    width: 32px; height: 32px;
    font-size: 0.78rem;
    font-family: 'Syne', sans-serif;
  }

  /* Pending */
  .co-step-pending .co-step-dot {
    background: var(--co-step-dot-bg);
    border: 2px solid var(--co-step-dot-bd);
    color: var(--co-step-dot-cl);
  }
  .co-step-pending span { color: var(--co-text-micro); }

  /* Active */
  .co-step-active .co-step-dot {
    background: var(--co-step-act-bg);
    border: 2px solid var(--co-step-act-bd);
    color: var(--co-step-act-cl);
  }
  .co-step-active span { color: var(--co-text-primary); }

  /* Done */
  .co-step-done .co-step-dot {
    background: var(--co-step-done-bg);
    border: 2px solid var(--co-step-done-bd);
    color: var(--co-step-done-cl);
  }
  .co-step-done span { color: var(--co-text-secondary); }

  /* Connector line */
  .co-step-line {
    height: 2px;
    background: var(--co-step-line);
    max-width: 80px;
    margin: 0 8px 22px;
  }

  /* ── Title ── */
  .co-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.7rem, 4vw, 2.2rem);
    font-weight: 800;
    color: var(--co-text-primary);
    letter-spacing: -0.04em;
  }

  /* ── Section cards — extend Bootstrap .border ── */
  .co-card {
    background: var(--co-bg-card);
    border-color: var(--co-border) !important;
    box-shadow: var(--co-shadow-card);
  }

  /* Card icon tile */
  .co-card-icon {
    width: 34px; height: 34px;
    background: var(--co-bg-icon);
    color: var(--co-text-secondary);
  }

  /* Card section title */
  .co-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--co-text-primary);
    letter-spacing: -0.02em;
  }

  /* ── Field labels ── */
  .co-label {
    font-size: 0.68rem;
    letter-spacing: 0.09em;
    color: var(--co-text-muted);
  }

  /* ── Inputs & textarea ── */
  .co-input {
    background: var(--co-bg-input);
    border: 1.5px solid var(--co-border-input);
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    color: var(--co-text-primary);
    outline: none;
    resize: vertical;
    transition: border-color 0.15s, box-shadow 0.15s;
    display: block;
  }
  .co-input:focus {
    border-color: var(--co-text-primary) !important;
    box-shadow: 0 0 0 3px var(--co-focus-ring) !important;
  }
  .co-input::placeholder { color: var(--co-text-micro); }

  /* Phone input with left icon padding */
  .co-input-icon { padding-left: 40px; }

  .co-input-prefix {
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--co-text-micro);
    pointer-events: none;
  }

  /* ── Payment option buttons ── */
  .co-pay-option {
    background: var(--co-bg-pay);
    border-color: var(--co-border-pay) !important;
    padding: 16px 18px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .co-pay-option:hover {
    border-color: var(--co-text-secondary) !important;
    background: var(--co-bg-pay-hover);
  }
  .co-pay-option.selected {
    border-color: var(--co-border-pay-sel) !important;
    background: var(--co-bg-pay-sel);
    box-shadow: 0 0 0 3px var(--co-focus-ring);
  }

  .co-pay-icon { font-size: 22px; }

  .co-pay-title {
    font-size: 0.9rem;
    color: var(--co-text-primary);
  }
  .co-pay-sub {
    font-size: 0.75rem;
    color: var(--co-text-muted);
  }

  /* Custom radio dot */
  .co-pay-radio {
    width: 18px; height: 18px;
    border: 2px solid var(--co-pay-radio-bd);
    position: relative;
    transition: border-color 0.15s;
  }
  .co-pay-option.selected .co-pay-radio {
    border-color: var(--co-pay-radio-sel);
  }
  .co-pay-option.selected .co-pay-radio::after {
    content: '';
    position: absolute;
    inset: 3px;
    background: var(--co-pay-radio-sel);
    border-radius: 50%;
  }

  /* ── Summary card ── */
  .co-panel-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--co-text-muted);
  }

  .co-summary-card {
    background: var(--co-bg-card);
    border-color: var(--co-border) !important;
    box-shadow: var(--co-shadow-card);
  }

  /* Summary item row */
  .co-summary-item { animation: fadeUp 0.3s ease both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .co-summary-emoji {
    width: 36px; height: 36px;
    background: var(--co-summary-emoji);
    font-size: 17px;
  }

  .co-summary-name {
    font-size: 0.85rem;
    color: var(--co-text-primary);
    line-height: 1.3;
  }
  .co-summary-qty {
    font-size: 0.75rem;
    color: var(--co-text-micro);
  }
  .co-summary-price {
    font-family: 'Syne', sans-serif;
    font-size: 0.88rem;
    color: var(--co-text-primary);
  }

  /* Dividers */
  .co-divider {
    border-color: var(--co-divider) !important;
    opacity: 1 !important;
  }

  /* Fee rows */
  .co-fee-row {
    font-size: 0.85rem;
    color: var(--co-text-secondary);
  }
  .co-fee-row span:last-child { color: var(--co-text-primary); }
  .co-fee-green { color: var(--co-green) !important; }

  /* Grand total */
  .co-grand-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    color: var(--co-text-primary);
  }
  .co-grand-amount {
    font-family: 'Syne', sans-serif;
    font-size: 1.55rem;
    font-weight: 800;
    color: var(--co-red);
    letter-spacing: -0.03em;
  }

  /* ── CTA — extends Bootstrap .btn ── */
  .co-place-btn {
    background: var(--co-btn-bg) !important;
    color: var(--co-btn-text) !important;
    border: none !important;
    padding: 15px 20px !important;
    font-family: 'Syne', sans-serif !important;
    font-size: 0.95rem !important;
    letter-spacing: 0.01em;
    box-shadow: var(--co-shadow-btn);
    transition: all 0.2s !important;
  }
  .co-place-btn:hover:not(:disabled) {
    background: var(--co-red) !important;
    color: #fff !important;
    transform: translateY(-1px);
    box-shadow: var(--co-shadow-btn-hv) !important;
  }
  .co-place-btn:active:not(:disabled) { transform: translateY(0) !important; }
  .co-place-btn:disabled {
    background: var(--co-btn-dis-bg) !important;
    color: var(--co-btn-dis-text) !important;
    cursor: not-allowed;
    box-shadow: none !important;
  }

  /* Inline spinner inside button */
  .co-btn-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Secure note */
  .co-secure {
    font-size: 0.72rem;
    color: var(--co-text-micro);
  }

  /* ── Loading & empty screens ── */
  .co-loading {
    min-height: 60vh;
    background: var(--co-bg-page);
  }
  .co-muted { color: var(--co-text-muted); }

  .co-spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--co-spinner-track);
    border-top-color: var(--co-red);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* Back / browse button */
  .co-back-btn {
    background: var(--co-btn-bg) !important;
    color: var(--co-btn-text) !important;
    border: none !important;
    font-family: 'Syne', sans-serif;
    font-size: 0.88rem;
    box-shadow: var(--co-shadow-btn);
    transition: all 0.2s !important;
  }
  .co-back-btn:hover {
    background: var(--co-red) !important;
    color: #fff !important;
    transform: translateY(-1px);
    box-shadow: var(--co-shadow-btn-hv) !important;
  }
`;