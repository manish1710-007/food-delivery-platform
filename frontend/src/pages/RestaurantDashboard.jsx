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

      const res = await api.get(`/api/orders?${params}`);

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

    
    socket.emit("JoinRestaurant", user._id);

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
      
      

      <div className="container position-relative z-1 pt-5">
        
        {/* HEADER */}
        <div className="mb-5 border-bottom-wire border-cyan pb-3">
          <div className="text-cyan font-monospace small mb-1">/// SECURE_NODE: ACTIVE</div>
          <h2 className="y2k-title text-main m-0 fs-2 text-uppercase">
            SYS_DASHBOARD <span className="blink text-cyan">_</span>
          </h2>
        </div>

        {/* FILTERS (Wrapped in a wire box to contain any non-Y2K bootstrap inputs) */}
        <div className="y2k-wire-box p-3 mb-4">
          <div className="text-muted small font-monospace mb-2">&gt; APPLY_DATA_FILTERS:</div>
          <OrderFilters onFilter={handleFilter} />
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="y2k-wire-box border-cyan p-4 text-center">
            <span className="text-cyan font-monospace">AWAITING_INCOMING_TRANSMISSIONS...</span>
          </div>
        )}

        {/* ORDERS LIST */}
        <div className="row g-4">
          {Array.isArray(orders) && orders.map(order => (
            <div key={order._id} className="col-12 col-lg-6">
              <div className="y2k-wire-box h-100 p-4 d-flex flex-column">
                
                {/* Order Header */}
                <div className="d-flex justify-content-between align-items-start mb-3 border-bottom-wire border-cyan pb-2">
                  <h5 className="text-main font-monospace m-0">
                    ID: <span className="text-cyan">#{order._id.slice(-6)}</span>
                  </h5>
                  
                  {/* Status Indicator */}
                  <span className={`font-monospace small fw-bold px-2 py-1 ${
                    order.status === "pending" ? "bg-magenta-dim border-magenta text-magenta" : 
                    order.status === "cancelled" ? "text-muted" : 
                    "bg-cyan-dim border-cyan text-cyan"
                  }`} style={{ border: "1px solid" }}>
                    [ {order.status.toUpperCase()} ]
                  </span>
                </div>

                {/* Items List */}
                <div className="text-muted font-monospace small mb-3 flex-grow-1">
                  {order.items?.map(item => (
                    <div key={item.product} className="d-flex justify-content-between">
                      <span>&gt; {item.name}</span>
                      <span className="text-main">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Summary Info */}
                <div className="d-flex justify-content-between text-main font-monospace mb-4 pb-2 border-bottom-wire border-cyan">
                  <span>USR: {order.user?.name || "UNKNOWN_NODE"}</span>
                  <span className="text-cyan fw-bold">₹{order.totalPrice}</span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="d-flex flex-wrap gap-2 mt-auto">
                  <button
                    className="y2k-btn-action flex-grow-1"
                    onClick={() => updateStatus(order._id, "accepted")}
                    disabled={order.status !== "pending"}
                  >
                    [ ACCEPT ]
                  </button>

                  <button
                    className="y2k-btn-action flex-grow-1"
                    onClick={() => updateStatus(order._id, "preparing")}
                    disabled={order.status !== "preparing"}
                  >
                    [ PREPARE ]
                  </button>

                  <button
                    className="y2k-btn-action flex-grow-1"
                    onClick={() => updateStatus(order._id, "on_the_way")}
                    disabled={order.status !== "on_the_way"}
                  >
                    [ DISPATCH ]
                  </button>

                  <button
                    className="y2k-btn-action flex-grow-1"
                    onClick={() => updateStatus(order._id, "delivered")}
                  >
                    [ DELIVER ]
                  </button>

                  <button
                    className="y2k-btn-danger flex-grow-1"
                    onClick={() => updateStatus(order._id, "cancelled")}
                  >
                    [ ABORT ]
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-5 font-monospace">
            <button
              className="y2k-btn-action px-4"
              disabled={page === 1}
              onClick={prevPage}
            >
              &lt;&lt; PREV
            </button>

            <span className="text-cyan">
              BLOCK {page} // {totalPages}
            </span>

            <button
              className="y2k-btn-action px-4"
              disabled={page === totalPages}
              onClick={nextPage}
            >
              NEXT &gt;&gt;
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
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background-color: var(--bg-color);
  }

  /* GRID & OVERLAYS */
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

  /* UTILS */
  .text-cyan { color: var(--cyan) !important; text-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
  .text-magenta { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255, 0, 85, 0.3); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan-dim { background-color: var(--cyan-dim) !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /* WIREFRAME BOXES */
  .y2k-wire-box {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: var(--wire-border);
    position: relative;
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 6px; height: 6px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  /* TYPOGRAPHY */
  .y2k-title { font-family: 'DotGothic16', sans-serif; }

  /* ACTION BUTTONS */
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
  .y2k-btn-action:hover:not(:disabled) {
    background: var(--cyan-dim);
    box-shadow: 0 0 10px var(--cyan-dim);
  }
  .y2k-btn-action:disabled {
    color: var(--text-muted);
    border-color: rgba(94, 121, 147, 0.3);
    cursor: not-allowed;
  }

  .y2k-btn-danger {
    background: transparent;
    border: 1px solid rgba(255, 0, 85, 0.5);
    color: var(--magenta);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-danger:hover:not(:disabled) {
    background: var(--magenta-dim);
    box-shadow: 0 0 10px var(--magenta-dim);
  }
`;