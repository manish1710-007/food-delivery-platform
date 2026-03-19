import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

export default function RestaurantMenu() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/restaurant-owner/menu`);
      setItems(res.data);
    } catch (err) {
      console.error("[SYS.ERR] FAILED_TO_FETCH_MENU_REGISTRY:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category));
    return ["All", ...unique];
  }, [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await api.put(`/restaurant-owner/menu/${editingItem._id}`, form);
      } else {
        await api.post("/restaurant-owner/menu", form);
      }

      setForm({ name: "", price: "", image: "", category: "" });
      setEditingItem(null);
      fetchProducts();
    } catch (err) {
      console.error("[SYS.ERR] FAILED_TO_WRITE_TO_REGISTRY:", err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("WARNING: PURGE THIS ITEM FROM THE REGISTRY?")) return;

    try {
      
      await api.delete(`/restaurant-owner/menu/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("[SYS.ERR] PURGE_FAILED:", err);
    }
  };

  const editProduct = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      price: item.price,
      image: item.image || "",
      category: item.category
    });
  };

  if (loading) {
    return (
      <div className="y2k-page vh-100 d-flex justify-content-center align-items-center">
        <style>{styles}</style>
        <div className="scanlines"></div>
        <div className="text-cyan font-monospace fs-4">
          &gt; ACCESSING_MENU_REGISTRY... <span className="blink">_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="y2k-page min-vh-100 position-relative pb-5">
      <style>{styles}</style>
      
      

      <div className="container position-relative z-1 pt-5">
        
        {/* HEADER */}
        <div className="mb-5 border-bottom-wire border-cyan pb-3">
          <div className="text-cyan font-monospace small mb-1">/// DATABASE: MENU_ITEMS</div>
          <h2 className="y2k-title text-main m-0 fs-2 text-uppercase">
            SYS_MENU <span className="blink text-cyan">_</span>
          </h2>
        </div>

        {/* INPUT FORM */}
        <div className="y2k-wire-box p-4 p-md-5 mb-5">
          <h5 className="text-cyan font-monospace mb-4">
            {editingItem ? "> OVERRIDE_EXISTING_ITEM" : "> INJECT_NEW_ITEM"}
          </h5>

          <form onSubmit={handleSubmit} className="row g-4">
            
            {/* Name */}
            <div className="col-md-4">
              <label className="d-block text-muted small font-monospace mb-1">&gt; IDENTIFIER (Name)</label>
              <div className="y2k-input-group d-flex">
                <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">ID:</span>
                <input
                  type="text"
                  className="y2k-input flex-grow-1 p-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cyber Burger"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div className="col-md-2">
              <label className="d-block text-muted small font-monospace mb-1">&gt; VALUE (Price)</label>
              <div className="y2k-input-group d-flex">
                <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">₹</span>
                <input
                  type="number"
                  className="y2k-input flex-grow-1 p-2"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="col-md-3">
              <label className="d-block text-muted small font-monospace mb-1">&gt; CLASS (Category)</label>
              <div className="y2k-input-group d-flex">
                <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">CAT:</span>
                <input
                  type="text"
                  className="y2k-input flex-grow-1 p-2"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Mains"
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="col-md-12">
              <label className="d-block text-muted small font-monospace mb-1">&gt; VISUAL_DATA (Image URL)</label>
              <div className="y2k-input-group d-flex">
                <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">URL:</span>
                <input
                  type="text"
                  className="y2k-input flex-grow-1 p-2"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12 mt-4 text-end border-top-wire border-cyan pt-4">
              {editingItem && (
                <button 
                  type="button" 
                  className="y2k-btn-action me-3" 
                  onClick={() => { setEditingItem(null); setForm({ name: "", price: "", image: "", category: "" }); }}
                >
                  [ CANCEL ]
                </button>
              )}
              <button type="submit" className="y2k-btn-magenta px-5 py-2">
                {editingItem ? "[ EXECUTE_UPDATE ]" : "[ EXECUTE_INJECT ]"}
              </button>
            </div>
          </form>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mb-4 d-flex gap-3 flex-wrap border-bottom-wire border-cyan pb-3">
          <span className="text-muted font-monospace d-flex align-items-center">&gt; FILTER:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`y2k-btn-action ${activeCategory === cat ? "active-filter" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              [ {cat.toUpperCase()} ]
            </button>
          ))}
        </div>

        {/* ITEMS GRID */}
        <div className="row g-4">
          {items
            .filter((item) => activeCategory === "All" ? true : item.category === activeCategory)
            .map((item) => (
              <div key={item._id} className="col-md-6 col-lg-4">
                <div className="y2k-wire-box h-100 d-flex flex-column overflow-hidden group-hover">
                  
                  {/* Image Container */}
                  <div className="position-relative border-bottom border-cyan" style={{ height: "200px", background: "rgba(0, 229, 255, 0.05)" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-100 h-100" style={{ objectFit: "cover", opacity: 0.8 }} />
                    ) : (
                      <div className="w-100 h-100 d-flex justify-content-center align-items-center text-cyan font-monospace opacity-50">
                        NO_VISUAL_DATA
                      </div>
                    )}
                    <div className="position-absolute top-0 end-0 bg-cyan-dim border-start border-bottom border-cyan px-2 py-1 text-cyan font-monospace small">
                      {item.category.toUpperCase()}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <h5 className="text-main font-monospace mb-1">{item.name}</h5>
                    <p className="text-cyan fw-bold font-monospace fs-5 mb-4">₹{item.price}</p>
                    
                    <div className="d-flex gap-2 mt-auto">
                      <button className="y2k-btn-action flex-grow-1" onClick={() => editProduct(item)}>
                        [ EDIT ]
                      </button>
                      <button className="y2k-btn-danger flex-grow-1" onClick={() => deleteProduct(item._id)}>
                        [ PURGE ]
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
        </div>

        {items.length === 0 && (
          <div className="text-muted font-monospace text-center mt-5">
            &gt; DATABASE_EMPTY. PLEASE_INJECT_DATA.
          </div>
        )}

      </div>
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #010308; 
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.1);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.1);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background-color: var(--bg-color);
  }

  .y2k-grid-bg {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(var(--cyan-dim) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0; pointer-events: none; opacity: 0.3;
  }

  .scanlines {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
    background-size: 100% 4px; z-index: 9999; pointer-events: none; opacity: 0.6;
  }

  /* UTILS */
  .text-cyan { color: var(--cyan) !important; text-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
  .text-magenta { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255, 0, 85, 0.3); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan-dim { background-color: var(--cyan-dim) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  .y2k-wire-box {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: var(--wire-border);
    position: relative;
    transition: all 0.3s ease;
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 6px; height: 6px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  .y2k-wire-box:hover {
    box-shadow: 0 0 15px var(--cyan-dim);
    border-color: var(--cyan);
  }

  .y2k-title { font-family: 'DotGothic16', sans-serif; }

  /* INPUTS */
  .y2k-input-group {
    background: rgba(0,0,0,0.8);
    border: 1px solid var(--cyan-glow);
    transition: all 0.2s;
  }
  .y2k-input-group:focus-within {
    border-color: var(--cyan);
    box-shadow: 0 0 10px var(--cyan-dim);
  }
  .y2k-input-prefix {
    font-size: 0.8rem;
    background: rgba(0, 229, 255, 0.05);
    min-width: 50px;
    text-align: center;
  }
  .y2k-input {
    background: transparent;
    border: none;
    color: var(--text-main);
    font-family: 'Share Tech Mono', monospace;
    outline: none;
    font-size: 0.95rem;
  }
  .y2k-input::placeholder { color: rgba(94, 121, 147, 0.4); font-size: 0.8rem; }

  /* BUTTONS */
  .y2k-btn-action {
    background: transparent;
    border: 1px solid var(--cyan-glow);
    color: var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-action:hover, .y2k-btn-action.active-filter {
    background: var(--cyan-dim);
    box-shadow: 0 0 10px var(--cyan-dim);
    border-color: var(--cyan);
  }

  .y2k-btn-magenta {
    background: rgba(255, 0, 85, 0.1);
    border: 2px solid var(--magenta);
    color: var(--magenta);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    transition: all 0.2s;
    font-size: 1rem;
    letter-spacing: 1px;
  }
  .y2k-btn-magenta:hover {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 20px var(--magenta-dim);
  }

  .y2k-btn-danger {
    background: transparent;
    border: 1px solid rgba(255, 0, 85, 0.5);
    color: var(--magenta);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-danger:hover {
    background: var(--magenta-dim);
    box-shadow: 0 0 10px var(--magenta-dim);
  }
`;