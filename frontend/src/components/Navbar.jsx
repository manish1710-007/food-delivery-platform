import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Navbar() {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">
        🍔 FoodDash
      </Link>

      <div className="ms-auto d-flex gap-3 align-items-center">
        {user && user.role === "admin" && (
          <Link
            to="/admin/dashboard"
            className="btn btn-outline-dark btn-sm"
          >
            Admin
          </Link>
        )}

        {user ? (
          <>
            <span className="fw-semibold">
              Hi, {user.name || user.email}
            </span>

            <div className="position-relative">
              <Link className="btn btn-outline-primary btn-sm" to="/cart">
                Cart
              </Link>

              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </div>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-primary btn-sm" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary btn-sm" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
