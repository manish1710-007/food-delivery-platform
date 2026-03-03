import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      alert("SYS_ERR: FAILED_TO_FETCH_NODES");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "", address: "", image: "" });
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
        await api.put(`/admin/restaurants/${editing._id}`, form);
      } else {
        await api.post("/admin/restaurants", form);
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("SYS_ERR: WRITE_OPERATION_FAILED");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("SYS_WARN: PERMANENTLY PURGE THIS NODE?")) return;
    try {
      await api.delete(`/admin/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("SYS_ERR: PURGE_FAILED");
    }
  }

  async function toggleActive(id) {
    try {
      await api.patch(`/admin/restaurants/${id}/toggle`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("SYS_ERR: STATE_FLIP_FAILED");
    }
  }

  async function toggleApproval(id) {
    try {
      await api.patch(`/admin/restaurants/${id}/approve`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("SYS_ERR: AUTH_FAILED");
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
      const res = await fetch(`https://api.cloudinary.com/v1_1/dcl5zom8v/image/upload`, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setForm({ ...form, image: json.secure_url });
    } catch (err) {
      console.error(err);
      alert("SYS_ERR: PACKET_UPLOAD_FAILED");
    } finally {
      setUploading(false);
    }
  }

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box p-4 text-center" style={{ width: "320px" }}>
            <div className="mb-3 text-cyan">SCANNING_HOST_NODES... <span className="blink">_</span></div>
            <div className="y2k-progress-bar">
              <div className="y2k-progress-fill" style={{ animationDuration: '2s' }}></div>
            </div>
          </div>
        </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page pb-5">
        {/* Grid & Scanlines */}
        <div className="y2k-grid-bg"></div>
        <div className="scanlines"></div>

        <div className="container-fluid px-3 px-xl-4 position-relative z-1 pt-4 w-100">

          {/* Header HUD */}
          <div className="y2k-wire-box border-magenta d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 p-3 bg-magenta-dim text-start">
            <div>
              <h1 className="y2k-title mb-1 fs-4 text-magenta d-flex align-items-center gap-2 m-0 text-shadow-magenta">
                <span className="blink">_</span> SYS_NODES // RESTAURANT_MANAGER
              </h1>
              <div className="text-magenta small font-monospace opacity-75">
                ROOT_DIR: C:\SERVER\HOST_NODES\&gt;
              </div>
            </div>
            <div className="mt-3 mt-md-0">
               <button className="y2k-btn-magenta px-4 py-2" onClick={openCreate}>
                [ INITIALIZE_NEW_NODE ]
              </button>
            </div>
          </div>

          <div className="row g-4 align-items-start">

            {/* ── LEFT: Node List & Search (col-xl-9) ── */}
            <div className="col-12 col-xl-9">
              
              {/* Search Bar */}
              <div className="y2k-wire-box border-cyan p-3 mb-4 text-start">
                  <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                    <span className="text-cyan small font-monospace">/// QUERY_NODES</span>
                  </div>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan text-uppercase">C:\&gt;</span>
                    <input 
                      className="y2k-input flex-grow-1 p-2" 
                      value={search} 
                      onChange={e => setSearch(e.target.value)} 
                      placeholder="ENTER_NODE_IDENTIFIER..." 
                    />
                  </div>
              </div>

              {/* Node List */}
              <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                  <span className="text-cyan small font-monospace">/// ACTIVE_ROUTING_TABLE</span>
                  <span className="text-cyan small font-monospace">FOUND: {filtered.length}</span>
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center p-5 text-muted font-monospace">
                    [ DIR_EMPTY: NO_MATCHING_NODES ]
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {filtered.map(r => (
                      <div key={r._id} className="y2k-data-row d-flex flex-column flex-lg-row justify-content-between p-3 border-cyan gap-3">
                        
                        {/* Node Info & Image */}
                        <div className="d-flex align-items-center gap-3 overflow-hidden" style={{ minWidth: "250px" }}>
                          <div className="y2k-avatar-frame border-cyan p-1 flex-shrink-0" style={{ width: "60px", height: "60px" }}>
                            <img
                                src={r.image || "https://via.placeholder.com/60"}
                                className="w-100 h-100"
                                style={{ objectFit: "cover", filter: "grayscale(100%) contrast(1.5) sepia(1) hue-rotate(140deg)" }}
                                alt={r.name}
                            />
                          </div>
                          <div className="flex-grow-1 overflow-hidden pe-2 text-start">
                            <div className="text-main fw-bold font-monospace fs-5 text-truncate">{r.name.toUpperCase()}</div>
                            <div className="text-muted small font-monospace text-truncate">
                                &gt; {r.address.toUpperCase()}
                            </div>
                            <div className="text-cyan small font-monospace text-truncate opacity-75" style={{ fontSize: "0.65rem" }}>
                                ID: {r._id.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="d-flex align-items-center gap-2 flex-wrap font-monospace small">
                          <span className={`y2k-status-badge px-2 py-1 border ${r.status === "approved" ? "border-cyan text-cyan" : "border-amber text-amber"}`}>
                            [{r.status === "approved" ? "AUTH: OK" : "AUTH: PEND"}]
                          </span>
                          <span className={`y2k-status-badge px-2 py-1 border ${r.isActive ? "border-cyan text-cyan" : "border-magenta text-magenta"}`}>
                            [{r.isActive ? "SYS: ONLINE" : "SYS: OFFLINE"}]
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-lg-end">
                            <button className="y2k-btn-outline text-muted font-monospace px-2 py-1" onClick={() => toggleApproval(r._id)}>
                                [ AUTH_NODE ]
                            </button>
                            <button className="y2k-btn-outline text-muted font-monospace px-2 py-1" onClick={() => toggleActive(r._id)}>
                                [ FLIP_STATE ]
                            </button>
                            <button className="y2k-btn-outline text-cyan font-monospace px-2 py-1" onClick={() => openEdit(r)}>
                                [ EDIT ]
                            </button>
                            <button className="y2k-btn-outline text-magenta font-monospace px-2 py-1" onClick={() => handleDelete(r._id)}>
                                [ PURGE ]
                            </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: System Diagnostics (col-xl-3) ── */}
            <div className="col-12 col-xl-3 d-none d-xl-block">
              <div className="position-sticky" style={{ top: "80px" }}>
                <div className="y2k-wire-box p-4 text-start h-100 d-flex flex-column gap-3 border-cyan">
                  <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-2">
                    <span className="text-cyan small font-monospace">/// NETWORK_TOPOLOGY</span>
                  </div>

                  {/* Fake Routing Map */}
                  <div className="text-center font-monospace text-cyan my-2" style={{ fontSize: "0.55rem", whiteSpace: "pre", lineHeight: "1.2" }}>
{`
    [ROOT]
      |
  .---+---.
  |       |
[N1]    [N2]
  |       |
 .+.     .+.
 | |     | |
`}
                  </div>

                  <div className="border-bottom-wire border-cyan"></div>

                  {/* Node Stats */}
                  <div className="text-muted font-monospace mt-2" style={{ fontSize: "0.7rem", lineHeight: "1.8" }}>
                    &gt; TOTAL_NODES: <span className="text-cyan">{restaurants.length}</span><br/>
                    &gt; ONLINE: <span className="text-cyan">{restaurants.filter(r => r.isActive).length}</span><br/>
                    &gt; OFFLINE: <span className="text-magenta">{restaurants.filter(r => !r.isActive).length}</span><br/>
                    &gt; PENDING_AUTH: <span className="text-amber">{restaurants.filter(r => r.status !== "approved").length}</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Y2K MODAL ── */}
        {showModal && (
          <div className="y2k-modal-overlay d-flex align-items-center justify-content-center">
            <div className="y2k-wire-box border-cyan p-0 text-start w-100" style={{ maxWidth: "500px", background: "#02060d" }}>
              
              {/* Modal Title Bar */}
              <div className="bg-cyan text-dark d-flex justify-content-between align-items-center p-2 font-monospace fw-bold">
                <span>{editing ? "RECONFIGURE_NODE.exe" : "INITIALIZE_NODE.exe"}</span>
                <button className="y2k-close-btn" onClick={() => setShowModal(false)}>[ X ]</button>
              </div>
              
              <form className="p-4 font-monospace" onSubmit={handleSubmit}>
                
                <label className="d-block text-muted small mb-1">&gt; NODE_IDENTIFIER</label>
                <div className="y2k-input-group d-flex mb-3">
                  <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">ID:</span>
                  <input className="y2k-input flex-grow-1 p-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                
                <label className="d-block text-muted small mb-1">&gt; GEO_COORDINATES</label>
                <div className="y2k-input-group d-flex mb-3">
                  <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">LOC:</span>
                  <input className="y2k-input flex-grow-1 p-2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                </div>
                
                <label className="d-block text-muted small mb-1">&gt; NODE_DESCRIPTION</label>
                <div className="y2k-input-group d-flex mb-3">
                  <textarea className="y2k-input flex-grow-1 p-2 w-100" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                
                <label className="d-block text-muted small mb-1">&gt; UPLOAD_DATA_PACKET (Image)</label>
                <div className="y2k-input-group d-flex mb-3">
                  <input type="file" className="y2k-input flex-grow-1 p-2 w-100" onChange={uploadImage} style={{ fontSize: "0.8rem" }} />
                </div>
                
                {uploading && <div className="text-cyan small blink mb-3">&gt; TRANSMITTING_PACKET_TO_CLOUD...</div>}
                
                {form.image && (
                  <div className="mb-4">
                    <div className="text-muted small mb-1">&gt; PREVIEW_RENDER</div>
                    <div className="y2k-avatar-frame border-cyan p-1" style={{ width: "120px", height: "80px" }}>
                        <img src={form.image} className="w-100 h-100" alt="Preview" style={{ objectFit: "cover", filter: "grayscale(100%) contrast(1.5) sepia(1) hue-rotate(140deg)" }} />
                    </div>
                  </div>
                )}
                
                <div className="d-flex justify-content-end gap-3 mt-4 border-top-wire pt-3">
                  <button className="y2k-btn-outline text-muted px-3" type="button" onClick={() => setShowModal(false)}>[ CANCEL ]</button>
                  <button className="y2k-btn-magenta px-4" type="submit" disabled={uploading}>
                    {uploading ? "[ WAIT ]" : "[ COMMIT_CHANGES ]"}
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
    --amber: #ffb700;
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
  .text-amber { color: var(--amber) !important; text-shadow: 0 0 5px rgba(255, 183, 0, 0.3); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan { background-color: var(--cyan) !important; color: #000 !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-amber { border: 1px solid var(--amber) !important; }
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
    font-size: 0.95rem;
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
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-outline:hover {
    color: var(--cyan) !important;
    text-shadow: 0 0 5px var(--cyan);
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
  
  .y2k-status-badge { background: rgba(0,0,0,0.6); }

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

  /* PROGRESS BAR */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }
`;