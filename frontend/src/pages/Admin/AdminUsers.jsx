import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const res = await api.get("/admin/users");
        setUsers(res.data);
    };

    const changeRole = async (id, role) => {
        await api.put(`/users/${id}/role`, { role });
        loadUsers();
    };

    return (
        <div>
            <h2>Users</h2>
            {users.map(u => (
                <div key={u._id} className="card p-3 mt-2">
                    <b>{u.email}</b>
                    <p>Role: {u.role}</p>

                    <button
                        className="btn btn-primary me-2"
                        onClick={() => changeRole(u._id, "admin")}
                    >
                        Make Admin
                    </button>

                    <button
                        className="btn btn-info"
                        onClick={() => changeRole(u._id, "restaurant")}
                    >
                        Make Restaurant
                    </button>
                </div>      
            ))} 
        </div>
    );
}