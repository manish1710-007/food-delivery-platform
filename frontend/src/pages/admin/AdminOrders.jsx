import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await api.get("/admin/orders");
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to load orders", err);
        } finally {
            setLoading(false);
        }
    };

    // Added a function to handle status updates!
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            // Adjust this endpoint to match your backend route for updating status
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            loadOrders(); // Refresh the list
        } catch (err) {
            console.error("Failed to update order status", err);
            alert("Could not update status.");
        }
    };

    // Helper function to color-code the statuses dynamically
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
            default: // Pending or placed
                return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25'; 
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-danger" />
        </div>
    );

    return (
        <div className="container-fluid py-4">
            
            {/* HEADER */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <h3 className="fw-bold mb-0">🛵 Order Management</h3>
                <button className="btn btn-light border rounded-pill px-4 shadow-sm fw-bold" onClick={loadOrders}>
                    ↻ Refresh
                </button>
            </div>

            {/* TABLE */}
            <div className="card custom-card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-borderless table-hover align-middle mb-0">
                        <thead className="border-bottom">
                            <tr>
                                <th className="py-3 px-4">Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Restaurant</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th className="text-end px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                            {orders.map(o => (
                                <tr key={o._id} className="border-bottom">
                                    <td className="py-3 px-4 fw-bold font-monospace">
                                        #{o._id.slice(-6).toUpperCase()}
                                    </td>
                                    
                                    <td>
                                        <span className="text-muted small">
                                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </td>

                                    {/* Assuming your backend populates customer and restaurant names. Adjust if needed! */}
                                    <td><span className="fw-semibold">{o.customer?.name || "Guest"}</span></td>
                                    <td><span className="text-muted">{o.restaurant?.name || "Unknown"}</span></td>
                                    
                                    <td className="fw-bold text-danger">₹{o.total}</td>
                                    
                                    <td>
                                        <span className={`badge rounded-pill ${getStatusBadge(o.status)}`}>
                                            {o.status || "Pending"}
                                        </span>
                                    </td>

                                    <td className="text-end px-4">
                                        {/* Status Update Dropdown */}
                                        <div className="dropdown">
                                            <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Update Status
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-4 p-2 custom-card">
                                                <li><button className="dropdown-item py-2 rounded-3 fw-medium" onClick={() => updateOrderStatus(o._id, 'Preparing')}>👨‍🍳 Preparing</button></li>
                                                <li><button className="dropdown-item py-2 rounded-3 fw-medium" onClick={() => updateOrderStatus(o._id, 'Out for Delivery')}>🛵 Out for Delivery</button></li>
                                                <li><button className="dropdown-item py-2 rounded-3 fw-medium text-success" onClick={() => updateOrderStatus(o._id, 'Delivered')}>✅ Delivered</button></li>
                                                <li><hr className="dropdown-divider my-2" /></li>
                                                <li><button className="dropdown-item py-2 rounded-3 fw-medium text-danger" onClick={() => updateOrderStatus(o._id, 'Cancelled')}>❌ Cancel</button></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}