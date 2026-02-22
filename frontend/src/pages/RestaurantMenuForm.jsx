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
    category: "Burger"
  });

  useEffect(() => {
    if (editingItem) {
      setForm(editingItem);
    }
  }, [editingItem]);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "fooddash");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dcl5zom8v/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const json = await res.json();
    setForm({ ...form, image: json.secure_url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await api.put(`/restaurant/menu/${editingItem._id}`, form);
      } else {
        await api.post("/restaurant/menu", form);
      }

      setForm({ name: "", price: "", image: "" });
      setEditingItem(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then(res=>{setCategories(res.data)});
  }, []);

  <select
    value={form.category}
    onChange={e => setForm({ ...form, category: e.target.value })}
    className="form-select"
  >

    <option>Select category</option>
    {categories.map(cat => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5>{editingItem ? "Edit Item" : "Add New Item"}</h5>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
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

            <div className="col-md-3">
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

            <div className="col-md-3">
              <input
                type="file"
                className="form-control"
                onChange={uploadImage}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
                >
                <option value="Appetizer">Appetizer</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Salad">Salad</option>
                <option value="Other">Other</option>  
                </select>
            </div>

            <div className="col-md-2">
              <button className="btn btn-primary w-100">
                {editingItem ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
