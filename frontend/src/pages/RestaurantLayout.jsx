import { Link, Outlet, useLocation } from "react-router-dom";

export default function RestaurantLayout() {
  const location = useLocation();

  // Route definitions for easy mapping and clean code
  const navLinks = [
    { path: "dashboard", label: "ACTIVE_PAYLOADS (Orders)" },
    { path: "menu", label: "ASSET_REGISTRY (Menu)" },
    { path: "profile", label: "NODE_CONFIG (Profile)" },
  ];

  // Helper to check if a tab is currently active
  const isActive = (path) => location.pathname.includes(path);

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-layout-wrapper">
        
        <div className="container-fluid px-3 px-xl-4 py-4 position-relative z-1">
          
          {/*  THE COMMAND RIBBON (Top Navigation)  */}
          <div className="y2k-wire-box border-cyan mb-4 p-0 overflow-hidden d-flex flex-column flex-lg-row shadow-lg">
            
            {/* Identification Block */}
            <div className="bg-cyan text-dark px-4 py-3 d-flex flex-column justify-content-center" style={{ minWidth: "280px" }}>
              <h2 className="m-0 font-monospace fw-bold fs-5 d-flex align-items-center gap-2">
                <span className="blink">_</span> HOST_NODE
              </h2>
              <div className="small font-monospace mt-1" style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                LOCAL_SYS_CONTROL // PRIVILEGE: LVL_2
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
                    className={`y2k-nav-tab px-4 py-3 d-flex align-items-center font-monospace text-decoration-none transition-all ${active ? 'active text-cyan bg-cyan-dim' : 'text-muted'}`}
                  >
                    <span className={`me-2 ${active ? 'text-main' : 'opacity-50'}`}>
                      {active ? ">>" : ">"}
                    </span>
                    [ {link.label} ]
                  </Link>
                );
              })}
            </div>
            
            {/* System Status Indicator */}
            <div className="d-none d-xl-flex align-items-center px-4 font-monospace small text-cyan border-start-wire border-cyan" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
               <div className="d-flex flex-column text-end">
                 <span>UPLINK: SECURE</span>
                 <span className="text-muted" style={{ fontSize: "0.65rem" }}>ENCRYPTION: RSA-2048</span>
               </div>
            </div>

          </div>

          {/*  THE INJECTED CONTENT (Outlet)  */}
          <div className="y2k-content-area">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  /* Notice we don't redefine the :root colors here, 
     as they should already be inherited globally from your App,
     but we define the specific layout mechanics. */

  .y2k-layout-wrapper {
    min-height: 100vh;
    /* This ensures it sits nicely above the global background */
  }

  /* ── COMMAND RIBBON STYLES ── */
  .y2k-nav-scroll {
    /* Hides scrollbar but allows horizontal scrolling on mobile */
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
    border-bottom: 2px solid var(--cyan);
    box-shadow: inset 0 -10px 15px -10px var(--cyan-glow);
    text-shadow: 0 0 5px rgba(0, 229, 255, 0.4);
  }

  /* UTILS (Just in case they aren't globally loaded yet) */
  .border-start-wire { border-left: 1px dashed var(--cyan-glow); }
  .transition-all { transition: all 0.2s ease-in-out; }
`;