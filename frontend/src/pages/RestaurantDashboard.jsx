import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    socket.connect();
    socket.emit("JoinRestaurant");

    socket.on("NewOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("OrderUpdated", (data) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId ? { ...o, status: data.status } : o
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
            <p>Status: <strong>{order.status}</strong></p>

            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <p>Total: ₹{order.totalPrice}</p>

            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() => updateStatus(order._id, "accepted")}
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
                On the way
              </button>

              <button
                className="btn btn-dark btn-sm"
                onClick={() => updateStatus(order._id, "delivered")}
              >
                Delivered
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
