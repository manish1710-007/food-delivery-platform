import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // Enhanced admin modules with Y2K terminal flavor
  const adminModules = [
    { 
      title: "ANALYTICS.exe", 
      path: "/admin/analytics", 
      icon: "[ 📈 ]", 
      desc: "MONITOR_TRAFFIC_&_REVENUE",
      pid: "0x0A94",
      status: "ACTIVE"
    },
    { 
      title: "RESTAURANTS.sys", 
      path: "/admin/restaurants", 
      icon: "[ 🏪 ]", 
      desc: "MANAGE_HOST_NODES",
      pid: "0x1B3D",
      status: "ACTIVE"
    },
    { 
      title: "PRODUCTS.dat", 
      path: "/admin/products", 
      icon: "[ 🍔 ]", 
      desc: "GLOBAL_ASSET_REGISTRY",
      pid: "0x7C2E",
      status: "STABLE"
    },
    { 
      title: "ORDERS.log", 
      path: "/admin/orders", 
      icon: "[ 🛵 ]", 
      desc: "TRACK_LIVE_TRANSMISSIONS",
      pid: "0x9F41",
      status: "ACTIVE"
    },
    { 
      title: "USERS.db", 
      path: "/admin/users", 
      icon: "[ 👥 ]", 
      desc: "NETWORK_IDENTITY_CONTROL",
      pid: "0x3D8C",
      status: "LOCKED"
    },
  ];

  // Fake live server logs
  const [logs, setLogs] = useState([
    "> ROOT_LOGIN_DETECTED",
    "> AUTH_KEY: VALID",
    "> MOUNTING_CORE_FILESYSTEM...",
    "> SECURE_CONNECTION_ESTABLISHED"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        "> PING raipur.node.local ... [OK]",
        "> INCOMING_PACKET_DETECTED",
        "> SYNCING_DB_CLUSTER...",
        "> MEMORY_ALLOCATION_OPTIMIZED",
        "> BACKGROUND_WORKER_ALIVE"
      ];
      const newLog = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => [...prev, newLog].slice(-8)); // Keep last 8 logs
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page pb-5">
        {/* Grid & Scanlines */}
        <div className="y2k-grid-bg"></div>
        <div className="scanlines"></div>

        <div className="container-fluid px-3 px-xl-4 position-relative z-1 pt-4 w-100">

          {/* Header HUD */}
          <div className="y2k-wire-box border-magenta d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 p-3 bg-magenta-dim text-start">
            <div>
              <h1 className="y2k-title mb-1 fs-3 text-magenta d-flex align-items-center gap-2 m-0 text-shadow-magenta">
                <span className="blink">_</span> SYS_ADMIN_MAINFRAME
              </h1>
              <div className="text-magenta small font-monospace opacity-75">
                ROOT_DIRECTORY: C:\SERVER\CONTROL_CENTER\&gt;
              </div>
            </div>
            
            <div className="d-flex gap-4 mt-3 mt-md-0 font-monospace small">
              <div className="d-flex flex-column text-end">
                <span className="text-muted">SYS_UPTIME</span>
                <span className="text-cyan">99.999%</span>
              </div>
              <div className="d-flex flex-column text-end">
                <span className="text-muted">ACTIVE_NODES</span>
                <span className="text-cyan">1,024</span>
              </div>
              <div className="d-flex flex-column text-end">
                <span className="text-muted">SECURITY</span>
                <span className="text-magenta blink">GOD_MODE</span>
              </div>
            </div>
          </div>

          <div className="row g-4 align-items-start">

            {/*  LEFT: Core Modules Grid   */}
            <div className="col-12 col-xl-9">
              <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                <span className="text-cyan small font-monospace">/// EXECUTABLE_MODULES</span>
                <span className="text-cyan small font-monospace">TOTAL_MODULES: {adminModules.length}</span>
              </div>

              <div className="row g-4">
                {adminModules.map((mod, index) => (
                  <div className="col-lg-6 col-xl-4" key={index}>
                    <Link to={mod.path} className="text-decoration-none">
                      <div className="y2k-wire-box y2k-admin-card border-cyan p-3 h-100 d-flex flex-column justify-content-between transition-all">
                        
                        {/* Card Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3 border-bottom-wire pb-2">
                          <div className="text-cyan fs-3">{mod.icon}</div>
                          <div className="text-end">
                            <div className="text-muted small font-monospace">PID: {mod.pid}</div>
                            <div className="text-magenta small font-monospace" style={{ fontSize: "0.65rem" }}>
                              [{mod.status}]
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div>
                          <h4 className="text-main fw-bold m-0 fs-5 font-monospace">{mod.title}</h4>
                          <p className="text-muted small mt-2 mb-0 font-monospace opacity-75">
                            &gt; {mod.desc}
                          </p>
                        </div>
                        
                        {/* Fake Loading Bar */}
                        <div className="mt-3">
                          <div className="y2k-progress-bar border-cyan" style={{ height: "4px" }}>
                            <div className="bg-cyan h-100" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/*  RIGHT: System Diagnostics & Logs  */}
            <div className="col-12 col-xl-3 d-none d-xl-block">
              <div className="position-sticky" style={{ top: "80px" }}>
                
                {/* Global Network Visual */}
                <div className="y2k-wire-box border-cyan p-3 mb-4 text-start">
                  <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                    <span className="text-cyan small font-monospace">/// GLOBAL_NETWORK_MAP</span>
                  </div>
                  
                  <div className="position-relative w-100 d-flex align-items-center justify-content-center border-cyan" style={{ height: "160px", border: "1px solid", background: "rgba(0, 229, 255, 0.05)", overflow: "hidden" }}>
                    {/* Fake Radar Grid */}
                    <div className="y2k-radar-grid position-absolute w-100 h-100"></div>
                    <div className="y2k-radar-sweep"></div>
                    
                    {/* Fake Nodes */}
                    <div className="position-absolute bg-magenta shadow-magenta rounded-circle" style={{ width: "6px", height: "6px", top: "30%", left: "40%" }}></div>
                    <div className="position-absolute bg-cyan shadow-cyan rounded-circle" style={{ width: "4px", height: "4px", top: "60%", right: "20%" }}></div>
                    <div className="position-absolute bg-cyan shadow-cyan rounded-circle blink" style={{ width: "5px", height: "5px", bottom: "30%", left: "60%" }}></div>

                    <div className="position-absolute bottom-0 start-0 p-1 text-cyan font-monospace" style={{ fontSize: "0.6rem" }}>
                      TGT: ROOT_CLUSTER
                    </div>
                  </div>
                </div>

                {/* Server Event Logger */}
                <div className="y2k-wire-box border-magenta p-0 h-100 d-flex flex-column text-start bg-magenta-dim">
                  <div className="bg-magenta text-dark p-1 px-3 text-start font-monospace fw-bold" style={{ fontSize: "0.8rem" }}>
                    MAINFRAME_SYS_LOGS
                  </div>
                  <div className="p-3 font-monospace small flex-grow-1 d-flex flex-column justify-content-end overflow-hidden" style={{ minHeight: "300px", fontSize: "0.7rem" }}>
                    {logs.map((log, idx) => (
                      <div key={idx} className={`mb-1 ${log.includes("ROOT") || log.includes("GOD_MODE") ? "text-magenta fw-bold" : log.includes("[OK]") ? "text-cyan" : "text-muted"}`}>
                        {log}
                      </div>
                    ))}
                    <div className="text-magenta mt-1"><span className="blink">_</span></div>
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
    --panel-bg: #02060d;
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.2);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.1);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  /* BASE STYLES */
  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background: 
      linear-gradient(rgba(1, 3, 10, 0.8), rgba(1, 3, 10, 0.85)),
      url('/y2k_fooddash_bg.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    
    min-height: 100vh;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  /* GRID & OVERLAYS */
  .y2k-grid-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(var(--cyan-dim) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0; pointer-events: none; opacity: 0.4;
  }

  .scanlines {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
    background-size: 100% 4px; z-index: 9999; pointer-events: none; opacity: 0.6;
  }

  /* UTILS */
  .text-cyan { color: var(--cyan) !important; }
  .text-magenta { color: var(--magenta) !important; }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan { background-color: var(--cyan) !important; color: #000 !important; }
  .bg-magenta { background-color: var(--magenta) !important; color: #fff !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  
  .text-shadow-magenta { text-shadow: 0 0 8px rgba(255, 0, 85, 0.6); }
  .shadow-cyan { box-shadow: 0 0 8px var(--cyan); }
  .shadow-magenta { box-shadow: 0 0 8px var(--magenta); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  /* WIREFRAME BOXES */
  .y2k-wire-box {
    background: rgba(2, 6, 13, 0.85);
    backdrop-filter: blur(4px);
    border: var(--wire-border);
    position: relative;
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 8px; height: 8px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  .y2k-wire-box.border-magenta::before, .y2k-wire-box.border-magenta::after { border-color: var(--magenta); }

  /* TYPOGRAPHY */
  .y2k-title {
    font-family: 'DotGothic16', sans-serif;
  }

  /* ADMIN CARDS */
  .y2k-admin-card {
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }
  .y2k-admin-card:hover {
    background: var(--cyan-dim);
    box-shadow: inset 0 0 20px rgba(0, 229, 255, 0.15);
    border-color: var(--cyan);
    transform: translateY(-2px);
  }
  .y2k-admin-card:hover .text-main {
    color: var(--cyan) !important;
    text-shadow: 0 0 5px var(--cyan);
  }
  
  /* RADAR CSS */
  .y2k-radar-grid {
    background-image: 
      linear-gradient(var(--cyan-dim) 1px, transparent 1px),
      linear-gradient(90deg, var(--cyan-dim) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center;
  }
  .y2k-radar-sweep {
    position: absolute; width: 140px; height: 140px;
    border-radius: 50%; border: 1px dashed var(--cyan-glow);
    animation: spin 3s linear infinite;
  }
  .y2k-radar-sweep::before {
    content: ''; position: absolute; top: 0; left: 50%; width: 50%; height: 50%;
    background: linear-gradient(90deg, transparent, var(--cyan-glow));
    transform-origin: bottom left;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;