import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    };

    const changeRole = async (id, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        
        setUpdatingId(id);
        try {
            await api.put(`/users/${id}/role`, { role: newRole });
            await loadUsers();
        } catch (err) {
            console.error("Failed to update role", err);
            alert("Could not update user role.");
        } finally {
            setUpdatingId(null);
        }
    };

    const getRoleBadge = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
            case 'restaurant':
                return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
            case 'driver':
                return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
            default: 
                return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25';
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
            (u.email || "").toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter ? u.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <div className="spinner-border text-danger" />
        </div>
    );

    return (
        <div className="container-fluid py-4">
            
            {/* HEADER */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                {/* text-body ensures it's black in light mode, white in dark mode */}
                <h3 className="fw-bold mb-0 text-body">👥 User Management</h3>
                <div className="badge bg-secondary bg-opacity-10 text-body border px-3 py-2 rounded-pill fw-semibold">
                    Total Users: {users.length}
                </div>
            </div>

            {/* FILTERS & SEARCH */}
            {/* bg-body-tertiary elegantly handles light/dark mode natively */}
            <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 p-3 mb-4">
                <div className="row g-3">
                    <div className="col-md-8">
                        {/* Standard form-control automatically handles theme colors */}
                        <input
                            className="form-control form-control-lg shadow-none"
                            placeholder="🔍 Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select form-select-lg shadow-none"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="customer">Customer</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="driver">Driver</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* USERS TABLE */}
            <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    {/* table-transparent prevents Bootstrap tables from forcing a white background */}
                    <table className="table table-borderless table-hover align-middle mb-0 bg-transparent">
                        <thead className="border-bottom">
                            <tr>
                                <th className="py-3 px-4 text-body">User</th>
                                <th className="text-body">Role</th>
                                <th className="text-body">Joined</th>
                                <th className="text-end px-4 text-body">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            )}
                            {filteredUsers.map(u => (
                                <tr key={u._id} className="border-bottom">
                                    <td className="py-3 px-4">
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={`https://ui-avatars.com/api/?name=${u.name || u.email}&background=random&color=fff`} 
                                                alt="Avatar" 
                                                className="rounded-circle me-3 shadow-sm" 
                                                width="42" 
                                                height="42" 
                                            />
                                            <div>
                                                <h6 className="fw-bold mb-0 text-body">{u.name || "Unknown User"}</h6>
                                                <small className="text-muted">{u.email}</small>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={`badge rounded-pill px-3 py-2 ${getRoleBadge(u.role)}`}>
                                            <span className="text-capitalize">{u.role || "customer"}</span>
                                        </span>
                                    </td>

                                    <td>
                                        <span className="text-muted small fw-medium">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </td>

                                    <td className="text-end px-4">
                                        {updatingId === u._id ? (
                                            <span className="spinner-border spinner-border-sm text-primary me-3" />
                                        ) : (
                                            <div className="dropdown">
                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 dropdown-toggle shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Manage Role
                                                </button>
                                                {/* Dropdown menu bg-body-tertiary for dark mode fix */}
                                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 rounded-4 p-2 bg-body-tertiary">
                                                    <li><h6 className="dropdown-header fw-bold text-body">Assign new role:</h6></li>
                                                    <li><button className="dropdown-item py-2 rounded-3 fw-medium text-body" onClick={() => changeRole(u._id, "customer")}>👤 Customer</button></li>
                                                    <li><button className="dropdown-item py-2 rounded-3 fw-medium text-body" onClick={() => changeRole(u._id, "restaurant")}>🏪 Restaurant</button></li>
                                                    <li><button className="dropdown-item py-2 rounded-3 fw-medium text-body" onClick={() => changeRole(u._id, "driver")}>🛵 Driver</button></li>
                                                    <li><hr className="dropdown-divider my-2 border-secondary opacity-25" /></li>
                                                    <li><button className="dropdown-item py-2 rounded-3 fw-bold text-danger" onClick={() => changeRole(u._id, "admin")}>🛡️ Admin</button></li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}