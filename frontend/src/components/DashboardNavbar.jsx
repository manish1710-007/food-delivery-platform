import { useAuth } from "../auth/useAuth";

export default function DashboardNavbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-light bg-white shadow-sm px-4">

            <span className="navbar-brand">
                Welcome, {user.name}!
            </span>

            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                Logout
            </button>
        </nav>
    );
}
    