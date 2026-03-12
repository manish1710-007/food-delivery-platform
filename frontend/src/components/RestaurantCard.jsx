import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  return (
    <>
      <style>{styles}</style>
      
      <Link
        to={`/restaurant/${restaurant._id}`}
        className="y2k-rest-link"
      >
        <div className="y2k-rest-card h-100 position-relative d-flex flex-column">
          
          {/* Hacker Reticle Corners */}
          <div className="y2k-corner top-left"></div>
          <div className="y2k-corner top-right"></div>
          <div className="y2k-corner bottom-left"></div>
          <div className="y2k-corner bottom-right"></div>

          {/* Image Node */}
          <div className="y2k-img-container">
            <img
              src={
                restaurant.image ||
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
              }
              alt={restaurant.name}
              className="y2k-rest-img"
            />
            <div className="y2k-scanlines"></div>
            
            {/* Status Badge */}
            <div className="y2k-status-badge">
              <span className="y2k-blink-dot"></span> [ ONLINE ]
            </div>
          </div>

          {/* Data Payload (Card Body) */}
          <div className="y2k-card-body p-3 d-flex flex-column flex-grow-1">
            <h5 className="y2k-rest-name mb-1">
              &gt; {restaurant.name}
            </h5>
            <p className="y2k-rest-cuisine mt-auto mb-0">
              <span className="y2k-label">/// TYPE: </span>
              {restaurant.cuisine || "SYS.UNKNOWN"}
            </p>
          </div>
          
        </div>
      </Link>
    </>
  );
}

const styles = `
  /* Remove default link styling */
  .y2k-rest-link {
    text-decoration: none;
    color: inherit;
    display: block;
    height: 100%;
  }

  /* The Mainframe Node Container */
  .y2k-rest-card {
    background: rgba(10, 10, 18, 0.85);
    border: 1px solid var(--cyan, #00e5ff);
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.1);
    font-family: 'VT323', monospace;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  /* Neon Hover State! */
  .y2k-rest-link:hover .y2k-rest-card {
    border-color: #ff00ff; /* Shifts to Gyaru Pink */
    box-shadow: 0 0 25px rgba(255, 0, 255, 0.3), inset 0 0 15px rgba(255, 0, 255, 0.1);
    transform: translateY(-5px) scale(1.02);
  }

  /* Decorative Reticle Corners */
  .y2k-corner {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid var(--cyan, #00e5ff);
    z-index: 10;
    transition: all 0.3s ease;
  }
  
  .y2k-rest-link:hover .y2k-corner {
    border-color: #ff00ff;
    box-shadow: 0 0 8px #ff00ff;
  }

  .top-left { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .top-right { top: -1px; right: -1px; border-left: none; border-bottom: none; }
  .bottom-left { bottom: -1px; left: -1px; border-right: none; border-top: none; }
  .bottom-right { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  /* Image Container */
  .y2k-img-container {
    position: relative;
    height: 180px;
    border-bottom: 1px dashed rgba(0, 229, 255, 0.5);
    overflow: hidden;
    background: #000;
  }

  .y2k-rest-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: contrast(1.3) saturate(1.2) brightness(0.9);
    transition: transform 0.5s ease, filter 0.3s ease;
  }

  .y2k-rest-link:hover .y2k-rest-img {
    transform: scale(1.1);
    filter: contrast(1.1) saturate(1.4) brightness(1.1);
  }

  /* CRT Scanlines over the image */
  .y2k-scanlines {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%, 
      rgba(0, 0, 0, 0.5) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 2;
  }

  /* Blinking Online Badge */
  .y2k-status-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid #00ff00;
    color: #00ff00;
    padding: 2px 8px;
    font-size: 0.85rem;
    letter-spacing: 1px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 6px;
    backdrop-filter: blur(4px);
  }

  .y2k-blink-dot {
    width: 8px;
    height: 8px;
    background-color: #00ff00;
    border-radius: 50%;
    box-shadow: 0 0 8px #00ff00;
    animation: y2k-blink 1.5s infinite;
  }

  @keyframes y2k-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* Text & Data Payload */
  .y2k-card-body {
    background: rgba(0, 0, 0, 0.3);
  }

  .y2k-rest-name {
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.4);
    letter-spacing: 1px;
    line-height: 1.2;
    transition: color 0.3s ease;
  }

  .y2k-rest-link:hover .y2k-rest-name {
    color: var(--cyan, #00e5ff);
    text-shadow: 0 0 8px var(--cyan, #00e5ff);
  }

  .y2k-label {
    color: #ff00ff; /* Magenta label */
    letter-spacing: 2px;
  }

  .y2k-rest-cuisine {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
    text-transform: uppercase;
  }
`;