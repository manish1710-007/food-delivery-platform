import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminDashboard() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.includes(path) ? "btn-dark" : "btn-outline-dark";
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <h4>Admin Panel</h4>
                <div className="d-grid gap-2 mt-4">

                    <Link 
                        to="/admin/dashboard/analytics"
                        className={`btn ${isActive("analytics")}`}
                    >
                        Analytics</Link>
                    <Link 
                        to="/admin/dashboard/restaurants"
                        className={`btn ${isActive("restaurants")}`}
                    >
                        Restaurants</Link>
                    <Link 
                        to="/admin/dashboard/products"
                        className={`btn ${isActive("products")}`}
                    >
                        Products</Link>
                    <Link 
                        to="/admin/dashboard/orders"
                        className={`btn ${isActive("orders")}`}
                    >
                        Orders</Link>
                    <Link 
                        to="/admin/dashboard/users"
                        className={`btn ${isActive("users")}`}
                    >
                        Users</Link>        
                </div>
            </div>

            {/* Content */}
            <div className="col-md-10 p-4"><Outlet />    
            </div>
        </div>
    );
}