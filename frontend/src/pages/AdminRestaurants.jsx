import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState("");

  // Fetch all restaurants 
  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/admin/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const createRestaurant = async () => {
    if (!name.trim()) return;
    try {
      await api.post("/admin/restaurants", { name });
      setName("");
      fetchRestaurants();
    } catch (err) {
      alert("Failed to add restaurant", err);
    }
  };

 
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/restaurants/${id}/status`, { status });
      fetchRestaurants();
    } catch (err) {
      alert(`Failed to ${status} restaurant`, err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>🏪 Manage Restaurants</h3>

      {/* Add New Restaurant Section */}
      <div className="input-group my-4 shadow-sm">
        <input
          className="form-control"
          placeholder="New Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createRestaurant}>
          Add Restaurant
        </button>
      </div>

      {/* Restaurant List */}
      <div className="row">
        {restaurants.map((r) => (
          <div key={r._id} className="col-12 mb-3">
            <div className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                
                {/* Left Side: Info */}
                <div>
                  <h5 className="mb-1">{r.name}</h5>
                  
                  {/* Show Owner info if available */}
                  {r.owner && (
                    <p className="text-muted mb-1 small">
                      Owner: {r.owner.name} ({r.owner.email})
                    </p>
                  )}
                  
                  {/* Status Indicator */}
                  <span className={`badge ${r.isApproved || r.status === 'approved' ? "bg-success" : "bg-warning text-dark"}`}>
                    {r.isApproved || r.status === 'approved' ? "✅ Approved" : "⏳ Pending"}
                  </span>
                </div>

              
                <div>
                  {/* Only show buttons if not yet approved */}
                  {(!r.isApproved && r.status !== 'approved') && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => updateStatus(r._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(r._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        ))}

        {restaurants.length === 0 && (
          <p className="text-center text-muted">No restaurants found.</p>
        )}
      </div>
    </div>
  );
}