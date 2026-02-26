import React, { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100 flex-md-row-reverse">
        
        
        <div className="col-md-5 col-lg-4 d-flex justify-content-center align-items-center bg-white shadow-sm z-1">
          <div className="w-100 p-5" style={{ maxWidth: "450px" }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold">Create Account ✨</h2>
              <p className="text-muted">Join FoodDash today!</p>
            </div>

            {error && <div className="alert alert-danger rounded-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-lg bg-light border-0"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg bg-light border-0"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg bg-light border-0"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">I want to sign up as a:</label>
                <select
                  name="role"
                  className="form-select form-select-lg bg-light border-0"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="customer">Hungry Customer</option>
                  <option value="restaurant">Restaurant Owner</option>
                  <option value="driver">Delivery Driver</option>
                </select>
              </div>

              <button className="btn btn-success btn-lg w-100 rounded-3 shadow-sm mb-3">
                Register
              </button>
            </form>

            <p className="text-center text-muted mt-3">
              Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Log in</Link>
            </p>
          </div>
        </div>

        
        <div className="col-md-7 col-lg-8 d-none d-md-block position-relative bg-dark">
          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop"
            alt="Burger background"
            className="w-100 h-100"
            style={{ objectFit: "cover", opacity: "0.8" }}
          />
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-4">
             <h1 className="fw-bold display-3 shadow-sm">Craving Something?</h1>
          </div>
        </div>

      </div>
    </div>
  );
}