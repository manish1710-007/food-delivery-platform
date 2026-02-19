import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminRestaurants() {

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        const res = await api.get("/admin/restaurants");
        setRestaurants(res.data);
    };

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const res = await api.get("/restaurants");
    setRestaurants(res.data);
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "fooddash");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzqj8y7l6/image/upload",
      { method: "POST", body: data }
    );

    const json = await res.json();

    setForm({
      ...form,
      image: json.secure_url,
    });

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/restaurants", form);

    setForm({
      name: "",
      description: "",
      address: "",
      image: "",
    });

    fetchRestaurants();
  };

  return (
    <div className="container">

      <h2 className="mb-4">Restaurants</h2>

      {/* ADD RESTAURANT FORM */}

      <div className="card mb-4">
        <div className="card-body">

          <h5>Add Restaurant</h5>

          <form onSubmit={handleSubmit}>

            <input
              className="form-control mb-2"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="file"
              className="form-control mb-2"
              onChange={uploadImage}
            />

            {uploading && <p>Uploading...</p>}

            {form.image && (
              <img
                src={form.image}
                width="120"
                className="mb-2"
              />
            )}

            <button className="btn btn-primary">
              Add Restaurant
            </button>

          </form>

        </div>
      </div>

      {/* RESTAURANTS LIST */}

      <div className="row">

        {restaurants.map((r) => (
          <div key={r._id} className="col-md-4">

            <div className="card mb-3">

              <img
                src={r.image}
                className="card-img-top"
                height="160"
                style={{ objectFit: "cover" }}
              />

              <div className="card-body">

                <h5>{r.name}</h5>

                <p>{r.address}</p>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
