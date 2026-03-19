import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RestaurantProfile() {
  const [data, setData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    address: "",
    phone: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/restaurant-owner/my");
        setData(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("[SYS.ERR] FAILED_TO_FETCH_PROFILE:", err);
        setStatusMsg("ERR: UNABLE TO CONTACT MAINFRAME");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Save Profile Data
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("> INITIATING_DATA_TRANSFER...");

    try {
      await api.put("/restaurant-owner/my", data);
      setStatusMsg("> UPLINK_SUCCESS: PROFILE_UPDATED_SECURELY");
      
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error("[SYS.ERR] PROFILE_SAVE_REJECTED:", err);
      setStatusMsg("ERR: WRITE_PERMISSION_DENIED");
    } finally {
      setSaving(false);
    }
  };

  const handleInput = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="text-cyan font-monospace fs-4">
          &gt; DECRYPTING_PROFILE_DATA... <span className="blink">_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <style>{styles}</style>
      
      {/* HEADER */}
      <div className="mb-5 border-bottom-wire border-cyan pb-3">
        <div className="text-cyan font-monospace small mb-1">/// DATABASE: NODE_IDENTITY</div>
        <h2 className="y2k-title text-main m-0 fs-2 text-uppercase">
          SYS_PROFILE <span className="blink text-cyan">_</span>
        </h2>
      </div>

      <div className="row g-4">
        
        {/* The Form */}
        <div className="col-12 col-lg-7">
          <div className="y2k-wire-box p-4 p-md-5">
            <h5 className="text-cyan font-monospace mb-4 border-bottom-wire border-cyan pb-2">
              &gt; EDIT_NODE_PARAMETERS
            </h5>

            <form onSubmit={save} className="d-flex flex-column gap-4">
              
              {/* Restaurant Name */}
              <div>
                <label className="d-block text-muted small font-monospace mb-1">&gt; PUBLIC_IDENTIFIER (Name)</label>
                <div className="y2k-input-group d-flex">
                  <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">ID:</span>
                  <input
                    type="text"
                    className="y2k-input flex-grow-1 p-2"
                    value={data.name || ""}
                    onChange={e => handleInput("name", e.target.value)}
                    placeholder="e.g. Neon Noodles"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="d-block text-muted small font-monospace mb-1">&gt; NODE_DESCRIPTION</label>
                <div className="y2k-input-group d-flex">
                  <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan d-flex align-items-center">INFO:</span>
                  <textarea
                    className="y2k-input flex-grow-1 p-2"
                    value={data.description || ""}
                    onChange={e => handleInput("description", e.target.value)}
                    placeholder="Describe your establishment..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="row g-3">
                {/* Phone */}
                <div className="col-md-6">
                  <label className="d-block text-muted small font-monospace mb-1">&gt; COMMS_LINK (Phone)</label>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">TEL:</span>
                    <input
                      type="text"
                      className="y2k-input flex-grow-1 p-2"
                      value={data.phone || ""}
                      onChange={e => handleInput("phone", e.target.value)}
                      placeholder="+91..."
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="col-md-6">
                  <label className="d-block text-muted small font-monospace mb-1">&gt; PHYSICAL_COORDS (Address)</label>
                  <div className="y2k-input-group d-flex">
                    <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">LOC:</span>
                    <input
                      type="text"
                      className="y2k-input flex-grow-1 p-2"
                      value={data.address || ""}
                      onChange={e => handleInput("address", e.target.value)}
                      placeholder="Sector 7, Neo-City..."
                    />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="d-block text-muted small font-monospace mb-1">&gt; VISUAL_BANNER_URL (Image)</label>
                <div className="y2k-input-group d-flex">
                  <span className="y2k-input-prefix px-3 py-2 text-cyan border-end border-cyan">URL:</span>
                  <input
                    type="text"
                    className="y2k-input flex-grow-1 p-2"
                    value={data.imageUrl || ""}
                    onChange={e => handleInput("imageUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Status & Submit */}
              <div className="mt-4 pt-3 border-top-wire border-cyan d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className={`font-monospace small ${statusMsg.includes("ERR") ? "text-magenta blink" : "text-cyan"}`}>
                  {statusMsg}
                </div>
                
                <button 
                  type="submit" 
                  className="y2k-btn-magenta px-5 py-2"
                  disabled={saving}
                >
                  {saving ? "[ OVERWRITING... ]" : "[ EXECUTE_SAVE ]"}
                </button>
              </div>

            </form>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="y2k-wire-box h-100 p-0 overflow-hidden d-flex flex-column">
            
            <div className="bg-cyan-dim p-2 border-bottom border-cyan d-flex justify-content-between">
              <span className="text-cyan font-monospace small">&gt; LIVE_PREVIEW</span>
              <span className="text-cyan font-monospace small opacity-50">CUSTOMER_VIEW</span>
            </div>

            {/* Image Preview Banner */}
            <div className="position-relative border-bottom border-cyan" style={{ height: "200px", background: "rgba(0, 229, 255, 0.05)" }}>
              {data.imageUrl ? (
                <img src={data.imageUrl} alt="Profile Banner" className="w-100 h-100" style={{ objectFit: "cover", opacity: 0.8 }} />
              ) : (
                <div className="w-100 h-100 d-flex justify-content-center align-items-center text-cyan font-monospace opacity-50">
                  NO_VISUAL_DATA
                </div>
              )}
            </div>

            {/* Profile Info Preview */}
            <div className="p-4 flex-grow-1 d-flex flex-column">
              <h3 className="text-main font-monospace mb-2 text-uppercase">
                {data.name || "UNKNOWN_NODE"}
              </h3>
              
              <p className="text-muted font-monospace small mb-4 flex-grow-1">
                {data.description || "No description provided."}
              </p>

              <div className="font-monospace small text-cyan border-top-wire border-cyan pt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">LOC:</span> <span>{data.address || "UNKNOWN"}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">COMMS:</span> <span>{data.phone || "UNKNOWN"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

const styles = `
  /* Local Component Styles */
  .y2k-wire-box {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(0, 229, 255, 0.5);
    position: relative;
    transition: all 0.3s ease;
  }
  .y2k-wire-box::before, .y2k-wire-box::after {
    content: ''; position: absolute; width: 6px; height: 6px; 
    border: 1px solid #00e5ff; pointer-events: none;
  }
  .y2k-wire-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .y2k-wire-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  .y2k-input-group {
    background: rgba(0,0,0,0.8);
    border: 1px solid rgba(0, 229, 255, 0.5);
    transition: all 0.2s;
  }
  .y2k-input-group:focus-within {
    border-color: #00e5ff;
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.1);
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
    color: #e0e6ed;
    font-family: 'Share Tech Mono', monospace;
    outline: none;
    font-size: 0.95rem;
  }
  .y2k-input::placeholder { color: rgba(94, 121, 147, 0.4); font-size: 0.8rem; }
  textarea.y2k-input { resize: vertical; min-height: 80px; }

  .y2k-btn-magenta {
    background: rgba(255, 0, 85, 0.1);
    border: 2px solid #ff0055;
    color: #ff0055;
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    transition: all 0.2s;
    font-size: 1rem;
    letter-spacing: 1px;
  }
  .y2k-btn-magenta:hover:not(:disabled) {
    background: #ff0055;
    color: #fff;
    box-shadow: 0 0 20px rgba(255, 0, 85, 0.3);
  }
  .y2k-btn-magenta:disabled {
    border-color: #5e7993;
    color: #5e7993;
    cursor: not-allowed;
  }
`;