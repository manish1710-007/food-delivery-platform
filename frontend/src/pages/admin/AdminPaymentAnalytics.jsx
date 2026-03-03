import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

export default function AdminPaymentAnalytics() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fake ledger logs for the aesthetic sidebar
    const [ledgerLogs, setLedgerLogs] = useState([
        "> SECURE_LEDGER_MOUNTED",
        "> DECRYPTING_FINANCIAL_BLOCKS..."
    ]);

    useEffect(() => {
        fetchAnalytics();
        
        // Simulating incoming transaction streams
        const interval = setInterval(() => {
            const fakeHash = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
            const fakeAmt = Math.floor(Math.random() * 1500) + 100;
            setLedgerLogs(prev => [...prev, `> RX_${fakeHash} : +INR ${fakeAmt}`].slice(-10));
        }, 3000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get("/admin/payment-analytics");
            setData(res.data.revenueByDate || []);
        } catch (err) {
            console.error("Failed to load payment analytics", err);
            setError("SYS_ERR: FAILED_TO_DECRYPT_LEDGER");
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return isNaN(date) ? dateStr : date.toLocaleDateString('en-GB', { month: 'short', day: '2-digit' }).toUpperCase();
    };

    // Custom Terminal Tooltip
    const Y2KTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="y2k-wire-box border-magenta p-2 text-start font-monospace small" style={{ background: "rgba(2, 6, 13, 0.95)" }}>
                    <div className="text-muted mb-1 border-bottom-wire border-magenta pb-1">&gt; TS: <span className="text-main">{formatDate(label)}</span></div>
                    <div className="d-flex justify-content-between gap-4 mt-1">
                        <span className="text-cyan">[GROSS_YIELD]</span>
                        <span className="text-magenta fw-bold">INR {payload[0].value}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
                <div className="y2k-wire-box p-4 text-center border-cyan" style={{ width: "320px" }}>
                    <div className="mb-3 text-cyan font-monospace small">COMPILING_FINANCIAL_DATA... <span className="blink">_</span></div>
                    <div className="y2k-progress-bar border-cyan">
                        <div className="y2k-progress-fill" style={{ animationDuration: '2s' }}></div>
                    </div>
                </div>
            </div>
        </>
    );

    if (error) return (
        <>
            <style>{styles}</style>
            <div className="y2k-page d-flex flex-column align-items-center justify-content-center min-vh-100">
                <div className="y2k-wire-box border-magenta p-4 text-center">
                    <span className="text-magenta d-block mb-2" style={{ fontSize: "2rem" }}>[ ! ]</span>
                    <p className="mb-0 text-magenta font-monospace">{error}</p>
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
                                <span className="blink">_</span> SYS_LEDGER // REVENUE_STREAM
                            </h1>
                            <div className="text-magenta small font-monospace opacity-75">
                                ROOT_DIR: C:\SERVER\FINANCIALS\&gt;
                            </div>
                        </div>
                        <div className="mt-3 mt-md-0 y2k-wire-box border-cyan px-3 py-2 d-flex align-items-center gap-3">
                            <span className="text-cyan small font-monospace">/// NET_LIQUIDITY</span>
                            <span className="text-main fw-bold fs-4 font-monospace">INR {totalRevenue.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="row g-4 align-items-start">
                        
                        {/* ── LEFT: The Revenue Chart (col-xl-9) ── */}
                        <div className="col-12 col-xl-9">
                            <div className="y2k-wire-box border-cyan p-3 p-md-4 text-start">
                                <div className="d-flex justify-content-between border-bottom-wire border-cyan pb-2 mb-4">
                                    <span className="text-cyan small font-monospace">/// REVENUE_OVER_TIME (TIMELINE_MATRIX)</span>
                                </div>
                                
                                {data.length === 0 ? (
                                    <div className="text-center py-5 text-muted font-monospace">
                                        [ DIR_EMPTY: NO_REVENUE_DETECTED ]
                                    </div>
                                ) : (
                                    <div style={{ width: '100%', height: 400 }}>
                                        <ResponsiveContainer>
                                            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                {/* Holographic grid */}
                                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="rgba(0, 229, 255, 0.15)" />
                                                
                                                <XAxis 
                                                    dataKey="_id" 
                                                    tickFormatter={formatDate} 
                                                    tick={{ fill: '#5e7993', fontFamily: '"Share Tech Mono", monospace', fontSize: 11 }} 
                                                    axisLine={{ stroke: '#5e7993' }} 
                                                    tickLine={false} 
                                                    dy={10} 
                                                />
                                                
                                                <YAxis 
                                                    tickFormatter={(value) => `₹${value}`} 
                                                    tick={{ fill: '#5e7993', fontFamily: '"Share Tech Mono", monospace', fontSize: 11 }} 
                                                    axisLine={{ stroke: '#5e7993' }} 
                                                    tickLine={false} 
                                                    dx={-10} 
                                                />
                                                
                                                {/* Y2K Terminal Tooltip with custom cursor targeting line */}
                                                <Tooltip 
                                                    content={<Y2KTooltip />} 
                                                    cursor={{ stroke: 'rgba(255, 0, 85, 0.4)', strokeWidth: 1, strokeDasharray: '4 4' }} 
                                                />
                                                
                                                {/* Sharp linear graph, neon colors */}
                                                <Line 
                                                    type="linear" 
                                                    dataKey="revenue" 
                                                    stroke="#ff0055" 
                                                    strokeWidth={2} 
                                                    dot={{ r: 4, strokeWidth: 2, fill: "#02060d", stroke: "#ff0055" }} 
                                                    activeDot={{ r: 6, fill: "#ff0055", stroke: "#fff", strokeWidth: 0 }} 
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── RIGHT: Active Transaction Ledger (col-xl-3) ── */}
                        <div className="col-12 col-xl-3 d-none d-xl-block">
                            <div className="position-sticky" style={{ top: "80px" }}>
                                <div className="y2k-wire-box border-magenta p-0 h-100 d-flex flex-column text-start bg-magenta-dim">
                                    
                                    <div className="bg-magenta text-dark p-2 px-3 text-start font-monospace fw-bold" style={{ fontSize: "0.8rem" }}>
                                        ACTIVE_TRANSACTION_STREAM
                                    </div>
                                    
                                    {/* Scrolling Log Output */}
                                    <div className="p-3 font-monospace small flex-grow-1 d-flex flex-column justify-content-end overflow-hidden" style={{ minHeight: "350px", fontSize: "0.7rem" }}>
                                        {ledgerLogs.map((log, idx) => {
                                            const isAmount = log.includes("+INR");
                                            return (
                                                <div key={idx} className={`mb-1 ${isAmount ? "text-cyan" : "text-muted"}`}>
                                                    {log}
                                                </div>
                                            );
                                        })}
                                        <div className="text-magenta mt-1"><span className="blink">_</span></div>
                                    </div>
                                    
                                    {/* Encryption Footer */}
                                    <div className="border-top-wire border-magenta p-2 text-center text-muted font-monospace" style={{ fontSize: "0.6rem" }}>
                                        &gt; END_TO_END_ENCRYPTION_ACTIVE<br/>
                                        &gt; ALGORITHM: RSA-4096
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
  .text-main { color: var(--text-main) !important; }
  .text-muted { color: var(--text-muted) !important; }
  
  .bg-magenta { background-color: var(--magenta) !important; color: #fff !important; }
  .bg-magenta-dim { background-color: var(--magenta-dim) !important; }
  
  .border-cyan { border: 1px solid var(--cyan) !important; }
  .border-magenta { border: 1px solid var(--magenta) !important; }
  .border-bottom-wire { border-bottom: 1px dashed var(--cyan-glow); }
  .border-top-wire { border-top: 1px dashed var(--cyan-glow); }
  .border-bottom-wire.border-magenta { border-bottom-color: rgba(255,0,85,0.5); }
  .border-top-wire.border-magenta { border-top-color: rgba(255,0,85,0.5); }
  
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

  /* PROGRESS BAR */
  .y2k-progress-bar { width: 100%; height: 12px; border: 1px solid var(--cyan-glow); background: #000; padding: 2px; }
  .y2k-progress-fill { height: 100%; background: var(--cyan); width: 0%; animation: load ease-out forwards; }
  @keyframes load { to { width: 100%; } }
`;