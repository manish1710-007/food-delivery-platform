import React, { useEffect, useState } from "react";
import api from "../api/axios";
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

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    
    <div className="container-xl px-4 py-5 mx-auto">
      <div className="row g-4">
        
        
        <div className="col-lg-9">
          
          {/* HERO */}
          <div
            className="text-white rounded-4 p-5 mb-5 shadow-sm border-0"
            style={{ background: "linear-gradient(135deg, #ff416c, #ff4b2b)" }}
          >
            <div className="row align-items-center">
              <div className="col-md-7">
                <h1 className="display-5 fw-bold">FoodDash 🍔</h1>
                <p className="lead">Order food from your favorite restaurants</p>
                <input
                  className="form-control form-control-lg mt-3 shadow-sm border-0"
                  placeholder="Search restaurants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-5 text-center d-none d-md-block">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                  width="200"
                  alt="food"
                  style={{ transform: "rotate(10deg)" }}
                />
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="row text-center mb-5 g-3">
            {[
              { label: "Restaurants", value: restaurants.length },
              { label: "Products", value: products.length },
              { label: "Orders Today", value: "120+" },
              { label: "Average Rating", value: "4.8 ⭐" }
            ].map((stat, idx) => (
              <div className="col-md-3 col-6" key={idx}>
                {/* Replaced bg-white with custom-card */}
                <div className="p-3 custom-card rounded-4 shadow-sm h-100 border">
                  <h3 className="fw-bold text-danger mb-1">{stat.value}</h3>
                  <p className="text-muted mb-0 small">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RESTAURANTS */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Nearby Restaurants</h4>
            <span className="badge bg-light text-dark border shadow-sm">
              {filteredRestaurants.length} found
            </span>
          </div>

          {filteredRestaurants.length === 0 ? (
            <p className="text-muted">No restaurants found</p>
          ) : (
            <div className="row g-4 mb-5">
              {filteredRestaurants.map((r) => (
                <div key={r._id} className="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                  {/* Added custom-card here as well */}
                  <div className="card custom-card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                    <img
                      src={r.image}
                      className="card-img-top"
                      height="160"
                      style={{ objectFit: "cover" }}
                      alt={r.name}
                    />
                    <div className="card-body">
                      <h6 className="fw-bold text-truncate">{r.name}</h6>
                      <p className="text-muted small mb-0 text-truncate">
                        {r.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRODUCTS */}
          <h4 className="fw-bold mb-4">🔥 Popular Foods</h4>
          {products.length === 0 ? (
            <p className="text-muted">No products available</p>
          ) : (
            <div className="row g-4 mb-5">
              {products.slice(0, 8).map((p) => (
                <div key={p._id} className="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="col-lg-3 d-none d-lg-block">
          <div className="position-sticky" style={{ top: "20px" }}>
            
            {/* Animated GIF - Removed inner padding/white bg so it looks flush */}
            <div className="card custom-card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
              <img 
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2E3M3ZhaHg2OXltaXZlYndidGNmYWIzeHB0Y3NhZ3Fub2hnY2J6YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qLw4x1K59L0iI/giphy.gif" 
                alt="Hungry" 
                className="w-100"
                style={{ objectFit: "cover", height: "250px" }}
              />
            </div>

            {/* Promo Feature */}
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden text-white border-0" style={{ background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" }}>
              <div className="card-body p-4 text-center">
                <h4 className="fw-bold mb-2 text-dark">🎁 20% OFF</h4>
                <p className="small mb-3 text-dark fw-medium">On your first order today!</p>
                <div className="bg-white text-dark py-2 px-3 rounded-3 fw-bold d-inline-block shadow-sm">
                  USE CODE: DASH20
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}