import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminPaymentAnalytics() {
    const [data, setData] = useState([]);
    
    useEffect(() => {

        api.get("/admin/payment-analytics")
            .then((res) => {
                setData(res.data.revenueByDate);
            });
    }, []);

    return (
        <div>
            <h3>Revenue Analytics</h3>
            <LineChart width={700} height={400} data={data}>

            <XAxis datakey="_id" />
            <YAxis />
            <Tooltip />
            <CartesianGrid/>

            <Line datakey="revenue" />
            </LineChart>
        </div>
    );
}