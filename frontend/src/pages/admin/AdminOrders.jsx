import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const res = await api.get("/admin/orders");
        setOrders(res.data);
    };

    return (
        <div>
            <h2>All orders</h2>
            {orders.map(o => (
                <div key={o._id} className="card p-3 mt-3">
                    <h5>Order #{o._id.slice(-6)}</h5>
                    <p>Status: {o.status}</p>
                    <p>Total: ${o.total}</p>
                </div>
            ))}
        </div>
    );
}
