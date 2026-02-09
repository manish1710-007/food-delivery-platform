import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RestaurantProfile() {
    const [data, setData] = useState({});

    useEffect(() => {
        api.get("/restaurant-owner/my").then(res => setData(res.data)); 
    }, []);

    const save = async () => {
        await api.put("/restaurant-owner/my", data);
        alert("Profile updated!");
    };

    return (
        <div>
            <input
                value={data.name || ""}
                onChange={ e => setData({ ...data, description: e.target.value})}
                placeholder="Restaurant Name"
                className="form-control mb-2"
            />
            <textarea
                value={data.description || ""}
                onChange={e => setData({ ...data, description: e.target.value})}
                className="form-control mb-2"

            />
            <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
    );
}