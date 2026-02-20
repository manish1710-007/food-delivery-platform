import React, { useEffect, useState } from "react";
import api from "../api/axios";
import RestaurantCard from "../components/RestaurantCard";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [restaurantsRes, productsRes] = await Promise.all([
        api.get("/restaurants"),
        api.get("/products"),
      ]);

      setRestaurants(restaurantsRes.data);
      setProducts(productsRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading FoodDash...</h4>
      </div>
    );
  }

  return (
    <div>

      {/* HERO SECTION */}
      <div
        className="text-white text-center d-flex align-items-center justify-content-center"
        style={{
          height: "300px",
          background:
            "linear-gradient(135deg, #ff512f, #dd2476)",
        }}
      >
        <div>
          <h1 className="fw-bold">FoodDash 🍔</h1>
          <p>Order food from your favorite restaurants</p>

          <input
            className="form-control mt-3"
            style={{ width: "300px", margin: "auto" }}
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {/* RESTAURANTS */}
      <div className="container mt-5">

        <div className="d-flex justify-content-between mb-3">
          <h3>Nearby Restaurants</h3>
          <span className="text-muted">
            {filteredRestaurants.length} found
          </span>
        </div>

        {filteredRestaurants.length === 0 ? (
          <p>No restaurants found</p>
        ) : (
          <div className="row">
            {filteredRestaurants.map(r => (
              <div className="col-md-4 mb-4" key={r._id}>
                <RestaurantCard restaurant={r} />
              </div>
            ))}
          </div>
        )}
      </div>


      {/* FEATURED PRODUCTS */}
      <div className="container mt-5 mb-5">

        <h3 className="mb-3">Popular Foods</h3>

        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          <div className="row">
            {products.slice(0, 8).map(p => (
              <div className="col-md-3 mb-4" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}