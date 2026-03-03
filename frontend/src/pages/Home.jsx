import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Fake system logs for the terminal sidebar
  const [sysLogs, setSysLogs] = useState([]);

  useEffect(() => { 
    loadData(); 
    
    // Generate fake terminal logs for the aesthetic
    const interval = setInterval(() => {
      const actions = ["SYS_CHK", "PING", "NODE_SYNC", "MEM_ALLOC", "DATA_FETCH"];
      const status = Math.random() > 0.9 ? "WARN" : "OK";
      const newLog = `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${actions[Math.floor(Math.random()*actions.length)]} ... ${status}`;
      setSysLogs(prev => [newLog, ...prev].slice(0, 20));
    }, 1500);
    
    return () => clearInterval(interval);
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

  const categories = ["All", "🍔 Burgers", "🍕 Pizza", "🌮 Tacos", "🍜 Noodles", "🥗 Healthy", "🍛 Curry"];

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-loading d-flex flex-column align-items-center justify-content-center gap-3">
          <div className="y2k-wire-box p-4 text-center">
            <div className="loading-glitch mb-2">BOOTING_NETWORK...</div>
            <div className="y2k-progress-bar">
              <div className="y2k-progress-fill"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page">
        {/* Fine Blueprint Grid Background */}
        <div className="y2k-grid-bg"></div>
        {/* CRT Scanlines */}
        <div className="scanlines"></div>

        {/* Changed to container-fluid for edge-to-edge layout */}
        <div className="container-fluid px-3 px-xl-4 py-4 position-relative z-1">
          
          <div className="row g-4">
            {/* MAIN CONTENT AREA - Left Side */}
            <div className="col-12 col-xl-9">
              
              {/* Top Navigation / Hero Window */}
              <div className="y2k-wire-box mb-4">
                <div className="y2k-title-bar d-flex justify-content-between">
                  <span><span className="blink">_</span> FOOD_NETWORK_v3.0 // 私の世界</span>
                  <span>[ READ ONLY ]</span>
                </div>
                
                <div className="p-4 position-relative">
                  <div className="row align-items-center g-4">
                    <div className="col-lg-7">
                      <div className="y2k-eyebrow mb-2">
                        &gt; SYS_STATUS: OPTIMAL | FREE_DELIVERY: ENABLED
                      </div>

                      <h1 className="y2k-headline mb-3">
                        GREAT FOOD.<br />
                        <span className="y2k-highlight">DELIVERED FAST.</span>
                      </h1>

                      <p className="y2k-subtext mb-4">
                        INDEXED: {restaurants.length} HOSTS // {products.length} PACKETS // LATENCY: 30m
                      </p>

                      {/* Search */}
                      <div className="y2k-input-group mb-4 d-flex align-items-center">
                        <span className="y2k-prompt px-3">C:\SEARCH&gt;</span>
                        <input
                          className="y2k-input flex-grow-1"
                          placeholder="ENTER_QUERY..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                          <button className="y2k-btn-clear px-3" onClick={() => setSearch("")}>[CLR]</button>
                        )}
                      </div>

                      {/* Category filters */}
                      <div className="d-flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`y2k-btn-outline ${activeCategory === cat ? "active" : ""}`}
                          >
                            [{cat}]
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="col-lg-5 d-none d-lg-block">
                      <div className="y2k-wire-box y2k-image-frame p-1">
                        <div className="y2k-title-bar py-1 px-2 text-muted" style={{fontSize: '0.65rem'}}>
                          TGT_CAMERA_01
                        </div>
                        <div className="position-relative overflow-hidden" style={{height: '220px'}}>
                          <div className="crosshair-center"></div>
                          <img
                            src="https://i.pinimg.com/736x/87/00/40/870040715694c03eeaeecf572a1cdcb9.jpg"
                            alt="Radar view"
                            className="y2k-hero-img w-100 h-100 object-fit-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="row g-3 mb-4">
                {[
                  { value: restaurants.length, label: "DATA_NODES", icon: "DIR" },
                  { value: products.length,    label: "ASSETS",      icon: "FILE" },
                  { value: "120+",             label: "PACKETS_SENT",icon: "SYS" },
                  { value: "4.8",              label: "USER_RATING", icon: "OBJ" },
                ].map((s, i) => (
                  <div className="col-6 col-md-3" key={i}>
                    <div className="y2k-wire-box d-flex flex-column p-3">
                      <span className="y2k-stat-icon mb-1">[{s.icon}]</span>
                      <span className="y2k-stat-val text-cyan">{s.value}</span>
                      <span className="y2k-stat-label">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Banner */}
              <div className="y2k-wire-box mb-5 d-flex align-items-stretch">
                <div className="y2k-alert-badge d-flex align-items-center px-3 text-dark bg-cyan fw-bold">
                  ALERT
                </div>
                <div className="y2k-marquee flex-grow-1 overflow-hidden d-flex align-items-center px-3">
                  <div className="marquee-content text-cyan">
                    &gt;&gt; USE CODE DASH20 FOR 20% OFF INITIALIZATION SEQUENCE &lt;&lt; &nbsp; &nbsp; &gt;&gt; USE CODE DASH20 FOR 20% OFF INITIALIZATION SEQUENCE &lt;&lt;
                  </div>
                </div>
              </div>

              {/* Restaurants Section */}
              <div className="mb-5">
                <div className="d-flex align-items-end justify-content-between mb-3 border-bottom-wire pb-2">
                  <h2 className="y2k-section-title mb-0">/// LOCAL_HOSTS</h2>
                  <span className="y2k-badge">FOUND: {filteredRestaurants.length}</span>
                </div>

                {filteredRestaurants.length === 0 ? (
                  <div className="y2k-wire-box text-center p-5">
                    <span className="blink text-cyan">NO_NODES_FOUND "{search}"</span>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredRestaurants.map((r) => (
                      <div className="col-xl-4 col-lg-4 col-sm-6" key={r._id}>
                        <div className="y2k-wire-card h-100 d-flex flex-column">
                          <div className="y2k-card-header d-flex justify-content-between">
                            <span>ID:{r._id.slice(-4).toUpperCase() || 'X99'}</span>
                            <span className="text-cyan">PING:25ms</span>
                          </div>
                          <div className="y2k-card-img-wrap p-2 border-bottom-wire">
                            <img src={r.image} alt={r.name} className="w-100 object-fit-cover" style={{height: '140px', filter: 'grayscale(0.3) contrast(1.2)'}} />
                          </div>
                          <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                            <div>
                              <div className="y2k-card-title text-truncate">{r.name}</div>
                              <div className="y2k-card-addr text-truncate mt-1 text-muted">
                                &gt; {r.address}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-end mt-3">
                              <span className="y2k-btn-outline px-2 py-1" style={{fontSize: '0.7rem'}}>CONNECT</span>
                              <span className="text-cyan" style={{fontSize: '0.8rem'}}>LVL: 4.{Math.floor(Math.random() * 3) + 6}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Section */}
              <div className="mb-4">
                <div className="d-flex align-items-end justify-content-between mb-3 border-bottom-wire border-magenta pb-2">
                  <h2 className="y2k-section-title text-magenta mb-0">/// EXECUTABLES</h2>
                  <span className="y2k-badge border-magenta text-magenta">ITEMS: {products.length}</span>
                </div>
                
                <div className="row g-4">
                  {products.slice(0, 8).map((p) => (
                    <div className="col-xl-4 col-lg-4 col-sm-6" key={p._id}>
                      <div className="y2k-wire-card border-magenta p-1">
                        <ProductCard product={p} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SIDEBAR - Right Side (Fills the blank space) */}
            <div className="col-12 col-xl-3 d-none d-xl-block">
              <div className="y2k-sidebar position-sticky top-0" style={{ paddingTop: '1rem', height: '100vh', overflow: 'hidden' }}>
                <div className="y2k-wire-box h-100 d-flex flex-column">
                  
                  <div className="y2k-title-bar">
                    <span>SYS_MONITOR</span>
                  </div>
                  
                  <div className="p-3 d-flex flex-column flex-grow-1">
                    
                    {/* Fake Server Stats */}
                    <div className="mb-4">
                      <div className="text-cyan mb-1" style={{fontSize: '0.8rem'}}>CPU_USAGE</div>
                      <div className="y2k-progress-bar mb-3"><div className="y2k-progress-fill" style={{width: '34%'}}></div></div>
                      
                      <div className="text-cyan mb-1" style={{fontSize: '0.8rem'}}>MEM_ALLOC</div>
                      <div className="y2k-progress-bar mb-3"><div className="y2k-progress-fill" style={{width: '68%'}}></div></div>
                      
                      <div className="text-magenta mb-1" style={{fontSize: '0.8rem'}}>NET_TRAFFIC</div>
                      <div className="y2k-progress-bar bg-magenta-dim border-magenta"><div className="y2k-progress-fill bg-magenta" style={{width: '82%'}}></div></div>
                    </div>

                    <div className="border-bottom-wire mb-3"></div>

                    {/* Active Terminal Logs */}
                    <div className="text-cyan mb-2" style={{fontSize: '0.8rem'}}>/// ACTIVE_PROCESSES</div>
                    <div className="y2k-terminal-logs flex-grow-1 overflow-hidden" style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                      {sysLogs.map((log, idx) => (
                        <div key={idx} className={log.includes("WARN") ? "text-magenta" : ""}>
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Bottom Deco */}
                    <div className="mt-3 text-end text-cyan" style={{fontSize: '0.65rem'}}>
                      v2.0.44_STABLE <br/>
                      {new Date().toISOString().split('T')[0]}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #02060d; /* Deeper black/blue */
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.2);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.2);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  .text-cyan { color: var(--cyan) !important; }
  .text-magenta { color: var(--magenta) !important; }
  .bg-cyan { background-color: var(--cyan) !important; }
  .bg-magenta { background-color: var(--magenta) !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  .border-magenta { border-color: var(--magenta-glow) !important; border: 1px solid var(--magenta) !important; }

  /* BASE STYLES */
  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background:
      linear-gradient(rgba(1, 3, 10, 0.8), rgba(1, 3, 10, 0.85)),
      url('/y2k_fooddash_bg.png');
    background-size: cover;
    backgrund-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat; 

    
    min-height: 100vh;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
  }

  /* SKETCH/BLUEPRINT GRID */
  .y2k-grid-bg {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
      linear-gradient(var(--cyan-dim) 1px, transparent 1px),
      linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
    pointer-events: none;
    opacity: 0.5;
  }

  /* CRT OVERLAY */
  .scanlines {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
    background-size: 100% 4px;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.6;
  }

  /* WIREFRAME BOXES (The "Sketch Layer" look) */
  .y2k-wire-box {
    background: rgba(2, 6, 13, 0.7);
    backdrop-filter: blur(4px);
    border: var(--wire-border);
    position: relative;
  }
  
  /* Corner Crosshairs for the Blueprint Vibe */
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 10px; height: 10px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  .border-bottom-wire { border-bottom: var(--wire-border); }

  .y2k-title-bar {
    border-bottom: var(--wire-border);
    padding: 4px 8px;
    font-size: 0.8rem;
    color: var(--cyan);
    background: rgba(0, 229, 255, 0.05);
    letter-spacing: 1px;
  }

  /* TYPOGRAPHY */
  h1, h2, h3 { font-weight: normal; }
  .y2k-headline { font-size: clamp(2rem, 3.5vw, 3rem); line-height: 1.1; }
  .y2k-highlight { color: var(--magenta); text-shadow: 2px 2px 0px rgba(255,0,85,0.4); }
  .y2k-eyebrow { color: var(--cyan); font-size: 0.8rem; }
  .y2k-subtext { color: var(--text-muted); font-size: 0.9rem; }
  .y2k-section-title { font-size: 1.2rem; color: var(--cyan); }

  /* FORMS & BUTTONS */
  .y2k-input-group { border: var(--wire-border); background: rgba(0,0,0,0.5); }
  .y2k-prompt { color: var(--cyan); font-size: 0.9rem; }
  .y2k-input {
    background: transparent; border: none; color: var(--text-main);
    font-family: inherit; outline: none; padding: 8px 0;
  }
  .y2k-input::placeholder { color: var(--text-muted); }
  .y2k-btn-clear { background: transparent; color: var(--cyan); border: none; border-left: var(--wire-border); cursor: pointer; }

  .y2k-btn-outline {
    background: transparent;
    border: 1px solid var(--text-muted);
    color: var(--text-muted);
    padding: 4px 12px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-outline:hover, .y2k-btn-outline.active {
    border-color: var(--cyan);
    color: var(--cyan);
    background: var(--cyan-dim);
    box-shadow: 0 0 8px var(--cyan-dim);
  }

  /* IMAGE FRAME CROSSHAIR */
  .crosshair-center {
    position: absolute; width: 30px; height: 30px;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    border: 1px solid var(--cyan-glow); z-index: 2; pointer-events: none;
  }
  .crosshair-center::before { content: ''; position: absolute; top: 50%; left: -10px; right: -10px; height: 1px; background: var(--cyan-glow); }
  .crosshair-center::after { content: ''; position: absolute; left: 50%; top: -10px; bottom: -10px; width: 1px; background: var(--cyan-glow); }

  /* CARDS */
  .y2k-wire-card {
    background: rgba(0,0,0,0.4);
    border: 1px solid var(--text-muted);
    transition: all 0.2s;
    cursor: pointer;
  }
  .y2k-wire-card:hover {
    border-color: var(--cyan);
    background: rgba(0, 229, 255, 0.05);
    box-shadow: inset 0 0 15px rgba(0,229,255,0.1);
  }
  .y2k-card-header { font-size: 0.75rem; padding: 4px 8px; border-bottom: 1px solid var(--text-muted); color: var(--text-muted); }
  .y2k-wire-card:hover .y2k-card-header { border-color: var(--cyan); color: var(--cyan); }
  .y2k-card-title { font-size: 1rem; color: var(--text-main); }
  .y2k-card-addr { font-size: 0.75rem; }

  /* STATS */
  .y2k-stat-icon { font-size: 0.8rem; color: var(--text-muted); }
  .y2k-stat-val { font-size: 1.5rem; line-height: 1; margin: 4px 0; }
  .y2k-stat-label { font-size: 0.7rem; color: var(--text-muted); }

  /* BADGES & PROMO */
  .y2k-badge { border: 1px solid var(--cyan); color: var(--cyan); padding: 2px 8px; font-size: 0.75rem; }
  .y2k-marquee { white-space: nowrap; }
  .marquee-content { display: inline-block; animation: scrollLeft 20s linear infinite; }
  @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* SIDEBAR PROGRESS BARS */
  .y2k-progress-bar { width: 100%; height: 10px; border: 1px solid var(--cyan-glow); background: rgba(0,0,0,0.5); padding: 1px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); }

  /* UTILS */
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }
`;