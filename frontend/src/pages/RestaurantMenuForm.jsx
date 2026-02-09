import { useState } from "react";
import api from "../api/axios";

export default function RestaurantMenuForm() {
  const [form, setForm] = useState({ name: "", price: "", image: "" });

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "fooddash");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload",
      { method: "POST", body: data }
    );

    const json = await res.json();
    setForm({ ...form, image: json.secure_url });
  };

  const submit = async () => {
    await api.post("/restaurant-owner/menu", form);
    alert("Added!");
  };

  return (
    <div>
      <input
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="form-control mb-2"
      />
      <input
        placeholder="Price"
        onChange={e => setForm({ ...form, price: e.target.value })}
        className="form-control mb-2"
      />
      <input type="file" onChange={uploadImage} />
      <button className="btn btn-success mt-2" onClick={submit}>Save</button>
    </div>
  );
}
