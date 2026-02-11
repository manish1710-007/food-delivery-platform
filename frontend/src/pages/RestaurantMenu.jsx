import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function RestaurantMenu() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        api.get("/restaurant-owner/menu").then(res => setItems(res.data)); 
    }, []);

    return (
        <div> 
            <h3>Restaurant Menu Management</h3>
            <Link to="add" className="btn-success mb-3">Add New Item</Link>

            {items.map(item => (
                <div key={item._id} className="card p-2 mb-2">
                    <b>{item.name}</b> - ₹{item.price}
                    <div className="mt-2">
                        <Link to={`${item._id}/edit`} className="btn btn-sm btn-primary">Edit</Link>
                    </div>
                </div>    
            ))}
        </div>
    );
}