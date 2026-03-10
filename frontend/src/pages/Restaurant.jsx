import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, prodRes] = await Promise.all([
          api.get(`/restaurants/${id}`).catch(() => ({ data: null })),
          api.get(`/products?restaurant=${id}`)
        ]);
        setRestaurant(restRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: "80vh", background: "#010308" }}>
        <div style={{ textAlign: "center" }}>
          <div className="rp-pulse-ring" />
          <p style={{ color: "#00e5ff", marginTop: "1.2rem", letterSpacing: "0.18em", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
            Loading Menu
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center text-white w-100" style={{ minHeight: "80vh", background: "#010308" }}>
        <h2 className="fw-bold mb-3">Restaurant Not Found</h2>
        <button className="btn btn-outline-info rounded-pill px-4 py-2" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="consumer-page container-fluid px-0 pb-5">

        {/* ── 1. HERO BANNER ── */}
        <div className="restaurant-hero position-relative w-100">

          {/* Floating back btn — becomes glowy when scrolled */}
          <button
            className={`back-btn btn rounded-circle position-fixed shadow d-flex justify-content-center align-items-center ${scrolled ? 'back-btn--scrolled' : ''}`}
            onClick={() => navigate(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>

          <img
            src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070"}
            alt={restaurant.name}
            className={`w-100 h-100 object-fit-cover rp-hero-img ${heroLoaded ? 'rp-hero-img--loaded' : ''}`}
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="hero-gradient-overlay" />

          {/* Open Now badge top-right */}
          <div className="rp-open-badge">
            <span className="rp-open-dot" />
            Open Now
          </div>
        </div>

        {/* ── 2. OVERLAPPING INFO CARD ── */}
        <div className="container-fluid px-4 position-relative z-3 rp-info-wrap">
          <div className="info-card p-4 p-md-5 shadow-lg text-start rp-animate-up">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">

              {/* Left: name, address, badges */}
              <div>
                <div className="rp-cuisine-label">
                  {restaurant.cuisine || "Multi-Cuisine"} • Est. 2018
                </div>
                <h1 className="rp-restaurant-name mb-2">{restaurant.name}</h1>
                <p className="mb-3 fs-6 d-flex align-items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {restaurant.address}
                </p>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <span className="badge-modern rp-badge-star">
                    <span style={{ color: "#ffc107" }}>★</span> 4.8
                    <span style={{ opacity: 0.45, fontWeight: 400, marginLeft: "3px" }}>/ 5</span>
                  </span>
                  <span className="badge-modern rp-badge-time">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    15–25 min
                  </span>
                  <span className="badge-modern rp-badge-delivery">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    Free delivery
                  </span>
                  <span className="badge-modern rp-badge-veg">🌿 Veg options</span>
                </div>
              </div>

              {/* Right: quick stats */}
              <div className="rp-stats-panel flex-shrink-0">
                <div className="rp-stat">
                  <div className="rp-stat__num">{products.length}</div>
                  <div className="rp-stat__label">Items</div>
                </div>
                <div className="rp-stat-divider" />
                <div className="rp-stat">
                  <div className="rp-stat__num">500+</div>
                  <div className="rp-stat__label">Orders</div>
                </div>
                <div className="rp-stat-divider" />
                <div className="rp-stat">
                  <div className="rp-stat__num">₹₹</div>
                  <div className="rp-stat__label">Price</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── 3. STICKY CATEGORY NAV ── */}
        <div className={`category-nav-wrapper sticky-top shadow-sm mt-4 ${scrolled ? 'category-nav-wrapper--stuck' : ''}`}>
          <div className="container-fluid px-4">
            <div className="d-flex overflow-auto py-3 hide-scrollbar gap-2 align-items-center">
              <span className="text-muted small fw-bold text-uppercase me-2 d-none d-md-block" style={{ letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
                Menu:
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {activeCategory === cat && <span className="category-pill__dot" />}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. MENU GRID ── */}
        <div className="container-fluid px-4 mt-5">
          <div className="rp-menu-header mb-4">
            <div className="d-flex align-items-baseline gap-3">
              <h3 className="rp-menu-title mb-0">
                {activeCategory === "All" ? "Full Menu" : activeCategory}
              </h3>
              <span className="rp-menu-count">{filteredProducts.length} items</span>
            </div>
            <div className="rp-menu-divider" />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-5 text-muted border border-secondary border-opacity-25 rounded-4 bg-dark bg-opacity-25">
              <div className="fs-1 mb-3 opacity-50">🍽️</div>
              No items found in this category.
            </div>
          ) : (
            <div className="row g-4 mx-0">
              {filteredProducts.map((product, i) => (
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={product._id}>
                  <div
                    className="modern-product-wrapper h-100"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  :root {
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.13);
    --bg: #010308;
  }

  html, body {
    overflow-x: hidden;
    width: 100%;

  }

  .consumer-page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: var(--bg);
    overflow-x: hidden;
    width: 100%;
  }

  /* ── CUSTOM SPINNER ── */
  .rp-pulse-ring {
    width: 50px; height: 50px; border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: var(--cyan);
    border-right-color: rgba(0,229,255,0.2);
    margin: 0 auto;
    animation: rp-spin 0.85s linear infinite;
  }
  @keyframes rp-spin { to { transform: rotate(360deg); } }

  /* ── HERO ── */
  .restaurant-hero img {
    width: 100%;
    max-width: 100%;
    display: block;
    height: 45vh;
    min-height: 320px;
    max-height: 480px;
    background-color: #111;
    overflow: hidden;
  }

  /* Hero image reveal on load */
  .rp-hero-img {
    opacity: 0;
    transform: scale(1.06);
    transition: opacity 0.9s ease, transform 1.4s ease;
    display: block;
  }
  .rp-hero-img--loaded {
    opacity: 1;
    transform: scale(1);
  }

  /* Open Now badge */
  .rp-open-badge {
    position: absolute; top: 24px; right: 24px;
    display: flex; align-items: center; gap: 8px;
    padding: 7px 16px;
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(0,255,120,0.35);
    border-radius: 100px;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.07em;
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    color: #7dffb3; z-index: 10;
  }
  .rp-open-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #00ff88; box-shadow: 0 0 8px #00ff88;
    animation: rp-blink 2s ease-in-out infinite;
  }
  @keyframes rp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* Back button */
  .back-btn {
    top: 24px; left: 24px; z-index: 200;
    width: 45px; height: 45px;
    background: rgba(1,3,8,0.6);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
    color: white;
    transition: all 0.22s ease;
  }
  .back-btn:hover {
    background: white; color: #010308;
    border-color: white; transform: translateX(-3px);
  }
  .back-btn--scrolled {
    background: rgba(1,3,8,0.92);
    border-color: rgba(0,229,255,0.35);
    box-shadow: 0 0 18px rgba(0,229,255,0.15);
  }

  .hero-gradient-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(1,3,8,0.2) 0%, rgba(1,3,8,0) 30%, rgba(1,3,8,0.96) 100%);
    pointer-events: none;
  }

  /* ── INFO CARD ── */
  .rp-info-wrap { margin-top: -100px; }

  .info-card {
    background: rgba(12, 18, 28, 0.96);
    backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
  }

  .rp-animate-up {
    animation: rp-slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes rp-slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rp-cuisine-label {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--cyan); margin-bottom: 8px;
  }

  .rp-restaurant-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 900; line-height: 1.1;
    color: #fff; letter-spacing: -0.02em;
  }

  /* Badges */
  .badge-modern {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 100px;
    font-weight: 600; font-size: 0.83rem; border: 1px solid;
  }
  .rp-badge-star     { background: rgba(255,193,7,0.1);   border-color: rgba(255,193,7,0.3);   color: #ffc107; }
  .rp-badge-time     { background: rgba(0,229,255,0.08);  border-color: rgba(0,229,255,0.25);  color: var(--cyan); }
  .rp-badge-delivery { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.09); color: rgba(255,255,255,0.6); }
  .rp-badge-veg      { background: rgba(0,255,136,0.07);  border-color: rgba(0,255,136,0.22);  color: #7dffb3; }

  /* Stats panel */
  .rp-stats-panel {
    display: flex; align-items: center; gap: 24px;
    padding: 20px 28px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
  }
  .rp-stat { text-align: center; }
  .rp-stat__num {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.6rem; font-weight: 700; color: white; line-height: 1;
  }
  .rp-stat__label {
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin-top: 5px;
  }
  .rp-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.07); }

  /* ── STICKY NAV ── */
  .category-nav-wrapper {
    background: rgba(1,3,8,0.82);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    z-index: 1020;
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .category-nav-wrapper--stuck {
    background: rgba(1,3,8,0.97);
    box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.5);
  }

  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .hide-scrollbar::-webkit-scrollbar { display: none; }

  .category-pill {
    display: inline-flex; align-items: center; gap: 7px;
    white-space: nowrap;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.55);
    padding: 8px 20px; border-radius: 50px;
    font-weight: 600; font-size: 0.9rem; cursor: pointer;
    transition: all 0.22s ease;
  }
  .category-pill:hover {
    background: rgba(255,255,255,0.09);
    color: #fff; border-color: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
  .category-pill.active {
    background: var(--cyan); color: #010308;
    border-color: var(--cyan);
    box-shadow: 0 0 20px rgba(0,229,255,0.3), 0 4px 12px rgba(0,229,255,0.18);
  }
  .category-pill.active:hover { transform: translateY(-2px); }
  .category-pill__dot {
    width: 6px; height: 6px; background: #010308;
    border-radius: 50%; flex-shrink: 0;
  }

  /* ── MENU HEADER ── */
  .rp-menu-header {
    display: flex; align-items: center; gap: 20px;
  }
  .rp-menu-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 900; color: white; letter-spacing: -0.02em;
    flex-shrink: 0;
  }
  .rp-menu-count {
    font-size: 0.78rem; font-weight: 700;
    color: rgba(255,255,255,0.28);
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .rp-menu-divider {
    flex: 1; height: 1px;
    background: linear-gradient(to right, rgba(255,255,255,0.07), transparent);
  }

  /* ── PRODUCT CARD WRAPPER ── */
  .modern-product-wrapper {
    border-radius: 20px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: rp-fadeIn 0.5s ease both;
  }
  .modern-product-wrapper:hover { transform: translateY(-5px); }

  @keyframes rp-fadeIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .modern-product-wrapper > div,
  .modern-product-wrapper .card,
  .modern-product-wrapper .y2k-wire-card {
    background: #0d1320 !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 20px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.35) !important;
    overflow: hidden;
    transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
  }
  .modern-product-wrapper:hover > div,
  .modern-product-wrapper:hover .card,
  .modern-product-wrapper:hover .y2k-wire-card {
    border-color: rgba(0,229,255,0.2) !important;
    box-shadow: 0 12px 36px rgba(0,0,0,0.5) !important;
  }

  .modern-product-wrapper img {
    border-radius: 20px 20px 0 0 !important;
    filter: none !important;
    aspect-ratio: 4/3;
    object-fit: cover;
  }

  .modern-product-wrapper h5,
  .modern-product-wrapper .card-title {
    color: #fff !important;
    font-weight: bold !important;
  }

  .modern-product-wrapper p,
  .modern-product-wrapper .card-text {
    color: rgba(255,255,255,0.45) !important;
  }
`;