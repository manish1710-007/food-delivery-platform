import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders")
      .then(res => setOrders(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    setOrders(prev =>
      prev.map(o =>
        o._id === id ? { ...o, status } : o
      )
    );
  };

  return (
    <div className="container mt-4">
      <h3>📦 Incoming Orders</h3>

      {orders.map(order => (
        <div key={order._id} className="card mb-3">
          <div className="card-body">
            <h5>Order #{order._id.slice(-6)}</h5>
            <p>Status: <b>{order.status}</b></p>
            <p>Total: ₹{order.totalPrice}</p>

            <div className="d-flex gap-2">
              {order.status === "pending" && (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => updateStatus(order._id, "accepted")}
                  >
                    Accept
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => updateStatus(order._id, "cancelled")}
                  >
                    Reject
                  </button>
                </>
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
                  className="btn btn-info btn-sm"
                  onClick={() => updateStatus(order._id, "on_the_way")}
                >
                  On the Way
                </button>
              )}

              {order.status === "on_the_way" && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => updateStatus(order._id, "delivered")}
                >
                  Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
