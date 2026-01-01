import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../sockets/socket";
import api from "../api/axios";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch order once
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load order");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  // Socket live updates
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("JoinOrder", id);

    socket.on("OrderUpdated", (data) => {
      if (data.orderId === id) {
        setOrder((prev) => ({ ...prev, status: data.status }));
      }
    });

    return () => {
      socket.off("OrderUpdated");
      socket.disconnect();
    };
  }, [id]);

  if (loading) return <div className="m-4">Loading order...</div>;
  if (!order) return <div className="m-4">Order not found</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-success">🎉 Order Placed Successfully!</h2>

      <p><strong>Order ID:</strong> {order._id}</p>

      <p>
        <strong>Status:</strong>{" "}
        <span className="badge bg-warning text-dark">{order.status}</span>
      </p>

      <hr />

      <h4>Order Summary</h4>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total: ₹{order.totalPrice}</h4>

      <hr />

      <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
      <p>
        <strong>Payment:</strong>{" "}
        {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
      </p>

      <div className="mt-4">
        <button className="btn btn-primary me-2" onClick={() => navigate("/")}>
          Back to Home
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/orders/my")}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
