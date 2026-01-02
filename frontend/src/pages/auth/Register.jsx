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
    role: "Restaurant" // default
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
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="col-md-5">
        <div className="card shadow p-4">
          <h3 className="text-center mb-3">Create Account</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Role</label>
              <select
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="restaurant">Restaurant Owner</option>
                <option value="driver">Driver</option>
              </select>
            </div>

            <button className="btn btn-success w-100">Register</button>
          </form>

          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
