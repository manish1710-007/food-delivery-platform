import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // SaaS Features State
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [updatingId, setUpdatingId] = useState(null); // Targeted loading state
    const [viewingOrder, setViewingOrder] = useState(null); // For the details modal

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await api.get("/admin/orders");
            // Sort so the newest orders are always at the top!
            const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            console.error("Failed to load orders", err);
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
            alert(err.response?.data?.message || "Could not update status. Check console.");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': 
                return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
            case 'cancelled': 
                return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
            case 'preparing': 
                return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
            case 'out for delivery': 
                return 'bg-info bg-opacity-10 text-info border border-info border-opacity-25';
            default: 
                return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25'; 
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(o => {
        const matchesSearch = 
            (o.customer?.name || "").toLowerCase().includes(search.toLowerCase()) || 
            (o._id || "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? o.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    // Quick Metrics
    const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <div className="spinner-border text-danger" />
        </div>
    );

    return (
        <div className="container-fluid py-4">
            
            {/* HEADER */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <h3 className="fw-bold mb-0 text-body">🛵 Order Management</h3>
                <button className="btn btn-light border rounded-pill px-4 shadow-sm fw-bold" onClick={loadOrders}>
                    ↻ Refresh Orders
                </button>
            </div>

            {/* QUICK METRICS */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: "50px", height: "50px", fontSize: "20px"}}>📦</div>
                        <div>
                            <p className="text-muted mb-0 fw-semibold small">Total Orders</p>
                            <h4 className="fw-bold m-0 text-body">{orders.length}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center">
                        <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: "50px", height: "50px", fontSize: "20px"}}>⏳</div>
                        <div>
                            <p className="text-muted mb-0 fw-semibold small">Active / Pending</p>
                            <h4 className="fw-bold m-0 text-body">{pendingCount}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center">
                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: "50px", height: "50px", fontSize: "20px"}}>₹</div>
                        <div>
                            <p className="text-muted mb-0 fw-semibold small">Delivered Revenue</p>
                            <h4 className="fw-bold m-0 text-success">₹{totalRevenue}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 p-3 mb-4">
                <div className="row g-3">
                    <div className="col-md-8">
                        <input
                            className="form-control form-control-lg shadow-none bg-transparent text-body border-secondary border-opacity-25"
                            placeholder="🔍 Search by Order ID or Customer Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select form-select-lg shadow-none bg-transparent text-body border-secondary border-opacity-25"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="" className="text-dark">All Statuses</option>
                            <option value="pending" className="text-dark">Pending</option>
                            <option value="preparing" className="text-dark">Preparing</option>
                            <option value="out for delivery" className="text-dark">Out for Delivery</option>
                            <option value="delivered" className="text-dark">Delivered</option>
                            <option value="cancelled" className="text-dark">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-borderless table-hover align-middle mb-0 bg-transparent">
                        <thead className="border-bottom border-secondary border-opacity-25">
                            <tr>
                                <th className="py-3 px-4 text-body">Order ID</th>
                                <th className="text-body">Date & Time</th>
                                <th className="text-body">Customer</th>
                                <th className="text-body">Restaurant</th>
                                <th className="text-body">Total</th>
                                <th className="text-body">Status</th>
                                <th className="text-end px-4 text-body">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                            {filteredOrders.map(o => (
                                <tr key={o._id} className="border-bottom border-secondary border-opacity-10">
                                    <td className="py-3 px-4 fw-bold font-monospace text-body">
                                        #{o._id.slice(-6).toUpperCase()}
                                    </td>
                                    
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="text-body fw-medium">
                                                {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                            <span className="text-muted small">
                                                {o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                            </span>
                                        </div>
                                    </td>
                                    
                                    <td><span className="fw-semibold text-body">{o.user?.name || "Guest"}</span></td>
                                    
                                    <td><span className="text-muted fw-medium">{o.restaurant?.name || "Unknown"}</span></td>
                                    
                                    <td className="fw-bold text-danger">₹{o.totalPrice || 0}</td>
                                    
                                    <td>
                                        <span className={`badge rounded-pill text-capitalize px-3 py-2 ${getStatusBadge(o.status)}`}>
                                            {o.status || "pending"}
                                        </span>
                                    </td>

                                    <td className="text-end px-4">
                                        {updatingId === o._id ? (
                                            <span className="spinner-border spinner-border-sm text-danger me-4" />
                                        ) : (
                                            <div className="d-flex justify-content-end gap-2">
                                                {/* VIEW DETAILS BUTTON */}
                                                <button 
                                                    className="btn btn-sm btn-light border rounded-pill px-3 shadow-sm text-primary fw-medium"
                                                    onClick={() => setViewingOrder(o)}
                                                >
                                                    👁️ Details
                                                </button>

                                                <div className="dropdown">
                                                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 dropdown-toggle shadow-sm fw-medium" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        Status
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 rounded-4 p-2 bg-body-tertiary">
                                                        <li><button className="dropdown-item py-2 rounded-3 fw-medium text-body" onClick={() => updateOrderStatus(o._id, 'preparing')}>👨‍🍳 Preparing</button></li>
                                                        <li><button className="dropdown-item py-2 rounded-3 fw-medium text-body" onClick={() => updateOrderStatus(o._id, 'on_the_way')}>🛵 Out for Delivery</button></li>
                                                        <li><button className="dropdown-item py-2 rounded-3 fw-medium text-success" onClick={() => updateOrderStatus(o._id, 'delivered')}>✅ Delivered</button></li>
                                                        <li><hr className="dropdown-divider my-2 border-secondary opacity-25" /></li>
                                                        <li><button className="dropdown-item py-2 rounded-3 fw-medium text-danger" onClick={() => updateOrderStatus(o._id, 'cancelled')}>❌ Cancel</button></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ORDER DETAILS MODAL */}
            {viewingOrder && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-body-tertiary border-0 shadow-lg rounded-4">
                            
                            <div className="modal-header border-bottom border-secondary border-opacity-25 py-3 px-4">
                                <div>
                                    <h5 className="fw-bold mb-1 text-body">Order #{viewingOrder._id.slice(-6).toUpperCase()}</h5>
                                    <span className="text-muted small">Placed on {new Date(viewingOrder.createdAt).toLocaleString()}</span>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setViewingOrder(null)} />
                            </div>
                            
                            <div className="modal-body p-4">
                                <div className="row g-4">
                                    {/* Left Column: Items */}
                                    <div className="col-md-7">
                                        <h6 className="fw-bold text-body mb-3">Order Items</h6>
                                        <div className="card border-0 bg-transparent">
                                            <ul className="list-group list-group-flush border-top border-bottom border-secondary border-opacity-25">
                                                {viewingOrder.items?.map((item, idx) => (
                                                    <li key={idx} className="list-group-item bg-transparent px-0 py-3 d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6 className="fw-semibold text-body mb-0">{item.name}</h6>
                                                            <small className="text-muted">₹{item.price} x {item.quantity}</small>
                                                        </div>
                                                        <span className="fw-bold text-body">₹{item.price * item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                                                <h6 className="fw-bold text-muted m-0">Grand Total</h6>
                                                <h5 className="fw-bold text-danger m-0">₹{viewingOrder.totalPrice}</h5>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Delivery Info */}
                                    <div className="col-md-5">
                                        <h6 className="fw-bold text-body mb-3">Delivery Information</h6>
                                        <div className="card border border-secondary border-opacity-25 bg-transparent rounded-4 p-3 mb-3">
                                            <p className="text-body fw-medium mb-1">👤 {viewingOrder.customer?.name || "Guest Customer"}</p>
                                            <p className="text-muted small mb-3">📧 {viewingOrder.customer?.email || "No email"}</p>
                                            
                                            <p className="text-body fw-medium mb-1">📞 Phone Number</p>
                                            <p className="text-muted small mb-3">{viewingOrder.phone || "Not provided"}</p>
                                            
                                            <p className="text-body fw-medium mb-1">📍 Delivery Address</p>
                                            <p className="text-muted small mb-0">{viewingOrder.deliveryAddress || "No address provided"}</p>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between card border border-secondary border-opacity-25 bg-transparent rounded-4 p-3">
                                            <div>
                                                <h6 className="fw-bold text-body mb-0">Payment</h6>
                                                <small className="text-muted text-uppercase">{viewingOrder.paymentMethod || "COD"}</small>
                                            </div>
                                            <span className={`badge ${viewingOrder.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-${viewingOrder.paymentStatus === 'paid' ? 'success' : 'warning'} px-3 py-2 rounded-pill`}>
                                                {viewingOrder.paymentStatus || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-footer border-top border-secondary border-opacity-25">
                                <button type="button" className="btn btn-light border rounded-pill px-4 fw-medium shadow-sm" onClick={() => setViewingOrder(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}