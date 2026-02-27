import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/useAuth";

export default function Login() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      setSession(res.data.accessToken, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        
        
        <div className="col-md-5 col-lg-4 d-flex justify-content-center align-items-center bg-body shadow-sm z-1">
          <div className="w-100 p-5" style={{ maxWidth: "450px" }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold">Welcome Back 👋</h2>
              <p className="text-muted">Sign in to continue to FoodDash</p>
            </div>

            {error && <div className="alert alert-danger rounded-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email address</label>
                <input
                  type="email"
                  className="form-control form-control-lg bg-light border-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg bg-light border-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm mb-3"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-muted mt-3">
              Don’t have an account? <Link to="/register" className="fw-bold text-decoration-none">Register here</Link>
            </p>
          </div>
        </div>

        
        <div className="col-md-7 col-lg-8 d-none d-md-block position-relative bg-dark">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            alt="Delicious food"
            className="w-100 h-100"
            style={{ objectFit: "cover", opacity: "0.8" }}
          />
          <div className="position-absolute bottom-0 start-0 p-5 text-white">
            <h1 className="fw-bold display-4">Fast. Fresh. Delicious.</h1>
            <p className="lead fs-4">Delivered straight to your door.</p>
          </div>
        </div>

      </div>
    </div>
  );
}