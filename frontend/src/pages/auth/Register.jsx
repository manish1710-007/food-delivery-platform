import React, { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regLogs, setRegLogs] = useState([
    "> ESTABLISHING_NEW_NODE...",
    "> AWAITING_USR_DEF"
  ]);

  const addLog = (msg) => {
    setRegLogs(prev => [...prev, msg].slice(-5));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (Math.random() > 0.7) addLog(`> ALLOCATING_MEM: [${e.target.name.toUpperCase()}]`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    addLog("> GENERATING_NEW_IDENTITY...");

    try {
      await register(form);
      addLog("> IDENTITY_CREATED [OK]");
      
      // Artificial delay for aesthetic log reading
      setTimeout(() => {
        navigate("/");
      }, 800);
      
    } catch (err) {
      setError(err.response?.data?.message || "NODE_CREATION_FAILED");
      addLog("> SYS_ERR: INITIALIZATION_ABORTED");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="y2k-page container-fluid vh-100 p-0 overflow-hidden">
        
        {/* Global CRT Scanlines */}
        <div className="scanlines"></div>

        <div className="row g-0 h-100 position-relative z-1 flex-md-row-reverse">
          
          {/* ── RIGHT: Registration Console ── */}
          <div className="col-12 col-md-5 col-lg-4 d-flex flex-column justify-content-center align-items-center y2k-auth-panel border-start border-cyan position-relative">
            {/* Background Grid for the panel */}
            <div className="y2k-grid-bg"></div>

            <div className="w-100 p-4 p-md-5 position-relative z-1 overflow-auto h-100 d-flex flex-column justify-content-center" style={{ maxWidth: "450px" }}>
              
              {/* Header */}
              <div className="mb-4 text-start border-bottom-wire border-cyan pb-3">
                <div className="text-cyan font-monospace small mb-1">/// INITIALIZE_PROFILE.exe</div>
                <h2 className="y2k-title text-main m-0 fs-3">
                  SYS_REGISTER <span className="blink text-cyan">_</span>
                </h2>
              </div>

              {/* Error Output */}
              {error && (
                <div className="y2k-wire-box bg-magenta-dim border-magenta p-2 mb-4 text-magenta font-monospace small d-flex align-items-center gap-2">
                  <span className="fs-5">⚠</span>
                  <span>ERR: {error.toUpperCase()}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 text-start">
                
                {/* Name */}
                <div>
                  <label className="d-block text-muted small font-monospace mb-1">&gt; USR_DEF (Full Name)</label>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">NME:</span>
                    <input
                      type="text"
                      name="name"
                      className="y2k-input flex-grow-1 p-2"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="ENTER_DESIGNATION"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="d-block text-muted small font-monospace mb-1">&gt; NET_ADDR (Email)</label>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">@:</span>
                    <input
                      type="email"
                      name="email"
                      className="y2k-input flex-grow-1 p-2"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ENTER_NETWORK_ALIAS"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="d-block text-muted small font-monospace mb-1">&gt; CIPHER_KEY (Password)</label>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">KEY:</span>
                    <input
                      type="password"
                      name="password"
                      className="y2k-input flex-grow-1 p-2"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="d-block text-muted small font-monospace mb-1">&gt; SYS_PRIVILEGE (Role)</label>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">LVL:</span>
                    <select
                      name="role"
                      className="y2k-input flex-grow-1 p-2 y2k-select"
                      value={form.role}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="customer">ROOT_USER (Customer)</option>
                      <option value="restaurant">HOST_NODE (Restaurant)</option>
                      <option value="driver">PACKET_ROUTER (Driver)</option>
                    </select>
                  </div>
                </div>

                {/* Terminal Log Output */}
                <div className="y2k-wire-box border-cyan p-2 font-monospace text-muted mt-2" style={{ fontSize: "0.65rem", height: "75px", overflow: "hidden" }}>
                  {regLogs.map((log, i) => (
                    <div key={i} className={log.includes("ERR") ? "text-magenta" : log.includes("[OK]") ? "text-cyan fw-bold" : ""}>
                      {log}
                    </div>
                  ))}
                  <div className="text-cyan mt-1"><span className="blink">_</span></div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="y2k-btn-magenta w-100 py-3 mt-1 d-flex justify-content-center align-items-center"
                  disabled={loading}
                >
                  {loading ? "[ COMPILING_DATA... ]" : "[ INITIALIZE_PROFILE ]"}
                </button>
              </form>

              <div className="text-center font-monospace mt-4 small border-top-wire border-cyan pt-3">
                <span className="text-muted">NODE_ALREADY_EXISTS? </span>
                <Link to="/login" className="text-cyan text-decoration-none fw-bold hover-glow">
                  [ ESTABLISH_LINK ]
                </Link>
              </div>

            </div>
          </div>

          {/* ── LEFT: System Visual (Hidden on mobile) ── */}
          <div className="col-md-7 col-lg-8 d-none d-md-block position-relative y2k-hero-panel bg-dark overflow-hidden">
            
            {/* The Image generated previously */}
            <img
              src="/y2k_FoodDash_R.png"
              alt="Initialize Identity"
              className="w-100 h-100"
              style={{ objectFit: "cover", opacity: 0.85 }}
            />

            {/* Tactical Overlay Elements */}
            <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none p-4 d-flex flex-column justify-content-between">
              
              {/* Top Left HUD (Moved to left since panel is on the left now) */}
              <div className="text-start font-monospace text-cyan small opacity-75">
                <div>SYS_TIME: {new Date().toISOString().split('T')[1].substring(0, 8)}</div>
                <div>NODE: UNKNOWN</div>
                <div>STATUS: UNREGISTERED</div>
              </div>

              {/* Center Crosshair */}
              <div className="crosshair-center"></div>

              {/* Bottom Right Fake Boot Text */}
              <div className="text-end font-monospace text-cyan small opacity-75 d-flex flex-column align-items-end" style={{ fontSize: "0.7rem", textShadow: "0 0 5px rgba(0, 229, 255, 0.5)" }}>
                <div> ALLOCATING_MEMORY... [OK]</div>
                <div> GENERATING_USR_ID... [PENDING]</div>
                <div> WAITING_FOR_DATA_STREAM...</div>
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
    background-color: var(--bg-color);
  }

  .y2k-auth-panel {
    background-color: var(--panel-bg);
    box-shadow: -10px 0 30px rgba(0,0,0,0.8);
  }
  
  .y2k-hero-panel {
    background-color: #000;
  }

  /* GRID & OVERLAYS */
  .y2k-grid-bg {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
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
  
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  .hover-glow:hover { text-shadow: 0 0 8px var(--cyan); }

  /* WIREFRAME BOXES */
  .y2k-wire-box {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: var(--wire-border);
    position: relative;
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 6px; height: 6px; 
    border: 1px solid var(--cyan); pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  .y2k-wire-box.border-magenta::before, .y2k-wire-box.border-magenta::after { border-color: var(--magenta); }

  /* TYPOGRAPHY */
  .y2k-title {
    font-family: 'DotGothic16', sans-serif;
  }

  /* TERMINAL INPUTS */
  .y2k-input-group {
    background: rgba(0,0,0,0.8);
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
    font-size: 0.95rem;
  }
  .y2k-input::placeholder { color: rgba(94, 121, 147, 0.4); font-size: 0.8rem; }

  /* Select specific styling to remove default dropdown arrows */
  .y2k-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
  }
  .y2k-select option {
    background: var(--panel-bg);
    color: var(--text-main);
  }

  /* BUTTONS */
  .y2k-btn-magenta {
    background: rgba(255, 0, 85, 0.1);
    border: 2px solid var(--magenta);
    color: var(--magenta);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    transition: all 0.2s;
    font-size: 1.1rem;
    box-shadow: inset 0 0 10px rgba(255,0,85,0.2);
    letter-spacing: 1px;
  }
  .y2k-btn-magenta:hover:not(:disabled) {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 20px var(--magenta-dim);
    text-shadow: none;
  }
  .y2k-btn-magenta:disabled {
    background: rgba(0,0,0,0.5);
    border-color: var(--text-muted);
    color: var(--text-muted);
    cursor: not-allowed;
    text-shadow: none;
    box-shadow: none;
  }

  /* HUD CROSSHAIR */
  .crosshair-center {
    position: absolute; width: 60px; height: 60px;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    border: 1px solid var(--cyan-glow); z-index: 2; pointer-events: none;
  }
  .crosshair-center::before { content: ''; position: absolute; top: 50%; left: -20px; right: -20px; height: 1px; background: var(--cyan-glow); }
  .crosshair-center::after { content: ''; position: absolute; left: 50%; top: -20px; bottom: -20px; width: 1px; background: var(--cyan-glow); }
`;