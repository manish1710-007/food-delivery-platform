import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="y2k-auth-loader">
          <div className="y2k-loader-panel">
            {/* Corner decorations */}
            <div className="y2k-auth-corner top-left"></div>
            <div className="y2k-auth-corner bottom-right"></div>
            
            <div className="y2k-spinner mb-4"></div>
            
            <div className="y2k-terminal-text">
              <p>&gt; INITIATING_SECURE_HANDSHAKE...</p>
              <p>&gt; DECRYPTING_USER_PAYLOAD...</p>
              <p className="y2k-blink mt-2">
                &gt; VERIFYING_ACCESS_TOKEN <span className="y2k-cursor"></span>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (roles && !roles.includes(user.role.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  if (children) return children;

  return <Outlet />;
}

const styles = `
  .y2k-auth-loader {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #010308; /* Matches your dark background */
    font-family: 'VT323', monospace;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .y2k-loader-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(10, 10, 18, 0.85);
    border: 1px dashed var(--cyan, #00e5ff);
    padding: 3rem 4rem;
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.15), inset 0 0 20px rgba(0, 229, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  /* Target Reticle Corners */
  .y2k-auth-corner {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid #ff00ff; /* Magenta corners */
    box-shadow: 0 0 10px #ff00ff;
  }
  .y2k-auth-corner.top-left { top: -2px; left: -2px; border-right: none; border-bottom: none; }
  .y2k-auth-corner.bottom-right { bottom: -2px; right: -2px; border-left: none; border-top: none; }

  /* Cyber Spinner */
  .y2k-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(0, 229, 255, 0.2);
    border-top-color: #ff00ff;
    border-right-color: var(--cyan, #00e5ff);
    border-radius: 50%;
    animation: y2k-spin 0.8s linear infinite;
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
  }

  @keyframes y2k-spin {
    to { transform: rotate(360deg); }
  }

  /* Terminal Typography */
  .y2k-terminal-text {
    color: var(--cyan, #00e5ff);
    font-size: 1.4rem;
    letter-spacing: 2px;
    text-shadow: 0 0 5px var(--cyan, #00e5ff);
  }

  .y2k-terminal-text p {
    margin: 5px 0;
    line-height: 1.2;
  }

  .y2k-blink {
    color: #ff00ff;
    text-shadow: 0 0 8px #ff00ff;
  }

  /* Blinking Terminal Cursor */
  .y2k-cursor {
    display: inline-block;
    width: 12px;
    height: 1.2rem;
    background-color: #ff00ff;
    vertical-align: middle;
    animation: y2k-blink-cursor 1s step-end infinite;
    box-shadow: 0 0 8px #ff00ff;
  }

  @keyframes y2k-blink-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;