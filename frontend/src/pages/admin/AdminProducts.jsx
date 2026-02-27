import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({ 
      name: "", 
      price: "", 
      category: "", 
      restaurant: "", 
      image: "", 
      available: true 
  });

  useEffect(() => {
    fetchProducts();
    fetchRestaurants();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRestaurants() {
    try {
      const res = await api.get("/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", price: "", category: "", restaurant: "", image: "", available: true });
    setShowModal(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      restaurant: product.restaurant?._id || "",
      image: product.image || "",
      available: product.available ?? true,
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
          // FIXED: Using .patch instead of .put to match your backend!
          await api.patch(`/products/${editing._id}`, form);
      } else {
          await api.post("/products", form);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Save failed:", err);
      // FIXED: Actually show the error if it fails
      alert(err.response?.data?.message || "Failed to save product.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  async function toggleAvailability(product) {
    try {
      // FIXED: Using .patch instead of .put here too!
      await api.patch(`/products/${product._id}`, {
        ...product,
        available: !product.available,
        restaurant: product.restaurant?._id,
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle availability");
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
      const res = await fetch("https://api.cloudinary.com/v1_1/dcl5zom8v/image/upload", { method: "POST", body: data });
      const json = await res.json();
      setForm({ ...form, image: json.secure_url });
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
        setUploading(false);
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && (!restaurantFilter || p.restaurant?._id === restaurantFilter)
  );

  if (loading) return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="spinner-border text-danger" />
      </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h3 className="fw-bold mb-0 text-body">🍔 Product Management</h3>
        <button className="btn btn-danger rounded-pill px-4 shadow-sm fw-bold" onClick={openCreate}>+ Add Product</button>
      </div>

      {/* FILTERS */}
      <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input className="form-control shadow-none bg-transparent text-body" placeholder="🔍 Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-6">
            <select className="form-select shadow-none bg-transparent text-body" value={restaurantFilter} onChange={(e) => setRestaurantFilter(e.target.value)}>
              <option value="">All Restaurants</option>
              {restaurants.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle mb-0 bg-transparent">
            <thead className="border-bottom border-secondary border-opacity-25">
              <tr>
                <th className="py-3 px-4 text-body">Item</th>
                <th className="text-body">Restaurant</th>
                <th className="text-body">Category</th>
                <th className="text-body">Price</th>
                <th className="text-body">Status</th>
                <th className="text-end px-4 text-body">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-bottom border-secondary border-opacity-10">
                  <td className="py-3 px-4">
                    <div className="d-flex align-items-center">
                      <img src={p.image || "https://via.placeholder.com/48"} width="48" height="48" className="rounded-3 me-3 shadow-sm" style={{objectFit: "cover"}} alt="" />
                      <span className="fw-semibold text-body">{p.name}</span>
                    </div>
                  </td>
                  <td><span className="text-muted">{p.restaurant?.name || "Unassigned"}</span></td>
                  <td><span className="badge bg-secondary bg-opacity-10 text-body border border-secondary border-opacity-25">{p.category}</span></td>
                  <td className="fw-bold text-danger">₹{p.price}</td>
                  <td>
                    <span className={`badge ${p.available ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25" : "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25"}`}>
                      {p.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="text-end px-4">
                    <button className="btn btn-sm btn-light border rounded-pill px-3 me-2 shadow-sm" onClick={() => toggleAvailability(p)}>Toggle</button>
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDelete(p._id)}>Delete</button>
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
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)" }}>
            <div className="modal-dialog modal-dialog-centered">
              {/* bg-body-tertiary fixes the blinding white box in dark mode! */}
              <form className="modal-content bg-body-tertiary border-0 shadow-lg rounded-4" onSubmit={handleSubmit}>
                <div className="modal-header border-bottom border-secondary border-opacity-25">
                  <h5 className="fw-bold mb-0 text-body">{editing ? "✏️ Edit Product" : "✨ Add Product"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                
                <div className="modal-body p-4">
                  <label className="form-label fw-semibold small text-body">Product Name</label>
                  <input className="form-control shadow-none bg-transparent text-body mb-3 border-secondary border-opacity-50" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                  
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small text-body">Price (₹)</label>
                      <input type="number" className="form-control shadow-none bg-transparent text-body border-secondary border-opacity-50" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small text-body">Category</label>
                      <input className="form-control shadow-none bg-transparent text-body border-secondary border-opacity-50" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
                    </div>
                  </div>

                  <label className="form-label fw-semibold small text-body">Assign to Restaurant</label>
                  <select className="form-select shadow-none bg-transparent text-body mb-3 border-secondary border-opacity-50" value={form.restaurant} onChange={(e) => setForm({...form, restaurant: e.target.value})} required>
                    <option value="" className="text-dark">Select restaurant...</option>
                    {restaurants.map((r) => <option key={r._id} value={r._id} className="text-dark">{r.name}</option>)}
                  </select>

                  <label className="form-label fw-semibold small text-body">Product Image</label>
                  <input type="file" className="form-control shadow-none bg-transparent text-body mb-2 border-secondary border-opacity-50" onChange={uploadImage} />
                  
                  {uploading && <div className="text-primary fw-medium small mb-2">Uploading to secure cloud...</div>}
                  {form.image && <img src={form.image} width="100" className="rounded-3 shadow-sm mt-2 mb-3" alt="Preview" />}

                  <div className="form-check form-switch mt-3">
                    <input type="checkbox" className="form-check-input" checked={form.available} onChange={(e) => setForm({...form, available: e.target.checked})} />
                    <label className="form-check-label ms-2 fw-medium text-body">Available for ordering</label>
                  </div>
                </div>
                
                <div className="modal-footer border-top border-secondary border-opacity-25">
                  <button type="button" className="btn btn-light border rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-danger rounded-pill px-4 fw-bold shadow-sm" disabled={uploading}>
                      {uploading ? "Wait..." : "Save Product"}
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