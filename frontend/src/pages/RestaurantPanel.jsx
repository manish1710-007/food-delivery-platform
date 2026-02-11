import { Link, Outlet, useLocation } from "react-router-dom";

export default function RestaurantPanel() {
  const { pathname } = useLocation();

  const navItem = (to, label) => (
    <Link
        to={to}
        className={`List-group-item list-group-item-action ${pathname.includes(to) ? "active" : ""}`}
    >
        {label}
    </Link>
  );

  return (
    <div className="container-fluid">
        <div className="row min-vh-100">
            {/* Sidebar */}
            <div className="col-3 col-md-2 bg-light border-end p-3">
                <h5 className="mb-4">Restaurant Panel</h5>
                <div className="list-group">
                    {navItem("/restaurant/panel/profile", "Profile")}
                    {navItem("/restaurant/panel/menu", "Menu")}
                    {navItem("/restaurant/panel/orders", "Orders")}
                    {navItem("/restaurant/panel/menu/Analytics", "Analytics")}
                </div>
            </div>
            
            {/* Main Content */}
            <div className="col-9 col-md-10 p-4">
                <Outlet />
            </div>
        </div>      
    </div>
  );
}