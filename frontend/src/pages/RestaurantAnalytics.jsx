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

const Y2K_COLORS = ["#00e5ff", "#ff0055", "#b026ff", "#39ff14", "#ffea00"];

export default function RestaurantAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/restaurant-owner/analytics");
      setData(res.data);
    } catch (err) {
      console.error("[SYS.ERR] FAILED_TO_FETCH_TELEMETRY:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 min-vh-100">
        <div className="text-cyan font-monospace fs-4">
          &gt; COMPILING_TELEMETRY_DATA... <span className="blink">_</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="y2k-wire-box border-magenta p-4 text-center mt-5 mx-3">
        <span className="text-magenta font-monospace blink">ERR: TELEMETRY_OFFLINE</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="y2k-wire-box p-2 font-monospace small" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="text-muted border-bottom-wire border-cyan pb-1 mb-1">{label}</div>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color || '#00e5ff' }}>
              &gt; {entry.name.toUpperCase()}: {entry.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container-fluid py-4 pb-5">
      <style>{styles}</style>
      
      {/* HEADER */}
      <div className="mb-5 border-bottom-wire border-cyan pb-3">
        <div className="text-cyan font-monospace small mb-1">/// DATABASE: TELEMETRY</div>
        <h2 className="y2k-title text-main m-0 fs-2 text-uppercase">
          SYS_ANALYTICS <span className="blink text-cyan">_</span>
        </h2>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="y2k-wire-box p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center hover-glow-box">
            <h6 className="text-muted font-monospace small mb-2">&gt; TOTAL_TRANSMISSIONS (Orders)</h6>
            <h2 className="text-cyan m-0 font-monospace">{data.totalOrders}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="y2k-wire-box p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center hover-glow-box" style={{ borderColor: 'rgba(57, 255, 20, 0.5)' }}>
            <h6 className="text-muted font-monospace small mb-2">&gt; NET_YIELD (Revenue)</h6>
            <h2 className="m-0 font-monospace" style={{ color: '#39ff14', textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' }}>
              ₹{data.totalRevenue}
            </h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="y2k-wire-box p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center hover-glow-box" style={{ borderColor: 'rgba(176, 38, 255, 0.5)' }}>
            <h6 className="text-muted font-monospace small mb-2">&gt; SUCCESSFUL_DROPS (Delivered)</h6>
            <h2 className="m-0 font-monospace" style={{ color: '#b026ff', textShadow: '0 0 10px rgba(176, 38, 255, 0.5)' }}>
              {data.deliveredOrders}
            </h2>
          </div>
        </div>
      </div>

      {/* REVENUE CHART */}
      <div className="y2k-wire-box p-4 mb-5">
        <h5 className="text-cyan font-monospace mb-4 border-bottom-wire border-cyan pb-2">
          &gt; YIELD_HISTORY (Last 7 Days)
        </h5>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.1)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#5e7993" 
                tick={{ fill: '#5e7993', fontSize: 12, fontFamily: 'monospace' }} 
                tickMargin={10}
              />
              <YAxis 
                stroke="#5e7993" 
                tick={{ fill: '#5e7993', fontSize: 12, fontFamily: 'monospace' }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 229, 255, 0.05)' }} />
              <Bar 
                dataKey="revenue" 
                name="Revenue" 
                fill="rgba(0, 229, 255, 0.3)" 
                stroke="#00e5ff" 
                strokeWidth={2}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Orders by Status */}
        <div className="col-md-6">
          <div className="y2k-wire-box p-4 h-100">
            <h5 className="text-cyan font-monospace mb-4 border-bottom-wire border-cyan pb-2">
              &gt; TRANSMISSION_STATUS
            </h5>

            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.ordersByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth={2}
                  >
                    {data.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Y2K_COLORS[index % Y2K_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontFamily: 'monospace', fontSize: '12px', color: '#e0e6ed' }}
                    formatter={(value) => <span style={{ color: '#e0e6ed' }}>{value.toUpperCase()}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TOP SELLING ITEMS */}
        <div className="col-md-6">
          <div className="y2k-wire-box p-4 h-100 d-flex flex-column">
            <h5 className="text-magenta font-monospace mb-4 border-bottom-wire border-magenta pb-2">
              &gt; HIGHEST_FREQUENCY_NODES (Top Sellers)
            </h5>

            {(!data.topItems || data.topItems.length === 0) ? (
              <div className="flex-grow-1 d-flex justify-content-center align-items-center text-muted font-monospace">
                NO_SALES_DATA_DETECTED
              </div>
            ) : (
              <div className="d-flex flex-column gap-2 flex-grow-1 overflow-auto">
                {data.topItems.map((item, index) => (
                  <div key={item._id} className="d-flex justify-content-between align-items-center p-3 bg-cyan-dim border-start border-cyan" style={{ borderLeftWidth: '3px !important' }}>
                    <div className="d-flex align-items-center gap-3">
                      <span className="text-cyan font-monospace fw-bold">0{index + 1}</span>
                      <span className="text-main font-monospace">{item.name}</span>
                    </div>
                    <span className="font-monospace small px-2 py-1 bg-dark border border-cyan text-cyan">
                      x{item.quantitySold}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = `
  /* Local Component Styles */
  .y2k-wire-box {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(0, 229, 255, 0.3);
    position: relative;
    transition: all 0.3s ease;
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 6px; height: 6px; 
    border: 1px solid #00e5ff; pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  .hover-glow-box:hover {
    box-shadow: inset 0 0 20px rgba(0, 229, 255, 0.1), 0 0 15px rgba(0, 229, 255, 0.2);
    border-color: #00e5ff !important;
  }

  /* Override recharts default text color so legend works on dark mode */
  .recharts-default-legend {
    margin-top: 15px !important;
  }
`;