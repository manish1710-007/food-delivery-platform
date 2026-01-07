import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Join restaurant room (backend should map restaurantId → socket room)
    socket.emit("joinRestaurant");

    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("orderUpdated", ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="m-4">Loading orders...</div>;

  return (
    <div className="container mt-4">
      <h2>🍽 Incoming Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (
        <div key={order._id} className="card my-3">
          <div className="card-body">
            <h5>Order #{order._id.slice(-6)}</h5>

            <p>
              Status:{" "}
              <span className="badge bg-secondary">
                {order.status}
              </span>
            </p>

            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>

            <div className="mt-3 d-flex flex-wrap gap-2">
              {order.status === "pending" && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => updateStatus(order._id, "accepted")}
                >
                  Accept
                </button>
              )}

              {order.status === "accepted" && (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => updateStatus(order._id, "preparing")}
                >
                  Preparing
                </button>
              )}

              {order.status === "preparing" && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => updateStatus(order._id, "on_the_way")}
                >
                  Dispatch
                </button>
              )}

              {order.status === "on_the_way" && (
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => updateStatus(order._id, "delivered")}
                >
                  Delivered
                </button>
              )}

              {["pending", "accepted"].includes(order.status) && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => updateStatus(order._id, "cancelled")}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
