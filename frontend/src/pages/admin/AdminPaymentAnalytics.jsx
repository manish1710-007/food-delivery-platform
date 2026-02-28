import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

export default function AdminPaymentAnalytics() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get("/admin/payment-analytics");
            
            setData(res.data.revenueByDate || []);
        } catch (err) {
            console.error("Failed to load payment analytics", err);
            setError("Failed to load revenue data.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate total revenue from the fetched data for a quick metric
    const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

    // Custom formatter to make dates look cleaner 
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return isNaN(date) ? dateStr : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <div className="spinner-border text-danger" />
        </div>
    );

    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger rounded-4 shadow-sm">{error}</div>
        </div>
    );

    return (
        <div className="container-fluid py-4">
            {/* HEADER */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <h3 className="fw-bold mb-0 text-body">💳 Revenue Analytics</h3>
                
                <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-4 py-2 rounded-pill fs-6 fw-bold shadow-sm">
                    Total: ₹{totalRevenue.toLocaleString()}
                </div>
            </div>

            {/* CHART CARD */}
            <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 p-4">
                <h5 className="fw-bold mb-4 text-body">Revenue Over Time</h5>
                
                {data.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        No revenue data available yet.
                    </div>
                ) : (
                    
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6c757d" opacity={0.2} />
                                
                                
                                <XAxis 
                                    dataKey="_id" 
                                    tickFormatter={formatDate} 
                                    tick={{ fill: '#6c757d', fontSize: 12 }} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    dy={10} 
                                />
                                
                                <YAxis 
                                    tickFormatter={(value) => `₹${value}`} 
                                    tick={{ fill: '#6c757d', fontSize: 12 }} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    dx={-10} 
                                />
                                
                                <Tooltip 
                                    formatter={(value) => [`₹${value}`, "Revenue"]}
                                    labelFormatter={formatDate}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                                />
                                
                                
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#ff416c" 
                                    strokeWidth={4} 
                                    dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#ff416c" }} 
                                    activeDot={{ r: 8, fill: "#ff416c", stroke: "#fff", strokeWidth: 2 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}