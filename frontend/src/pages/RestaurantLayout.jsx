import { Link, Outlet, useLocation } from "react-router-dom";

export default function RestaurantLayout() {
  const location = useLocation();

  const navLinks = [
    { path: "dashboard", label: "SYS_CTRL (Dashboard)" },
    { path: "orders", label: "ACTIVE_PAYLOADS (Orders)" },
    { path: "menu", label: "ASSET_REGISTRY (Menu)" },
    { path: "profile", label: "NODE_CONFIG (Profile)" },
    { path: "analytics", label: "TELEMETRY (Analytics)" },
  ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-layout-wrapper">
        
        {/* Global Background Elements */}
        <div className="scanlines"></div>
        <div className="y2k-grid-bg"></div>

        <div className="container-fluid px-3 px-xl-4 py-4 position-relative z-1">
          
          {/* THE COMMAND RIBBON */}
          <div className="y2k-wire-box border-cyan mb-4 p-0 overflow-hidden d-flex flex-column flex-lg-row shadow-lg" style={{ background: "rgba(2, 6, 13, 0.95)" }}>
            
            {/* Identification Block */}
            <div className="bg-cyan-dim border-end border-cyan px-4 py-3 d-flex flex-column justify-content-center" style={{ minWidth: "250px" }}>
              <h2 className="m-0 font-monospace fw-bold fs-5 text-cyan d-flex align-items-center gap-2">
                <span className="blink text-main">_</span> HOST_NODE
              </h2>
              <div className="small font-monospace mt-1 text-muted" style={{ fontSize: "0.75rem" }}>
                LOCAL_SYS_CONTROL // LVL_2
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex flex-grow-1 overflow-auto y2k-nav-scroll">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`y2k-nav-tab px-3 py-3 d-flex align-items-center font-monospace text-decoration-none transition-all ${active ? 'active text-cyan' : 'text-muted'}`}
                    style={{ fontSize: "0.85rem" }}
                  >
                    <span className={`me-2 ${active ? 'text-magenta fw-bold' : 'opacity-50'}`}>
                      {active ? ">>" : ">"}
                    </span>
                    [ {link.label} ]
                  </Link>
                );
              })}
            </div>
            
            {/* System Status Indicator */}
            <div className="d-none d-xl-flex align-items-center px-4 font-monospace small text-cyan border-start border-cyan bg-cyan-dim">
               <div className="d-flex flex-column text-end">
                 <span>UPLINK: SECURE</span>
                 <span className="text-muted" style={{ fontSize: "0.65rem" }}>RSA-2048</span>
               </div>
            </div>

          </div>

          
          <div className="y2k-content-area position-relative z-1">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :root {
    --bg-color: #010308; 
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.1);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.15);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  .y2k-layout-wrapper {
    min-height: 100vh;
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

  .y2k-wire-box {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: 1px solid var(--cyan);
    position: relative;
  }

  /* ── COMMAND RIBBON STYLES ── */
  .y2k-nav-scroll {
    scrollbar-width: none; 
    -ms-overflow-style: none;
  }
  .y2k-nav-scroll::-webkit-scrollbar {
    display: none; 
  }

  .y2k-nav-tab {
    border-right: 1px dashed var(--cyan-glow);
    white-space: nowrap;
    border-bottom: 2px solid transparent;
  }
  
  .y2k-nav-tab:hover:not(.active) {
    background-color: rgba(0, 229, 255, 0.05);
    color: var(--text-main) !important;
    text-shadow: 0 0 5px var(--cyan-dim);
  }

  .y2k-nav-tab.active {
    background-color: rgba(0, 229, 255, 0.1);
    border-bottom: 2px solid var(--cyan);
    box-shadow: inset 0 -10px 15px -10px var(--cyan-glow);
    text-shadow: 0 0 5px rgba(0, 229, 255, 0.4);
  }

  .transition-all { transition: all 0.2s ease-in-out; }
  .bg-cyan-dim { background-color: var(--cyan-dim) !important; }
`;