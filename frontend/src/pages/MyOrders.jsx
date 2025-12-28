import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="m-4">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="m-4">You have no orders yet.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td>
                <span className="badge bg-warning text-dark">
                  {order.status}
                </span>
              </td>
              <td>₹{order.totalPrice}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
