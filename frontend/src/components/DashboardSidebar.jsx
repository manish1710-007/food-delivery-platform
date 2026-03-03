import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function DashboardSidebar() {
    const location = useLocation();
    const { user } = useAuth();

    // Dynamic Theming based on Role
    const isAdmin = user?.role === "admin";
    const themeColor = isAdmin ? "magenta" : "cyan";
    const ThemeBorder = isAdmin ? "border-magenta" : "border-cyan";
    const ThemeText = isAdmin ? "text-magenta" : "text-cyan";
    const activeClass = isAdmin ? "active-magenta" : "active-cyan";

    const isActive = (path) => location.pathname.startsWith(path);

    // Mapped Links for cleaner rendering and retro naming
    const adminLinks = [
        { name: "SYS_DASHBOARD", path: "/admin/dashboard" },
        { name: "HOST_NODES.exe", path: "/admin/restaurants" },
        { name: "PACKET_ROUTING", path: "/admin/orders" },
        { name: "TAXONOMY.dat", path: "/admin/categories" },
        { name: "REVENUE_STREAM", path: "/admin/payment-analytics" },
        { name: "DATA_ANALYTICS", path: "/admin/analytics" },
    ];

    const restaurantLinks = [
        { name: "HOST_DASHBOARD", path: "/restaurant/dashboard" },
        { name: "MENU_ASSETS.dat", path: "/restaurant/menu" },
        { name: "INBOUND_ORDERS", path: "/restaurant/orders" },
        { name: "LOCAL_ANALYTICS", path: "/restaurant/analytics" },
    ];

    return (
        <>
            <style>{styles}</style>
            <div 
                className={`y2k-sidebar ${ThemeBorder} d-flex flex-column`}
                style={{ width: "260px", minHeight: "100vh" }}
            >
                {/* ── Grid Background ── */}
                <div className="y2k-sidebar-bg"></div>

                {/* ── Header ── */}
                <div className={`y2k-sidebar-header border-bottom-wire ${ThemeBorder} p-4 position-relative z-1`}>
                    <h4 className={`m-0 font-monospace fw-bold ${ThemeText} d-flex align-items-center gap-2`} style={{ fontSize: "1.2rem", letterSpacing: "1px" }}>
                        <span className="blink">_</span>
                        {isAdmin ? "ROOT_ACCESS" : "HOST_NODE"}
                    </h4>
                    <div className="text-muted small font-monospace mt-2">
                        USR_ID: {user?._id?.slice(-6).toUpperCase() || "SYS99"}
                    </div>
                </div>

                {/* ── Navigation Tree ── */}
                <div className="flex-grow-1 p-3 d-flex flex-column gap-2 overflow-auto position-relative z-1 mt-2">
                    <div className="text-muted small font-monospace mb-2">
                        C:\SYS\DIR_TREE&gt;
                    </div>

                    {/* Admin Menu */}
                    {isAdmin && adminLinks.map((link) => (
                        <Link 
                            key={link.path}
                            to={link.path} 
                            className={`y2k-nav-link ${isActive(link.path) ? activeClass : ""} d-block text-decoration-none font-monospace`}
                        >
                            <span className="y2k-cursor text-magenta me-2">{isActive(link.path) ? ">" : "\u00A0"}</span> 
                            [{link.name}]
                        </Link>
                    ))}

                    {/* Restaurant Menu */}
                    {user?.role === "restaurant" && restaurantLinks.map((link) => (
                        <Link 
                            key={link.path}
                            to={link.path} 
                            className={`y2k-nav-link ${isActive(link.path) ? activeClass : ""} d-block text-decoration-none font-monospace`}
                        >
                            <span className="y2k-cursor text-cyan me-2">{isActive(link.path) ? ">" : "\u00A0"}</span> 
                            [{link.name}]
                        </Link>
                    ))}
                </div>

                {/* ── Bottom Diagnostic Panel ── */}
                <div className={`p-4 border-top-wire ${ThemeBorder} position-relative z-1 bg-dark-dim`}>
                    <div className={`text-muted font-monospace small mb-2`}>
                        {isAdmin ? "/// MAINFRAME_UPLINK" : "/// SERVER_UPLINK"}
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className={`y2k-status-dot bg-${themeColor} blink shadow-${themeColor}`}></div>
                        <span className={`${ThemeText} font-monospace fw-bold`} style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
                            LINK_STABLE
                        </span>
                    </div>
                    
                    {/* Fake Connection Stats */}
                    <div className="font-monospace text-muted d-flex flex-column gap-1" style={{ fontSize: "0.65rem" }}>
                        <div className="d-flex justify-content-between">
                            <span>LATENCY:</span>
                            <span className={ThemeText}>12ms</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>PACKET_LOSS:</span>
                            <span className={ThemeText}>0.0%</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2 pt-2 border-top-wire border-secondary">
                            <span>V: 2.4.1</span>
                            <span>A: 0x{Math.floor(Math.random() * 9999).toString(16).toUpperCase()}</span>
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
    --bg-sidebar: #010409;
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.15);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.15);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
  }

  /* SIDEBAR CONTAINER */
  .y2k-sidebar {
    background-color: var(--bg-sidebar);
    border-right: 2px solid; /* Color applied dynamically via inline class */
    position: relative;
    overflow: hidden;
    box-shadow: 4px 0 20px rgba(0,0,0,0.5);
  }

  .bg-dark-dim { background-color: rgba(0, 0, 0, 0.4); }

  /* BACKGROUND GRID */
  .y2k-sidebar-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 0; pointer-events: none;
  }

  /* UTILS */
  .text-cyan { color: var(--cyan) !important; text-shadow: 0 0 5px rgba(0, 229, 255, 0.4); }
  .text-magenta { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255, 0, 85, 0.4); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan { background-color: var(--cyan) !important; }
  .bg-magenta { background-color: var(--magenta) !important; }
  
  .border-cyan { border-color: var(--cyan) !important; }
  .border-magenta { border-color: var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed; }
  .border-top-wire { border-top: 1px dashed; }
  
  .shadow-cyan { box-shadow: 0 0 8px var(--cyan); }
  .shadow-magenta { box-shadow: 0 0 8px var(--magenta); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /* STATUS DOT */
  .y2k-status-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
  }

  /* NAVIGATION LINKS */
  .y2k-nav-link {
    color: var(--text-muted);
    font-size: 0.85rem;
    padding: 8px 12px;
    transition: all 0.1s;
    border: 1px solid transparent;
    cursor: pointer;
    white-space: nowrap;
  }

  .y2k-nav-link:hover {
    color: var(--text-main);
    background: rgba(255,255,255,0.05);
    border: 1px dashed var(--text-muted);
  }

  /* ACTIVE STATE - ADMIN (MAGENTA) */
  .y2k-nav-link.active-magenta {
    color: var(--magenta) !important;
    background: var(--magenta-dim);
    border: 1px solid var(--magenta);
    box-shadow: inset 0 0 10px var(--magenta-dim);
    text-shadow: 0 0 5px rgba(255, 0, 85, 0.5);
  }

  /* ACTIVE STATE - RESTAURANT (CYAN) */
  .y2k-nav-link.active-cyan {
    color: var(--cyan) !important;
    background: var(--cyan-dim);
    border: 1px solid var(--cyan);
    box-shadow: inset 0 0 10px var(--cyan-dim);
    text-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
  }

  .y2k-cursor {
    display: inline-block;
    width: 12px;
    font-weight: bold;
  }
`;