import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false); // Added uploading state

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    try {
      const res = await api.get("/admin/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "", address: "", image: "" });
    setShowModal(true);
  }

  function openEdit(r) {
    setEditing(r);
    setForm({
      name: r.name,
      description: r.description || "",
      address: r.address || "",
      image: r.image || "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/restaurants/${editing._id}`, form);
      } else {
        await api.post("/admin/restaurants", form);
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this restaurant permanently?")) return;
    try {
      await api.delete(`/admin/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function toggleActive(id) {
    try {
      await api.patch(`/admin/restaurants/${id}/toggle`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("Toggle failed");
    }
  }

  async function toggleApproval(id) {
    try {
      await api.patch(`/admin/restaurants/${id}/approve`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "fooddash");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dcl5zom8v/image/upload`, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setForm({ ...form, image: json.secure_url });
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-danger" />
    </div>
  );

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h3 className="fw-bold mb-0">🏪 Restaurants</h3>
        <button className="btn btn-danger rounded-pill px-4 shadow-sm fw-bold" onClick={openCreate}>
          + Add Restaurant
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="card custom-card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="row">
          <div className="col-md-6">
            <input
              className="form-control bg-light border-0"
              placeholder="🔍 Search restaurants by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card custom-card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle mb-0">
            <thead className="border-bottom">
              <tr>
                <th className="py-3 px-4">Restaurant</th>
                <th>Address</th>
                <th>Approval</th>
                <th>Status</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No restaurants found.
                  </td>
                </tr>
              )}
              {filtered.map(r => (
                <tr key={r._id} className="border-bottom">
                  <td className="py-3 px-4">
                    <div className="d-flex align-items-center">
                      <img
                        src={r.image || "https://via.placeholder.com/60"}
                        width="48"
                        height="48"
                        className="rounded-3 me-3 shadow-sm"
                        style={{ objectFit: "cover" }}
                        alt={r.name}
                      />
                      <div>
                        <h6 className="fw-bold mb-0">{r.name}</h6>
                        <small className="text-muted text-truncate d-inline-block" style={{maxWidth: "200px"}}>
                          {r.description || "No description"}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-muted">{r.address}</span></td>
                  
                  {/* APPROVAL BADGE */}
                  <td>
                    <span className={`badge ${r.status === "approved" ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25" : "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25"}`}>
                      {r.status || "Pending"}
                    </span>
                  </td>

                  {/* ACTIVE BADGE */}
                  <td>
                    <span className={`badge ${r.isActive ? "bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25" : "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25"}`}>
                      {r.isActive ? "Active" : "Offline"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-end px-4">
                    <button className="btn btn-sm btn-light border rounded-pill px-3 me-2" onClick={() => toggleApproval(r._id)}>Approve</button>
                    <button className="btn btn-sm btn-light border rounded-pill px-3 me-2" onClick={() => toggleActive(r._id)}>Toggle</button>
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" onClick={() => openEdit(r)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDelete(r._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* THEME-AWARE MODAL */}
      {showModal && (
        <>
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <form className="modal-content custom-card border-0 shadow-lg rounded-4" onSubmit={handleSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="fw-bold mb-0">
                    {editing ? "✏️ Edit Restaurant" : "✨ Add Restaurant"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                
                <div className="modal-body p-4">
                  <label className="form-label fw-semibold small">Restaurant Name</label>
                  <input className="form-control bg-light border-0 mb-3" placeholder="e.g. Domino's Pizza" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  
                  <label className="form-label fw-semibold small">Address</label>
                  <input className="form-control bg-light border-0 mb-3" placeholder="e.g. 123 Main St" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                  
                  <label className="form-label fw-semibold small">Description</label>
                  <textarea className="form-control bg-light border-0 mb-3" placeholder="A short blurb about the restaurant..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  
                  <label className="form-label fw-semibold small">Restaurant Image</label>
                  <input type="file" className="form-control bg-light border-0 mb-2" onChange={uploadImage} />
                  
                  {uploading && <div className="text-primary small fw-semibold mb-3">Uploading image to secure cloud...</div>}
                  
                  {form.image && (
                    <div className="mt-3">
                      <img src={form.image} width="120" className="rounded-4 shadow-sm" alt="Preview" />
                    </div>
                  )}
                </div>
                
                <div className="modal-footer border-top border-0">
                  <button className="btn btn-light rounded-pill px-4" type="button" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-danger rounded-pill px-4 fw-bold shadow-sm" type="submit" disabled={uploading}>
                    {uploading ? "Wait..." : "Save Restaurant"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}