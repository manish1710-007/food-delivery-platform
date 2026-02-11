import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];

export default function RestaurantAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/restaurant/analytics");
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="m-4">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="m-4">No analytics available</div>;
  }

  return (
    <div>
        <h3>Restaurant Analytics Dashboard</h3>
      <h2 className="mb-4">📊 Restaurant Analytics</h2>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Total Orders</h6>
              <h3>{data.totalOrders}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Total Revenue</h6>
              <h3>₹{data.totalRevenue}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Delivered Orders</h6>
              <h3>{data.deliveredOrders}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Revenue (Last 7 Days)</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders by Status + Top Items */}
      <div className="row">
        {/* Pie Chart */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Orders by Status</h5>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.ordersByStatus}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={100}
                    label
                  >
                    {data.ordersByStatus.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>🔥 Top Selling Items</h5>

              {data.topItems.length === 0 && <p>No sales yet</p>}

              <ul className="list-group">
                {data.topItems.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{item.name}</span>
                    <span>{item.quantitySold} sold</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
