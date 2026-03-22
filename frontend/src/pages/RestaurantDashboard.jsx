import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";
import OrderFilters from "../components/OrderFilters";

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = useCallback(async (customFilters = filters, currentPage = page) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...customFilters,
        page: currentPage,
        limit: 5,
      });

      const res = await api.get(`/orders?${params}`);

      const payload = res.data.orders || res.data;
      setOrders(Array.isArray(payload) ? payload : []);
      setTotalPages(res.data.totalPages || 1);

    } catch (err) {
      console.error(err);
      console.error("[SYS.ERR] FAILED_TO_FETCH_MAINFRAME_DATA");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    socket.connect();

    if (user && user._id) {
      socket.emit("JoinRestaurant", user._id);
    }

    socket.on("newOrder", (order) => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on("orderUpdated", ({ orderId, status }) => {
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
      socket.disconnect();
    };
  }, [user]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    fetchOrders(newFilters, 1);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error("[SYS.ERR] FAILED_TO_UPDATE_NODE:", err);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "text-magenta border-magenta bg-magenta-dim";
      case "preparing": return "text-warning border-warning";
      case "on_the_way": return "text-info border-info";
      case "delivered": return "text-cyan border-cyan bg-cyan-dim";
      case "cancelled": return "text-muted border-secondary";
      default: return "text-cyan border-cyan";
    }
  };

  if (loading) {
    return (
      <div className="y2k-page vh-100 d-flex justify-content-center align-items-center">
        <style>{styles}</style>
        <div className="scanlines"></div>
        <div className="text-cyan font-monospace fs-4">
          &gt; QUERYING_MAINFRAME_DB... <span className="blink">_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="y2k-page min-vh-100 position-relative pb-5">
      <style>{styles}</style>
      
      <div className="container position-relative z-1 pt-4">
        
        {/* HEADER */}
        <div className="mb-4 border-bottom-wire border-cyan pb-2 d-flex justify-content-between align-items-end">
          <div>
            <div className="text-cyan font-monospace small mb-1">/// SECURE_NODE: ACTIVE</div>
            <h2 className="y2k-title text-main m-0 fs-2 text-uppercase d-flex align-items-center gap-2">
              SYS_DASHBOARD <span className="blink text-cyan">_</span>
            </h2>
          </div>
          <div className="text-muted font-monospace small d-none d-md-block">
            ACTIVE_SESSIONS: {orders.length}
          </div>
        </div>

        {/* FILTERS */}
        <div className="y2k-wire-box p-3 mb-4 y2k-glass">
          <div className="text-cyan small font-monospace mb-3 border-bottom-wire border-cyan pb-1 d-inline-block">
            &gt; APPLY_DATA_FILTERS:
          </div>
          <OrderFilters onFilter={handleFilter} />
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="y2k-wire-box border-cyan p-5 text-center mt-5">
            <div className="fs-1 mb-3 opacity-50">📡</div>
            <span className="text-cyan font-monospace fs-5">AWAITING_INCOMING_TRANSMISSIONS...</span>
            <p className="text-muted font-monospace small mt-2">Node is actively listening for new data packets.</p>
          </div>
        )}

        {/* ORDERS LIST */}
        <div className="row g-4">
          {Array.isArray(orders) && orders.map(order => (
            <div key={order._id} className="col-12 col-xl-6">
              <div className="y2k-wire-box h-100 d-flex flex-column overflow-hidden y2k-card-hover">
                
                {/* Order Header Ribbon */}
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom-wire border-cyan bg-dark-glass">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted font-monospace small">ID:</span>
                    <span className="text-cyan font-monospace fs-5 fw-bold">#{order._id.slice(-6)}</span>
                  </div>
                  
                  {/* Dynamic Status Indicator */}
                  <span className={`font-monospace small fw-bold px-3 py-1 ${getStatusColor(order.status)}`} style={{ border: "1px solid", borderRadius: "2px" }}>
                    [ {order.status.replace("_", " ").toUpperCase()} ]
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  
                  {/* User & Price Summary */}
                  <div className="d-flex justify-content-between text-main font-monospace mb-4 p-2 bg-dark-glass border-start border-cyan" style={{ borderLeftWidth: "3px !important" }}>
                    <div className="d-flex flex-column">
                      <span className="text-muted" style={{ fontSize: "0.7rem" }}>REQUESTING_NODE</span>
                      <span className="text-main">{order.user?.name || "UNKNOWN_NODE"}</span>
                    </div>
                    <div className="d-flex flex-column text-end">
                      <span className="text-muted" style={{ fontSize: "0.7rem" }}>TOTAL_VALUE</span>
                      <span className="text-cyan fw-bold fs-5">₹{order.totalPrice}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="text-muted font-monospace small mb-4 flex-grow-1">
                    <div className="border-bottom-wire border-cyan pb-1 mb-2 text-cyan opacity-75">
                      &gt; PAYLOAD_CONTENTS
                    </div>
                    {order.items?.map(item => (
                      <div key={item.product} className="d-flex justify-content-between align-items-center py-1 border-bottom border-dark">
                        <span>- {item.name}</span>
                        <span className="text-main bg-dark px-2 rounded">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* ACTION BUTTONS GRID */}
                  <div className="mt-auto">
                    <div className="text-muted font-monospace mb-2" style={{ fontSize: "0.65rem" }}>
                      &gt; AVAILABLE_ACTIONS
                    </div>
                    
                    <div className="d-grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>
                      
                      <button
                        className={`y2k-btn-action text-center ${order.status === "pending" ? "glowing-btn" : ""}`}
                        onClick={() => updateStatus(order._id, "accepted")}
                        disabled={order.status !== "pending"}
                      >
                        [ ACCEPT ]
                      </button>

                      <button
                        className={`y2k-btn-action text-center ${order.status === "accepted" ? "glowing-btn text-warning border-warning" : ""}`}
                        onClick={() => updateStatus(order._id, "preparing")}
                        disabled={order.status !== "accepted"}
                      >
                        [ PREPARE ]
                      </button>

                      <button
                        className={`y2k-btn-action text-center ${order.status === "preparing" ? "glowing-btn text-info border-info" : ""}`}
                        onClick={() => updateStatus(order._id, "on_the_way")}
                        disabled={order.status !== "preparing"}
                      >
                        [ DISPATCH ]
                      </button>

                      <button
                        className={`y2k-btn-action text-center ${order.status === "on_the_way" ? "glowing-btn text-cyan border-cyan" : ""}`}
                        onClick={() => updateStatus(order._id, "delivered")}
                        disabled={order.status !== "on_the_way"}
                      >
                        [ DELIVER ]
                      </button>
                    </div>

                    <button
                      className="y2k-btn-danger w-100 mt-2 py-2"
                      onClick={() => updateStatus(order._id, "cancelled")}
                      disabled={order.status === "delivered" || order.status === "cancelled"}
                    >
                      [ ABORT_SEQUENCE ]
                    </button>

                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-5 p-3 y2k-wire-box font-monospace">
            <button
              className="y2k-btn-action px-4 py-2"
              disabled={page === 1}
              onClick={prevPage}
            >
              &lt;&lt; REWIND
            </button>

            <span className="text-cyan fw-bold">
              BLOCK {page} // {totalPages}
            </span>

            <button
              className="y2k-btn-action px-4 py-2"
              disabled={page === totalPages}
              onClick={nextPage}
            >
              FORWARD &gt;&gt;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #010308; 
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.1);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.1);
    --warning: #ffb703;
    --info: #4cc9f0;
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background-color: transparent; 
  }

  /* UTILS */
  .text-cyan { color: var(--cyan) !important; text-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
  .text-magenta { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255, 0, 85, 0.3); }
  .text-warning { color: var(--warning) !important; text-shadow: 0 0 5px rgba(255, 183, 3, 0.3); }
  .text-info { color: var(--info) !important; text-shadow: 0 0 5px rgba(76, 201, 240, 0.3); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan-dim { background-color: var(--cyan-dim) !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  .bg-dark-glass { background-color: rgba(2, 6, 13, 0.6) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-warning { border: 1px solid var(--warning) !important; }
  .border-info { border: 1px solid var(--info) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /* WIREFRAME BOXES */
  .y2k-wire-box {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    border: var(--wire-border);
    position: relative;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 6px; height: 6px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  /* HOVER EFFECTS */
  .y2k-card-hover {
    transition: all 0.3s ease;
  }
  .y2k-card-hover:hover {
    border-color: var(--cyan);
    box-shadow: 0 0 15px var(--cyan-dim), inset 0 0 10px rgba(0,0,0,0.8);
    transform: translateY(-2px);
  }

  /* TYPOGRAPHY */
  .y2k-title { font-family: 'DotGothic16', sans-serif; letter-spacing: 1px; }

  /* ACTION BUTTONS */
  .y2k-btn-action {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(94, 121, 147, 0.4);
    color: var(--text-muted);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 10px 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  /* Disable state */
  .y2k-btn-action:disabled {
    color: rgba(94, 121, 147, 0.3);
    border-color: rgba(94, 121, 147, 0.1);
    background: rgba(0,0,0,0.2);
    cursor: not-allowed;
  }

  /* The Intuitive Next-Step Glow */
  .glowing-btn {
    border-color: var(--cyan) !important;
    background-color: var(--cyan-dim) !important;
    box-shadow: 0 0 10px var(--cyan-dim), inset 0 0 5px var(--cyan-dim);
    color: var(--cyan) !important;
    font-weight: bold;
    letter-spacing: 1px;
  }
  
  .glowing-btn:hover:not(:disabled) {
    background-color: var(--cyan);
    color: #000 !important;
    text-shadow: none;
    box-shadow: 0 0 20px var(--cyan-glow);
  }

  .y2k-btn-danger {
    background: rgba(255, 0, 85, 0.05);
    border: 1px solid rgba(255, 0, 85, 0.4);
    color: var(--magenta);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-danger:hover:not(:disabled) {
    background: var(--magenta);
    color: #fff !important;
    box-shadow: 0 0 15px var(--magenta-dim);
    text-shadow: none;
  }
  .y2k-btn-danger:disabled {
    color: rgba(94, 121, 147, 0.3);
    border-color: rgba(94, 121, 147, 0.1);
    background: transparent;
    cursor: not-allowed;
  }
`;