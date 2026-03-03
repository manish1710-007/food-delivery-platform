import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [logs, setLogs] = useState([
    "> INITIALIZING_TAXONOMY_MODULE...", 
    "> ROOT_DIR_MOUNTED",
    "> AWAITING_ADMIN_INPUT..."
  ]);

  const addLog = useCallback((msg) => {
    setLogs(prev => [...prev, msg].slice(-7)); // Keep last 7 logs
  }, []);

  const load = useCallback(async () => {
    try {
        const res = await api.get("/categories");
        setCategories(res.data);
    } catch (err) { 
        console.error(err); 
        addLog("> SYS_ERR: FAILED_TO_FETCH_NODES");
    }
  }, [addLog]);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if(!name.trim()) return addLog("> WARN: EMPTY_STRING_REJECTED");
    const tag = name.toUpperCase();
    addLog(`> EXEC: MKDIR [${tag}]`);
    
    try {
      await api.post("/categories", { name });
      addLog(`> WRITE_SUCCESS: NODE_ALLOCATED`);
      setName("");
      load();
    } catch (err) {
      addLog("> SYS_ERR: WRITE_OPERATION_FAILED", err);
    }
  };

  const remove = async (id, catName) => {
    addLog(`> EXEC: PURGE_NODE [${catName.toUpperCase()}]`);
    try {
      await api.delete("/categories/" + id);
      addLog(`> MEMORY_FREED: ROW_DELETED`);
      load();
    } catch (err) {
      addLog("> SYS_ERR: PURGE_OPERATION_FAILED", err);
    }
  };

  // Generate fake hex memory addresses for the visualizer
  const memoryBlocks = Array.from({ length: 64 });

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
              <h1 className="y2k-title mb-1 fs-4 text-magenta d-flex align-items-center gap-2 m-0 text-shadow-magenta">
                <span className="blink">_</span> SYS_TAXONOMY // DIRECTORY_MANAGER
              </h1>
              <div className="text-magenta small font-monospace opacity-75">
                ACCESS_LEVEL: GOD_MODE
              </div>
            </div>
            <div className="text-end font-monospace small text-cyan mt-2 mt-md-0">
              <div>ALLOCATED_TAGS: {categories.length}</div>
              <div>FREE_BLOCKS: {1024 - categories.length}</div>
            </div>
          </div>

          <div className="row g-4 align-items-start">

            {/* ── LEFT: Command Input & Logs (col-xl-5) ── */}
            <div className="col-12 col-xl-5">
              <div className="position-sticky" style={{ top: "80px" }}>
                
                {/* Input Panel */}
                <div className="y2k-wire-box border-cyan p-4 mb-4 text-start">
                  <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-4">
                    <span className="text-cyan small font-monospace">/// REGISTER_NEW_NODE</span>
                  </div>

                  <div className="mb-4">
                    <label className="d-block text-muted small font-monospace mb-1">&gt; TAG_IDENTIFIER</label>
                    <div className="y2k-input-group d-flex">
                      <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan text-uppercase">C:\&gt;</span>
                      <input 
                        className="y2k-input flex-grow-1 p-2" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && create()}
                        placeholder="ENTER_CATEGORY_NAME..." 
                      />
                    </div>
                  </div>

                  <button className="y2k-btn-magenta w-100 py-3" onClick={create}>
                    [ EXECUTE: WRITE_TO_DISK ]
                  </button>
                </div>

                {/* System Event Logger */}
                <div className="y2k-wire-box border-cyan p-0 d-flex flex-column text-start" style={{ height: "220px" }}>
                  <div className="bg-cyan text-dark p-1 px-3 text-start font-monospace fw-bold" style={{ fontSize: "0.8rem" }}>
                    TRANSACTION_LOG.sys
                  </div>
                  <div className="p-3 font-monospace small flex-grow-1 d-flex flex-column justify-content-end overflow-hidden" style={{ fontSize: "0.75rem" }}>
                    {logs.map((log, idx) => (
                      <div key={idx} className={`mb-1 text-truncate ${log.includes("ERR") || log.includes("WARN") || log.includes("PURGE") ? "text-magenta fw-bold" : log.includes("SUCCESS") ? "text-cyan fw-bold" : "text-muted"}`}>
                        {log}
                      </div>
                    ))}
                    <div className="text-cyan mt-1"><span className="blink">_</span></div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── RIGHT: Data Grid & Visualizer (col-xl-7) ── */}
            <div className="col-12 col-xl-7">
              
              {/* Fake Memory Visualizer */}
              <div className="y2k-wire-box border-magenta p-3 mb-4 d-none d-md-block text-start">
                <div className="text-magenta small font-monospace mb-2">/// DATA_BLOCK_ALLOCATION_MAP</div>
                <div className="d-flex flex-wrap gap-1">
                  {memoryBlocks.map((_, i) => (
                    <div 
                      key={i} 
                      className={`y2k-mem-block ${i < categories.length ? 'allocated blink-slow' : 'free'}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* The Actual Category List */}
              <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                  <span className="text-cyan small font-monospace">/// GLOBAL_TAXONOMY_INDEX</span>
                </div>

                {categories.length === 0 ? (
                  <div className="text-center p-5 text-muted font-monospace">
                    [ DIR_EMPTY: NO_NODES_FOUND ]
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {categories.map((cat, i) => (
                      <div key={cat._id} className="y2k-data-row d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-2 px-3 border-cyan">
                        
                        <div className="d-flex align-items-center gap-3 overflow-hidden mb-2 mb-sm-0">
                          <span className="text-cyan font-monospace small opacity-50 flex-shrink-0">
                            0x{i.toString(16).padStart(4, '0').toUpperCase()}
                          </span>
                          <span className="text-main fw-bold font-monospace text-truncate fs-5">
                            {cat.name.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3 flex-shrink-0">
                          <span className="text-muted small font-monospace d-none d-md-inline">
                            ID:{cat._id.slice(-6).toUpperCase()}
                          </span>
                          <button 
                            className="y2k-btn-outline-danger font-monospace px-3 py-1" 
                            onClick={() => remove(cat._id, cat.name)}
                          >
                            [ PURGE ]
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
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
    --magenta-dim: rgba(255, 0, 85, 0.15);
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
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  .blink-slow { animation: blinker-slow 3s infinite; }
  @keyframes blinker-slow { 50% { opacity: 0.5; } }

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
  .y2k-title { font-family: 'DotGothic16', sans-serif; }

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

  /* BUTTONS */
  .y2k-btn-magenta {
    background: rgba(255, 0, 85, 0.1);
    border: 2px solid var(--magenta);
    color: var(--magenta);
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    transition: all 0.2s;
    font-size: 1rem;
    box-shadow: inset 0 0 10px rgba(255,0,85,0.2);
    letter-spacing: 1px;
  }
  .y2k-btn-magenta:hover {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 20px var(--magenta-dim);
    text-shadow: none;
  }

  .y2k-btn-outline-danger {
    background: transparent;
    border: 1px solid var(--magenta);
    color: var(--magenta);
    cursor: pointer;
    transition: all 0.2s;
  }
  .y2k-btn-outline-danger:hover {
    background: var(--magenta);
    color: #fff;
    box-shadow: 0 0 10px var(--magenta-dim);
  }

  /* DATA ROWS */
  .y2k-data-row {
    background: rgba(0,0,0,0.4);
    transition: all 0.2s;
  }
  .y2k-data-row:hover {
    background: rgba(0, 229, 255, 0.05);
    border-color: var(--cyan) !important;
    box-shadow: inset 0 0 10px var(--cyan-dim);
  }
  
  /* MEMORY BLOCKS VISUALIZER */
  .y2k-mem-block {
    width: 14px;
    height: 14px;
    border: 1px solid rgba(255, 0, 85, 0.3);
    transition: all 0.3s;
  }
  .y2k-mem-block.free {
    background: transparent;
  }
  .y2k-mem-block.allocated {
    background: var(--magenta);
    border-color: var(--magenta);
    box-shadow: 0 0 5px var(--magenta);
  }
`;