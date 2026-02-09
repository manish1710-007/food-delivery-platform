import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RestaurantOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // replace with logged-in restaurant id later
  const RESTAURANT_ID = import.meta.env.VITE_RESTAURANT_ID;

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders?restaurant=${RESTAURANT_ID}`);
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="m-4">Loading orders...</div>;

  if (orders.length === 0)
    return <div className="m-4">No incoming orders</div>;

  return (
    <div className="container mt-4">
      <h2>Incoming Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="card mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5>Order #{order._id.slice(-6)}</h5>
              <span className="badge bg-warning text-dark">
                {order.status}
              </span>
            </div>

            <ul className="mt-2">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <p className="mt-2">
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>

            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => updateStatus(order._id, "accepted")}
              >
                Accept
              </button>

              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => updateStatus(order._id, "preparing")}
              >
                Preparing
              </button>

              <button
                className="btn btn-sm btn-outline-success"
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
