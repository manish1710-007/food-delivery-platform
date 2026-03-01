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
    ? { label: "Admin Dashboard", to: "/admin/dashboard", cls: "nb-role-admin" }
    : user?.role === "restaurant"
    ? { label: "Restaurant Panel", to: "/restaurant/dashboard", cls: "nb-role-restaurant" }
    : null;

  return (
    <>
      <style>{navStyles}</style>

      <nav className="nb-nav sticky-top">
        <div className="container-xl nb-inner d-flex align-items-center justify-content-between">

          {/* ── Brand ── */}
          <Link to="/" className="nb-brand d-flex align-items-center gap-2 text-decoration-none">
            <span className="nb-brand-icon">🍔</span>
            <span className="nb-brand-name">FoodDash</span>
          </Link>

          {/* ── Right side ── */}
          <div className="d-flex align-items-center gap-2">

            <ThemeToggle />

            {user ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="nb-cart-btn d-flex align-items-center gap-2 text-decoration-none position-relative rounded-pill px-3 py-2"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  <span className="nb-cart-label fw-semibold small">Cart</span>
                  {cartCount > 0 && (
                    <span className="nb-cart-badge position-absolute rounded-pill">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Avatar + dropdown */}
                <div className="position-relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    aria-expanded={dropdownOpen}
                    className={`nb-avatar-btn d-flex align-items-center gap-2 rounded-pill border px-2 py-1 ${dropdownOpen ? "open" : ""}`}
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e53935&color=fff&bold=true`}
                      alt={user.name}
                      className="rounded-circle flex-shrink-0"
                      width="30" height="30"
                    />
                    <span className="nb-user-name fw-semibold small d-none d-sm-inline">
                      {user.name}
                    </span>
                    <svg
                      className={`nb-chevron flex-shrink-0 ${dropdownOpen ? "flipped" : ""}`}
                      width="13" height="13" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5"
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="nb-menu position-absolute end-0 rounded-4 overflow-hidden">

                      {/* Header */}
                      <div className="nb-menu-header d-flex align-items-center gap-3 p-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e53935&color=fff&bold=true&size=64`}
                          alt={user.name}
                          className="rounded-circle flex-shrink-0"
                          width="38" height="38"
                        />
                        <div className="overflow-hidden">
                          <div className="nb-menu-name fw-bold small text-truncate">{user.name}</div>
                          <div className="nb-menu-role text-truncate">{user.email || user.role}</div>
                        </div>
                      </div>

                      <hr className="nb-divider my-0" />

                      {/* Role link */}
                      {roleLabel && (
                        <>
                          <Link
                            to={roleLabel.to}
                            className={`nb-menu-item d-flex align-items-center gap-2 px-3 py-2 text-decoration-none small fw-bold ${roleLabel.cls}`}
                          >
                            <span className="nb-mi-icon">⚡</span>
                            {roleLabel.label}
                          </Link>
                          <hr className="nb-divider my-0" />
                        </>
                      )}

                      {/* Standard links */}
                      {[
                        { icon: "👤", label: "Edit Account", to: "/profile" },
                        { icon: "📦", label: "My Orders",    to: "/orders/my" },
                        { icon: "⚙️", label: "Settings",     to: "/settings" },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="nb-menu-item d-flex align-items-center gap-2 px-3 py-2 text-decoration-none small fw-medium"
                        >
                          <span className="nb-mi-icon">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      <hr className="nb-divider my-0" />

                      <button
                        className="nb-menu-item nb-menu-logout d-flex align-items-center gap-2 px-3 py-2 w-100 border-0 bg-transparent text-start small fw-semibold"
                        onClick={handleLogout}
                      >
                        <span className="nb-mi-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest */
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="nb-login-btn text-decoration-none fw-semibold small px-3 py-2 rounded-pill border">
                  Login
                </Link>
                <Link to="/register" className="nb-signup-btn text-decoration-none fw-semibold small px-3 py-2 rounded-pill">
                  Sign Up
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
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  /* ══════════════════════════
     CSS VARIABLE TOKENS
     ThemeToggle sets data-theme="dark"|"light" on <html>
  ══════════════════════════ */
  :root,
  [data-theme="light"] {
    --nb-bg:            rgba(247, 246, 243, 0.88);
    --nb-border:        rgba(0, 0, 0, 0.09);
    --nb-text:          #111111;
    --nb-text-sub:      #777777;
    --nb-hover-bg:      rgba(0, 0, 0, 0.04);
    --nb-menu-bg:       #ffffff;
    --nb-menu-border:   #eeeae4;
    --nb-menu-shadow:   0 16px 48px rgba(0,0,0,0.12);
    --nb-menu-header:   #faf9f7;
    --nb-cart-bg:       #f0ede8;
    --nb-cart-text:     #111111;
    --nb-red:           #e53935;
    --nb-amber:         #f59e0b;
    --nb-divider-color: #f0ede8;
    --nb-item-hover:    #faf9f7;
  }

  [data-theme="dark"] {
    --nb-bg:            rgba(13, 13, 13, 0.88);
    --nb-border:        rgba(255, 255, 255, 0.08);
    --nb-text:          #f0efe9;
    --nb-text-sub:      #888888;
    --nb-hover-bg:      rgba(255, 255, 255, 0.06);
    --nb-menu-bg:       #1a1a1a;
    --nb-menu-border:   #2a2a2a;
    --nb-menu-shadow:   0 16px 48px rgba(0,0,0,0.55);
    --nb-menu-header:   #141414;
    --nb-cart-bg:       rgba(255, 255, 255, 0.07);
    --nb-cart-text:     #f0efe9;
    --nb-divider-color: #242424;
    --nb-item-hover:    #222222;
  }

  /* ── Shell — glass effect, sticky ── */
  .nb-nav {
    background: var(--nb-bg) !important;
    border-bottom: 1px solid var(--nb-border);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, border-color 0.2s;
    z-index: 1030;
  }

  /* container height */
  .nb-inner { height: 64px; }

  /* ── Brand ── */
  .nb-brand { transition: opacity 0.15s; }
  .nb-brand:hover { opacity: 0.75; }
  .nb-brand-icon { font-size: 22px; line-height: 1; }
  .nb-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--nb-text);
    letter-spacing: -0.03em;
  }

  /* ── Cart button ── */
  .nb-cart-btn {
    background: var(--nb-cart-bg);
    color: var(--nb-cart-text) !important;
    border: 1px solid var(--nb-border);
    transition: all 0.15s;
  }
  .nb-cart-btn:hover {
    background: var(--nb-red) !important;
    color: #fff !important;
    border-color: var(--nb-red) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(229,57,53,0.28);
  }

  /* hide "Cart" label on xs */
  @media (max-width: 499px) { .nb-cart-label { display: none !important; } }

  .nb-cart-badge {
    top: -7px !important;
    right: -7px !important;
    background: var(--nb-red);
    color: #fff;
    font-size: 0.6rem;
    font-weight: 800;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border: 2px solid var(--nb-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes badgePop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  /* ── Avatar trigger button ── */
  .nb-avatar-btn {
    background: var(--nb-hover-bg);
    border-color: var(--nb-border) !important;
    color: var(--nb-text);
    cursor: pointer;
    transition: all 0.15s;
  }
  .nb-avatar-btn:hover,
  .nb-avatar-btn.open {
    border-color: rgba(229,57,53,0.4) !important;
    box-shadow: 0 0 0 3px rgba(229,57,53,0.08) !important;
  }
  .nb-user-name {
    color: var(--nb-text);
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .nb-chevron { color: var(--nb-text-sub); transition: transform 0.2s; }
  .nb-chevron.flipped { transform: rotate(180deg); }

  /* ── Dropdown panel ── */
  .nb-menu {
    top: calc(100% + 10px);
    min-width: 240px;
    background: var(--nb-menu-bg);
    border: 1px solid var(--nb-menu-border);
    box-shadow: var(--nb-menu-shadow);
    animation: menuIn 0.18s cubic-bezier(0.16,1,0.3,1) both;
    z-index: 1050;
  }
  @keyframes menuIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .nb-menu-header { background: var(--nb-menu-header); }
  .nb-menu-name {
    font-family: 'Syne', sans-serif;
    color: var(--nb-text);
    letter-spacing: -0.02em;
  }
  .nb-menu-role { font-size: 0.72rem; color: var(--nb-text-sub); margin-top: 1px; }

  /* Override Bootstrap hr */
  .nb-divider {
    border-color: var(--nb-divider-color) !important;
    opacity: 1 !important;
    margin: 0 !important;
  }

  .nb-menu-item {
    color: var(--nb-text) !important;
    transition: background 0.12s;
    cursor: pointer;
  }
  .nb-menu-item:hover { background: var(--nb-item-hover) !important; }

  .nb-mi-icon { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }

  /* Role colours */
  .nb-role-admin       { color: var(--nb-red) !important; }
  .nb-role-restaurant  { color: var(--nb-amber) !important; }
  .nb-menu-logout      { color: var(--nb-red) !important; }

  /* ── Guest auth buttons ── */
  .nb-login-btn {
    color: var(--nb-text) !important;
    border-color: var(--nb-border) !important;
    font-size: 0.85rem;
    transition: all 0.15s;
  }
  .nb-login-btn:hover { background: var(--nb-hover-bg) !important; }

  .nb-signup-btn {
    background: var(--nb-red);
    color: #fff !important;
    font-size: 0.85rem;
    transition: all 0.15s;
    box-shadow: 0 2px 12px rgba(229,57,53,0.28);
  }
  .nb-signup-btn:hover {
    background: #c62828 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(229,57,53,0.36);
  }
`;