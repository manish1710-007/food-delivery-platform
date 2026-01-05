import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/admin/users").then((res) => setUsers(res.data));
    }, []);

    const updateRole = async (id, role) => {
        await api.patch('/admin/users/${id}/role', {role});
        setUsers((prev) =>
            prev.map((u) => (u._id === id ? { ...u, role } : u))
        );
    };

    return (
        <div className="container mt-4">
            <h3>User Management</h3>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Change</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) =>
                                        updateRole(user._id, e.target.value)
                                    }
                                >
                                    <option value="user">User</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}