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
    available: true,
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
      alert("Failed to load products");
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

    setForm({
      name: "",
      price: "",
      category: "",
      restaurant: "",
      image: "",
      available: true,
    });

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

        await api.put(`/products/${editing._id}`, form);

      } else {

        await api.post("/products", form);

      }

      setShowModal(false);
      fetchProducts();

    } catch (err) {

      console.error(err);
      alert("Save failed");

    }
  }

  async function handleDelete(id) {

    if (!window.confirm("Delete this product?")) return;

    try {

      await api.delete(`/products/${id}`);
      fetchProducts();

    } catch (err) {

      console.error(err);
      alert("Delete failed");

    }
  }

  async function toggleAvailability(product) {

    try {

      await api.put(`/products/${product._id}`, {
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

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcl5zom8v/image/upload",
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

    } catch (err) {

      console.error(err);
      alert("Image upload failed");

    }

    setUploading(false);
  }

  const filtered = products.filter((p) => {

    return (
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!restaurantFilter ||
        p.restaurant?._id === restaurantFilter)
    );

  });

  if (loading)
    return (
      <div className="container mt-4">
        Loading products...
      </div>
    );

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between mb-3">

        <h3>🍔 Product Management</h3>

        <button
          className="btn btn-primary"
          onClick={openCreate}
        >
          + Add Product
        </button>

      </div>


      {/* FILTERS */}
      <div className="row mb-3">

        <div className="col-md-4">

          <input
            className="form-control"
            placeholder="Search products"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="col-md-4">

          <select
            className="form-control"
            value={restaurantFilter}
            onChange={(e) =>
              setRestaurantFilter(e.target.value)
            }
          >

            <option value="">
              All Restaurants
            </option>

            {restaurants.map((r) => (

              <option key={r._id} value={r._id}>
                {r.name}
              </option>

            ))}

          </select>

        </div>

      </div>


      {/* TABLE */}
      <table className="table table-bordered align-middle">

        <thead>

          <tr>

            <th>Image</th>
            <th>Name</th>
            <th>Restaurant</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filtered.length === 0 && (

            <tr>
              <td colSpan="7" className="text-center">
                No products found
              </td>
            </tr>

          )}

          {filtered.map((p) => (

            <tr key={p._id}>

              <td>

                <img
                  src={p.image}
                  width="60"
                  alt=""
                />

              </td>

              <td>{p.name}</td>

              <td>{p.restaurant?.name}</td>

              <td>{p.category}</td>

              <td>₹{p.price}</td>

              <td>

                <span
                  className={`badge ${
                    p.available
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {p.available
                    ? "Available"
                    : "Unavailable"}
                </span>

              </td>

              <td>

                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() =>
                    openEdit(p)
                  }
                >
                  Edit
                </button>


                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() =>
                    toggleAvailability(p)
                  }
                >
                  Toggle
                </button>


                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    handleDelete(p._id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>


      {/* MODAL */}
      {showModal && (

        <>
          <div className="modal show d-block">

            <div className="modal-dialog">

              <form
                className="modal-content"
                onSubmit={handleSubmit}
              >

                <div className="modal-header">

                  <h5>

                    {editing
                      ? "Edit Product"
                      : "Add Product"}

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
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    required
                  />


                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    required
                  />


                  <input
                    className="form-control mb-2"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                  />


                  <select
                    className="form-control mb-2"
                    value={form.restaurant}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        restaurant:
                          e.target.value,
                      })
                    }
                    required
                  >

                    <option value="">
                      Select restaurant
                    </option>

                    {restaurants.map((r) => (

                      <option
                        key={r._id}
                        value={r._id}
                      >
                        {r.name}
                      </option>

                    ))}

                  </select>


                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={uploadImage}
                  />

                  {uploading && (
                    <p>Uploading image...</p>
                  )}

                  {form.image && (

                    <img
                      src={form.image}
                      width="120"
                      alt=""
                    />

                  )}


                  <div className="form-check mt-2">

                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={form.available}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          available:
                            e.target.checked,
                        })
                      }
                    />

                    <label className="form-check-label">
                      Available
                    </label>

                  </div>

                </div>


                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save
                  </button>

                </div>

              </form>

            </div>

          </div>

          <div className="modal-backdrop show"></div>

        </>
      )}

    </div>
  );
}