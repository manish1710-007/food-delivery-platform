import React, { useState } from "react";
import { useAuth } from "../auth/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock form state (pre-filled with user data)
  const [form, setForm] = useState({
    name: user?.name || "Manish Kumar",
    email: user?.email || "manish@example.com",
    phone: "+91 9876543210",
    address: "123 Food Street, Raipur, India"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Add your api.put('/users/profile', form) call here
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="container-xl px-4 py-5 mx-auto" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4">👤 Edit Account</h2>
      
      <div className="card custom-card shadow-sm border-0 rounded-4 p-4 p-md-5">
        {success && <div className="alert alert-success rounded-3">Profile updated successfully! 🎉</div>}
        
        <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
          <img 
            src={`https://ui-avatars.com/api/?name=${form.name}&background=ff416c&color=fff&size=128`} 
            alt="Profile" 
            className="rounded-circle shadow-sm me-4" 
            width="100" 
          />
          <div>
            <h4 className="fw-bold mb-1">{form.name}</h4>
            <p className="text-muted mb-2">Manage your personal information</p>
            <button className="btn btn-sm btn-outline-primary rounded-pill px-3">Change Avatar</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" name="name" className="form-control form-control-lg bg-light border-0" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Email Address</label>
            <input type="email" name="email" className="form-control form-control-lg bg-light border-0" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Phone Number</label>
            <input type="text" name="phone" className="form-control form-control-lg bg-light border-0" value={form.phone} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Default Delivery Address</label>
            <input type="text" name="address" className="form-control form-control-lg bg-light border-0" value={form.address} onChange={handleChange} />
          </div>
          <div className="col-12 mt-5 text-end">
            <button type="submit" className="btn btn-danger btn-lg px-5 rounded-pill shadow-sm" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}