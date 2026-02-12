import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

export default function RestaurantMenu() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: ""
  });

  
  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?restaurant=${user.restaurantId}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.restaurantId) {
      fetchProducts();
    }
  }, [user]);

  
  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category));
    return ["All", ...unique];
  }, [items]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await api.patch(`/products/${editingItem._id}`, form);
      } else {
        await api.post("/products", {
          ...form,
          restaurant: user.restaurantId
        });
      }

      setForm({ name: "", price: "", image: "", category: "" });
      setEditingItem(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  
  const editProduct = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      price: item.price,
      image: item.image || "",
      category: item.category
    });
  };

  if (loading) return <div className="m-4">Loading menu...</div>;

  return (
    <div className="container mt-4">
      <h2>🍽 Restaurant Menu</h2>

      
      <div className="card p-3 mb-4">
        <h5>{editingItem ? "Edit Item" : "Add New Item"}</h5>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Item Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Image URL"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
            />
          </div>

          
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100">
              {editingItem ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      
      <div className="mb-4 d-flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${
              activeCategory === cat
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      
      <div className="row">
        {items
          .filter((item) =>
            activeCategory === "All"
              ? true
              : item.category === activeCategory
          )
          .map((item) => (
            <div key={item._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {item.image && (
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body">
                  <span className="badge bg-info text-dark mb-2">
                    {item.category}
                  </span>

                  <h5>{item.name}</h5>
                  <p className="fw-bold">₹{item.price}</p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => editProduct(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProduct(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {items.length === 0 && (
        <div className="text-muted">No items added yet.</div>
      )}
    </div>
  );
}
