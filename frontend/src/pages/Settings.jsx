import React, { useState } from "react";

export default function Settings() {
  const [logs, setLogs] = useState([
    "> KERNEL_LOADED [OK]",
    "> CONTROL_PANEL_MOUNTED",
    "> AWAITING_SYS_ADMIN_INPUT..."
  ]);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [prefs, setPrefs] = useState({
    email: true,
    sms: true,
    promo: false
  });

  const [loading, setLoading] = useState(false);

  // Helper to add terminal logs
  const addLog = (msg) => {
    setLogs(prev => [...prev, msg].slice(-8));
  };

  const handlePwChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (Math.random() > 0.7) addLog(`> CIPHER_INPUT_DETECTED [${e.target.name.toUpperCase()}]`);
  };

  const handlePwUpdate = () => {
    setLoading(true);
    addLog("> VALIDATING_NEW_CIPHER...");
    setTimeout(() => {
      setLoading(false);
      addLog("> CIPHER_OVERWRITE_SUCCESS [OK]");
      setPasswords({ current: "", new: "", confirm: "" });
    }, 1200);
  };

  const handleToggle = (key) => {
    const newState = !prefs[key];
    setPrefs({ ...prefs, [key]: newState });
    addLog(`> OVERRIDE_PREF: [${key.toUpperCase()}] -> ${newState ? "ENABLED" : "DISABLED"}`);
  };

  const handlePurge = () => {
    addLog("> WARN: PURGE_COMMAND_INITIATED");
    if(window.confirm("SYS_WARN: IRREVERSIBLE ACTION. Are you absolutely sure you want to purge your data?")) {
      addLog("> FATAL: EXECUTING_DATA_PURGE...");
      
    } else {
      addLog("> PURGE_ABORTED_BY_USER");
    }
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
              <span className="blink">_</span> C:\SYS\CONTROL_PANEL.exe
            </h1>
            <span className="text-muted d-none d-sm-block small">
              [ PRIVILEGE: SYS_ADMIN ]
            </span>
          </div>

          <div className="row g-4 align-items-start">

            {/*  LEFT: Config Options  */}
            <div className="col-12 col-xl-8 d-flex flex-column gap-4">

              {/* Security Section */}
              <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-4">
                  <span className="text-cyan small fw-bold">/// SECURITY_PROTOCOLS</span>
                  <span className="text-muted small">ENCRYPTION: AES-256</span>
                </div>

                <div className="mb-4">
                  <label className="d-block text-muted small mb-1">&gt; CURRENT_CIPHER</label>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">KEY:</span>
                    <input 
                      type="password" name="current" 
                      className="y2k-input flex-grow-1 p-2" 
                      placeholder="[ ENTER_CURRENT_PASSWORD ]"
                      value={passwords.current} onChange={handlePwChange} 
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="d-block text-muted small mb-1">&gt; NEW_CIPHER</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">NEW:</span>
                      <input 
                        type="password" name="new" 
                        className="y2k-input flex-grow-1 p-2" 
                        placeholder="[ ENTER_NEW_PASSWORD ]"
                        value={passwords.new} onChange={handlePwChange} 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="d-block text-muted small mb-1">&gt; VERIFY_CIPHER</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">CHK:</span>
                      <input 
                        type="password" name="confirm" 
                        className="y2k-input flex-grow-1 p-2" 
                        placeholder="[ RE-ENTER_PASSWORD ]"
                        value={passwords.confirm} onChange={handlePwChange} 
                      />
                    </div>
                  </div>
                </div>

                <div className="text-end border-top-wire pt-3">
                  <button 
                    className="y2k-btn-outline text-cyan px-4 py-2 fw-bold"
                    onClick={handlePwUpdate}
                    disabled={loading || !passwords.current || !passwords.new}
                  >
                    {loading ? "[ REWRITING_BLOCKS... ]" : "[ OVERWRITE_CIPHER ]"}
                  </button>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-4">
                  <span className="text-cyan small fw-bold">/// SYSTEM_PREFERENCES</span>
                  <span className="text-muted small">COMM_CHANNELS</span>
                </div>

                <div className="d-flex flex-column gap-3 font-monospace">
                  
                  {/* Email Toggle */}
                  <div className="d-flex justify-content-between align-items-center p-2 border-cyan" style={{ border: "1px solid rgba(0, 229, 255, 0.1)", background: "rgba(0,0,0,0.3)" }}>
                    <div className="overflow-hidden pe-3">
                      <div className="text-main fw-bold">&gt; NET_RECEIPTS (Email)</div>
                      <div className="text-muted small text-truncate">TRANSMIT_INVOICE_LOGS_TO_MAIL_SERVER</div>
                    </div>
                    <button 
                      className={`y2k-toggle-btn flex-shrink-0 ${prefs.email ? 'active' : ''}`}
                      onClick={() => handleToggle('email')}
                    >
                      {prefs.email ? '[ ENABLED ]' : '[ DISABLED ]'}
                    </button>
                  </div>

                  {/* SMS Toggle */}
                  <div className="d-flex justify-content-between align-items-center p-2 border-cyan" style={{ border: "1px solid rgba(0, 229, 255, 0.1)", background: "rgba(0,0,0,0.3)" }}>
                    <div className="overflow-hidden pe-3">
                      <div className="text-main fw-bold">&gt; MOBILE_ALERTS (SMS)</div>
                      <div className="text-muted small text-truncate">PING_CELLULAR_NETWORK_ON_PROXIMITY</div>
                    </div>
                    <button 
                      className={`y2k-toggle-btn flex-shrink-0 ${prefs.sms ? 'active' : ''}`}
                      onClick={() => handleToggle('sms')}
                    >
                      {prefs.sms ? '[ ENABLED ]' : '[ DISABLED ]'}
                    </button>
                  </div>

                  {/* Promo Toggle */}
                  <div className="d-flex justify-content-between align-items-center p-2 border-cyan" style={{ border: "1px solid rgba(0, 229, 255, 0.1)", background: "rgba(0,0,0,0.3)" }}>
                    <div className="overflow-hidden pe-3">
                      <div className="text-main fw-bold">&gt; VENDOR_BROADCASTS (Promo)</div>
                      <div className="text-muted small text-truncate">ALLOW_INCOMING_COMMERCIAL_TRANSMISSIONS</div>
                    </div>
                    <button 
                      className={`y2k-toggle-btn flex-shrink-0 ${prefs.promo ? 'active' : ''}`}
                      onClick={() => handleToggle('promo')}
                    >
                      {prefs.promo ? '[ ENABLED ]' : '[ DISABLED ]'}
                    </button>
                  </div>

                </div>
              </div>

              {/* Danger Zone */}
              <div className="y2k-wire-box border-magenta p-3 p-md-4 text-start bg-magenta-dim">
                <div className="d-flex justify-content-between border-bottom-wire border-magenta pb-2 mb-3">
                  <span className="text-magenta small fw-bold blink">/// CRITICAL_SYS_FAILURE (DANGER)</span>
                </div>
                <div className="mb-4">
                  <div className="text-magenta fw-bold fs-5 mb-1">TERMINATE_ACCOUNT</div>
                  <div className="text-magenta small font-monospace" style={{ opacity: 0.8 }}>
                    SYS_WARN: EXECUTING THIS COMMAND WILL PERMANENTLY PURGE ALL USER DATA, TRANSACTION LOGS, AND CLEARANCES FROM THE MAINFRAME. THIS REVERSAL IS IMPOSSIBLE.
                  </div>
                </div>
                <div>
                  <button className="y2k-btn-magenta w-100 py-3 d-flex justify-content-center align-items-center gap-2" onClick={handlePurge}>
                    <span className="fs-4">⚠</span> [ PURGE_USER_DATA ]
                  </button>
                </div>
              </div>

            </div>

            {/*  RIGHT: Diagnostic & Event Logs  */}
            <div className="col-12 col-xl-4 d-none d-lg-block">
              <div className="position-sticky" style={{ top: "80px" }}>
                
                {/* Hardware Monitor */}
                <div className="y2k-wire-box border-cyan p-4 mb-4 text-start">
                  <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                    <span className="text-cyan small">/// HARDWARE_MONITOR</span>
                  </div>
                  
                  <div className="d-flex flex-column gap-3 font-monospace small">
                    <div>
                      <div className="d-flex justify-content-between text-muted mb-1">
                        <span>CPU_TEMP</span>
                        <span className="text-cyan">42°C</span>
                      </div>
                      <div className="y2k-progress-bar"><div className="y2k-progress-fill" style={{width: '35%'}}></div></div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between text-muted mb-1">
                        <span>MEM_USAGE</span>
                        <span className="text-cyan">6.4/16 GB</span>
                      </div>
                      <div className="y2k-progress-bar"><div className="y2k-progress-fill" style={{width: '40%'}}></div></div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between text-muted mb-1">
                        <span>NET_TRAFFIC</span>
                        <span className="text-magenta">↑ 12Kbps ↓ 4Kbps</span>
                      </div>
                      <div className="y2k-progress-bar border-magenta"><div className="y2k-progress-fill bg-magenta" style={{width: '12%'}}></div></div>
                    </div>
                  </div>
                </div>

                {/* Event Log Terminal */}
                <div className="y2k-wire-box border-cyan p-0 h-100 d-flex flex-column text-start">
                  <div className="bg-cyan text-dark p-1 text-center font-monospace fw-bold" style={{ fontSize: "0.8rem" }}>
                    EVENT_LOGGER.sys
                  </div>
                  <div className="p-3 font-monospace small flex-grow-1 d-flex flex-column justify-content-end overflow-hidden" style={{ minHeight: "250px" }}>
                    {logs.map((log, idx) => (
                      <div key={idx} className={`mb-1 ${log.includes("WARN") || log.includes("FATAL") ? "text-magenta fw-bold" : log.includes("[OK]") ? "text-cyan fw-bold" : "text-muted"}`}>
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
    --magenta-dim: rgba(255, 0, 85, 0.1);
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
  .text-magenta { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255,0,85,0.4); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan { background-color: var(--cyan) !important; color: #000 !important; }
  .bg-magenta { background-color: var(--magenta) !important; color: #fff !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  
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

  /* TOGGLE BUTTONS (Replaces Form Switches) */
  .y2k-toggle-btn {
    background: rgba(0,0,0,0.6);
    border: 1px solid var(--text-muted);
    color: var(--text-muted);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.2s;
    width: 120px;
    text-align: center;
  }
  .y2k-toggle-btn.active {
    background: var(--cyan-dim);
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: 0 0 8px var(--cyan-dim);
  }
  .y2k-toggle-btn:hover {
    border-color: var(--cyan);
  }

  /* BUTTONS */
  .y2k-btn-outline {
    background: transparent;
    border: 1px solid var(--cyan);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    transition: all 0.2s;
    font-size: 0.85rem;
  }
  .y2k-btn-outline:hover:not(:disabled) { 
    background: var(--cyan);
    color: #000 !important;
    text-shadow: none;
    box-shadow: 0 0 10px var(--cyan-dim);
  }
  .y2k-btn-outline:disabled {
    border-color: var(--text-muted);
    color: var(--text-muted) !important;
    cursor: not-allowed;
  }

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
  }
  .y2k-btn-magenta:hover {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 20px var(--magenta-dim);
    text-shadow: none;
  }

  /* PROGRESS BARS */
  .y2k-progress-bar { width: 100%; height: 6px; border: 1px solid var(--cyan-glow); background: #000; padding: 1px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); }
`;