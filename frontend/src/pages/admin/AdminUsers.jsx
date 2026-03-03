import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    
    // Fake system logs
    const [sysLogs, setSysLogs] = useState([
        "> USER_DIRECTORY_MOUNTED",
        "> AWAITING_ADMIN_OVERRIDE..."
    ]);

    const addLog = (msg) => {
        setSysLogs(prev => [...prev, msg].slice(-8));
    };

    useEffect(() => {
        loadUsers();
        
        // Simulating active network connections
        const interval = setInterval(() => {
            const fakeIP = `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
            setSysLogs(prev => [...prev, `> PING_FROM [${fakeIP}] ... SECURE`].slice(-8));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load users", err);
            addLog("> SYS_ERR: DIR_FETCH_FAILED");
        } finally {
            setLoading(false);
        }
    };

    const changeRole = async (id, newRole, userName) => {
        if (!window.confirm(`SYS_WARN: OVERRIDE PRIVILEGES FOR [${userName.toUpperCase()}] TO [${newRole.toUpperCase()}]?`)) {
            return addLog("> OVERRIDE_ABORTED");
        }
        
        setUpdatingId(id);
        addLog(`> INITIATING_PRIVILEGE_OVERRIDE...`);
        try {
            await api.put(`/users/${id}/role`, { role: newRole });
            addLog(`> OVERRIDE_SUCCESS [OK]`);
            await loadUsers();
        } catch (err) {
            console.error("Failed to update role", err);
            addLog("> SYS_ERR: OVERRIDE_FAILED");
            alert("SYS_ERR: Could not update user role.");
        } finally {
            setUpdatingId(null);
        }
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'text-magenta border-magenta';
            case 'restaurant': return 'text-amber border-amber';
            case 'driver': return 'text-cyan border-cyan';
            default: return 'text-muted border-secondary';
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
            (u.email || "").toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter ? u.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
                <div className="y2k-wire-box p-4 text-center border-cyan" style={{ width: "320px" }}>
                    <div className="mb-3 text-cyan font-monospace small">COMPILING_USER_DIRECTORY... <span className="blink">_</span></div>
                    <div className="y2k-progress-bar border-cyan">
                        <div className="y2k-progress-fill bg-cyan" style={{ animationDuration: '2s' }}></div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="y2k-page pb-5">
                <div className="y2k-grid-bg"></div>
                <div className="scanlines"></div>

                <div className="container-fluid px-3 px-xl-4 position-relative z-1 pt-4 w-100">
                    
                    {/* Header HUD */}
                    <div className="y2k-wire-box border-magenta d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 p-3 bg-magenta-dim text-start">
                        <div>
                            <h1 className="y2k-title mb-1 fs-4 text-magenta d-flex align-items-center gap-2 m-0 text-shadow-magenta">
                                <span className="blink">_</span> SYS_USERS // PRIVILEGE_MATRIX
                            </h1>
                            <div className="text-magenta small font-monospace opacity-75">
                                ROOT_DIR: C:\SERVER\IDENTITIES\&gt;
                            </div>
                        </div>
                        <div className="mt-3 mt-md-0 y2k-wire-box border-cyan px-3 py-2 d-flex align-items-center gap-3">
                            <span className="text-cyan small font-monospace">/// REGISTERED_NODES</span>
                            <span className="text-main fw-bold fs-4 font-monospace">{users.length}</span>
                        </div>
                    </div>

                    <div className="row g-4 align-items-start">
                        
                        {/* ── LEFT: Filters & User Matrix (col-xl-9) ── */}
                        <div className="col-12 col-xl-9">
                            
                            {/* Query Panel */}
                            <div className="y2k-wire-box border-cyan p-3 mb-4 text-start">
                                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                                    <span className="text-cyan small font-monospace">/// QUERY_DIRECTORY</span>
                                </div>
                                <div className="row g-3 font-monospace">
                                    <div className="col-md-8">
                                        <div className="y2k-input-group d-flex">
                                            <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">C:\&gt;</span>
                                            <input
                                                className="y2k-input flex-grow-1 p-2"
                                                placeholder="ENTER_ALIAS_OR_NET_ADDR..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="y2k-input-group d-flex h-100">
                                            <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">LVL:</span>
                                            <select
                                                className="y2k-input flex-grow-1 p-2 y2k-select text-uppercase"
                                                value={roleFilter}
                                                onChange={(e) => setRoleFilter(e.target.value)}
                                            >
                                                <option value="">ALL_CLEARANCES</option>
                                                <option value="customer">ROOT_USER</option>
                                                <option value="restaurant">HOST_NODE</option>
                                                <option value="driver">PACKET_ROUTER</option>
                                                <option value="admin">SYS_ADMIN</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User List */}
                            <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-3">
                                    <span className="text-cyan small font-monospace">/// IDENTITY_DATABASE</span>
                                    <span className="text-cyan small font-monospace">MATCHES: {filteredUsers.length}</span>
                                </div>

                                {filteredUsers.length === 0 ? (
                                    <div className="text-center p-5 text-muted font-monospace">
                                        [ DIR_EMPTY: NO_MATCHING_IDENTITIES ]
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {filteredUsers.map(u => (
                                            <div key={u._id} className="y2k-data-row d-flex flex-column flex-lg-row justify-content-between align-items-lg-center p-3 border-cyan gap-3 font-monospace">
                                                
                                                {/* Identity Info */}
                                                <div className="d-flex align-items-center gap-3 overflow-hidden" style={{ minWidth: "250px" }}>
                                                    <div className="y2k-avatar-frame border-cyan p-1 flex-shrink-0" style={{ width: "48px", height: "48px" }}>
                                                        <img 
                                                            src={`https://ui-avatars.com/api/?name=${u.name || u.email}&background=00e5ff&color=000&bold=true`} 
                                                            className="w-100 h-100" 
                                                            style={{ filter: "grayscale(100%) contrast(1.5) sepia(1) hue-rotate(140deg)" }} 
                                                            alt="" 
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden pe-2">
                                                        <div className="text-main fw-bold fs-5 text-truncate">{u.name?.toUpperCase() || "UNKNOWN_USER"}</div>
                                                        <div className="text-muted small text-truncate">@: {u.email}</div>
                                                    </div>
                                                </div>

                                                {/* Meta */}
                                                <div className="d-flex flex-column gap-1 text-muted small" style={{ minWidth: "140px" }}>
                                                    <span>&gt; ID: {u._id.slice(-6).toUpperCase()}</span>
                                                    <span>&gt; ADDED: {u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A'}</span>
                                                </div>

                                                {/* Action / Override */}
                                                <div className="d-flex align-items-center justify-content-lg-end" style={{ minWidth: "220px" }}>
                                                    {updatingId === u._id ? (
                                                        <span className="text-magenta blink small">[ OVERWRITING... ]</span>
                                                    ) : (
                                                        <div className="y2k-input-group d-flex w-100">
                                                            <span className="y2k-input-prefix px-2 py-1 text-cyan border-end border-cyan small" style={{ minWidth: "auto" }}>AUTH:</span>
                                                            <select 
                                                                className={`y2k-input flex-grow-1 p-1 y2k-select text-uppercase small fw-bold ${getRoleColor(u.role)}`}
                                                                value={u.role || 'customer'}
                                                                onChange={(e) => changeRole(u._id, e.target.value, u.name)}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <option value="customer">ROOT_USER (Cust)</option>
                                                                <option value="restaurant">HOST_NODE (Rest)</option>
                                                                <option value="driver">ROUTER (Drvr)</option>
                                                                <option value="admin">SYS_ADMIN (Adm)</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── RIGHT: Active Connections (col-xl-3) ── */}
                        <div className="col-12 col-xl-3 d-none d-xl-block">
                            <div className="position-sticky" style={{ top: "80px" }}>
                                <div className="y2k-wire-box border-cyan p-0 h-100 d-flex flex-column text-start">
                                    <div className="bg-cyan text-dark p-2 px-3 text-start font-monospace fw-bold" style={{ fontSize: "0.8rem" }}>
                                        ACTIVE_CONNECTIONS
                                    </div>
                                    
                                    <div className="p-3 font-monospace small flex-grow-1 d-flex flex-column justify-content-end overflow-hidden" style={{ minHeight: "400px", fontSize: "0.7rem" }}>
                                        {sysLogs.map((log, idx) => (
                                            <div key={idx} className={`mb-1 ${log.includes("ERR") || log.includes("ABORTED") ? "text-magenta fw-bold" : log.includes("[OK]") || log.includes("PING") ? "text-cyan" : "text-muted"}`}>
                                                {log}
                                            </div>
                                        ))}
                                        <div className="text-cyan mt-1"><span className="blink">_</span></div>
                                    </div>

                                    <div className="border-top-wire border-cyan p-2 text-center text-muted font-monospace" style={{ fontSize: "0.6rem" }}>
                                        &gt; FIREWALL: ACTIVE<br/>
                                        &gt; INTRUSION_DETECTION: ON
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
    --magenta-dim: rgba(255, 0, 85, 0.15);
    --amber: #ffb700;
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
  .text-cyan { color: var(--cyan) !important; text-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
  .text-magenta { color: var(--magenta) !important; text-shadow: 0 0 5px rgba(255, 0, 85, 0.3); }
  .text-amber { color: var(--amber) !important; text-shadow: 0 0 5px rgba(255, 183, 0, 0.3); }
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-cyan { background-color: var(--cyan) !important; color: #000 !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-amber { border: 1px solid var(--amber) !important; }
  .border-secondary { border-color: var(--text-muted) !important; }
  
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  
  .text-shadow-magenta { text-shadow: 0 0 8px rgba(255, 0, 85, 0.6); }
  
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
  .y2k-title { font-family: 'DotGothic16', sans-serif; }

  /* AVATAR FRAME */
  .y2k-avatar-frame {
    background: #000;
    position: relative;
  }
  .y2k-avatar-frame::after {
    content: ''; position: absolute; inset: 0;
    border: 1px solid var(--cyan);
    pointer-events: none;
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
    min-width: 40px;
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

  .y2k-select {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }
  .y2k-select option { background: var(--panel-bg); color: var(--text-main); }

  /* DATA ROWS */
  .y2k-data-row {
    background: rgba(0,0,0,0.4);
    transition: all 0.2s;
  }
  .y2k-data-row:hover {
    background: rgba(0, 229, 255, 0.05);
    box-shadow: inset 0 0 10px var(--cyan-dim);
  }

  /* PROGRESS BAR */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }
`;