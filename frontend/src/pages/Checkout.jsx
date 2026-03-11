import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  
  // Extra Aesthetic: Fake dynamic encryption key
  const [encKey, setEncKey] = useState("0x0000000000000000");

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
        alert("SYS_ERR: FAILED_TO_MOUNT_CART");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const itemTotal  = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 49 : 0;
  const grandTotal  = itemTotal + deliveryFee;

  // Aesthetic wrapper for input changes
  const handleInput = (setter, val) => {
    setter(val);
    setEncKey("0x" + Math.random().toString(16).slice(2, 18).toUpperCase());
  };

  const handleCheckout = async () => {
    if (!deliveryAddress || !phone) return alert("SYS_HALT: INCOMPLETE_PAYLOAD");
    if (!restaurantId) return alert("SYS_HALT: TARGET_NODE_UNKNOWN");
    try {
      setSubmitting(true);
      const res = await api.post("/orders/checkout", {
        restaurant: restaurantId,
        deliveryAddress,
        phone,
        paymentMethod: "cod",
      });
      fetchCartCount();
      alert("PAYLOAD_DELIVERED_SUCCESSFULLY [OK]");
      navigate(`/orders/${res.data.order?._id || "my"}`);
    } catch (err) {
      alert(err.response?.data?.message || "TRANSMISSION_FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (!deliveryAddress || !phone) return alert("SYS_HALT: INCOMPLETE_PAYLOAD");
    if (!restaurantId) return alert("SYS_HALT: TARGET_NODE_UNKNOWN");
    try {
      setSubmitting(true);
      const res = await api.post("/payment/create-checkout-session", {
        restaurant: restaurantId,
        deliveryAddress,
        phone,
      });
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.message || "SECURE_TUNNEL_FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  const _foodEmojis = ["🍔", "🍕", "🌮", "🍜", "🍱", "🥗", "🍛", "🌯"];
  const _getEmoji = (name = "") => _foodEmojis[name.charCodeAt(0) % _foodEmojis.length];

  /*  Loading  */
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box p-4 text-center" style={{ width: "320px" }}>
            <div className="mb-3 text-cyan">ESTABLISHING_SECURE_LINK... <span className="blink">_</span></div>
            <div className="y2k-progress-bar">
              <div className="y2k-progress-fill" style={{ animationDuration: '2s' }}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /*  Empty cart  */
  if (cart.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box text-center p-5 mx-auto" style={{ maxWidth: "600px" }}>
            <div className="mb-3 text-muted" style={{ fontSize: 48 }}>[ NULL ]</div>
            <h2 className="text-cyan mb-2 fs-4">PAYLOAD_EMPTY</h2>
            <p className="text-muted mb-4 small">NO_DATA_TO_TRANSMIT</p>
            <Link to="/" className="y2k-btn-magenta text-decoration-none d-inline-block px-4 py-2">
              [ RETURN_TO_ROOT ]
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page pb-5">
        {/* Grid & Scanlines */}
        <div className="y2k-grid-bg"></div>
        <div className="scanlines"></div>

        <div className="container-fluid px-3 px-xl-4 position-relative z-1 pt-4 w-100">
          
          {/* Header & Fake Routing Steps */}
          <div className="y2k-wire-box d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 p-2 border-cyan">
            <h1 className="y2k-title mb-2 mb-md-0 fs-5 text-cyan d-flex align-items-center gap-2 m-0 p-2">
              <span className="blink">_</span> SECURE_CHECKOUT_GATEWAY
            </h1>
            
            <div className="d-flex gap-2 p-2 small font-monospace text-muted overflow-auto">
              <span>[OK] CART_MOUNTED</span>
              <span className="text-cyan">--&gt;</span>
              <span className="text-cyan">[WAIT] AUTH_REQUIRED</span>
              <span className="text-cyan">--&gt;</span>
              <span>[LOCKED] TRANSMIT</span>
            </div>
          </div>

          <div className="row g-4 align-items-start">

            {/*  LEFT: Forms  */}
            <div className="col-12 col-xl-5 d-flex flex-column gap-4">

              {/* Delivery Details */}
              <div className="y2k-wire-box border-cyan p-4 text-start">
                <div className="d-flex justify-content-between border-bottom-wire pb-2 mb-4">
                  <span className="text-cyan small">/// 01_TARGET_COORDINATES</span>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="d-block text-muted small mb-1">&gt; LOCAL_ADDR</label>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">C:\</span>
                    <textarea
                      className="y2k-input flex-grow-1 p-2"
                      rows="2"
                      placeholder="ENTER_PHYSICAL_LOCATION..."
                      value={deliveryAddress}
                      onChange={(e) => handleInput(setDeliveryAddress, e.target.value)}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-2">
                  <label className="d-block text-muted small mb-1">&gt; COMM_CHANNEL</label>
                  <div className="y2k-input-group d-flex align-items-center">
                    <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">TEL:</span>
                    <input
                      className="y2k-input flex-grow-1 p-2"
                      placeholder="ENTER_PHONE_NUMBER..."
                      value={phone}
                      onChange={(e) => handleInput(setPhone, e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="y2k-wire-box border-magenta p-4 text-start">
                <div className="d-flex justify-content-between border-bottom-wire border-magenta pb-2 mb-4">
                  <span className="text-magenta small">/// 02_EXCHANGE_PROTOCOL</span>
                </div>

                <div className="d-flex flex-column gap-3">
                  {/* COD */}
                  <button
                    onClick={() => setPayMethod("cod")}
                    className={`y2k-pay-option d-flex align-items-center gap-3 p-3 text-start ${payMethod === "cod" ? "active" : ""}`}
                  >
                    <span className="fs-4 flex-shrink-0 text-cyan">[{payMethod === "cod" ? "X" : " "}]</span>
                    <div className="d-flex flex-column gap-1 flex-grow-1">
                      <span className="fw-bold font-monospace text-main">PROTOCOL: HANDSHAKE</span>
                      <span className="small" style={{ opacity: 0.7 }}>( Cash on Delivery )</span>
                    </div>
                  </button>

                  {/* Card */}
                  <button
                    onClick={() => setPayMethod("card")}
                    className={`y2k-pay-option d-flex align-items-center gap-3 p-3 text-start ${payMethod === "card" ? "active" : ""}`}
                  >
                    <span className="fs-4 flex-shrink-0 text-magenta">[{payMethod === "card" ? "X" : " "}]</span>
                    <div className="d-flex flex-column gap-1 flex-grow-1">
                      <span className="fw-bold font-monospace text-main">PROTOCOL: STRIPE_SECURE</span>
                      <span className="small" style={{ opacity: 0.7 }}>( Credit / Debit / UPI )</span>
                    </div>
                  </button>
                </div>
              </div>

            </div>

            {/*  MIDDLE: Order Summary (col-xl-4)  */}
            <div className="col-12 col-lg-6 col-xl-4">
              <div className="position-sticky" style={{ top: "80px" }}>
                
                <div className="y2k-wire-box border-magenta p-4 text-start">
                  <div className="d-flex justify-content-between border-bottom-wire border-magenta pb-2 mb-3">
                    <span className="text-magenta small">/// TRANSACTION_LOG</span>
                  </div>

                  {/* Items Mini List */}
                  <div className="d-flex flex-column gap-2 mb-4">
                    {cart.map((item) => (
                      <div key={item._id} className="d-flex justify-content-between align-items-center small font-monospace">
                        <span className="text-truncate text-muted pe-2">&gt; {item.name.toUpperCase()} <span className="text-cyan">x{item.quantity}</span></span>
                        <span className="text-nowrap text-main flex-shrink-0">INR {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-bottom-wire border-magenta mb-3"></div>

                  {/* Fee rows */}
                  <div className="d-flex flex-column gap-3 mb-4 small font-monospace">
                    <div className="d-flex justify-content-between align-items-center text-muted">
                      <span className="text-truncate pe-2">&gt; SUBTOTAL</span>
                      <span className="text-nowrap flex-shrink-0 text-end">INR {itemTotal}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-muted">
                      <span className="text-truncate pe-2">&gt; TRANSPORT_FEE</span>
                      <span className="text-cyan text-nowrap flex-shrink-0 text-end">+ INR {deliveryFee}</span>
                    </div>
                  </div>

                  <div className="border-bottom-wire border-magenta mb-3"></div>

                  {/* Grand total */}
                  <div className="d-flex justify-content-between align-items-end mb-4">
                    <span className="text-magenta fs-6 text-nowrap pe-2">SYS_TOTAL</span>
                    <span className="text-magenta fs-2 fw-bold lh-1 text-nowrap text-end flex-shrink-0">INR {grandTotal}</span>
                  </div>

                  {/* MASSIVE CHECKOUT BUTTON */}
                  <button
                    className="y2k-btn-checkout w-100 mb-2 d-flex justify-content-center align-items-center"
                    disabled={submitting || !payMethod}
                    onClick={payMethod === "cod" ? handleCheckout : handleStripeCheckout}
                  >
                    {submitting ? (
                      <><span className="blink">_</span> TRANSMITTING...</>
                    ) : !payMethod ? (
                      "[ AWAITING_PROTOCOL ]"
                    ) : (
                      "[ TRANSMIT_PAYLOAD ]"
                    )}
                  </button>
                  
                  {/* Warning label if form incomplete */}
                  {(!deliveryAddress || !phone) && (
                    <div className="text-center text-magenta mt-2 font-monospace" style={{fontSize: "0.7rem"}}>
                      WARN: INPUT_COORDINATES_REQUIRED
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/*  RIGHT: System Diagnostics  */}
            <div className="col-12 col-lg-6 col-xl-3 d-none d-xl-block">
              <div className="position-sticky" style={{ top: "80px" }}>
                
                <div className="y2k-wire-box p-4 text-start h-100 d-flex flex-column gap-3 border-cyan">
                  <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-2">
                    <span className="text-cyan small">/// SECURITY_MODULE</span>
                  </div>

                  {/* ASCII Lock */}
                  <div className="text-center font-monospace text-cyan my-3" style={{ fontSize: "0.6rem", whiteSpace: "pre" }}>
                    {`
   .--------.
  / .------. \\
 / /        \\ \\
 | |        | |
_| |________| |_
.' |_|        |_| '.
'._____ ____ _____.'
|     .'____'.     |
'.__.'.'    '.'.__.'
'.__  | SYS  |  __.'
|   '.'.____.'.'   |
'.____'.____.'____.'
'.________________.'
                    `}
                  </div>

                  <div className="border-bottom-wire border-cyan"></div>

                  {/* Dynamic Encryption Key Visual */}
                  <div>
                    <div className="text-muted mb-1" style={{ fontSize: "0.7rem" }}>&gt; SESSION_KEY_GEN</div>
                    <div className="font-monospace text-magenta text-truncate" style={{ fontSize: "0.8rem", background: "rgba(255,0,85,0.1)", padding: "4px" }}>
                      {encKey}
                    </div>
                  </div>

                  <div className="border-bottom-wire border-cyan mt-2"></div>
                  
                  {/* Status List */}
                  <div className="text-muted font-monospace" style={{ fontSize: "0.65rem", lineHeight: "1.6" }}>
                    &gt; SSL_CERT: <span className="text-cyan">VALID</span><br/>
                    &gt; HANDSHAKE: <span className={payMethod ? "text-cyan" : "text-muted"}>{payMethod ? "ESTABLISHED" : "PENDING"}</span><br/>
                    &gt; GEO_DATA: <span className={deliveryAddress ? "text-cyan" : "text-muted"}>{deliveryAddress ? "LOCKED" : "AWAITING"}</span><br/>
                    &gt; COMM_NODE: <span className={phone ? "text-cyan" : "text-muted"}>{phone ? "ACTIVE" : "AWAITING"}</span>
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
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #02060d; 
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.2);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.2);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  /* BASE STYLES */
  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background: 
      linear-gradient(rgba(1, 3, 10, 0.8), rgba(1, 3, 10, 0.85)),
      url('/y2k_fooddash_bg.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    
    min-height: 100vh;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  /* GRID & OVERLAYS */
  .y2k-grid-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(var(--cyan-dim) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0; pointer-events: none; opacity: 0.5;
  }

  .scanlines {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
    background-size: 100% 4px; z-index: 9999; pointer-events: none; opacity: 0.6;
  }

  /* UTILS */
  .text-cyan { color: var(--cyan) !important; }
  .text-magenta { color: var(--magenta) !important; }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border-color: var(--magenta) !important; border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /* WIREFRAME BOXES */
  .y2k-wire-box {
    background: rgba(2, 6, 13, 0.85);
    backdrop-filter: blur(4px);
    border: var(--wire-border);
    position: relative;
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 8px; height: 8px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  
  .y2k-wire-box.border-magenta::before, .y2k-wire-box.border-magenta::after { border-color: var(--magenta); }

  /* TYPOGRAPHY */
  .y2k-title-bar {
    font-family: 'DotGothic16', sans-serif;
  }

  /* TERMINAL INPUTS */
  .y2k-input-group {
    background: rgba(0,0,0,0.6);
    border: 1px solid var(--cyan-glow);
    transition: all 0.2s;
  }
  .y2k-input-group:focus-within {
    border-color: var(--cyan);
    box-shadow: 0 0 10px var(--cyan-dim);
  }
  .y2k-input-prefix {
    font-size: 0.8rem;
    background: rgba(0, 229, 255, 0.05);
  }
  .y2k-input {
    background: transparent;
    border: none;
    color: var(--text-main);
    font-family: 'Share Tech Mono', monospace;
    outline: none;
    font-size: 0.9rem;
  }
  .y2k-input::placeholder { color: rgba(94, 121, 147, 0.4); }

  /* PROTOCOL SELECTION BUTTONS */
  .y2k-pay-option {
    background: rgba(0,0,0,0.4);
    border: 1px solid var(--text-muted);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    transition: all 0.2s;
  }
  .y2k-pay-option:hover {
    border-color: var(--cyan);
    background: var(--cyan-dim);
  }
  .y2k-pay-option.active {
    background: var(--magenta-dim);
    border-color: var(--magenta);
    box-shadow: inset 0 0 15px rgba(255,0,85,0.2);
  }
  .y2k-pay-option.active .text-main { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255,0,85,0.5); }

  /* THE MASSIVE CHECKOUT BUTTON */
  .y2k-btn-checkout {
    background: rgba(255, 0, 85, 0.1);
    border: 2px solid var(--magenta);
    color: var(--magenta);
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.9rem, 1.8vw, 1.15rem); 
    font-weight: bold;
    padding: 14px 8px;
    text-align: center;
    text-shadow: 0 0 8px rgba(255, 0, 85, 0.8);
    box-shadow: inset 0 0 15px rgba(255, 0, 85, 0.2);
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
    letter-spacing: 1px;
    cursor: pointer;
  }
  .y2k-btn-checkout:hover:not(:disabled) {
    background: var(--magenta);
    color: #fff;
    text-shadow: none;
    box-shadow: 0 0 25px rgba(255, 0, 85, 0.6);
    transform: scale(1.02);
  }
  .y2k-btn-checkout:disabled {
    background: rgba(0,0,0,0.5);
    border-color: var(--text-muted);
    color: var(--text-muted);
    text-shadow: none;
    box-shadow: none;
    cursor: not-allowed;
  }

  .y2k-btn-magenta {
    background: transparent;
    border: 1px solid var(--magenta);
    color: var(--magenta);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    transition: all 0.2s;
  }
  .y2k-btn-magenta:hover {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 15px var(--magenta-dim);
  }

  /* PROGRESS BAR (Loading) */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }
`;