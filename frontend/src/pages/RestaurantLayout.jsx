import { Link, Outlet, useLocation } from "react-router-dom";

export default function RestaurantLayout() {
  const location = useLocation();

  const navLinks = [
    { path: "dashboard", label: "Dashboard" },
    { path: "orders", label: "Orders" },
    { path: "menu", label: "Menu" },
    { path: "profile", label: "Profile" },
    { path: "analytics", label: "Analytics" },
  ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <>
      <style>{styles}</style>

      <div className="layout-root">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            <span className="blink">_</span> HOST_NODE
          </div>

          <div className="nav">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={`/restaurant/${link.path}`}
                  className={`nav-item ${active ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Area */}
        <div className="main">

          {/* Top Bar */}
          <div className="topbar">
            <div className="status">
              ● SYSTEM ACTIVE
            </div>

            <div className="user">
              ROOT_USER
            </div>
          </div>

          {/* Content */}
          <div className="content">
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
    --bg: #010308;
    --panel: #02060d;
    --cyan: #00e5ff;
    --cyan-dim: rgba(0,229,255,0.1);
    --text: #e0e6ed;
    --muted: #5e7993;
  }

  body {
    margin: 0;
  }

  .layout-root {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Share Tech Mono', monospace;
    color: var(--text);
  }

  /* SIDEBAR */
  .sidebar {
    width: 220px;
    background: var(--panel);
    border-right: 1px solid rgba(0,229,255,0.2);
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .logo {
    font-size: 18px;
    color: var(--cyan);
    margin-bottom: 30px;
  }

  .nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .nav-item {
    padding: 10px;
    text-decoration: none;
    color: var(--muted);
    border: 1px solid transparent;
    transition: 0.2s;
  }

  .nav-item:hover {
    background: var(--cyan-dim);
    color: var(--text);
  }

  .nav-item.active {
    border: 1px solid var(--cyan);
    color: var(--cyan);
    background: var(--cyan-dim);
  }

  /* MAIN */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* TOPBAR */
  .topbar {
    height: 60px;
    border-bottom: 1px solid rgba(0,229,255,0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: var(--panel);
  }

  .status {
    color: var(--cyan);
    font-size: 14px;
  }

  .user {
    color: var(--muted);
    font-size: 14px;
  }

  /* CONTENT */
  .content {
    padding: 20px;
  }

  .blink {
    animation: blink 1s infinite;
  }

  @keyframes blink {
    50% { opacity: 0; }
  }
`;