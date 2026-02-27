import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminCategories(){
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    try {
        const res = await api.get("/categories");
        setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if(!name.trim()) return;
    await api.post("/categories", { name });
    setName("");
    load();
  };

  const remove = async (id) => {
    await api.delete("/categories/" + id);
    load();
  };

  return(
    <div className="container-fluid py-4" style={{maxWidth: "600px"}}>
      <h3 className="fw-bold mb-4">🏷️ Categories</h3>

      <div className="card custom-card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="d-flex gap-2">
          <input 
            className="form-control bg-light border-0" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="New category name..." 
          />
          <button className="btn btn-danger rounded-pill px-4 fw-bold shadow-sm" onClick={create}>Add</button>
        </div>
      </div>

      <div className="d-flex flex-column gap-2">
        {categories.map(cat => (
          <div key={cat._id} className="card custom-card border-0 shadow-sm rounded-3 p-3 d-flex flex-row justify-content-between align-items-center">
            <span className="fw-semibold">{cat.name}</span>
            <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => remove(cat._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}