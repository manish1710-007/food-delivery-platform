import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function AdminAnalytics() {
    const [data, setData] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const res = await api.get("/admin/analytics");
            setData(res.data);
        } catch (err) {
            console.error("Failed to load analytics", err);
        }
    };

    // Custom Y2K Terminal Tooltip for Charts
    const Y2KTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="y2k-wire-box border-cyan p-2 text-start font-monospace small" style={{ background: "rgba(2, 6, 13, 0.95)" }}>
                    <div className="text-cyan mb-1 border-bottom-wire border-cyan pb-1">&gt; TGT: {label || payload[0].name}</div>
                    {payload.map((p, index) => (
                        <div key={index} className="d-flex justify-content-between gap-3 mt-1" style={{ color: p.color || 'var(--magenta)' }}>
                            <span>[{p.dataKey.toUpperCase()}]</span>
                            <span className="fw-bold">{p.value}</span>
                        </div>
                    ))}
                    <div className="text-muted mt-1" style={{ fontSize: "0.6rem" }}>/// LOG_RECORDED</div>
                </div>
            );
        }
        return null;
    };

    if (!data) return (
        <>
            <style>{styles}</style>
            <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
                <div className="y2k-wire-box p-4 text-center" style={{ width: "320px" }}>
                    <div className="mb-3 text-cyan">FETCHING_TELEMETRY_DATA... <span className="blink">_</span></div>
                    <div className="y2k-progress-bar">
                        <div className="y2k-progress-fill" style={{ animationDuration: '3s' }}></div>
                    </div>
                </div>
            </div>
        </>
    );

    // Hardcore Neon Palette: Cyan, Magenta, Amber, Muted Blue, White
    const COLORS = ["#00e5ff", "#ff0055", "#ffb700", "#5e7993", "#e0e6ed"];

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
                                <span className="blink">_</span> SYS_TELEMETRY // DATA_ANALYTICS
                            </h1>
                            <div className="text-magenta small font-monospace opacity-75">
                                ROOT_DIR: C:\SERVER\TELEMETRY_LOGS\&gt;
                            </div>
                        </div>
                        <div className="text-end font-monospace small text-cyan mt-2 mt-md-0">
                            <div>DATA_STREAM: SECURE</div>
                            <div className="blink-slow">LIVE_MONITORING: ACTIVE</div>
                        </div>
                    </div>

                    {/* Premium Metric Cards -> Terminal Readouts */}
                    <div className="row g-4 mb-4 font-monospace">
                        <div className="col-md-4">
                            <div className="y2k-wire-box border-cyan p-3 p-xl-4 d-flex align-items-center gap-3">
                                <div className="text-cyan fs-1 opacity-75">[+]</div>
                                <div>
                                    <p className="text-muted mb-1 small">&gt; TOTAL_PACKETS_PROCESSED</p>
                                    <h3 className="text-main fw-bold m-0">{data.totalOrders}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="y2k-wire-box border-magenta p-3 p-xl-4 d-flex align-items-center gap-3 bg-magenta-dim">
                                <div className="text-magenta fs-1 opacity-75">[$]</div>
                                <div>
                                    <p className="text-magenta mb-1 small" style={{ opacity: 0.8 }}>&gt; GROSS_SYSTEM_YIELD</p>
                                    <h3 className="text-magenta fw-bold m-0 text-shadow-magenta">INR {data.totalRevenue}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Fake Diagnostic Box for Aesthetic */}
                        <div className="col-md-4 d-none d-md-block">
                            <div className="y2k-wire-box border-amber p-3 p-xl-4 d-flex flex-column justify-content-center h-100 gap-2">
                                <div className="d-flex justify-content-between small text-amber">
                                    <span>DATA_INTEGRITY</span>
                                    <span>99.9%</span>
                                </div>
                                <div className="y2k-progress-bar border-amber bg-transparent">
                                    <div className="bg-amber h-100 w-100"></div>
                                </div>
                                <div className="text-muted small" style={{ fontSize: "0.65rem" }}>SYS_LOAD: OPTIMAL // DB_SYNCED</div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="row g-4">
                        
                        {/* Pie Chart: Node Distribution */}
                        <div className="col-lg-5 col-xl-4">
                            <div className="y2k-wire-box border-cyan p-3 p-xl-4 h-100 text-start d-flex flex-column">
                                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-4">
                                    <span className="text-cyan small font-monospace">/// NODE_DISTRIBUTION_RADAR</span>
                                </div>
                                
                                <div className="flex-grow-1 position-relative d-flex align-items-center justify-content-center" style={{ minHeight: "300px" }}>
                                    {/* Fake Radar Crosshair behind the pie */}
                                    <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center pointer-events-none opacity-25">
                                        <div className="rounded-circle border border-cyan" style={{ width: "200px", height: "200px", borderStyle: "dashed !important" }}></div>
                                        <div className="position-absolute bg-cyan" style={{ width: "1px", height: "100%" }}></div>
                                        <div className="position-absolute bg-cyan" style={{ width: "100%", height: "1px" }}></div>
                                    </div>

                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie 
                                                data={data.ordersByStatus} 
                                                dataKey="count" 
                                                nameKey="_id" 
                                                outerRadius={110} 
                                                innerRadius={70} // Creates a hollow tech-ring look
                                                stroke="#02060d" // Matches background to create harsh slices
                                                strokeWidth={2}
                                            >
                                                {data.ordersByStatus.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<Y2KTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Bar Chart: Revenue Matrix */}
                        <div className="col-lg-7 col-xl-8">
                            <div className="y2k-wire-box border-magenta p-3 p-xl-4 h-100 text-start d-flex flex-column">
                                <div className="d-flex justify-content-between border-bottom-wire border-magenta pb-2 mb-4">
                                    <span className="text-magenta small font-monospace">/// TOP_HOST_REVENUE_MATRIX</span>
                                </div>

                                <div className="flex-grow-1" style={{ minHeight: "300px" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.topRestaurants} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                            {/* Harsh dashed grid lines */}
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 229, 255, 0.15)" />
                                            
                                            {/* Monospace Axis Styling */}
                                            <XAxis 
                                                dataKey="restaurant.name" 
                                                tick={{ fill: '#5e7993', fontFamily: '"Share Tech Mono", monospace', fontSize: 11 }} 
                                                axisLine={{ stroke: '#5e7993' }} 
                                                tickLine={false} 
                                            />
                                            <YAxis 
                                                tick={{ fill: '#5e7993', fontFamily: '"Share Tech Mono", monospace', fontSize: 11 }} 
                                                axisLine={{ stroke: '#5e7993' }} 
                                                tickLine={false}
                                                tickFormatter={(value) => `₹${value}`}
                                            />
                                            
                                            <Tooltip content={<Y2KTooltip />} cursor={{ fill: 'rgba(255, 0, 85, 0.1)' }} />
                                            
                                            {/* Sharp rectangular bars, no rounding */}
                                            <Bar dataKey="revenue" fill="#ff0055" radius={[0, 0, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
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
    --amber-dim: rgba(255, 183, 0, 0.2);
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
  .bg-amber { background-color: var(--amber) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-amber { border: 1px solid var(--amber) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-bottom-wire.border-magenta { border-bottom-color: rgba(255,0,85,0.5); }
  
  .text-shadow-magenta { text-shadow: 0 0 8px rgba(255, 0, 85, 0.6); }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }

  .blink-slow { animation: blinker-slow 3s infinite; }
  @keyframes blinker-slow { 50% { opacity: 0.3; } }

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
  .y2k-wire-box.border-amber::before, .y2k-wire-box.border-amber::after { border-color: var(--amber); }

  /* TYPOGRAPHY */
  .y2k-title { font-family: 'DotGothic16', sans-serif; }

  /* PROGRESS BAR */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }
`;