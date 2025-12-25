import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "220px" }}>
      <h4>Admin Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item"><Link to="/" className="nav-link text-white">Dashboard</Link></li>
        <li className="nav-item"><Link to="/restaurant" className="nav-link text-white">restaurant</Link></li>
        <li className="nav-item"><Link to="/orders" className="nav-link text-white">Orders</Link></li>
        <li className="nav-item"><Link to="/users" className="nav-link text-white">Users</Link></li>
      </ul>
    </div>
  );
}
export default Sidebar;
