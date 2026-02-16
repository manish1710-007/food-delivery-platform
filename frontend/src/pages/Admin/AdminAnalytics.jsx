import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

export default function AdminAnalytics() {
    const [data, setData] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        const res = await api.get("/admin/analytics");
        setData(res.data);
    };

    if (!data) return <div>Loading analytics...</div>;

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div>
            <h2>Admin Analytics</h2>

            {/* Stats */}
            <div className="row mt-4">
                <div className="card p-3">
                    <h5>Total Orders</h5>
                    <h3>{data.totalOrders}</h3>
                </div>
            </div>

            <div className="col-md-3">
                <div className="card p-3">
                    <h5>Total Revenue</h5>
                    <h3>${data.totalRevenue}</h3>
                </div>
            </div>
        {/* Charts */}
        <div className="row mt-5">

            {/* Pie Chart */}
            <div className="col-md-6">
                <h5>Orders by Restaurant</h5>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data.ordersByStatus}
                            dataKey="count"
                            nameKey="_id"
                            outerRadius={120}
                        >
                            {data.ordersByStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="col-md-6">
                <h5>Top Restaurant</h5>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topRestaurants}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="restaurant.name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" />
                    </BarChart>
                </ResponsiveContainer>
            </div>  

        </div>  
    </div>
);
}