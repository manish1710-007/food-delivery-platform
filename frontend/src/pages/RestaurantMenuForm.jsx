import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RestaurantMenuForm({
  fetchMenu,
  editingItem,
  setEditingItem
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: ""
  });

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState(""); // State for new tag input

  // Fetch existing categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || "",
        price: editingItem.price || "",
        image: editingItem.image || "",
        // Handle both populated object and raw ID string
        category: editingItem.category?._id || editingItem.category || ""
      });
    }
  }, [editingItem]);

  // Upload Image Handler
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "fooddash");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/du4ly99ab/image/upload",
        {
          method: "POST",
          body: data
        }
      );

      const json = await res.json();
      setForm((prev) => ({ ...prev, image: json.secure_url }));
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  // Function to Create New Category (The Fix)
  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      // Create category in DB
      const res = await api.post("/categories", { name });
      
      const newCat = res.data;
      setCategories((prev) => [...prev, newCat]);
      setForm((prev) => ({ ...prev, category: newCat._id }));
      setNewCategoryName(""); // Clear input
      
    } catch (err) {
      console.error("Failed to create category", err);
      alert("Failed to create category (Check console for details)");
    }
  };

  // Submit Form Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      alert("Please select or create a category");
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/restaurant/menu/${editingItem._id}`, form);
      } else {
        await api.post("/restaurant/menu", form);
      }

      // Reset form
      setForm({
        name: "",
        price: "",
        image: "",
        category: ""
      });

      setEditingItem(null);
      fetchMenu();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed");
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="mb-3">
          {editingItem ? "Edit Item" : "Add New Item"}
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            {/* NAME */}
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Item name"
                className="form-control"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

            {/* PRICE */}
            <div className="col-md-2">
              <input
                type="number"
                placeholder="Price"
                className="form-control"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                required
              />
            </div>

            {/* CATEGORY SELECT */}
            <div className="col-md-3">
              <select
                className="form-select"
                value={form.category || ""}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              >
                <option value="">Select category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* IMAGE */}
            <div className="col-md-2">
              <input
                type="file"
                className="form-control"
                onChange={uploadImage}
              />
            </div>

            {/* SUBMIT */}
            <div className="col-md-2">
              <button className="btn btn-primary w-100">
                {editingItem ? "Update" : "Add"}
              </button>
            </div>

          </div>

          {/* CREATE NEW TAG ROW */}
          <div className="row g-3 mt-2">
            <div className="col-md-6">
                <div className="input-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Or create new tag..." 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={handleAddCategory}
                    >
                        Add Tag
                    </button>
                </div>
            </div>
          </div>

          {/* IMAGE PREVIEW */}
          {form.image && (
            <div className="mt-3">
              <img
                src={form.image}
                alt="preview"
                style={{
                  width: "100px",
                  borderRadius: "6px"
                }}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}