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
      setError(err.response?.data?.message || "SYS_ERR: FAILED_TO_MOUNT_CART");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const checkout = async () => {
    if (cart.length === 0) return alert("SYS_HALT: CART_EMPTY");
    navigate("/checkout");
  };

  const removeItem = async (id) => {
    setRemovingId(id);
    try {
      await api.delete(`/orders/cart/${id}`);
      setCart((prev) => prev.filter((item) => item._id !== id));
      fetchCartCount();
    } catch {
      alert("SYS_ERR: FAILED_TO_TERMINATE_PROCESS");
    } finally {
      setRemovingId(null);
    }
  };

  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 49 : 0;
  const grandTotal = itemTotal + deliveryFee;

  const foodEmojis = ["🍔", "🍕", "🌮", "🍜", "🍱", "🥗", "🍛", "🌯"];
  const getEmoji = (name = "") => foodEmojis[name.charCodeAt(0) % foodEmojis.length];

  // Generate some fake hex code for the aesthetic sidebar
  const fakeHexDump = Array.from({ length: 8 }).map((_, i) => {
    const addr = (0x00400000 + i * 16).toString(16).toUpperCase().padStart(8, '0');
    const hex = Array.from({ length: 8 }).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(' ');
    return `${addr}  ${hex}`;
  });

  /* Loading  */
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box p-4 text-center" style={{ width: "320px" }}>
            <div className="mb-3 text-cyan">FETCHING_DATA_PACKETS... <span className="blink">_</span></div>
            <div className="y2k-progress-bar">
              <div className="y2k-progress-fill" style={{ animationDuration: '2s' }}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* Error  */
  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box border-magenta p-4 text-center">
            <span className="text-magenta d-block mb-2" style={{ fontSize: "2rem" }}>[ ! ]</span>
            <p className="mb-0 text-magenta font-monospace">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page pb-5">
        {/* Blueprint Grid & Scanlines */}
        <div className="y2k-grid-bg"></div>
        <div className="scanlines"></div>

        <div className="container-fluid px-3 px-xl-4 position-relative z-1 pt-4 w-100">

          {/* Header */}
          <div className="y2k-title-bar d-flex justify-content-between align-items-center mb-4 p-2">
            <h1 className="y2k-title mb-0 fs-5 text-cyan d-flex align-items-center gap-2">
              <span className="blink">_</span> C:\USER\SESSION\CART.exe
            </h1>
            <span className="text-muted d-none d-sm-block small">
              [ STATUS: {cart.length > 0 ? 'ALLOCATED' : 'EMPTY'} ]
            </span>
          </div>

          {cart.length === 0 ? (
            /* Empty state */
            <div className="y2k-wire-box text-center p-5 mt-4 mx-auto" style={{ maxWidth: "600px" }}>
              <div className="mb-3 text-muted" style={{ fontSize: 48 }}>[ 0_BYTES ]</div>
              <h2 className="text-cyan mb-2 fs-4">DIR_EMPTY</h2>
              <p className="text-muted mb-4 small">NO_EXECUTABLES_FOUND_IN_CART</p>
              <Link to="/" className="y2k-btn-magenta text-decoration-none d-inline-block px-4 py-2">
                [ RUN: BROWSE_HOSTS ]
              </Link>
            </div>

          ) : (
            /* Layout Grid Shifted to 5 - 4 - 3 for better breathing room */
            <div className="row g-4 align-items-start">

              {/* COL 1: Items List (col-xl-5) */}
              <div className="col-12 col-xl-5">
                <div className="d-flex justify-content-between border-bottom-wire pb-2 mb-3">
                  <span className="text-cyan small">/// ALLOCATED_RESOURCES</span>
                  <span className="text-cyan small">COUNT: {cart.length}</span>
                </div>

                <div className="d-flex flex-column gap-3">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className={`y2k-wire-box p-3 d-flex flex-column flex-sm-row align-items-sm-center gap-3 ${removingId === item._id ? "opacity-50" : ""}`}
                    >
                      <div className="d-flex align-items-center gap-3 w-100 text-start overflow-hidden">
                        <div className="y2k-item-icon d-flex align-items-center justify-content-center flex-shrink-0 border-cyan text-cyan">
                          {getEmoji(item.name)}
                        </div>
                        
                        <div className="flex-grow-1 overflow-hidden pe-2">
                          <div className="text-muted small mb-1">ID: {item._id.slice(-6).toUpperCase()}</div>
                          <div className="text-main fw-bold text-truncate" style={{ fontSize: "1.1rem" }}>{item.name.toUpperCase()}</div>
                          <div className="text-cyan small mt-1">INR {item.price} × {item.quantity} UNIT(S)</div>
                        </div>

                        <div className="d-flex flex-column align-items-end flex-shrink-0 gap-2 ms-auto">
                          <span className="text-magenta fw-bold fs-5 text-nowrap">INR {item.price * item.quantity}</span>
                          <button
                            className="y2k-btn-outline text-muted text-nowrap"
                            onClick={() => removeItem(item._id)}
                            disabled={removingId === item._id}
                          >
                            {removingId === item._id ? "[ ... ]" : "[ DEL ]"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COL 2: Transaction Log & Checkout Button (Widened to col-xl-4) */}
              <div className="col-12 col-lg-6 col-xl-4">
                <div className="position-sticky" style={{ top: "80px" }}>
                  <div className="d-flex justify-content-between border-bottom-wire border-magenta pb-2 mb-3">
                    <span className="text-magenta small">/// TRANSACTION_LOG</span>
                  </div>

                  <div className="y2k-wire-box border-magenta p-3 p-xl-4 text-start overflow-hidden">
                    
                    <div className="d-flex flex-column gap-3 mb-4 small font-monospace">
                      {/* Flex safeguard: text-truncate on left, flex-shrink-0 text-nowrap on right */}
                      <div className="d-flex justify-content-between align-items-center w-100 text-muted">
                        <span className="text-truncate pe-2">&gt; SUBTOTAL</span>
                        <span className="text-nowrap flex-shrink-0 text-end">INR {itemTotal}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center w-100 text-muted">
                        <span className="text-truncate pe-2">&gt; TRANSPORT_FEE</span>
                        <span className="text-cyan text-nowrap flex-shrink-0 text-end">+ INR {deliveryFee}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center w-100 text-muted">
                        <span className="text-truncate pe-2">&gt; PLATFORM_TAX</span>
                        <span className="text-cyan text-nowrap flex-shrink-0 text-end">[ BYPASSED ]</span>
                      </div>
                    </div>

                    <div className="border-bottom-wire border-magenta mb-3"></div>

                    {/* Grand total */}
                    <div className="d-flex justify-content-between align-items-end mb-4">
                      <span className="text-magenta fs-6 text-nowrap pe-2">SYS_TOTAL</span>
                      <span className="text-magenta fs-2 fw-bold lh-1 text-nowrap text-end flex-shrink-0">INR {grandTotal}</span>
                    </div>

                    {/* MASSIVE CHECKOUT BUTTON with Clamp Font Size */}
                    <button
                      className="y2k-btn-checkout w-100 mb-4 d-flex justify-content-center align-items-center"
                      onClick={checkout}
                    >
                      [ INITIATE_CHECKOUT ]
                    </button>

                    {/* Status Console below button */}
                    <div className="y2k-console-output p-2 text-muted small font-monospace border-cyan" style={{ fontSize: "0.7rem", border: "1px dashed" }}>
                      &gt; SECURE_TUNNEL: ESTABLISHED<br/>
                      &gt; ENCRYPTION: AES-256-GCM<br/>
                      &gt; PAYMENT_GATEWAY: STANDBY<br/>
                      <span className="blink">_</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* COL 3: System Diagnostics (col-xl-3) */}
              <div className="col-12 col-lg-6 col-xl-3 d-none d-lg-block">
                <div className="position-sticky" style={{ top: "80px" }}>
                  <div className="d-flex justify-content-between border-bottom-wire pb-2 mb-3">
                    <span className="text-cyan small">/// SYS_DIAGNOSTICS</span>
                  </div>

                  <div className="y2k-wire-box p-3 text-start h-100 d-flex flex-column gap-3">
                    
                    {/* Fake Memory Dump */}
                    <div className="overflow-hidden">
                      <div className="text-cyan mb-2 text-nowrap" style={{ fontSize: "0.7rem" }}>&gt; MEM_DUMP [CART_CACHE]</div>
                      <div className="font-monospace text-muted text-nowrap overflow-hidden" style={{ fontSize: "0.65rem", lineHeight: "1.4", opacity: 0.7 }}>
                        {fakeHexDump.map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </div>
                    </div>

                    <div className="border-bottom-wire border-cyan"></div>

                    {/* Radar / Node connection visual */}
                    <div>
                      <div className="text-cyan mb-2" style={{ fontSize: "0.7rem" }}>&gt; ROUTING_PATH</div>
                      <div className="position-relative border-cyan p-2 d-flex align-items-center justify-content-center" style={{ height: "120px", border: "1px solid" }}>
                        <div className="crosshair-center"></div>
                        <div className="y2k-radar-sweep"></div>
                        <span className="text-magenta" style={{ fontSize: "0.7rem", position: "absolute", bottom: "5px", right: "5px" }}>TGT_LOCKED</span>
                      </div>
                    </div>

                    <div className="border-bottom-wire border-cyan"></div>
                    
                    {/* Server Info */}
                    <div className="text-muted text-uppercase" style={{ fontSize: "0.7rem" }}>
                      HOST: LOCAL_MACHINE<br/>
                      PORT: 5173<br/>
                      LATENCY: 12ms<br/>
                      PACKET_LOSS: 0.00%
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
    background-color: var(--bg-color);
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
  
  .y2k-wire-box.border-magenta::before, .y2k-wire-box.border-magenta::after {
    border-color: var(--magenta);
  }

  /* TYPOGRAPHY */
  .y2k-title-bar {
    background: rgba(0, 229, 255, 0.05);
    border: var(--wire-border);
    font-family: 'DotGothic16', sans-serif;
  }

  /* CART SPECIFIC */
  .y2k-item-icon {
    width: 60px; height: 60px;
    background: rgba(0, 229, 255, 0.05);
    font-size: 1.8rem;
    box-shadow: inset 0 0 10px var(--cyan-dim);
  }

  /* STANDARD BUTTONS */
  .y2k-btn-outline {
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    transition: all 0.2s;
    font-size: 0.85rem;
  }
  .y2k-btn-outline:hover { color: var(--magenta) !important; text-shadow: 0 0 5px var(--magenta); }

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

  /* THE MASSIVE CHECKOUT BUTTON - Fixed for overflow */
  .y2k-btn-checkout {
    background: rgba(255, 0, 85, 0.1);
    border: 2px solid var(--magenta);
    color: var(--magenta);
    font-family: 'Share Tech Mono', monospace;
    
    /* Responsive font scaling: Never gets bigger than 1.15rem, shrinks on narrow columns */
    font-size: clamp(0.9rem, 1.8vw, 1.15rem); 
    font-weight: bold;
    padding: 14px 8px;
    text-align: center;
    text-shadow: 0 0 8px rgba(255, 0, 85, 0.8);
    box-shadow: inset 0 0 15px rgba(255, 0, 85, 0.2);
    transition: all 0.2s;
    
    /* Prevent text from wrapping or bleeding out */
    white-space: nowrap;
    overflow: hidden;
    letter-spacing: 1px;
    cursor: pointer;
  }
  .y2k-btn-checkout:hover {
    background: var(--magenta);
    color: #fff;
    text-shadow: none;
    box-shadow: 0 0 25px rgba(255, 0, 85, 0.6);
    transform: scale(1.02);
  }

  /* PROGRESS BAR & RADAR */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }

  .crosshair-center {
    position: absolute; width: 40px; height: 40px;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    border: 1px solid var(--cyan-glow); z-index: 2; pointer-events: none;
  }
  .crosshair-center::before { content: ''; position: absolute; top: 50%; left: -10px; right: -10px; height: 1px; background: var(--cyan-glow); }
  .crosshair-center::after { content: ''; position: absolute; left: 50%; top: -10px; bottom: -10px; width: 1px; background: var(--cyan-glow); }
  
  .y2k-radar-sweep {
    position: absolute; width: 100px; height: 100px;
    border-radius: 50%; border: 1px dashed var(--cyan-dim);
    animation: spin 4s linear infinite;
  }
  .y2k-radar-sweep::before {
    content: ''; position: absolute; top: 0; left: 50%; width: 50%; height: 50%;
    background: linear-gradient(90deg, transparent, var(--cyan-glow));
    transform-origin: bottom left;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;