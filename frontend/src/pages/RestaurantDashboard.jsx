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

  
  const fetchOrders = useCallback(async (customFilters = filters, currentPage = page) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...customFilters,
        page: currentPage,
        limit: 5,
      });

      const res = await api.get(`/orders?${params}`);

      setOrders(res.data.orders || res.data || []);
      setTotalPages(res.data.totalPages || 1);

    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

 
  useEffect(() => {
    fetchOrders();
  }, []);

 
  useEffect(() => {
    socket.connect();

    socket.emit("joinRestaurant");

    socket.on("newOrder", (order) => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on("orderUpdated", ({ orderId, status }) => {
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      );
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
      socket.disconnect();
    };
  }, []);

 
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
          order._id === orderId
            ? { ...order, status }
            : order
        )
      );

    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };


  const nextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchOrders(filters, newPage);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchOrders(filters, newPage);
    }
  };



  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">🍽 Restaurant Dashboard</h2>

      {/* FILTERS */}
      <OrderFilters onFilter={handleFilter} />

      {/* EMPTY */}
      {orders.length === 0 && (
        <div className="alert alert-info">
          No orders yet
        </div>
      )}

      {/* ORDERS LIST */}
      {orders.map(order => (
        <div key={order._id} className="card mb-3 shadow-sm">
          <div className="card-body">

            <div className="d-flex justify-content-between">
              <h5>Order #{order._id.slice(-6)}</h5>

              <span className={`badge 
                ${order.status === "pending" ? "bg-warning" : ""}
                ${order.status === "accepted" ? "bg-info" : ""}
                ${order.status === "preparing" ? "bg-primary" : ""}
                ${order.status === "on_the_way" ? "bg-secondary" : ""}
                ${order.status === "delivered" ? "bg-success" : ""}
                ${order.status === "cancelled" ? "bg-danger" : ""}
              `}>
                {order.status}
              </span>
            </div>

            <hr />

            {/* ITEMS */}
            <ul className="mb-3">
              {order.items.map(item => (
                <li key={item.product}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>

            <p>
              <strong>Customer:</strong> {order.user?.name || "N/A"}
            </p>

            {/* ACTION BUTTONS */}
            <div className="d-flex flex-wrap gap-2">

              <button
                className="btn btn-success btn-sm"
                onClick={() => updateStatus(order._id, "accepted")}
                disabled={order.status !== "pending"}
              >
                Accept
              </button>

              <button
                className="btn btn-warning btn-sm"
                onClick={() => updateStatus(order._id, "preparing")}
              >
                Preparing
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => updateStatus(order._id, "on_the_way")}
              >
                On the Way
              </button>

              <button
                className="btn btn-dark btn-sm"
                onClick={() => updateStatus(order._id, "delivered")}
              >
                Delivered
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => updateStatus(order._id, "cancelled")}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      ))}

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-4">

        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={prevPage}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-outline-primary"
          disabled={page === totalPages}
          onClick={nextPage}
        >
          Next
        </button>

      </div>

    </div>
  );
}
