import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [updatingId, setUpdatingId] = useState(null); 
    const [viewingOrder, setViewingOrder] = useState(null); 

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await api.get("/admin/orders");
            const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            console.error("Failed to load orders", err);
            alert("SYS_ERR: FAILED_TO_FETCH_TRANSMISSIONS");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            await loadOrders(); 
        } catch (err) {
            console.error("Failed to update order status", err);
            alert("SYS_ERR: OVERWRITE_FAILED");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status = "") => {
        const s = status.toLowerCase();
        if (s.includes('delivered')) return 'text-cyan border-cyan';
        if (s.includes('cancel')) return 'text-magenta border-magenta';
        if (s.includes('prepar') || s.includes('way') || s.includes('delivery')) return 'text-amber border-amber';
        return 'text-muted border-secondary'; // pending
    };

    const filteredOrders = orders.filter(o => {
        const customerName = (o.user?.name || o.customer?.name || "").toLowerCase();
        const matchesSearch = customerName.includes(search.toLowerCase()) || (o._id || "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? o.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const pendingCount = orders.filter(o => ['pending', 'preparing', 'on_the_way', 'out for delivery'].includes(o.status?.toLowerCase())).length;

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
                <div className="y2k-wire-box p-4 text-center" style={{ width: "320px" }}>
                    <div className="mb-3 text-cyan">INTERCEPTING_PACKETS... <span className="blink">_</span></div>
                    <div className="y2k-progress-bar">
                        <div className="y2k-progress-fill" style={{ animationDuration: '1.5s' }}></div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="y2k-page pb-5">
                <div className="y2k-grid-bg"></div>
                <div className="scanlines"></div>

                <div className="container-fluid px-3 px-xl-4 position-relative z-1 pt-4 w-100">
                    
                    {/* Header HUD */}
                    <div className="y2k-wire-box border-magenta d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 p-3 bg-magenta-dim text-start">
                        <div>
                            <h1 className="y2k-title mb-1 fs-4 text-magenta d-flex align-items-center gap-2 m-0 text-shadow-magenta">
                                <span className="blink">_</span> SYS_LOGISTICS // PACKET_ROUTING
                            </h1>
                            <div className="text-magenta small font-monospace opacity-75">
                                ROOT_DIR: C:\SERVER\ACTIVE_TRANSMISSIONS\&gt;
                            </div>
                        </div>
                        <div className="mt-3 mt-md-0">
                            <button className="y2k-btn-outline text-cyan px-4 py-2" onClick={loadOrders}>
                                [ FORCE_SYNC ]
                            </button>
                        </div>
                    </div>

                    {/* Quick Metrics */}
                    <div className="row g-3 mb-4 font-monospace">
                        <div className="col-md-4">
                            <div className="y2k-wire-box border-cyan p-3 d-flex align-items-center gap-3">
                                <div className="text-cyan fs-2">[+]</div>
                                <div>
                                    <div className="text-muted small">&gt; PROCESSED_PACKETS</div>
                                    <div className="text-main fs-4 fw-bold">{orders.length}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="y2k-wire-box border-amber p-3 d-flex align-items-center gap-3">
                                <div className="text-amber fs-2">[~]</div>
                                <div>
                                    <div className="text-muted small">&gt; IN_TRANSIT (ACTIVE)</div>
                                    <div className="text-main fs-4 fw-bold">{pendingCount}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="y2k-wire-box border-magenta p-3 d-flex align-items-center gap-3">
                                <div className="text-magenta fs-2">[$]</div>
                                <div>
                                    <div className="text-muted small">&gt; NET_YIELD (DELIVERED)</div>
                                    <div className="text-magenta fs-4 fw-bold">INR {totalRevenue}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 align-items-start">
                        {/* ── LEFT: Filters & List (col-xl-9) ── */}
                        <div className="col-12 col-xl-9">
                            
                            {/* Search & Filters */}
                            <div className="y2k-wire-box border-cyan p-3 mb-4 text-start">
                                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                                    <span className="text-cyan small font-monospace">/// QUERY_TRANSMISSIONS</span>
                                </div>
                                <div className="row g-3 font-monospace">
                                    <div className="col-md-8">
                                        <div className="y2k-input-group d-flex">
                                            <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">SRC:</span>
                                            <input
                                                className="y2k-input flex-grow-1 p-2"
                                                placeholder="ENTER_PKT_ID_OR_USER..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="y2k-input-group d-flex h-100">
                                            <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">FLT:</span>
                                            <select
                                                className="y2k-input flex-grow-1 p-2 y2k-select text-uppercase"
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                            >
                                                <option value="">ALL_STATES</option>
                                                <option value="pending">PENDING</option>
                                                <option value="preparing">PREPARING</option>
                                                <option value="on_the_way">DISPATCHED</option>
                                                <option value="delivered">DELIVERED</option>
                                                <option value="cancelled">CANCELLED</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                                    <span className="text-cyan small font-monospace">/// ACTIVE_ROUTING_TABLE</span>
                                    <span className="text-cyan small font-monospace">MATCHES: {filteredOrders.length}</span>
                                </div>

                                {filteredOrders.length === 0 ? (
                                    <div className="text-center p-5 text-muted font-monospace">
                                        [ DIR_EMPTY: NO_MATCHING_PACKETS ]
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {filteredOrders.map(o => (
                                            <div key={o._id} className="y2k-data-row d-flex flex-column flex-lg-row justify-content-between p-3 border-cyan gap-3 font-monospace">
                                                
                                                {/* ID & Date */}
                                                <div className="d-flex flex-column gap-1" style={{ minWidth: "150px" }}>
                                                    <div className="text-main fw-bold fs-5 text-truncate">
                                                        PKT: {o._id.slice(-6).toUpperCase()}
                                                    </div>
                                                    <div className="text-muted small">
                                                        TS: {new Date(o.createdAt).toISOString().replace('T', ' ').substring(0, 16)}
                                                    </div>
                                                </div>

                                                {/* User & Restaurant */}
                                                <div className="d-flex flex-column gap-1 flex-grow-1 overflow-hidden" style={{ minWidth: "150px" }}>
                                                    <div className="text-cyan text-truncate">&gt; TGT: {o.user?.name || o.customer?.name || "GUEST_NODE"}</div>
                                                    <div className="text-muted small text-truncate">&gt; SRC: {o.restaurant?.name || "UNKNOWN_HOST"}</div>
                                                </div>

                                                {/* Total */}
                                                <div className="d-flex align-items-center justify-content-lg-center">
                                                    <span className="text-magenta fw-bold fs-5">
                                                        INR {o.totalPrice}
                                                    </span>
                                                </div>

                                                {/* Actions & Status Updates */}
                                                <div className="d-flex align-items-center gap-2 flex-wrap justify-content-lg-end" style={{ minWidth: "280px" }}>
                                                    <button 
                                                        className="y2k-btn-outline text-cyan px-2 py-1"
                                                        onClick={() => setViewingOrder(o)}
                                                    >
                                                        [ INSPECT ]
                                                    </button>

                                                    {/* Direct Terminal Status Select */}
                                                    {updatingId === o._id ? (
                                                        <span className="text-magenta blink small">[ OVERWRITING... ]</span>
                                                    ) : (
                                                        <div className="y2k-input-group d-flex border-secondary">
                                                            <select 
                                                                className={`y2k-input p-1 y2k-select text-uppercase small fw-bold ${getStatusColor(o.status)}`}
                                                                value={o.status || 'pending'}
                                                                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                                                style={{ width: "130px", cursor: "pointer" }}
                                                            >
                                                                <option value="pending">PENDING</option>
                                                                <option value="preparing">PREPARING</option>
                                                                <option value="on_the_way">DISPATCHED</option>
                                                                <option value="delivered">DELIVERED</option>
                                                                <option value="cancelled">CANCELLED</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── RIGHT: Tactical Radar (col-xl-3) ── */}
                        <div className="col-12 col-xl-3 d-none d-xl-block">
                            <div className="position-sticky" style={{ top: "80px" }}>
                                <div className="y2k-wire-box p-4 text-start h-100 d-flex flex-column gap-3 border-cyan">
                                    <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-2">
                                        <span className="text-cyan small font-monospace">/// LOGISTICS_RADAR</span>
                                    </div>

                                    <div className="position-relative w-100 d-flex align-items-center justify-content-center border-cyan" style={{ height: "200px", border: "1px solid", background: "rgba(0, 229, 255, 0.05)", overflow: "hidden" }}>
                                        <div className="y2k-radar-grid position-absolute w-100 h-100"></div>
                                        <div className="y2k-radar-sweep"></div>
                                        {/* Fake moving blips */}
                                        <div className="position-absolute bg-amber shadow-amber rounded-circle blink" style={{ width: "5px", height: "5px", top: "40%", left: "30%" }}></div>
                                        <div className="position-absolute bg-cyan shadow-cyan rounded-circle" style={{ width: "4px", height: "4px", top: "70%", right: "40%" }}></div>
                                        <span className="position-absolute bottom-0 end-0 p-1 text-amber font-monospace" style={{ fontSize: "0.6rem" }}>SCANNING...</span>
                                    </div>

                                    <div className="border-bottom-wire border-cyan mt-2"></div>

                                    <div className="text-muted font-monospace small" style={{ lineHeight: "1.6" }}>
                                        &gt; DISPATCH_PROTOCOL: <span className="text-cyan">AUTO</span><br/>
                                        &gt; FLEET_STATUS: <span className="text-cyan">OPTIMAL</span><br/>
                                        &gt; DROP_RATE: <span className="text-magenta">0.02%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── MODAL: ORDER INSPECTOR ── */}
                {viewingOrder && (
                    <div className="y2k-modal-overlay d-flex align-items-center justify-content-center">
                        <div className="y2k-wire-box border-cyan p-0 text-start w-100" style={{ maxWidth: "700px", background: "#02060d" }}>
                            
                            <div className="bg-cyan text-dark d-flex justify-content-between align-items-center p-2 font-monospace fw-bold">
                                <span>INSPECT_PACKET.exe // ID: {viewingOrder._id.slice(-6).toUpperCase()}</span>
                                <button className="y2k-close-btn" onClick={() => setViewingOrder(null)}>[ X ]</button>
                            </div>
                            
                            <div className="p-4 font-monospace">
                                <div className="row g-4">
                                    
                                    {/* Left: Items */}
                                    <div className="col-md-7">
                                        <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                                            <span className="text-cyan small">/// PAYLOAD_CONTENTS</span>
                                        </div>
                                        <div className="d-flex flex-column gap-2 mb-3">
                                            {viewingOrder.items?.map((item, idx) => (
                                                <div key={idx} className="d-flex justify-content-between align-items-center small bg-dark-dim p-2 border-cyan" style={{ border: "1px dashed" }}>
                                                    <div className="text-main text-truncate pe-2">
                                                        &gt; {item.name.toUpperCase()} <span className="text-muted">x{item.quantity}</span>
                                                    </div>
                                                    <span className="text-magenta flex-shrink-0">INR {item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center border-top-wire border-cyan pt-2">
                                            <span className="text-cyan">SYS_TOTAL</span>
                                            <span className="text-magenta fs-4 fw-bold">INR {viewingOrder.totalPrice}</span>
                                        </div>
                                    </div>

                                    {/* Right: Delivery Info */}
                                    <div className="col-md-5">
                                        <div className="d-flex justify-content-between border-bottom-wire border-magenta pb-2 mb-3">
                                            <span className="text-magenta small">/// TARGET_NODE_DATA</span>
                                        </div>
                                        
                                        <div className="text-muted small mb-4" style={{ lineHeight: "1.8" }}>
                                            <span className="text-cyan">USR:</span> {viewingOrder.customer?.name || "GUEST"}<br/>
                                            <span className="text-cyan">NET:</span> {viewingOrder.customer?.email || "N/A"}<br/>
                                            <span className="text-cyan">TEL:</span> {viewingOrder.phone || "N/A"}<br/>
                                            <span className="text-cyan">LOC:</span> <span className="text-main">{viewingOrder.deliveryAddress || "N/A"}</span>
                                        </div>

                                        <div className="d-flex justify-content-between border-bottom-wire border-magenta pb-2 mb-3">
                                            <span className="text-magenta small">/// EXCHANGE_PROTOCOL</span>
                                        </div>
                                        <div className="text-muted small">
                                            <span className="text-cyan">METHOD:</span> {viewingOrder.paymentMethod?.toUpperCase() || "COD"}<br/>
                                            <span className="text-cyan">STATUS:</span> <span className={viewingOrder.paymentStatus === 'paid' ? 'text-cyan' : 'text-amber'}>[{viewingOrder.paymentStatus?.toUpperCase() || 'PENDING'}]</span>
                                        </div>
                                    </div>

                                </div>
                                
                                <div className="text-end mt-4 pt-3 border-top-wire border-cyan">
                                    <button className="y2k-btn-outline text-cyan px-4" onClick={() => setViewingOrder(null)}>[ CLOSE_INSPECTOR ]</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #010308; 
    --panel-bg: #02060d;
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.2);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.15);
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

  .bg-dark-dim { background: rgba(0, 0, 0, 0.4); }

  /* GRID & OVERLAYS */
  .y2k-grid-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(var(--cyan-dim) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0; pointer-events: none; opacity: 0.4;
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
  
  .bg-cyan { background-color: var(--cyan) !important; color: #000 !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  .bg-amber { background-color: var(--amber) !important; color: #000 !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-amber { border: 1px solid var(--amber) !important; }
  .border-secondary { border-color: var(--text-muted) !important; }
  
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  .border-bottom-wire.border-magenta { border-bottom-color: rgba(255,0,85,0.5); }
  
  .text-shadow-magenta { text-shadow: 0 0 8px rgba(255, 0, 85, 0.6); }
  .shadow-cyan { box-shadow: 0 0 8px var(--cyan); }
  .shadow-amber { box-shadow: 0 0 8px var(--amber); }
  
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
  .y2k-wire-box.border-amber::before, .y2k-wire-box.border-amber::after { border-color: var(--amber); }

  /* TYPOGRAPHY */
  .y2k-title { font-family: 'DotGothic16', sans-serif; }

  /* TERMINAL INPUTS */
  .y2k-input-group {
    background: rgba(0,0,0,0.8);
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
    min-width: 40px;
    text-align: center;
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

  .y2k-select {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }
  .y2k-select option { background: var(--panel-bg); color: var(--text-main); }

  /* BUTTONS */
  .y2k-btn-outline {
    background: transparent;
    border: 1px solid var(--cyan);
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-outline:hover {
    color: #000 !important;
    background: var(--cyan);
    text-shadow: none;
    box-shadow: 0 0 10px var(--cyan-dim);
  }

  /* DATA ROWS */
  .y2k-data-row {
    background: rgba(0,0,0,0.4);
    transition: all 0.2s;
  }
  .y2k-data-row:hover {
    background: rgba(0, 229, 255, 0.05);
    box-shadow: inset 0 0 10px var(--cyan-dim);
  }

  /* MODAL */
  .y2k-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    z-index: 1050;
    padding: 20px;
  }
  .y2k-close-btn {
    background: transparent; border: none; color: #000; font-weight: bold; cursor: pointer;
  }
  .y2k-close-btn:hover { color: var(--magenta); }

  /* RADAR CSS */
  .y2k-radar-grid {
    background-image: 
      linear-gradient(var(--cyan-dim) 1px, transparent 1px),
      linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center;
  }
  .y2k-radar-sweep {
    position: absolute; width: 180px; height: 180px;
    border-radius: 50%; border: 1px dashed var(--cyan-glow);
    animation: spin 3s linear infinite;
  }
  .y2k-radar-sweep::before {
    content: ''; position: absolute; top: 0; left: 50%; width: 50%; height: 50%;
    background: linear-gradient(90deg, transparent, var(--cyan-glow));
    transform-origin: bottom left;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }
  
  /* PROGRESS BAR */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }
`;