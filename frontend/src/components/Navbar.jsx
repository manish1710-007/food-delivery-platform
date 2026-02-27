import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth"; 
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle"; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand bg-body shadow-sm py-3 mb-4 border-bottom">
      <div className="container-xl d-flex justify-content-between align-items-center">
        
        {/* BRAND */}
        <Link to="/" className="navbar-brand fs-3 fw-bold text-body text-decoration-none m-0">
          FoodDash <span className="fs-4">🍔</span>
        </Link>

        {/* CONTROLS */}
        <div className="d-flex align-items-center gap-3">
          <ThemeToggle />
          
          {/*  CONDITIONAL RENDERING  */}
          {user ? (
            
            <>
              <Link to="/cart" className="btn btn-outline-danger position-relative rounded-pill px-4 fw-bold shadow-sm d-none d-sm-inline-block">
                Cart 🛒
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-body">
                    {cartCount}
                    <span className="visually-hidden">Items in cart</span>
                  </span>
                )}
              </Link>

              <div className="dropdown">
                <button 
                  className="btn btn-light dropdown-toggle d-flex align-items-center rounded-pill px-3 shadow-sm border custom-card" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=ff416c&color=fff`} 
                    alt="User" 
                    className="rounded-circle me-2" 
                    width="32" 
                    height="32" 
                  />
                  <span className="fw-semibold d-none d-sm-inline">{user.name}</span>
                </button>
                
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 rounded-4 p-2 bg-body-tertiary">
                  {/* ADMIN ONLY LINKS */}
                  {user.role == "admin" && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2 rounded-3 fw-bold text-danger" to="/admin/dashboard">Admin Dashboard</Link>
                      </li>
                      <li><hr className="dropdown-divider my-2 border-secondary opacity-25" /></li>
                    </>
                  )}

                  {/* RESTAURANT OWNER LINKS */}
                  {user.role == "restaurant" && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2 rounded-3 fw-bold text-warning" to="/restaurant/dashboard">Restaurant Panel</Link>
                      </li>
                      <li><hr className="dropdown-divider my-2 border-secondary opacity-25" /></li>
                    </>
                  )}
                  <li><Link className="dropdown-item py-2 rounded-3 fw-medium" to="/profile">👤 Edit Account</Link></li>
                  <li><Link className="dropdown-item py-2 rounded-3 fw-medium" to="/orders/my">📦 My Orders</Link></li>
                  <li><Link className="dropdown-item py-2 rounded-3 fw-medium" to="/settings">⚙️ Settings</Link></li>
                  <li><hr className="dropdown-divider my-2 border-secondary opacity-25" /></li>
                  <li><button className="dropdown-item py-2 rounded-3 fw-bold text-danger" onClick={handleLogout}>🚪 Logout</button></li>
                </ul>
              </div>
            </>
          ) : (
            
            <>
              <Link to="/login" className="btn btn-outline-primary rounded-pill px-4 fw-bold">Login</Link>
              <Link to="/register" className="btn btn-primary rounded-pill px-4 fw-bold">Sign Up</Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}