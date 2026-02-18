import {  useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminRestaurants() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        const res = await api.get("/admin/restaurants");
        setRestaurants(res.data);
    };

    const updateStatus = async (id, status) => {
        await api.put(`/restaurants/${id}/status`, { status });
        loadRestaurants();
    };

    return (
        <div>
            <h2>Restaurants</h2>

            {restaurants.map(r => (
                <div key={r._id} className="card p-3 mt-3">

                    <h5>{r.name}</h5>
                    <p>Status: {r.status}</p>

                    <button
                        className="btn btn-success me-2"
                        onClick={() => updateStatus(r._id, "approved")}
                    >
                        Approve 
                        </button> 

                        <button
                            className="btn btn-danger"
                            onClick={() => updateStatus(r._id, "rejected")}
                        >
                            Reject
                        </button>
                </div>      
            ))}
        </div>
    );
}