import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics")
      .then(res => setData(res.data))
      .catch(() => alert("Admin access only"));
  }, []);

  if (!data) return <p className="m-4">Loading analytics...</p>;

  return (
    <div className="container mt-4">
      <h2>📊 Admin Analytics</h2>

      {/* KPI Cards */}
      <div className="row my-4">
        <Kpi title="Total Orders" value={data.totalOrders} />
        <Kpi title="Revenue" value={`₹${data.totalRevenue}`} />
      </div>

      {/* Orders by Status */}
      <h4>Orders by Status</h4>
      <ul>
        {data.ordersByStatus.map(s => (
          <li key={s._id}>{s._id}: {s.count}</li>
        ))}
      </ul>

      {/* Top Restaurants */}
      <h4 className="mt-4">Top Restaurants</h4>
      <ul>
        {data.topRestaurants.map(r => (
          <li key={r._id}>
            {r.restaurant.name} — ₹{r.revenue}
          </li>
        ))}
      </ul>

      {/* Recent Orders */}
      <h4 className="mt-4">Recent Orders</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>User</th>
            <th>Restaurant</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.recentOrders.map(o => (
            <tr key={o._id}>
              <td>{o._id.slice(-6)}</td>
              <td>{o.user?.name}</td>
              <td>{o.restaurant?.name}</td>
              <td>{o.status}</td>
              <td>₹{o.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="col-md-3">
      <div className="card p-3 shadow-sm">
        <h6>{title}</h6>
        <h4>{value}</h4>
      </div>
    </div>
  );
}
