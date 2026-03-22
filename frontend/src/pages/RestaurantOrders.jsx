import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

export default function RestaurantOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      if (!user) return;
      
      const res = await api.get(`/orders`);
      const payload = res.data.orders || res.data;
      setOrders(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("[SYS.ERR] MAINFRAME_FETCH_FAILED:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);
  
  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("[SYS.ERR] STATUS_OVERRIDE_FAILED:", error);
    }
  };

  if (loading) {
    return (
      <div className="y2k-page vh-100 d-flex justify-content-center align-items-center">
        <style>{styles}</style>
        <div className="scanlines"></div>
        <div className="text-cyan font-monospace fs-4">
          &gt; QUERYING_ORDER_DATABASE... <span className="blink">_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="y2k-page min-vh-100 position-relative pb-5">
      <style>{styles}</style>
      
      <div className="scanlines"></div>
      <div className="y2k-grid-bg"></div>

      <div className="container position-relative z-1 pt-5">
        
        {/* HEADER */}
        <div className="mb-5 border-bottom-wire border-cyan pb-3">
          <div className="text-cyan font-monospace small mb-1">/// DATABASE: ACTIVE_ORDERS</div>
          <h2 className="y2k-title text-main m-0 fs-2 text-uppercase">
            INCOMING_TRANSMISSIONS <span className="blink text-cyan">_</span>
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="y2k-wire-box border-cyan p-4 text-center">
            <span className="text-cyan font-monospace">NO_INCOMING_TRANSMISSIONS...</span>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div key={order._id} className="col-12 col-md-6 col-lg-4">
                <div className="y2k-wire-box h-100 p-4 d-flex flex-column">
                  
                  {/* Order Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3 border-bottom-wire border-cyan pb-2">
                    <h5 className="text-main font-monospace m-0">
                      ID: <span className="text-cyan">#{order._id.slice(-6)}</span>
                    </h5>
                    <span className="font-monospace small fw-bold px-2 py-1 bg-magenta-dim border-magenta text-magenta" style={{ border: "1px solid" }}>
                      [ {(order.status || "unknown").toUpperCase()} ]
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="text-muted font-monospace small mb-3 flex-grow-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="d-flex justify-content-between">
                        <span>&gt; {item.name}</span>
                        <span className="text-main">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between text-main font-monospace mb-4 pb-2 border-bottom-wire border-cyan">
                    <span>TOTAL_VALUE:</span>
                    <span className="text-cyan fw-bold">₹{order.totalPrice}</span>
                  </div>

                  {/* Actions */}
                  <div className="d-flex flex-column gap-2 mt-auto">
                    <button
                      className="y2k-btn-action w-100"
                      onClick={() => updateStatus(order._id, "accepted")}
                    >
                      [ ACCEPT_ORDER ]
                    </button>

                    <button
                      className="y2k-btn-action w-100"
                      onClick={() => updateStatus(order._id, "preparing")}
                    >
                      [ INITIALIZE_PREP ]
                    </button>

                    <button
                      className="y2k-btn-action w-100"
                      onClick={() => updateStatus(order._id, "delivered")}
                    >
                      [ MARK_DELIVERED ]
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Ensure the standard Y2K CSS is injected
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #010308; 
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.1);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.1);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background-color: var(--bg-color);
  }

  .y2k-grid-bg {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(var(--cyan-dim) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0; pointer-events: none; opacity: 0.3;
  }

  .scanlines {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
    background-size: 100% 4px; z-index: 9999; pointer-events: none; opacity: 0.6;
  }

  .text-cyan { color: var(--cyan) !important; text-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
  .text-magenta { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255, 0, 85, 0.3); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  .y2k-wire-box {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: var(--wire-border);
    position: relative;
    transition: all 0.3s ease;
  }
  .y2k-wire-box:hover {
    box-shadow: 0 0 15px var(--cyan-dim);
    border-color: var(--cyan);
  }

  .y2k-title { font-family: 'DotGothic16', sans-serif; }

  .y2k-btn-action {
    background: transparent;
    border: 1px solid var(--cyan-glow);
    color: var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-action:hover {
    background: var(--cyan-dim);
    box-shadow: 0 0 10px var(--cyan-dim);
    border-color: var(--cyan);
  }
`;