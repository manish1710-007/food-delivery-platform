import { Link, Outlet, useLocation } from "react-router-dom";

export default function RestaurantPanel() {
  const { pathname } = useLocation();

  const navItem = (to, label, icon) => {
    const isActive = pathname === to || (to !== "/restaurant/panel" && pathname.includes(to));
    
    return (
      <Link
        to={to}
        className={`y2k-nav-link text-decoration-none d-flex align-items-center gap-3 mb-2 p-3 ${isActive ? "active" : ""}`}
      >
        <span className={isActive ? "text-magenta" : "text-cyan"}>{icon}</span>
        <span className="font-monospace fw-bold y2k-nav-text">
          {isActive ? `> ${label}_` : `[ ${label} ]`}
        </span>
      </Link>
    );
  };

  return (
    <div className="y2k-page min-vh-100 d-flex flex-column flex-md-row position-relative overflow-hidden">
      <style>{styles}</style>
      
      <div className="scanlines"></div>
      <div className="y2k-grid-bg"></div>

      <div className="y2k-sidebar border-end border-cyan p-3 p-md-4 d-flex flex-column z-1" 
           style={{ minWidth: "260px", background: "rgba(2, 6, 13, 0.95)" }}>
        
        {/* Header */}
        <div className="mb-5 border-bottom-wire border-cyan pb-3 mt-2">
          <div className="text-cyan font-monospace small mb-1">/// ROOT_ACCESS: GRANTED</div>
          <h2 className="y2k-title text-main m-0 fs-3">
            SYS_CTRL <span className="blink text-cyan">_</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="d-flex flex-column flex-grow-1">
          {navItem("/restaurant/panel/profile", "PROFILE", "◈")}
          {navItem("/restaurant/panel/menu", "MENU_DB", "▤")}
          {navItem("/restaurant/panel/orders", "ORDERS", "◎")}
          {navItem("/restaurant/panel/analytics", "ANALYTICS", "▚")}
        </div>

        {/* Footer System Status */}
        <div className="mt-5 pt-3 border-top-wire border-cyan text-muted font-monospace small d-none d-md-block">
          <div className="d-flex justify-content-between">
            <span>UPLINK:</span> <span className="text-cyan">SECURE</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>LATENCY:</span> <span>12ms</span>
          </div>
          <div className="d-flex justify-content-between mt-2 pt-2 border-top-wire border-cyan opacity-50">
            <span>NODE:</span> <span>ACTIVE</span>
          </div>
        </div>
      </div>
      
      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-0 p-md-2 z-1 position-relative overflow-auto" style={{ height: "100vh" }}>
        <Outlet />
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
    --magenta-dim: rgba(255, 0, 85, 0.15);
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
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  .y2k-title { font-family: 'DotGothic16', sans-serif; }

  /* SIDEBAR NAVIGATION BUTTONS */
  .y2k-nav-link {
    background: transparent;
    border-left: 3px solid transparent;
    color: var(--text-muted);
    transition: all 0.2s ease;
  }
  
  .y2k-nav-text {
    letter-spacing: 1px;
  }

  /* Hover State */
  .y2k-nav-link:hover {
    background: var(--cyan-dim);
    border-left: 3px solid var(--cyan);
    color: var(--cyan);
    box-shadow: inset 15px 0 20px -15px var(--cyan);
  }

  /* Active State */
  .y2k-nav-link.active {
    background: var(--magenta-dim);
    border-left: 3px solid var(--magenta);
    color: var(--text-main);
    box-shadow: inset 15px 0 20px -15px var(--magenta);
  }
  
  .y2k-nav-link.active .y2k-nav-text {
    color: #fff;
    text-shadow: 0 0 8px var(--magenta);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .y2k-sidebar {
      min-width: 100%;
      border-end: none !important;
      border-bottom: 1px solid var(--cyan);
    }
    .y2k-page {
      overflow-y: auto !important;
    }
    .flex-grow-1 {
      height: auto !important;
      overflow: visible !important;
    }
  }
`;