import React, { useEffect, useState } from "react";
import api from "../api/axios";
import RestaurantCard from "../components/RestaurantCard";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, productRes] = await Promise.all([
          api.get("/restaurants"),
          api.get("/products"),
        ]);

        setRestaurants(restaurantRes.data);
        setProducts(productRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="container mt-5">
        <h4>Loading amazing food near you...</h4>
      </div>
    );

  return (
    <div>

      {/* HERO SECTION */}
      <div
        className="text-white text-center py-5"
        style={{
          background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
        }}
      >
        <div className="container">
          <h1 className="fw-bold">Delicious food, delivered fast 🚀</h1>

          <p>Order from your favorite restaurants near you</p>

          <input
            type="text"
            className="form-control form-control-lg mt-3"
            placeholder="Search restaurants..."
            style={{ maxWidth: 500, margin: "auto" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* RESTAURANTS SECTION */}
      <div className="container mt-5">

        <h3 className="mb-4">🍽 Nearby Restaurants</h3>

        <div className="row">
          {filteredRestaurants.length === 0 && (
            <p>No restaurants found</p>
          )}

          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="col-md-4 mb-4">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>

      </div>

      {/* POPULAR FOODS SECTION */}
      <div className="container mt-5">

        <h3 className="mb-4">🔥 Popular Dishes</h3>

        <div className="row">

          {products.slice(0, 8).map((product) => (
            <div key={product._id} className="col-md-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
