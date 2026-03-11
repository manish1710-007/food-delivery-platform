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

  // Fake system logs for the sidebar
  const [sysLogs, setSysLogs] = useState([
    "> ASSET_REGISTRY_MOUNTED",
    "> AWAITING_SYS_ADMIN_CMD..."
  ]);

  const [form, setForm] = useState({ 
      name: "", 
      price: "", 
      category: "", 
      restaurant: "", 
      image: "", 
      available: true 
  });

  const addLog = (msg) => {
    setSysLogs(prev => [...prev, msg].slice(-8));
  };

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
      addLog("> SYS_ERR: FAILED_TO_FETCH_ASSETS");
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

  const getRestId = (rest) => {
    if (!rest) return "";
    return typeof rest === "object" ? rest._id : rest;
  };

  const getRestName = (rest) => {
    if (!rest) return "";
    if (rest.name) return rest.name;

    const searchId = typeof rest === "object" ? String(rest._id) : String(rest);
    const found = restaurants.find(r => String(r._id) === searchId);
    return found ? found.name : "UNKNOWN_HOST";
  };

  function openCreate() {
    setEditing(null);
    setForm({ name: "", price: "", category: "", restaurant: "", image: "", available: true });
    setShowModal(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      restaurant: getRestId(product.restaurant) || "",
      image: product.image || "",
      available: product.available ?? true,
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
          await api.patch(`/products/${editing._id}`, form);
          addLog(`> OVERWRITE_SUCCESS: [${form.name.toUpperCase()}]`);
      } else {
          await api.post("/products", form);
          addLog(`> NEW_ASSET_ALLOCATED: [${form.name.toUpperCase()}]`);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Save failed:", err);
      alert(err.response?.data?.message || "SYS_ERR: WRITE_FAILED");
      addLog("> SYS_ERR: WRITE_FAILED");
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm("SYS_WARN: PERMANENTLY PURGE THIS ASSET?")) return;
    try {
      await api.delete(`/products/${id}`);
      addLog(`> MEMORY_FREED: [${name.toUpperCase()}] PURGED`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "SYS_ERR: PURGE_FAILED");
    }
  }

  async function toggleAvailability(product) {
    try {
      await api.patch(`/products/${product._id}`, {
        ...product,
        available: !product.available,
        restaurant: getRestId(product.restaurant),
      });
      addLog(`> ASSET_STATE_FLIPPED: [${product.name.toUpperCase()}]`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("SYS_ERR: STATE_OVERRIDE_FAILED");
    }
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    addLog("> UPLOADING_SECURE_PACKET...");
    
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "fooddash"); // Ensure this preset exists in Cloudinary!

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/du4ly99ab/image/upload", { method: "POST", body: data });
      const json = await res.json();
      
      // Catch Cloudinary specific errors
      if (json.error) {
        throw new Error(json.error.message);
      }

      setForm({ ...form, image: json.secure_url });
      addLog("> PACKET_UPLOAD_SUCCESS [OK]");
      
    } catch (err) {
      console.error("Cloudinary Error:", err);
      alert(`SYS_ERR: UPLOAD_REJECTED\n${err.message}`);
      
      // Log the exact error to the terminal sidebar
      const shortError = err.message.length > 20 ? err.message.substring(0, 20) + "..." : err.message;
      addLog(`> ERR: ${shortError.toUpperCase()}`);
    } finally {
      setUploading(false);
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && 
    (!restaurantFilter || getRestId(p.restaurant) === restaurantFilter)
  );

  if (loading) return (
    <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
            <div className="y2k-wire-box p-4 text-center border-cyan" style={{ width: "320px" }}>
                <div className="mb-3 text-cyan font-monospace small">SCANNING_ASSET_REGISTRY... <span className="blink">_</span></div>
                <div className="y2k-progress-bar border-cyan">
                    <div className="y2k-progress-fill bg-cyan" style={{ animationDuration: '1.5s' }}></div>
                </div>
            </div>
        </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page pb-5">
        <div className="y2k-grid-bg"></div>
        <div className="scanlines"></div>

        <div className="container-fluid px-3 px-xl-4 position-relative z-1 pt-4 w-100">
          
          {/* Header HUD */}
          <div className="y2k-wire-box border-magenta d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 p-3 bg-magenta-dim text-start">
            <div>
              <h1 className="y2k-title mb-1 fs-4 text-magenta d-flex align-items-center gap-2 m-0 text-shadow-magenta">
                <span className="blink">_</span> SYS_ASSETS // GLOBAL_REGISTRY
              </h1>
              <div className="text-magenta small font-monospace opacity-75">
                ROOT_DIR: C:\SERVER\PRODUCTS\&gt;
              </div>
            </div>
            <div className="mt-3 mt-md-0">
               <button className="y2k-btn-magenta px-4 py-2" onClick={openCreate}>
                [ ALLOCATE_NEW_ASSET ]
              </button>
            </div>
          </div>

          <div className="row g-4 align-items-start">

            {/*  LEFT: Filters & Product List  */}
            <div className="col-12 col-xl-9">
              
              {/* Query Panel */}
              <div className="y2k-wire-box border-cyan p-3 mb-4 text-start">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                  <span className="text-cyan small font-monospace">/// QUERY_ASSETS</span>
                </div>
                <div className="row g-3 font-monospace">
                  <div className="col-md-6">
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">C:\&gt;</span>
                      <input 
                        className="y2k-input flex-grow-1 p-2" 
                        placeholder="ENTER_ASSET_NAME..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="y2k-input-group d-flex h-100">
                      <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">FLT:</span>
                      <select 
                        className="y2k-input flex-grow-1 p-2 y2k-select text-uppercase" 
                        value={restaurantFilter} 
                        onChange={(e) => setRestaurantFilter(e.target.value)}
                      >
                        <option value="">ALL_HOST_NODES</option>
                        {restaurants.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table / List */}
              <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                  <span className="text-cyan small font-monospace">/// ACTIVE_DATA_BLOCKS</span>
                  <span className="text-cyan small font-monospace">MATCHES: {filtered.length}</span>
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center p-5 text-muted font-monospace">
                    [ DIR_EMPTY: NO_ASSETS_FOUND ]
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {filtered.map((p) => (
                      <div key={p._id} className="y2k-data-row d-flex flex-column flex-lg-row justify-content-between p-3 border-cyan gap-3 font-monospace">
                        
                        {/* Image & Core Info */}
                        <div className="d-flex align-items-center gap-3 overflow-hidden" style={{ minWidth: "250px" }}>
                          <div className="y2k-avatar-frame border-cyan p-1 flex-shrink-0" style={{ width: "50px", height: "50px" }}>
                            <img 
                              src={p.image || "https://via.placeholder.com/48"} 
                              className="w-100 h-100" 
                              style={{ objectFit: "cover", filter: "grayscale(100%) contrast(1.5) sepia(1) hue-rotate(140deg)" }} 
                              alt="" 
                            />
                          </div>
                          <div className="flex-grow-1 overflow-hidden pe-2">
                            <div className="text-main fw-bold fs-5 text-truncate">{p.name.toUpperCase()}</div>
                            <div className="text-cyan small text-truncate">MD5: {p._id.slice(0, 8).toUpperCase()}</div>
                          </div>
                        </div>
                        
                        {/* Taxonomy & Host */}
                        <div className="d-flex flex-column justify-content-center overflow-hidden" style={{ minWidth: "150px" }}>
                          <div className="text-muted small text-truncate">&gt; HOST: {getRestName(p.restaurant).toUpperCase()}</div>
                          <div className="text-muted small text-truncate">&gt; TAG: <span className="text-main">[{p.category.toUpperCase()}]</span></div>
                        </div>

                        {/* Price & Status */}
                        <div className="d-flex flex-column align-items-lg-center justify-content-center">
                          <span className="text-magenta fw-bold fs-5">INR {p.price}</span>
                          <span className={`small fw-bold ${p.available ? "text-cyan" : "text-muted text-decoration-line-through"}`}>
                            {p.available ? "[ ONLINE ]" : "[ OFFLINE ]"}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-lg-end">
                          <button className="y2k-btn-outline text-muted px-2 py-1" onClick={() => toggleAvailability(p)}>
                            [ TOGGLE ]
                          </button>
                          <button className="y2k-btn-outline text-cyan px-2 py-1" onClick={() => openEdit(p)}>
                            [ EDIT ]
                          </button>
                          <button className="y2k-btn-outline text-magenta px-2 py-1" onClick={() => handleDelete(p._id, p.name)}>
                            [ PURGE ]
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/*  RIGHT: Storage Diagnostics  */}
            <div className="col-12 col-xl-3 d-none d-xl-block">
              <div className="position-sticky" style={{ top: "80px" }}>
                
                {/* Defrag Visualizer */}
                <div className="y2k-wire-box p-3 mb-4 text-start border-cyan">
                  <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                    <span className="text-cyan small font-monospace">/// STORAGE_ARRAY</span>
                  </div>
                  
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`y2k-mem-block ${i < Math.min(products.length, 48) ? 'allocated' : 'free'} ${Math.random() > 0.9 ? 'blink' : ''}`}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="text-muted font-monospace small" style={{ lineHeight: "1.6" }}>
                    &gt; TOTAL_ASSETS: <span className="text-cyan">{products.length}</span><br/>
                    &gt; CLOUD_SYNC: <span className="text-cyan">OK</span><br/>
                    &gt; FRAGMENTATION: <span className="text-magenta">2.4%</span>
                  </div>
                </div>

                {/* Event Logger */}
                <div className="y2k-wire-box border-magenta p-0 d-flex flex-column text-start bg-magenta-dim" style={{ height: "300px" }}>
                  <div className="bg-magenta text-dark p-1 px-3 text-start font-monospace fw-bold" style={{ fontSize: "0.8rem" }}>
                    ASSET_MODIFICATION_LOGS
                  </div>
                  <div className="p-3 font-monospace small flex-grow-1 d-flex flex-column justify-content-end overflow-hidden" style={{ fontSize: "0.7rem" }}>
                    {sysLogs.map((log, idx) => (
                      <div key={idx} className={`mb-1 ${log.includes("ERR") || log.includes("PURGED") ? "text-magenta fw-bold" : log.includes("SUCCESS") || log.includes("NEW") ? "text-cyan" : "text-muted"}`}>
                        {log}
                      </div>
                    ))}
                    <div className="text-magenta mt-1"><span className="blink">_</span></div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/*  MODAL: TERMINAL PROMPT  */}
        {showModal && (
          <div className="y2k-modal-overlay d-flex align-items-center justify-content-center">
            <div className="y2k-wire-box border-cyan p-0 text-start w-100" style={{ maxWidth: "600px", background: "#02060d" }}>
              
              <div className="bg-cyan text-dark d-flex justify-content-between align-items-center p-2 font-monospace fw-bold">
                <span>{editing ? "RECONFIGURE_ASSET.exe" : "ALLOCATE_ASSET.exe"}</span>
                <button className="y2k-close-btn" onClick={() => setShowModal(false)}>[ X ]</button>
              </div>
              
              <form className="p-4 font-monospace" onSubmit={handleSubmit}>
                
                {/* Form Row 1 */}
                <div className="row g-3 mb-3">
                  <div className="col-md-8">
                    <label className="d-block text-muted small mb-1">&gt; ASSET_IDENTIFIER</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">ID:</span>
                      <input className="y2k-input flex-grow-1 p-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="d-block text-muted small mb-1">&gt; VALUE (INR)</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">$:</span>
                      <input type="number" className="y2k-input flex-grow-1 p-2" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                  </div>
                </div>

                {/* Form Row 2 */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="d-block text-muted small mb-1">&gt; TAXONOMY_TAG</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">TAG:</span>
                      <input className="y2k-input flex-grow-1 p-2" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="d-block text-muted small mb-1">&gt; HOST_NODE</label>
                    <div className="y2k-input-group d-flex h-100">
                      <select className="y2k-input flex-grow-1 p-2 y2k-select text-uppercase" value={form.restaurant} onChange={e => setForm({ ...form, restaurant: e.target.value })} required>
                        <option value="">SELECT_HOST...</option>
                        {restaurants.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* File Upload */}
                <label className="d-block text-muted small mb-1">&gt; INJECT_DATA_PACKET (Image)</label>
                <div className="y2k-input-group d-flex mb-3">
                  <input type="file" className="y2k-input flex-grow-1 p-2 w-100" onChange={uploadImage} style={{ fontSize: "0.8rem" }} />
                </div>
                
                {uploading && <div className="text-cyan small blink mb-3">&gt; TRANSMITTING_TO_SECURE_STORAGE...</div>}
                
                {form.image && (
                  <div className="mb-4 d-flex align-items-center gap-3">
                    <div className="y2k-avatar-frame border-cyan p-1 flex-shrink-0" style={{ width: "60px", height: "60px" }}>
                        <img src={form.image} className="w-100 h-100" alt="Preview" style={{ objectFit: "cover", filter: "grayscale(100%) contrast(1.5) sepia(1) hue-rotate(140deg)" }} />
                    </div>
                    <div className="text-cyan small">&gt; PACKET_LOADED_SUCCESSFULLY</div>
                  </div>
                )}

                {/* Y2K Toggle */}
                <div className="mb-4 d-flex align-items-center justify-content-between p-2 border-cyan" style={{ border: "1px dashed rgba(0, 229, 255, 0.3)" }}>
                  <span className="text-muted small">&gt; NETWORK_AVAILABILITY</span>
                  <button 
                    type="button"
                    className={`y2k-toggle-btn ${form.available ? 'active' : ''}`}
                    onClick={() => setForm({...form, available: !form.available})}
                  >
                    {form.available ? '[ ONLINE ]' : '[ OFFLINE ]'}
                  </button>
                </div>
                
                {/* Footer */}
                <div className="d-flex justify-content-end gap-3 pt-3 border-top-wire border-cyan">
                  <button className="y2k-btn-outline text-muted px-3" type="button" onClick={() => setShowModal(false)}>[ ABORT ]</button>
                  <button className="y2k-btn-magenta px-4" type="submit" disabled={uploading}>
                    {uploading ? "[ WAIT ]" : "[ COMMIT_TO_REGISTRY ]"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #010308; 
    --panel-bg: #02060d;
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.2);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.15);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  /* BASE STYLES */
  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background: 
      linear-gradient(rgba(1, 3, 10, 0.8), rgba(1, 3, 10, 0.85)),
      url('/y2k_fooddash_bg.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    
    min-height: 100vh;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  /* GRID & OVERLAYS */
  .y2k-grid-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(var(--cyan-dim) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0; pointer-events: none; opacity: 0.4;
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
  
  .bg-cyan { background-color: var(--cyan) !important; color: #000 !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  
  .text-shadow-magenta { text-shadow: 0 0 8px rgba(255, 0, 85, 0.6); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /* WIREFRAME BOXES */
  .y2k-wire-box {
    background: rgba(2, 6, 13, 0.85);
    backdrop-filter: blur(4px);
    border: var(--wire-border);
    position: relative;
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 8px; height: 8px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  .y2k-wire-box.border-magenta::before, .y2k-wire-box.border-magenta::after { border-color: var(--magenta); }

  /* TYPOGRAPHY */
  .y2k-title { font-family: 'DotGothic16', sans-serif; }

  /* AVATAR FRAME */
  .y2k-avatar-frame {
    background: #000;
    position: relative;
  }
  .y2k-avatar-frame::after {
    content: ''; position: absolute; inset: 0;
    border: 1px solid var(--cyan);
    pointer-events: none;
  }

  /* TERMINAL INPUTS */
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
    min-width: 40px;
    text-align: center;
  }
  .y2k-input {
    background: transparent;
    border: none;
    color: var(--text-main);
    font-family: 'Share Tech Mono', monospace;
    outline: none;
    font-size: 0.9rem;
  }
  .y2k-input::placeholder { color: rgba(94, 121, 147, 0.4); }

  .y2k-select {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }
  .y2k-select option { background: var(--panel-bg); color: var(--text-main); }

  /* CUSTOM TOGGLE */
  .y2k-toggle-btn {
    background: rgba(0,0,0,0.6);
    border: 1px solid var(--text-muted);
    color: var(--text-muted);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    padding: 4px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-toggle-btn.active {
    background: var(--cyan-dim);
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: 0 0 8px var(--cyan-dim);
  }

  /* BUTTONS */
  .y2k-btn-magenta {
    background: rgba(255, 0, 85, 0.1);
    border: 2px solid var(--magenta);
    color: var(--magenta);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    transition: all 0.2s;
    font-size: 1rem;
    box-shadow: inset 0 0 10px rgba(255,0,85,0.2);
  }
  .y2k-btn-magenta:hover:not(:disabled) {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 20px var(--magenta-dim);
    text-shadow: none;
  }

  .y2k-btn-outline {
    background: transparent;
    border: 1px solid var(--cyan);
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-outline:hover {
    color: #000 !important;
    background: var(--cyan);
    text-shadow: none;
    box-shadow: 0 0 10px var(--cyan-dim);
  }

  /* DATA ROWS */
  .y2k-data-row {
    background: rgba(0,0,0,0.4);
    transition: all 0.2s;
  }
  .y2k-data-row:hover {
    background: rgba(0, 229, 255, 0.05);
    box-shadow: inset 0 0 10px var(--cyan-dim);
  }

  /* MODAL */
  .y2k-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    z-index: 1050;
    padding: 20px;
  }
  .y2k-close-btn {
    background: transparent; border: none; color: #000; font-weight: bold; cursor: pointer;
  }
  .y2k-close-btn:hover { color: var(--magenta); }

  /* PROGRESS BAR & MEMORY BLOCKS */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }

  .y2k-mem-block {
    width: 12px; height: 12px;
    border: 1px solid rgba(0, 229, 255, 0.3);
    transition: all 0.3s;
  }
  .y2k-mem-block.free { background: transparent; }
  .y2k-mem-block.allocated {
    background: var(--cyan); border-color: var(--cyan); box-shadow: 0 0 5px var(--cyan);
  }
`;