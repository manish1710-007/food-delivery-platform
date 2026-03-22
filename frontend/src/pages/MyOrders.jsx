import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        const payload = res.data?.orders || res.data;
        setOrders(Array.isArray(payload) ? payload : [])
      } catch (error) {
        console.error(error);
        alert("SYS_ERR: FAILED_TO_QUERY_ARCHIVES");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper to color-code the retro terminal statuses
  const getStatusColor = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("deliver") || s.includes("complet")) return "text-cyan border-cyan";
    if (s.includes("cancel") || s.includes("fail")) return "text-magenta border-magenta";
    return "text-amber border-amber"; // Default/Pending
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box p-4 text-center" style={{ width: "320px" }}>
            <div className="mb-3 text-cyan">QUERYING_ARCHIVES... <span className="blink">_</span></div>
            <div className="y2k-progress-bar">
              <div className="y2k-progress-fill" style={{ animationDuration: '1.5s' }}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box text-center p-5 mx-auto" style={{ maxWidth: "600px" }}>
            <div className="mb-3 text-muted" style={{ fontSize: 48 }}>[ 0_RECORDS ]</div>
            <h2 className="text-cyan mb-2 fs-4">ARCHIVE_EMPTY</h2>
            <p className="text-muted mb-4 small">NO_PREVIOUS_TRANSACTIONS_FOUND</p>
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
          
          {/* Header */}
          <div className="y2k-title-bar d-flex justify-content-between align-items-center mb-4 p-2">
            <h1 className="y2k-title mb-0 fs-5 text-cyan d-flex align-items-center gap-2 m-0 p-2">
              <span className="blink">_</span> C:\USER\SYS_ARCHIVES\ORDERS.exe
            </h1>
            <span className="text-muted d-none d-sm-block small">
              [ DB_CONN: STABLE ]
            </span>
          </div>

          <div className="row g-4 align-items-start">

            {/*  LEFT: Order Archive List  */}
            <div className="col-12 col-xl-9">
              <div className="y2k-wire-box border-cyan p-3 p-md-4">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                  <span className="text-cyan small">/// TRANSACTION_HISTORY</span>
                  <span className="text-cyan small">RECORDS_FOUND: {orders.length}</span>
                </div>

                <div className="d-flex flex-column gap-3">
                  {orders.map((order) => {
                    const statusStyles = getStatusColor(order.status);
                    
                    return (
                      <div key={order._id} className="y2k-order-row p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 border-cyan">
                        
                        {/* ID & Date */}
                        <div className="d-flex flex-column gap-1">
                          <div className="text-muted small font-monospace">
                            &gt; TS: {new Date(order.createdAt).toLocaleString().replace('T', ' ').substring(0, 19)}
                          </div>
                          <div className="text-main fw-bold fs-5 font-monospace">
                            PKT_ID: {order._id.slice(-6).toUpperCase()}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="d-flex align-items-center justify-content-md-center">
                          <span className={`y2k-status-badge font-monospace small px-2 py-1 ${statusStyles}`} style={{ border: "1px solid" }}>
                            [ {(order.status || "unknown").toUpperCase()} ]
                          </span>
                        </div>

                        {/* Total & Action */}
                        <div className="d-flex flex-row flex-md-column align-items-center align-items-md-end justify-content-between gap-2">
                          <span className="text-magenta fw-bold fs-5 font-monospace">
                            INR {order.totalPrice}
                          </span>
                          <button
                            className="y2k-btn-outline text-cyan font-monospace px-3 py-1"
                            onClick={() => navigate(`/orders/${order._id}`)}
                          >
                            [ INSPECT_NODE ]
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/*  RIGHT: Archive Diagnostics  */}
            <div className="col-12 col-xl-3 d-none d-xl-block">
              <div className="position-sticky" style={{ top: "80px" }}>
                <div className="y2k-wire-box p-4 text-start h-100 d-flex flex-column gap-3 border-magenta">
                  <div className="d-flex justify-content-between border-bottom-wire border-magenta pb-2 mb-2">
                    <span className="text-magenta small">/// ARCHIVE_STATS</span>
                  </div>

                  {/* Stat Blocks */}
                  <div className="d-flex flex-column gap-3 font-monospace small">
                    <div>
                      <div className="text-muted mb-1">&gt; TOTAL_ALLOCATIONS</div>
                      <div className="text-main fs-4 fw-bold">{orders.length}</div>
                    </div>
                    
                    <div className="border-bottom-wire border-magenta opacity-50"></div>

                    <div>
                      <div className="text-muted mb-1">&gt; LAST_SYNC</div>
                      <div className="text-cyan text-truncate">
                        {new Date().toISOString().replace('T', ' ').substring(0, 19)}
                      </div>
                    </div>

                    <div className="border-bottom-wire border-magenta opacity-50"></div>

                    <div>
                      <div className="text-muted mb-1">&gt; DB_UPTIME</div>
                      <div className="text-cyan">99.99%</div>
                    </div>
                  </div>

                  {/* Decorative Chart/Grid */}
                  <div className="mt-4 border-magenta p-2" style={{ border: "1px dashed", height: "100px", position: "relative" }}>
                    <div className="text-magenta small position-absolute top-0 start-0 p-1" style={{ fontSize: "0.6rem" }}>SYS_LOAD</div>
                    <div className="d-flex align-items-end justify-content-between h-100 pt-3 gap-1 opacity-75">
                      {/* Fake bars */}
                      {[40, 70, 30, 90, 50, 80, 20].map((h, i) => (
                        <div key={i} className="bg-magenta" style={{ width: "12%", height: `${h}%` }}></div>
                      ))}
                    </div>
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
    --amber: #ffb700;
    --amber-dim: rgba(255, 183, 0, 0.2);
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
  .text-cyan { color: var(--cyan) !important; text-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
  .text-magenta { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255, 0, 85, 0.3); }
  .text-amber { color: var(--amber) !important; text-shadow: 0 0 5px rgba(255, 183, 0, 0.3); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-magenta { background-color: var(--magenta) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-amber { border: 1px solid var(--amber) !important; }
  
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-bottom-wire.border-magenta { border-bottom-color: rgba(255, 0, 85, 0.5); }
  
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
    background: rgba(0, 229, 255, 0.05);
    border: var(--wire-border);
    font-family: 'DotGothic16', sans-serif;
  }

  /* ORDER ROWS */
  .y2k-order-row {
    background: rgba(0, 0, 0, 0.4);
    transition: all 0.2s;
  }
  .y2k-order-row:hover {
    background: rgba(0, 229, 255, 0.05);
    box-shadow: inset 0 0 15px var(--cyan-dim);
  }
  
  .y2k-status-badge {
    background: rgba(0,0,0,0.6);
    letter-spacing: 1px;
    white-space: nowrap;
  }

  /* BUTTONS */
  .y2k-btn-outline {
    background: transparent;
    border: 1px solid var(--cyan);
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-outline:hover { 
    background: var(--cyan);
    color: #000 !important;
    text-shadow: none;
    box-shadow: 0 0 10px var(--cyan-dim);
  }

  .y2k-btn-magenta {
    background: transparent;
    border: 1px solid var(--magenta);
    color: var(--magenta);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    transition: all 0.2s;
    font-size: 1.1rem;
    box-shadow: inset 0 0 10px rgba(255,0,85,0.1);
  }
  .y2k-btn-magenta:hover {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 15px var(--magenta-dim);
  }

  /* PROGRESS BAR */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }
`;