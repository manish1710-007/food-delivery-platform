import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const roleLabel = user?.role === "admin"
    ? { label: "SYS_ADMIN", to: "/admin/dashboard", cls: "text-magenta" }
    : user?.role === "restaurant"
    ? { label: "HOST_PANEL", to: "/restaurant/dashboard", cls: "text-amber" }
    : null;

  return (
    <>
      <style>{navStyles}</style>

      <nav className="y2k-navbar sticky-top">
        <div className="container-fluid px-3 px-xl-4 h-100 d-flex align-items-center justify-content-between">

          {/*  Brand  */}
          <Link to="/" className="y2k-brand d-flex align-items-center gap-2 text-decoration-none">
            <span className="y2k-brand-icon blink text-cyan">_</span>
            <span className="y2k-brand-name">
              FOOD_DASH<span className="text-cyan">.exe</span>
            </span>
          </Link>

          {/*  Right side  */}
          <div className="d-flex align-items-center gap-2 gap-md-3">

            <ThemeToggle />

            {user ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="y2k-nav-btn text-decoration-none position-relative d-flex align-items-center"
                >
                  <span className="d-none d-sm-inline me-2">[DIR: CART]</span>
                  <span className="d-sm-none">[📦]</span>
                  
                  {cartCount > 0 && (
                    <span className="y2k-cart-badge position-absolute">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Avatar + dropdown */}
                <div className="position-relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    aria-expanded={dropdownOpen}
                    className={`y2k-nav-btn d-flex align-items-center gap-2 ${dropdownOpen ? "active" : ""}`}
                  >
                    <span className="d-none d-sm-inline">
                      [USR: {user.name.split(" ")[0].toUpperCase()}]
                    </span>
                    <span className="d-sm-none">[USR]</span>
                    <span className="y2k-chevron">{dropdownOpen ? "▲" : "▼"}</span>
                  </button>

                  {dropdownOpen && (
                    <div className="y2k-dropdown position-absolute end-0 mt-1">
                      
                      {/* Window Title Bar */}
                      <div className="y2k-title-bar d-flex justify-content-between align-items-center">
                        <span>USER_PROFILE.sys</span>
                        <button className="y2k-close-btn" onClick={() => setDropdownOpen(false)}>X</button>
                      </div>

                      <div className="p-2">
                        {/* Header */}
                        <div className="d-flex align-items-center gap-3 mb-2 p-2 border-bottom-wire">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00e5ff&color=000&bold=true&size=64`}
                            alt={user.name}
                            className="y2k-avatar flex-shrink-0"
                            width="40" height="40"
                          />
                          <div className="overflow-hidden">
                            <div className="y2k-menu-name text-truncate text-cyan">{user.name.toUpperCase()}</div>
                            <div className="y2k-menu-role text-truncate">{user.email || user.role}</div>
                          </div>
                        </div>

                        {/* Role link */}
                        {roleLabel && (
                          <div className="mb-2 border-bottom-wire pb-2">
                            <Link
                              to={roleLabel.to}
                              className={`y2k-menu-item d-block text-decoration-none ${roleLabel.cls}`}
                            >
                              &gt; {roleLabel.label}
                            </Link>
                          </div>
                        )}

                        {/* Standard links */}
                        <div className="d-flex flex-column gap-1 mb-2 border-bottom-wire pb-2">
                          {[
                            { label: "EDIT_ACCOUNT", to: "/profile" },
                            { label: "ORDER_HISTORY", to: "/orders/my" },
                            { label: "SYS_SETTINGS", to: "/settings" },
                          ].map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="y2k-menu-item text-decoration-none"
                            >
                              &gt; {item.label}
                            </Link>
                          ))}
                        </div>

                        <button
                          className="y2k-menu-item y2k-logout w-100 text-start border-0 bg-transparent text-magenta"
                          onClick={handleLogout}
                        >
                          &gt; TERMINATE_SESSION
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest */
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="y2k-nav-btn text-decoration-none">
                  [ LOGIN ]
                </Link>
                <Link to="/register" className="y2k-nav-btn text-magenta border-magenta text-decoration-none">
                  [ EXECUTE: SIGN_UP ]
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Share+Tech+Mono&display=swap');

  :root {
    --nav-bg: #010409;
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.1);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.1);
    --amber: #ffb700;
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid rgba(0, 229, 255, 0.4);
  }

  /*  Shell  */
  .y2k-navbar {
    background: var(--nav-bg);
    border-bottom: var(--wire-border);
    height: 60px;
    font-family: 'Share Tech Mono', monospace;
    z-index: 1030;
    box-shadow: 0 4px 20px rgba(0,0,0,0.8);
  }

  /* Grid overlay for the navbar */
  .y2k-navbar::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(var(--cyan-dim) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }

  /*  Brand  */
  .y2k-brand { position: relative; z-index: 1; }
  .y2k-brand-icon { font-weight: bold; font-size: 1.2rem; }
  .y2k-brand-name {
    font-family: 'DotGothic16', sans-serif;
    font-size: 1.3rem;
    color: var(--text-main);
    letter-spacing: 1px;
    text-shadow: 2px 2px 0px rgba(0, 229, 255, 0.2);
  }

  /*  Utilities  */
  .text-cyan { color: var(--cyan) !important; }
  .text-magenta { color: var(--magenta) !important; }
  .text-amber { color: var(--amber) !important; }
  .border-magenta { border-color: var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed rgba(0, 229, 255, 0.3); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /*  Nav Buttons  */
  .y2k-nav-btn {
    position: relative;
    z-index: 1;
    background: rgba(0,0,0,0.6);
    border: 1px solid var(--text-muted);
    color: var(--text-main);
    padding: 4px 12px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.1s;
    font-family: 'Share Tech Mono', monospace;
  }
  .y2k-nav-btn:hover, .y2k-nav-btn.active {
    border-color: var(--cyan);
    color: var(--cyan);
    background: var(--cyan-dim);
    box-shadow: 0 0 8px var(--cyan-dim);
  }

  /* Cart Badge */
  .y2k-cart-badge {
    top: -8px; right: -8px;
    background: var(--cyan);
    color: #000;
    font-weight: bold;
    font-size: 0.65rem;
    padding: 0 4px;
    border: 1px solid #000;
    box-shadow: 2px 2px 0px rgba(0,0,0,0.8);
  }

  /*  Dropdown Panel  */
  .y2k-dropdown {
    width: 240px;
    background: var(--nav-bg);
    border: 2px solid var(--cyan);
    box-shadow: 6px 6px 0px rgba(0, 229, 255, 0.15), 0 10px 30px rgba(0,0,0,0.9);
    z-index: 1050;
    font-family: 'Share Tech Mono', monospace;
  }

  .y2k-title-bar {
    background: var(--cyan);
    color: #000;
    padding: 2px 8px;
    font-size: 0.8rem;
    font-family: 'DotGothic16', sans-serif;
    font-weight: bold;
  }
  
  .y2k-close-btn {
    background: transparent;
    border: none;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    font-size: 0.8rem;
  }
  .y2k-close-btn:hover { background: #000; color: var(--cyan); }

  /* Avatar Square */
  .y2k-avatar {
    border: 1px solid var(--cyan);
    filter: grayscale(100%) contrast(1.5) sepia(1) hue-rotate(140deg);
  }

  .y2k-menu-name { font-size: 0.9rem; font-weight: bold; }
  .y2k-menu-role { font-size: 0.7rem; color: var(--text-muted); }

  /* Menu Items */
  .y2k-menu-item {
    display: block;
    color: var(--text-main);
    padding: 6px 8px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0s;
  }
  .y2k-menu-item:hover {
    background: var(--cyan);
    color: #000 !important;
    text-shadow: none;
  }
  .y2k-logout:hover {
    background: var(--magenta) !important;
    color: #fff !important;
  }
`;