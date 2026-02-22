import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminRestaurants() {

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

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
    setForm({
      name: "",
      description: "",
      address: "",
      image: "",
    });
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

        await api.put(
          `/admin/restaurants/${editing._id}`,
          form
        );

      } else {

        await api.post(
          "/admin/restaurants",
          form
        );

      }

      setShowModal(false);
      fetchRestaurants();

    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  async function handleDelete(id) {

    if (!confirm("Delete this restaurant?")) return;

    try {

      await api.delete(
        `/admin/restaurants/${id}`
      );

      fetchRestaurants();

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }


  async function toggleActive(id) {

    try {

      await api.patch(
        `/admin/restaurants/${id}/toggle`
      );

      fetchRestaurants();

    } catch (err) {
      console.error(err);
      alert("Toggle failed");
    }
  }

 
  async function toggleApproval(id) {

    try {

      await api.patch(
        `/admin/restaurants/${id}/approve`
      );

      fetchRestaurants();

    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  }

 
  async function uploadImage(e) {

    const file = e.target.files[0];

    const data = new FormData();

    data.append("file", file);
    data.append(
      "upload_preset",
      "fooddash"
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dcl5zom8v/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();

    setForm({
      ...form,
      image: json.secure_url,
    });
  }


  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(
      search.toLowerCase()
    )
  );


  if (loading)
    return (
      <div className="p-4">
        Loading restaurants...
      </div>
    );

 
  return (
    <div className="container-fluid">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h3>🏪 Restaurant Management</h3>

        <button
          className="btn btn-primary"
          onClick={openCreate}
        >
          + Add Restaurant
        </button>

      </div>


      {/* SEARCH */}

      <div className="mb-3">

        <input
          className="form-control"
          placeholder="Search restaurant..."
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* TABLE */}

      <div className="table-responsive">

        <table className="table table-hover">

          <thead className="table-dark">

            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Address</th>
              <th>Approval</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filtered.map(r => (

              <tr key={r._id}>

                <td>
                  <img
                    src={r.image}
                    width="60"
                    style={{
                      borderRadius: "8px",
                    }}
                  />
                </td>

                <td>{r.name}</td>

                <td>{r.address}</td>


                {/* APPROVAL */}

                <td>

                  <span
                    className={`badge ${
                      r.status === "approved"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {r.status}
                  </span>

                </td>


                {/* ACTIVE */}

                <td>

                  <span
                    className={`badge ${
                      r.isActive
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {r.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </td>


                {/* ACTIONS */}

                <td>

                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() =>
                      toggleApproval(r._id)
                    }
                  >
                    Approve
                  </button>


                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() =>
                      toggleActive(r._id)
                    }
                  >
                    Toggle
                  </button>


                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() =>
                      openEdit(r)
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      handleDelete(r._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* MODAL */}

      {showModal && (

        <div className="modal show d-block">

          <div className="modal-dialog">

            <form
              className="modal-content"
              onSubmit={handleSubmit}
            >

              <div className="modal-header">

                <h5>
                  {editing
                    ? "Edit Restaurant"
                    : "Add Restaurant"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowModal(false)
                  }
                />

              </div>


              <div className="modal-body">

                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={form.name}
                  onChange={e =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Address"
                  value={form.address}
                  onChange={e =>
                    setForm({
                      ...form,
                      address:
                        e.target.value,
                    })
                  }
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={form.description}
                  onChange={e =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={uploadImage}
                />

                {form.image && (

                  <img
                    src={form.image}
                    width="100"
                  />

                )}

              </div>


              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );

}