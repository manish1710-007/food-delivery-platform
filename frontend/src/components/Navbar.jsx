import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth"; 
import ThemeToggle from "./ThemeToggle"; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand bg-body shadow-sm py-3 mb-4 border-bottom">
      <div className="container-xl d-flex justify-content-between align-items-center">
        
        {/* BRAND */}
        <Link to="/" className="navbar-brand fs-3 fw-bold text-dark text-decoration-none m-0">
          FoodDash <span className="fs-4">🍔</span>
        </Link>

        {/* CONTROLS */}
        <div className="d-flex align-items-center gap-3">
          <ThemeToggle />
          
          {/* ====== CONDITIONAL RENDERING ====== */}
          {user ? (
            /* SHOW THIS IF LOGGED IN */
            <>
              <Link to="/cart" className="btn btn-outline-danger position-relative rounded-pill px-4 fw-bold shadow-sm d-none d-sm-inline-block">
                Cart 🛒
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
                
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 rounded-4 p-2 custom-card">
                  <li><Link className="dropdown-item py-2 rounded-3 fw-medium" to="/profile">👤 Edit Account</Link></li>
                  <li><Link className="dropdown-item py-2 rounded-3 fw-medium" to="/settings">⚙️ Settings</Link></li>
                  <li><hr className="dropdown-divider my-2" /></li>
                  <li><button className="dropdown-item py-2 rounded-3 fw-bold text-danger" onClick={handleLogout}>🚪 Logout</button></li>
                </ul>
              </div>
            </>
          ) : (
            /* SHOW THIS IF LOGGED OUT */
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