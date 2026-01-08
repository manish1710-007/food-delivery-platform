import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminProducts() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    restaurant: ""
  });

  useEffect(() => {
    api.get("/admin/restaurants").then(res => setRestaurants(res.data));
  }, []);

  const submit = async () => {
    await api.post("/admin/products", form);
    alert("Product added");
    setForm({ name: "", price: "", restaurant: "" });
  };

  return (
    <div className="container mt-4">
      <h3>🍔 Add Food Item</h3>

      <input
        className="form-control my-2"
        placeholder="Food name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="form-control my-2"
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <select
        className="form-control my-2"
        value={form.restaurant}
        onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
      >
        <option value="">Select Restaurant</option>
        {restaurants.map(r => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </select>

      <button className="btn btn-primary" onClick={submit}>
        Add Product
      </button>
    </div>
  );
}
