import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function RestaurantView() {
  const { id } = useParams(); // Extracts the restaurant ID from the URL
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sysLogs, setSysLogs] = useState([
    "> ESTABLISHING_DIRECT_LINK...",
    `> TARGET_NODE_ID: ${id.slice(-6).toUpperCase()}`
  ]);

  useEffect(() => {
    async function fetchNodeData() {
      try {
        // 1. Fetch the specific restaurant data
        const restRes = await api.get(`/restaurants/${id}`);
        setRestaurant(restRes.data);
        
        setSysLogs(prev => [...prev, `> HANDSHAKE_ACCEPTED: ${restRes.data.name.toUpperCase()}`]);

        // 2. Fetch all products and filter for this specific host
        const prodRes = await api.get("/products");
        const nodeProducts = prodRes.data.filter(p => {
            // Handle if the backend populates the restaurant object or just sends the ID string
            const pRestId = typeof p.restaurant === "object" ? p.restaurant._id : p.restaurant;
            return pRestId === id;
        });
        
        setMenu(nodeProducts);
        setSysLogs(prev => [...prev, `> MOUNTED_${nodeProducts.length}_MENU_ASSETS`, "> READY_FOR_TRANSMISSION"]);

      } catch (err) {
        console.error(err);
        setSysLogs(prev => [...prev, "> FATAL_ERR: CONNECTION_REFUSED"]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNodeData();
  }, [id]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box p-4 text-center border-cyan" style={{ width: "320px" }}>
            <div className="mb-3 text-cyan font-monospace small">TUNNELING_TO_NODE... <span className="blink">_</span></div>
            <div className="y2k-progress-bar border-cyan">
              <div className="y2k-progress-fill bg-cyan" style={{ animationDuration: '1s' }}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!restaurant) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="y2k-wire-box border-magenta p-5 text-center">
            <h3 className="text-magenta font-monospace mb-4">/// ERR_404: NODE_OFFLINE</h3>
            <button className="y2k-btn-outline text-cyan px-4 py-2" onClick={() => navigate(-1)}>
              [ &lt; SEVER_LINK_AND_RETURN ]
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page pb-5">
        <div className="y2k-grid-bg"></div>
        <div className="scanlines"></div>

        <div className="container-fluid px-3 px-xl-4 py-4 position-relative z-1 w-100">
          
          {/* Top Control Bar */}
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <button className="y2k-btn-outline text-cyan px-3 py-2 font-monospace" onClick={() => navigate('/')}>
              [ &lt; DISCONNECT_NODE ]
            </button>
            <div className="text-muted font-monospace small">
              SECURE_TUNNEL: <span className="text-cyan">ACTIVE</span>
            </div>
          </div>

          <div className="row g-4 align-items-start">
            
            {/* ── LEFT: Host Info & Menu (col-xl-9) ── */}
            <div className="col-12 col-xl-9">
              
              {/* Host Identity Hero */}
              <div className="y2k-wire-box border-cyan p-0 mb-4 overflow-hidden d-flex flex-column flex-md-row">
                <div className="y2k-host-img-container border-end-md border-cyan position-relative flex-shrink-0" style={{ width: "100%", maxWidth: "300px", height: "200px" }}>
                  <div className="crosshair-center"></div>
                  <img 
                    src={restaurant.image || "https://via.placeholder.com/300"} 
                    alt={restaurant.name}
                    className="w-100 h-100 object-fit-cover"
                    style={{ filter: "grayscale(100%) contrast(1.2) sepia(1) hue-rotate(140deg) brightness(0.8)" }}
                  />
                  <div className="position-absolute bottom-0 start-0 p-2 bg-dark-dim w-100 text-cyan font-monospace small border-top-wire border-cyan">
                    CAM_FEED // LIVE
                  </div>
                </div>
                
                <div className="p-4 d-flex flex-column justify-content-center flex-grow-1">
                  <div className="text-cyan font-monospace small mb-2">&gt; TARGET_ACQUIRED</div>
                  <h1 className="y2k-title text-main m-0 fs-2 mb-1 text-uppercase">{restaurant.name}</h1>
                  <p className="text-muted font-monospace m-0 mb-3">&gt; LOC: {restaurant.address}</p>
                  
                  <div className="d-flex gap-3 font-monospace small">
                    <span className="y2k-badge border-cyan text-cyan px-2 py-1">[ SYS: ONLINE ]</span>
                    <span className="y2k-badge border-cyan text-cyan px-2 py-1">[ AUTH: OK ]</span>
                  </div>
                </div>
              </div>

              {/* The Menu Grid */}
              <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                <div className="d-flex justify-content-between align-items-end border-bottom-wire border-cyan pb-2 mb-4">
                  <h2 className="y2k-section-title mb-0">/// AVAILABLE_PAYLOADS</h2>
                  <span className="text-cyan small font-monospace">ASSETS: {menu.length}</span>
                </div>

                {menu.length === 0 ? (
                  <div className="text-center p-5 text-muted font-monospace border border-secondary" style={{ borderStyle: 'dashed' }}>
                    [ MENU_DIRECTORY_EMPTY ]
                  </div>
                ) : (
                  <div className="row g-4">
                    {menu.map((product) => (
                      <div className="col-xl-4 col-lg-6 col-sm-6" key={product._id}>
                        <div className="y2k-wire-card p-1 h-100">
                          {/* We reuse your existing ProductCard! */}
                          <ProductCard product={product} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* ── RIGHT: Node Diagnostics (col-xl-3) ── */}
            <div className="col-12 col-xl-3 d-none d-xl-block">
              <div className="position-sticky" style={{ top: "80px" }}>
                
                <div className="y2k-wire-box border-cyan p-0 h-100 d-flex flex-column text-start bg-dark-dim">
                  <div className="bg-cyan text-dark p-2 px-3 text-start font-monospace fw-bold" style={{ fontSize: "0.8rem" }}>
                    TERMINAL_UPLINK
                  </div>
                  
                  <div className="p-3 font-monospace small flex-grow-1 d-flex flex-column justify-content-end overflow-hidden" style={{ minHeight: "300px", fontSize: "0.7rem" }}>
                    {sysLogs.map((log, idx) => (
                      <div key={idx} className={`mb-1 ${log.includes("ERR") ? "text-magenta fw-bold" : "text-cyan"}`}>
                        {log}
                      </div>
                    ))}
                    <div className="text-cyan mt-1"><span className="blink">_</span></div>
                  </div>

                  <div className="border-top-wire border-cyan p-3 font-monospace small">
                    <div className="text-muted mb-1">&gt; NODE_LATENCY: <span className="text-cyan">14ms</span></div>
                    <div className="text-muted mb-1">&gt; PACKET_LOSS: <span className="text-cyan">0.0%</span></div>
                    <div className="text-muted">&gt; RATING: <span className="text-amber">4.8/5.0</span></div>
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
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #010308; 
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.2);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --amber: #ffb700;
    --text-main: #e0e6ed;
    --text-muted: #8aa2b9;
    --wire-border: 1px solid var(--cyan-glow);
  }

  /* GLOBAL BACKGROUND (Frosted Glass Cityscape) */
  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background: 
      linear-gradient(rgba(1, 3, 10, 0.85), rgba(1, 3, 10, 0.9)),
      url('/y2k_fooddash_bg.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
  }

  .y2k-grid-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(var(--cyan-dim) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0; pointer-events: none; opacity: 0.15;
  }

  .scanlines {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
    background-size: 100% 4px; z-index: 9999; pointer-events: none; opacity: 0.5;
  }

  .bg-dark-dim { background-color: rgba(0, 0, 0, 0.5); }

  /* UTILS */
  .text-cyan { color: var(--cyan) !important; text-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
  .text-magenta { color: var(--magenta) !important; }
  .text-amber { color: var(--amber) !important; }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan { background-color: var(--cyan) !important; color: #000 !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  
  @media (min-width: 768px) {
    .border-end-md { border-right: 1px dashed var(--cyan-glow); }
  }

  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /* WIREFRAME BOXES & CARDS */
  .y2k-wire-box {
    background: rgba(2, 6, 13, 0.45);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: var(--wire-border);
    position: relative;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 8px; height: 8px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  .y2k-wire-card {
    background: rgba(0,0,0,0.4);
    border: 1px solid var(--text-muted);
    transition: all 0.2s;
  }
  .y2k-wire-card:hover {
    border-color: var(--cyan);
    background: rgba(0, 229, 255, 0.05);
    box-shadow: inset 0 0 15px rgba(0,229,255,0.1);
  }

  .y2k-title { font-family: 'DotGothic16', sans-serif; }
  .y2k-section-title { font-family: 'DotGothic16', sans-serif; font-size: 1.2rem; color: var(--cyan); }

  /* BUTTONS */
  .y2k-btn-outline {
    background: rgba(0,0,0,0.5);
    border: 1px solid var(--cyan);
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-outline:hover {
    background: var(--cyan);
    color: #000 !important;
    box-shadow: 0 0 10px var(--cyan-dim);
    text-shadow: none;
  }

  /* IMAGE CROSSHAIR */
  .crosshair-center {
    position: absolute; width: 40px; height: 40px;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    border: 1px solid var(--cyan-glow); z-index: 2; pointer-events: none;
  }
  .crosshair-center::before { content: ''; position: absolute; top: 50%; left: -15px; right: -15px; height: 1px; background: var(--cyan-glow); }
  .crosshair-center::after { content: ''; position: absolute; left: 50%; top: -15px; bottom: -15px; width: 1px; background: var(--cyan-glow); }

  /* PROGRESS BAR */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }
`;