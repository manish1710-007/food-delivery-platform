import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminCategories(){

  const [categories, setCategories] =
    useState([]);

  const [name, setName] = useState("");

  const load = async () => {

    const res =
      await api.get("/categories");

    setCategories(res.data);
  };

  useEffect(()=>{
    load();
  },[]);

  const create = async () => {

    await api.post("/categories", {
      name
    });

    setName("");

    load();
  };

  const remove = async (id) => {

    await api.delete(
      "/categories/" + id
    );

    load();
  };

  return(

    <div className="container">

      <h2>Categories</h2>

      <div className="mb-3">

        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Category name"
        />

        <button onClick={create}>
          Add
        </button>

      </div>

      {categories.map(cat=>(
        <div key={cat._id}>

          {cat.name}

          <button
            onClick={()=>remove(cat._id)}
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}
