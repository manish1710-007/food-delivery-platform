import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  BarCharts,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";



export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics")
      .then(res => setData(res.data))
      .catch(() => alert("Admin access only"));
  }, []);

  if (!data) return <p className="m-4">Loading analytics...</p>;

  const restaurantRevenueData = data.topRestaurants.map((r) => ({
    name: r.restaurant?.name || "Unknown",
    revenue: r.revenue,
  }));  

  const orderTrend = data.ordersOverTime.map((o, index) => ({
    order: index + 1,
    total: o.totalPrice,
  }));

  const handleDownloadCSV = async () => {
    try {
      const res = await api.get("/admin/analytics/export", {
        responseType: "blob",
      });

      const url = window.URL.createdObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "analytics.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("CSV download failed", err);
    }
  };



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

      {/* Orders Over Time Chart */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Orders by Status</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.orderByStatus}>
              <XAsis datakey="_id" />
              <yAxis />
              <Tooltip />
              <Bar datakey="count" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Revenue Over Time Chart */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Top Restaurants Revenue</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={restaurantRevenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#198754" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Trends Line Chart */}
      <div className ="card mb-4">
        <div className="card-body">
          <h5>Order Trends Over Time</h5>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderTrend}>
              <XAxis dataKey="order" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" datakey="total" stroke="#dc3545" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

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

      <button
        className="btn btn-outline-success mb-3"
        onClick={handleDownloadCSV}
      >
        Download Analytics CSV
      </button>
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
