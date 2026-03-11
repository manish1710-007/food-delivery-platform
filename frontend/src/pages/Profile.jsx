import React, { useState } from "react";
import { useAuth } from "../auth/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sysLogs, setSysLogs] = useState(["> SYS_READY", "> AWAITING_INPUT..."]);

  // Mock form state (pre-filled with user data)
  const [form, setForm] = useState({
    name: user?.name || "GUEST_USER",
    email: user?.email || "guest@local.net",
    phone: "+91 0000000000",
    address: "Raipur, Chhattisgarh" 
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addLog = (msg) => {
    setSysLogs(prev => [...prev, msg].slice(-6)); // Keep last 6 logs
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    addLog("> INITIATING_DATA_OVERWRITE...");
    
    // Simulate API call
    setTimeout(() => {
      addLog("> UPLOADING_PAYLOAD...");
      setTimeout(() => {
        addLog("> OVERWRITE_SUCCESS [OK]");
        setLoading(false);
      }, 800);
    }, 600);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page pb-5">
        {/* Grid & Scanlines */}
        <div className="y2k-grid-bg"></div>
        <div className="scanlines"></div>

        <div className="container-fluid px-3 px-xl-4 position-relative z-1 pt-4 w-100">
          
          {/* Header */}
          <div className="y2k-title-bar d-flex justify-content-between align-items-center mb-4 p-2">
            <h1 className="y2k-title mb-0 fs-5 text-cyan d-flex align-items-center gap-2 m-0 p-2">
              <span className="blink">_</span> C:\USER\SYS_CONFIG.exe
            </h1>
            <span className="text-muted d-none d-sm-block small">
              [ ROOT_ACCESS: GRANTED ]
            </span>
          </div>

          <div className="row g-4 align-items-start">

            {/*  LEFT: Config Form  */}
            <div className="col-12 col-xl-8">
              
              <div className="y2k-wire-box border-cyan p-4">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-4">
                  <span className="text-cyan small">/// USER_DIRECTORY_RECORDS</span>
                </div>

                {/* Avatar / File Header */}
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-5 border-bottom-wire pb-4">
                  <div className="y2k-avatar-frame border-cyan p-1 flex-shrink-0">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=00e5ff&color=000&size=128&bold=true`} 
                      alt="Profile" 
                      className="w-100 h-100" 
                      style={{ filter: "grayscale(100%) contrast(1.5) sepia(1) hue-rotate(140deg)" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h2 className="text-main fw-bold m-0 fs-3">{form.name.toUpperCase()}</h2>
                    <p className="text-muted small mb-3 font-monospace">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    <button className="y2k-btn-outline text-cyan">
                      [ UPLOAD_SYS_IMG ]
                    </button>
                  </div>
                </div>

                {/* The Form */}
                <form onSubmit={handleSubmit} className="row g-4 font-monospace">
                  
                  {/* Name */}
                  <div className="col-md-6">
                    <label className="d-block text-muted small mb-1">&gt; USR_DEF (Name)</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">ID:</span>
                      <input 
                        type="text" name="name" 
                        className="y2k-input flex-grow-1 p-2" 
                        value={form.name} onChange={handleChange} required 
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="d-block text-muted small mb-1">&gt; NET_ADDR (Email)</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">@:</span>
                      <input 
                        type="email" name="email" 
                        className="y2k-input flex-grow-1 p-2" 
                        value={form.email} onChange={handleChange} required 
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="d-block text-muted small mb-1">&gt; COMM_LINK (Phone)</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">TEL:</span>
                      <input 
                        type="text" name="phone" 
                        className="y2k-input flex-grow-1 p-2" 
                        value={form.phone} onChange={handleChange} 
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="col-md-6">
                    <label className="d-block text-muted small mb-1">&gt; GEO_LOC (Address)</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">LOC:</span>
                      <input 
                        type="text" name="address" 
                        className="y2k-input flex-grow-1 p-2" 
                        value={form.address} onChange={handleChange} 
                      />
                    </div>
                  </div>

                  {/* Submit Action */}
                  <div className="col-12 mt-5 text-end border-top-wire pt-4">
                    <button type="submit" className="y2k-btn-magenta px-4 py-2" disabled={loading}>
                      {loading ? "[ PROCESSING... ]" : "[ OVERWRITE_DATA ]"}
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/*  RIGHT: System ID Card & Logs  */}
            <div className="col-12 col-xl-4 d-flex flex-column gap-4">
              
              {/* ID Badge Visual */}
              <div className="y2k-wire-box border-magenta p-0 overflow-hidden">
                <div className="bg-magenta text-dark p-2 text-center font-monospace fw-bold" style={{ fontSize: "0.8rem" }}>
                  IDENTIFICATION_BADGE
                </div>
                <div className="p-4 d-flex flex-column align-items-center gap-3">
                  
                  <div className="y2k-barcode w-100" style={{ height: "40px" }}></div>
                  
                  <div className="text-center w-100 font-monospace">
                    <div className="text-magenta fs-5">{form.name.toUpperCase()}</div>
                    <div className="text-muted small">LVL: CLEARANCE_04</div>
                  </div>

                  <div className="d-flex justify-content-between w-100 mt-2 pt-2 border-top-wire border-magenta text-muted" style={{ fontSize: "0.65rem" }}>
                    <span>ISSUED: {new Date().toISOString().split('T')[0]}</span>
                    <span>STATUS: <span className="text-cyan">ACTIVE</span></span>
                  </div>
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="y2k-wire-box border-cyan p-0 h-100 min-vh-25 d-flex flex-column">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan p-2">
                  <span className="text-cyan small">/// TERMINAL_OUTPUT</span>
                </div>
                
                <div className="p-3 font-monospace small flex-grow-1 d-flex flex-column justify-content-end" style={{ minHeight: "150px" }}>
                  {sysLogs.map((log, idx) => (
                    <div key={idx} className={log.includes("SUCCESS") || log.includes("[OK]") ? "text-magenta fw-bold" : "text-muted"}>
                      {log}
                    </div>
                  ))}
                  <div className="text-cyan mt-1"><span className="blink">_</span></div>
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
    --bg-color: #02060d; 
    --cyan: #00e5ff;
    --cyan-dim: rgba(0, 229, 255, 0.2);
    --cyan-glow: rgba(0, 229, 255, 0.5);
    --magenta: #ff0055;
    --magenta-dim: rgba(255, 0, 85, 0.2);
    --text-main: #e0e6ed;
    --text-muted: #5e7993;
    --wire-border: 1px solid var(--cyan-glow);
  }

  /* BASE STYLES */
  .y2k-page {
    font-family: 'Share Tech Mono', monospace;
    background-color: var(--bg-color);
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
    z-index: 0; pointer-events: none; opacity: 0.5;
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
  .bg-magenta { background-color: var(--magenta) !important; }
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border-color: var(--magenta) !important; border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  
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
  .y2k-title-bar {
    background: rgba(0, 229, 255, 0.05);
    border: var(--wire-border);
    font-family: 'DotGothic16', sans-serif;
  }

  /* PROFILE SPECIFIC */
  .y2k-avatar-frame {
    width: 100px; height: 100px;
    background: #000;
    position: relative;
  }
  .y2k-avatar-frame::after {
    content: ''; position: absolute; inset: 0;
    border: 1px solid var(--cyan);
    pointer-events: none;
  }

  /* Fake Barcode Generator using gradients */
  .y2k-barcode {
    background: repeating-linear-gradient(
      90deg,
      var(--magenta),
      var(--magenta) 2px,
      transparent 2px,
      transparent 5px,
      var(--magenta) 5px,
      var(--magenta) 8px,
      transparent 8px,
      transparent 10px
    );
    opacity: 0.8;
  }

  /* TERMINAL INPUTS */
  .y2k-input-group {
    background: rgba(0,0,0,0.6);
    border: 1px solid var(--cyan-glow);
    transition: all 0.2s;
  }
  .y2k-input-group:focus-within {
    border-color: var(--cyan);
    box-shadow: 0 0 10px var(--cyan-dim);
  }
  .y2k-input-prefix {
    font-size: 0.8rem;
    background: rgba(0, 229, 255, 0.05);
    min-width: 50px;
    text-align: center;
  }
  .y2k-input {
    background: transparent;
    border: none;
    color: var(--text-main);
    font-family: 'Share Tech Mono', monospace;
    outline: none;
    font-size: 0.9rem;
  }
  .y2k-input::placeholder { color: rgba(94, 121, 147, 0.4); }

  /* BUTTONS */
  .y2k-btn-outline {
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    transition: all 0.2s;
    font-size: 0.85rem;
    padding: 0;
  }
  .y2k-btn-outline:hover { color: #fff !important; text-shadow: 0 0 5px var(--cyan); }

  .y2k-btn-magenta {
    background: transparent;
    border: 1px solid var(--magenta);
    color: var(--magenta);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    transition: all 0.2s;
    font-size: 1.1rem;
    box-shadow: inset 0 0 10px rgba(255,0,85,0.1);
  }
  .y2k-btn-magenta:hover:not(:disabled) {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 15px var(--magenta-dim);
  }
  .y2k-btn-magenta:disabled {
    background: rgba(0,0,0,0.5);
    border-color: var(--text-muted);
    color: var(--text-muted);
    cursor: not-allowed;
  }
`;