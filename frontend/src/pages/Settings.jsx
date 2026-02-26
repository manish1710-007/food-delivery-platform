import React from "react";

export default function Settings() {
  return (
    <div className="container-xl px-4 py-5 mx-auto" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4">⚙️ Settings</h2>

      {/* Security Section */}
      <div className="card custom-card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h5 className="fw-bold mb-3 border-bottom pb-2">🔒 Security</h5>
        <div className="mb-3">
          <label className="form-label fw-semibold">Current Password</label>
          <input type="password" className="form-control bg-light border-0" placeholder="••••••••" />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">New Password</label>
            <input type="password" className="form-control bg-light border-0" placeholder="••••••••" />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input type="password" className="form-control bg-light border-0" placeholder="••••••••" />
          </div>
        </div>
        <button className="btn btn-dark rounded-pill px-4 mt-2">Update Password</button>
      </div>

      {/* Preferences Section */}
      <div className="card custom-card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h5 className="fw-bold mb-3 border-bottom pb-2">🔔 Notifications & Preferences</h5>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="fw-bold mb-0">Email Receipts</h6>
            <p className="text-muted small mb-0">Receive a copy of your order receipt via email.</p>
          </div>
          <div className="form-check form-switch fs-4">
            <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="fw-bold mb-0">SMS Delivery Alerts</h6>
            <p className="text-muted small mb-0">Get text messages when your driver is nearby.</p>
          </div>
          <div className="form-check form-switch fs-4">
            <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="fw-bold mb-0">Promotional Emails</h6>
            <p className="text-muted small mb-0">Receive discount codes and special offers.</p>
          </div>
          <div className="form-check form-switch fs-4">
            <input className="form-check-input" type="checkbox" role="switch" />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card bg-danger bg-opacity-10 border-danger border border-opacity-25 shadow-sm rounded-4 p-4">
        <h5 className="fw-bold text-danger mb-2">Danger Zone</h5>
        <p className="text-danger opacity-75 small mb-3">Once you delete your account, there is no going back. Please be certain.</p>
        <div>
          <button className="btn btn-outline-danger fw-bold rounded-pill px-4">Delete Account</button>
        </div>
      </div>

    </div>
  );
}