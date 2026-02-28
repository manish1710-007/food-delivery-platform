import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function DashboardSidebar() {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => 
        location.pathname.startsWith(path) ? "bg-primary text-white" : "";

    return (
        <div 
            className="bg-dark text-white p-3"
            style={{ width: "250px", minHeight: "100vh" }}
        >
            <h4 className="mb-4">FoodDash</h4>

            {/* Admin Menu */}
            {user.role === "admin" && (
                <>
                    <Link className={`nav-link text-white ${isActive("/admin/dashboard")}`} to="/admin/dashboard">Dashboard</Link>
                    <Link className={`nav-link text-white ${isActive("/admin/restaurants")}`} to="/admin/restaurants">Restaurants</Link>
                    <Link className={`nav-link text-white ${isActive("/admin/orders")}`} to="/admin/orders">Orders</Link>
                    <Link className={`nav-link text-white ${isActive("/admin/categories")}`} to="/admin/categories">Categories</Link>
                    <Link className={`nav-link text-white ${isActive("/admin/payment-analytics")}`} to="/admin/payment-analytics">Revenue</Link>
                    <Link className={`nav-link text-white ${isActive("/admin/analytics")}`} to="/admin/analytics">Analytics</Link>
                </>
            )}

            {/* Restaurant Menu */}
            {user?.role === "restaurant" && (
                <>
                <Link className={`nav-link text-white ${isActive("/restaurant/dashboard")}`} to="/restaurant/dashboard">Dashboard</Link>
                <Link className={`nav-link text-white ${isActive("/restaurant/menu")}`} to="/restaurant/menu">Menu</Link>
                <Link className={`nav-link text-white ${isActive("/restaurant/orders")}`} to="/restaurant/orders">Orders</Link>
                <Link className={`nav-link text-white ${isActive("/restaurant/analytics")}`} to="/restaurant/analytics">Analytics</Link>
                </>
            )}
        </div>
    
    );
}
