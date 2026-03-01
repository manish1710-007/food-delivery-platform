import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => { loadData(); }, []);

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

  const categories = ["All", "🍔 Burgers", "🍕 Pizza", "🌮 Tacos", "🍜 Noodles", "🥗 Healthy", "🍛 Curry"];

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="d-flex flex-column align-items-center justify-content-center home-loading gap-3">
          <div className="home-spinner" />
          <p className="mb-0 small">Finding the best food near you…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="home-page">

        {/*HERO — always dark editorial section*/}
        <section className="hero position-relative overflow-hidden">
          {/* Ambient blobs */}
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />

          <div className="container-xl hero-inner position-relative">
            <div className="row align-items-center g-5">

              {/* Left col */}
              <div className="col-lg-7">
                {/* Eyebrow pill */}
                <div className="hero-eyebrow d-inline-flex align-items-center gap-2 rounded-pill mb-4">
                  <span className="hero-dot" />
                  Free delivery on orders over ₹299
                </div>

                <h1 className="hero-headline mb-3">
                  Great food,<br />
                  <span className="hero-headline-accent">delivered fast.</span>
                </h1>

                <p className="hero-sub mb-4">
                  {restaurants.length}+ restaurants · {products.length}+ dishes · delivered in 30 min
                </p>

                {/* Search */}
                <div className="hero-search-wrap position-relative mb-4">
                  <svg className="hero-search-icon position-absolute" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    className="hero-search w-100"
                    placeholder="Search restaurants or dishes…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="hero-search-clear position-absolute rounded-circle border-0" onClick={() => setSearch("")}>✕</button>
                  )}
                </div>

                {/* Category pills */}
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`hero-cat border-0 rounded-pill small ${activeCategory === cat ? "active" : ""}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right col — floating image frame, hidden below lg */}
              <div className="col-lg-5 d-none d-lg-flex justify-content-center">
                <div className="hero-img-frame position-relative d-flex align-items-center justify-content-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                    alt="Food"
                    className="hero-img"
                  />
                  {/* Floating badge 1 */}
                  <div className="hero-badge hero-badge-1 position-absolute d-flex align-items-center gap-2 rounded-3">
                    <span className="hb-emoji">⚡</span>
                    <div>
                      <div className="hb-title">Fast Delivery</div>
                      <div className="hb-sub">Avg 28 min</div>
                    </div>
                  </div>
                  {/* Floating badge 2 */}
                  <div className="hero-badge hero-badge-2 position-absolute d-flex align-items-center gap-2 rounded-3">
                    <span className="hb-emoji">⭐</span>
                    <div>
                      <div className="hb-title">Top Rated</div>
                      <div className="hb-sub">4.8 avg score</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BODY — theme-responsive surface*/}
        <div className="home-body">
          <div className="container-xl py-5">

            {/* ── Stats row ── */}
            <div className="row g-3 mb-4">
              {[
                { value: restaurants.length, label: "Restaurants", icon: "🏪" },
                { value: products.length,    label: "Dishes",      icon: "🍽️" },
                { value: "120+",             label: "Orders Today", icon: "📦" },
                { value: "4.8 ⭐",           label: "Avg Rating",  icon: "🏆" },
              ].map((s, i) => (
                <div className="col-6 col-md-3" key={i}>
                  <div
                    className="stat-card h-100 text-center rounded-4 p-3"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label text-uppercase">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo banner  */}
            <div className="promo-banner rounded-4 d-flex align-items-center justify-content-between overflow-hidden position-relative mb-5 px-4 py-4">
              <div className="position-relative" style={{ zIndex: 1 }}>
                <span className="promo-tag badge rounded-pill mb-2">Limited Time</span>
                <div className="promo-headline mb-3">
                  Get <strong>20% off</strong> your first order
                </div>
                <div className="promo-code d-inline-flex align-items-center rounded-3 overflow-hidden">
                  <span className="promo-code-text px-3 py-2">DASH20</span>
                  <button
                    className="promo-copy border-0 px-3 py-2"
                    onClick={() => navigator.clipboard?.writeText("DASH20")}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="promo-right d-none d-sm-block" style={{ zIndex: 1 }}>🎁</div>
            </div>

            {/* Restaurants  */}
            <div className="mb-5">
              <div className="d-flex align-items-end justify-content-between mb-4">
                <div>
                  <div className="section-label text-uppercase small fw-bold mb-1">Near You</div>
                  <h2 className="section-title mb-0">Restaurants</h2>
                </div>
                <span className="section-count badge rounded-pill px-3 py-2">
                  {filteredRestaurants.length} found
                </span>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="empty-state text-center rounded-4 border py-5">
                  <div className="empty-icon">🔍</div>
                  <p className="mb-0 small">No restaurants match "<strong>{search}</strong>"</p>
                </div>
              ) : (
                <div className="row g-4">
                  {filteredRestaurants.map((r, i) => (
                    <div className="col-xl-3 col-lg-4 col-sm-6" key={r._id}>
                      <div
                        className="restaurant-card card border h-100 rounded-4 overflow-hidden"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        {/* Image */}
                        <div className="restaurant-img-wrap position-relative overflow-hidden">
                          <img
                            src={r.image}
                            alt={r.name}
                            className="restaurant-img w-100"
                          />
                          <span className="restaurant-rating position-absolute badge rounded-pill top-0 end-0 m-2">
                            4.{Math.floor(Math.random() * 3) + 6} ⭐
                          </span>
                        </div>
                        {/* Body */}
                        <div className="card-body p-3">
                          <h3 className="restaurant-name fw-bold text-truncate mb-1">{r.name}</h3>
                          <p className="restaurant-addr d-flex align-items-center gap-1 text-truncate mb-2">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {r.address}
                          </p>
                          <div className="restaurant-meta d-flex gap-3">
                            <span>🕒 25–35 min</span>
                            <span>🛵 ₹49 delivery</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Foods  */}
            <div className="mb-5">
              <div className="d-flex align-items-end justify-content-between mb-4">
                <div>
                  <div className="section-label text-uppercase small fw-bold mb-1">Trending Now</div>
                  <h2 className="section-title mb-0">Popular Foods</h2>
                </div>
                <span className="section-count badge rounded-pill px-3 py-2">
                  {products.length} items
                </span>
              </div>

              {products.length === 0 ? (
                <div className="empty-state text-center rounded-4 border py-5">
                  <div className="empty-icon">🍽️</div>
                  <p className="mb-0 small">No products available right now</p>
                </div>
              ) : (
                <div className="row g-4">
                  {products.slice(0, 8).map((p, i) => (
                    <div
                      className="col-xl-3 col-lg-4 col-sm-6 product-card-wrap"
                      key={p._id}
                      style={{ animationDelay: `${i * 55}ms` }}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* 
    CSS VARIABLE TOKENS
    ThemeToggle sets data-theme="dark"|"light" on <html>*/
  :root,
  [data-theme="light"] {
    --home-hero-bg:        #1a1a1a;
    --home-headline-cl:    #f0efe9;
    --home-sub-cl:         rgba(255,255,255,0.45);
    --home-search-bg:      rgba(255,255,255,0.07);
    --home-search-bd:      rgba(255,255,255,0.12);
    --home-search-cl:      #f0efe9;
    --home-search-ph:      rgba(255,255,255,0.3);
    --home-search-focus:   rgba(229,57,53,0.6);
    --home-cat-bg:         rgba(255,255,255,0.06);
    --home-cat-bd:         rgba(255,255,255,0.1);
    --home-cat-cl:         rgba(255,255,255,0.55);
    --home-cat-hover-bg:   rgba(255,255,255,0.1);
    --home-cat-hover-cl:   rgba(255,255,255,0.85);
    --home-frame-bg:       rgba(255,255,255,0.04);
    --home-frame-bd:       rgba(255,255,255,0.08);
    --home-badge-bg:       rgba(255,255,255,0.92);
    --home-badge-title:    #111;
    --home-badge-sub:      #888;
    --home-body-bg:        #f7f6f3;
    --home-card-bg:        #ffffff;
    --home-card-bd:        #e8e6e1;
    --home-card-shadow:    0 2px 12px rgba(0,0,0,0.04);
    --home-card-shadow-hv: 0 12px 36px rgba(0,0,0,0.1);
    --home-text-primary:   #111111;
    --home-text-muted:     #999999;
    --home-stat-label:     #aaaaaa;
    --home-stat-value:     #e53935;
    --home-count-bg:       #f0ede8;
    --home-count-cl:       #888888;
    --home-empty-bg:       #ffffff;
    --home-empty-bd:       #e8e6e1;
    --home-empty-cl:       #aaaaaa;
    --home-empty-strong:   #555555;
    --home-loading-bg:     #1a1a1a;
    --home-loading-cl:     rgba(255,255,255,0.4);
    --home-spinner-track:  rgba(255,255,255,0.1);
  }

  [data-theme="dark"] {
    --home-hero-bg:        #0d0d0d;
    --home-headline-cl:    #f0efe9;
    --home-sub-cl:         rgba(255,255,255,0.4);
    --home-search-bg:      rgba(255,255,255,0.06);
    --home-search-bd:      rgba(255,255,255,0.1);
    --home-search-cl:      #f0efe9;
    --home-search-ph:      rgba(255,255,255,0.25);
    --home-search-focus:   rgba(229,57,53,0.5);
    --home-cat-bg:         rgba(255,255,255,0.05);
    --home-cat-bd:         rgba(255,255,255,0.08);
    --home-cat-cl:         rgba(255,255,255,0.45);
    --home-cat-hover-bg:   rgba(255,255,255,0.1);
    --home-cat-hover-cl:   rgba(255,255,255,0.85);
    --home-frame-bg:       rgba(255,255,255,0.03);
    --home-frame-bd:       rgba(255,255,255,0.07);
    --home-badge-bg:       rgba(28,28,28,0.96);
    --home-badge-title:    #f0efe9;
    --home-badge-sub:      #777;
    --home-body-bg:        #111111;
    --home-card-bg:        #1a1a1a;
    --home-card-bd:        #2a2a2a;
    --home-card-shadow:    0 2px 16px rgba(0,0,0,0.3);
    --home-card-shadow-hv: 0 12px 36px rgba(0,0,0,0.5);
    --home-text-primary:   #f0efe9;
    --home-text-muted:     #666666;
    --home-stat-label:     #555555;
    --home-stat-value:     #ef5350;
    --home-count-bg:       #222222;
    --home-count-cl:       #666666;
    --home-empty-bg:       #1a1a1a;
    --home-empty-bd:       #2a2a2a;
    --home-empty-cl:       #555555;
    --home-empty-strong:   #888888;
    --home-loading-bg:     #0d0d0d;
    --home-loading-cl:     rgba(255,255,255,0.35);
    --home-spinner-track:  rgba(255,255,255,0.08);
  }

  /* BASE*/
  .home-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--home-hero-bg);
    min-height: 100vh;
  }

  /* HERO */
  .hero {
    background: var(--home-hero-bg);
    padding: 72px 0 80px;
    min-height: 520px;
  }

  /* Ambient blobs — pure CSS, no BS equivalent */
  .hero-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
  }
  .hero-blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #e53935 0%, transparent 70%);
    top: -180px; left: -120px;
    opacity: 0.55;
  }
  .hero-blob-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, #ff8f00 0%, transparent 70%);
    top: 60px; right: -100px;
    opacity: 0.28;
  }
  .hero-blob-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, #7c1fff 0%, transparent 70%);
    bottom: -80px; left: 40%;
    opacity: 0.18;
  }

  @media (max-width: 768px) { .hero { padding: 52px 0 60px; } }

  /* Eyebrow pill */
  .hero-eyebrow {
    background: var(--home-cat-bg);
    border: 1px solid var(--home-cat-bd);
    color: rgba(255,255,255,0.7);
    font-size: 0.78rem;
    font-weight: 500;
    padding: 6px 14px;
    letter-spacing: 0.02em;
    backdrop-filter: blur(8px);
    animation: fadeUp 0.5s ease both;
  }

  .hero-dot {
    width: 7px; height: 7px;
    background: #4caf50;
    border-radius: 50%;
    box-shadow: 0 0 8px #4caf50;
    flex-shrink: 0;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(1.3); }
  }

  /* Headline */
  .hero-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.4rem, 5.5vw, 4rem);
    font-weight: 800;
    color: var(--home-headline-cl);
    line-height: 1.07;
    letter-spacing: -0.04em;
    animation: fadeUp 0.5s 0.1s ease both;
  }
  .hero-headline-accent {
    background: linear-gradient(135deg, #ff6b35, #e53935);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    color: var(--home-sub-cl);
    font-size: 0.95rem;
    animation: fadeUp 0.5s 0.15s ease both;
  }

  /* Search */
  .hero-search-wrap { animation: fadeUp 0.5s 0.2s ease both; }

  .hero-search-icon {
    top: 50%; left: 18px;
    transform: translateY(-50%);
    color: var(--home-sub-cl);
    pointer-events: none;
  }

  .hero-search {
    background: var(--home-search-bg);
    border: 1.5px solid var(--home-search-bd);
    border-radius: 14px;
    padding: 15px 48px 15px 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--home-search-cl);
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    backdrop-filter: blur(8px);
  }
  .hero-search::placeholder { color: var(--home-search-ph); }
  .hero-search:focus {
    border-color: var(--home-search-focus);
    background: var(--home-cat-hover-bg);
  }

  .hero-search-clear {
    top: 50%; right: 14px;
    transform: translateY(-50%);
    background: var(--home-cat-bg);
    color: var(--home-cat-cl);
    width: 24px; height: 24px;
    font-size: 0.65rem;
    cursor: pointer;
    transition: background 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .hero-search-clear:hover { background: var(--home-cat-hover-bg); }

  /* Category pills */
  .hero-cat {
    background: var(--home-cat-bg);
    border: 1px solid var(--home-cat-bd) !important;
    color: var(--home-cat-cl);
    font-size: 0.78rem;
    font-weight: 500;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .hero-cat:hover {
    background: var(--home-cat-hover-bg);
    color: var(--home-cat-hover-cl);
  }
  .hero-cat.active {
    background: #e53935 !important;
    border-color: #e53935 !important;
    color: #fff !important;
  }

  /* Floating image frame */
  .hero-img-frame {
    width: 300px; height: 300px;
    background: radial-gradient(circle at 40% 40%, rgba(229,57,53,0.2), transparent 65%),
                var(--home-frame-bg);
    border: 1px solid var(--home-frame-bd);
    border-radius: 40px;
    backdrop-filter: blur(10px);
    animation: fadeUp 0.5s 0.3s ease both;
  }

  .hero-img {
    width: 200px;
    filter: drop-shadow(0 20px 40px rgba(229,57,53,0.4));
    animation: float 4s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(5deg); }
    50%       { transform: translateY(-12px) rotate(8deg); }
  }

  /* Floating badges on the image */
  .hero-badge {
    background: var(--home-badge-bg);
    backdrop-filter: blur(12px);
    padding: 10px 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    animation: badgeFloat 3s ease-in-out infinite alternate;
  }
  .hero-badge-1 { bottom: 20px; left: -36px; animation-delay: 0s; }
  .hero-badge-2 { top: 20px; right: -36px; animation-delay: 1.2s; }
  @keyframes badgeFloat {
    from { transform: translateY(0); }
    to   { transform: translateY(-6px); }
  }
  .hb-emoji { font-size: 20px; }
  .hb-title { font-size: 0.78rem; font-weight: 700; color: var(--home-badge-title); line-height: 1.2; }
  .hb-sub   { font-size: 0.68rem; color: var(--home-badge-sub); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /*BODY */
  .home-body {
    background: var(--home-body-bg);
    border-radius: 28px 28px 0 0;
    margin-top: -20px;
    position: relative;
    z-index: 2;
    transition: background 0.2s;
  }

  /* ── Stat cards ── */
  .stat-card {
    background: var(--home-card-bg);
    border: 1px solid var(--home-card-bd) !important;
    box-shadow: var(--home-card-shadow);
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
    animation: fadeUp 0.4s ease both;
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--home-card-shadow-hv);
  }
  .stat-icon { font-size: 22px; margin-bottom: 6px; }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--home-stat-value);
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--home-stat-label);
  }

  /* ── Promo banner — intentionally always dark ── */
  .promo-banner {
    background: #111;
  }
  .promo-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(229,57,53,0.25), transparent 60%);
    pointer-events: none;
    border-radius: inherit;
  }
  .promo-tag {
    background: rgba(229,57,53,0.2) !important;
    border: 1px solid rgba(229,57,53,0.4);
    color: #ef9a9a !important;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    display: inline-block;
  }
  .promo-headline {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #f0efe9;
    letter-spacing: -0.03em;
  }
  .promo-headline strong { color: #ef5350; }
  .promo-code {
    background: rgba(255,255,255,0.07);
    border: 1px dashed rgba(255,255,255,0.2);
  }
  .promo-code-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.9rem;
    color: #fff;
    letter-spacing: 0.1em;
  }
  .promo-copy {
    background: rgba(255,255,255,0.12);
    border-left: 1px solid rgba(255,255,255,0.15) !important;
    color: rgba(255,255,255,0.7);
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .promo-copy:hover { background: rgba(255,255,255,0.22); color: #fff; }
  .promo-right { font-size: 60px; opacity: 0.8; animation: float 3.5s ease-in-out infinite; }

  /* ── Section header ── */
  .section-label { color: #e53935; }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.65rem;
    font-weight: 800;
    color: var(--home-text-primary);
    letter-spacing: -0.04em;
  }
  .section-count {
    background: var(--home-count-bg) !important;
    color: var(--home-count-cl) !important;
    font-size: 0.7rem !important;
    letter-spacing: 0.06em;
    font-weight: 600 !important;
  }

  /* ── Restaurant cards — extend Bootstrap .card ── */
  .restaurant-card {
    background: var(--home-card-bg) !important;
    border-color: var(--home-card-bd) !important;
    box-shadow: var(--home-card-shadow);
    transition: transform 0.2s, box-shadow 0.2s;
    animation: fadeUp 0.4s ease both;
    cursor: pointer;
  }
  .restaurant-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--home-card-shadow-hv);
  }
  .restaurant-img-wrap { height: 160px; }
  .restaurant-img {
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  .restaurant-card:hover .restaurant-img { transform: scale(1.05); }

  .restaurant-rating {
    background: rgba(0,0,0,0.6) !important;
    backdrop-filter: blur(6px);
    color: #fff !important;
    font-size: 0.72rem !important;
    font-weight: 700 !important;
  }
  .restaurant-name {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    color: var(--home-text-primary);
    letter-spacing: -0.02em;
  }
  .restaurant-addr {
    font-size: 0.75rem;
    color: var(--home-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .restaurant-meta {
    font-size: 0.72rem;
    color: var(--home-stat-label);
    font-weight: 500;
  }

  /* ── Product card wrapper ── */
  .product-card-wrap { animation: fadeUp 0.4s ease both; }

  /* ── Empty state ── */
  .empty-state {
    color: var(--home-empty-cl);
    background: var(--home-empty-bg) !important;
    border-color: var(--home-empty-bd) !important;
  }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state strong { color: var(--home-empty-strong); }

  /* ── Loading screen ── */
  .home-loading {
    min-height: 80vh;
    background: var(--home-loading-bg);
    color: var(--home-loading-cl);
    font-family: 'DM Sans', sans-serif;
  }
  .home-spinner {
    width: 38px; height: 38px;
    border: 3px solid var(--home-spinner-track);
    border-top-color: #e53935;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;