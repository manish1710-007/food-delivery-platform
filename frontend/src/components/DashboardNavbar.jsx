import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";

export default function DashboardNavbar() {
    const { user, logout } = useAuth();
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

    // Live terminal clock
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Theme based on role (matches the sidebar)
    const isAdmin = user?.role === "admin";
    const ThemeColor = isAdmin ? "magenta" : "cyan";
    const ThemeText = isAdmin ? "text-magenta" : "text-cyan";

    return (
        <>
            <style>{styles}</style>
            <nav className={`y2k-dash-nav d-flex justify-content-between align-items-center px-3 px-md-4 py-2 position-sticky top-0 z-3 border-bottom-wire border-${ThemeColor}`}>
                
                {/* ── Left: User Identity ── */}
                <div className="d-flex align-items-center gap-2 gap-md-3 font-monospace">
                    <span className={`${ThemeText} fs-5 blink`}>_</span>
                    <span className="text-muted d-none d-sm-inline">&gt; USR_LOGGED_IN:</span>
                    <span className="text-main fw-bold fs-6">
                        {user?.name?.toUpperCase()}
                    </span>
                    <span className={`y2k-role-badge bg-${ThemeColor} text-dark px-2 fw-bold d-none d-md-inline`} style={{ fontSize: "0.7rem" }}>
                        {user?.role?.toUpperCase()}
                    </span>
                </div>

                {/* ── Right: Diagnostics & Actions ── */}
                <div className="d-flex align-items-center gap-3 gap-md-4">
                    
                    {/* Fake System Diagnostics */}
                    <div className="d-none d-lg-flex gap-4 font-monospace text-muted" style={{ fontSize: "0.75rem" }}>
                        <span>SYS_TIME: <span className="text-main">{time}</span></span>
                        <span>NET_STATUS: <span className={ThemeText}>ENCRYPTED</span></span>
                    </div>

                    {/* Logout Command */}
                    <button 
                        className="y2k-btn-logout font-monospace fw-bold" 
                        onClick={logout}
                    >
                        <span className="d-none d-sm-inline">[ TERMINATE_SESSION ]</span>
                        <span className="d-sm-none">[ LOGOUT ]</span>
                    </button>
                </div>
            </nav>
        </>
    );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :root {
    --nav-bg: #010308;
    --cyan: #00e5ff;
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.15);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
  }

  /* NAVBAR SHELL */
  .y2k-dash-nav {
    background-color: var(--nav-bg);
    font-family: 'Share Tech Mono', monospace;
    box-shadow: 0 4px 20px rgba(0,0,0,0.8);
    position: relative;
  }

  /* SUBTLE GRID BEHIND NAVBAR */
  .y2k-dash-nav::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 15px 15px;
    z-index: 0; pointer-events: none;
  }

  /* CONTENT WRAPPER TO SIT ABOVE GRID */
  .y2k-dash-nav > div {
    position: relative;
    z-index: 1;
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

  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /* ROLE BADGE */
  .y2k-role-badge {
    border: 1px solid transparent;
    letter-spacing: 1px;
  }

  /* LOGOUT BUTTON */
  .y2k-btn-logout {
    background: transparent;
    border: 1px solid var(--magenta);
    color: var(--magenta);
    padding: 6px 12px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-logout:hover {
    background: var(--magenta);
    color: #fff !important;
    box-shadow: 0 0 15px var(--magenta-dim);
    text-shadow: none;
  }
`;