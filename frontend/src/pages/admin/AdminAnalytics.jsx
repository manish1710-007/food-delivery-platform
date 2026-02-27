import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function AdminAnalytics() {
    const [data, setData] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const res = await api.get("/admin/analytics");
            setData(res.data);
        } catch (err) {
            console.error("Failed to load analytics", err);
        }
    };

    if (!data) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-danger" />
        </div>
    );

    const COLORS = ["#ff416c", "#00C49F", "#FFBB28", "#ff4b2b"];

    return (
        <div className="container-fluid py-4">
            <h3 className="fw-bold mb-4">📈 Analytics Overview</h3>

            {/* Premium Metric Cards */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card custom-card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: "60px", height: "60px", fontSize: "24px"}}>📦</div>
                        <div>
                            <p className="text-muted mb-1 fw-semibold">Total Orders</p>
                            <h3 className="fw-bold m-0">{data.totalOrders}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card custom-card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center">
                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: "60px", height: "60px", fontSize: "24px"}}>₹</div>
                        <div>
                            <p className="text-muted mb-1 fw-semibold">Total Revenue</p>
                            <h3 className="fw-bold m-0 text-success">₹{data.totalRevenue}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="row g-4">
                {/* Pie Chart */}
                <div className="col-lg-6">
                    <div className="card custom-card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h5 className="fw-bold mb-4">Orders by Restaurant</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={data.ordersByStatus} dataKey="count" nameKey="_id" outerRadius={100} innerRadius={60} stroke="none">
                                    {data.ordersByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="col-lg-6">
                    <div className="card custom-card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h5 className="fw-bold mb-4">Top Restaurants</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.topRestaurants}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                <XAxis dataKey="restaurant.name" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '10px', border: 'none' }} />
                                <Bar dataKey="revenue" fill="#ff416c" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>  
            </div>  
        </div>
    );
}