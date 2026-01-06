import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    api.get("/admin/restaurants/pending")
      .then(res => setRestaurants(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/restaurants/${id}/status`, { status });
    setRestaurants(prev => prev.filter(r => r._id !== id));
  };

  return (
    <div className="container mt-4">
      <h3>🍽️ Pending Restaurants</h3>

      {restaurants.length === 0 && <p>No pending approvals</p>}

      {restaurants.map(r => (
        <div key={r._id} className="card mb-3">
          <div className="card-body">
            <h5>{r.name}</h5>
            <p>Owner: {r.owner.name} ({r.owner.email})</p>

            <button
              className="btn btn-success me-2"
              onClick={() => updateStatus(r._id, "approved")}
            >
              Approve
            </button>

            <button
              className="btn btn-danger"
              onClick={() => updateStatus(r._id, "rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
