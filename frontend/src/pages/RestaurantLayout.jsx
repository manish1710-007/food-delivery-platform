import { Link, Outlet } from "react-router-dom";

export default function RestaurantLayout() {
  return (
    <div className="container mt-4">
        <h2>🍽️ Restaurant Owner Dashboard</h2>
        
        <div className ="d-flex gap-3 mb-4">
            <Link to="dashboard">Orders</Link>
            <Link to="profile">Profile</Link>
            <Link to="menu">Menu</Link>
        </div>    
        <Outlet />
    </div>
  );
}   
            