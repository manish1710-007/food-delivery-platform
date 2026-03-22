import { useState } from "react";

export default function OrderFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    from: "",
    to: "",
    search: ""
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const resetFilters = () => {
    const reset = {
      status: "",
      paymentStatus: "",
      from: "",
      to: "",
      search: ""
    };
    setFilters(reset);
    onFilter(reset);
  };

  return (
    <>
      <style>{styles}</style>

      <div className="y2k-filter-panel mb-2 shadow-lg overflow-hidden">
        
        {/* Retro Terminal Header */}
        <div className="y2k-panel-header d-flex justify-content-between align-items-center px-4 py-2 border-bottom border-cyan">
          <span className="font-monospace fw-bold d-flex align-items-center gap-2">
            <span className="blink">_</span> QUERY_MATRIX.exe
          </span>
          <span className="font-monospace small opacity-75">[SYS.FILTERS]</span>
        </div>

        <div className="p-3 p-md-4 bg-dark-glass">
          
          {/* Search & Dropdowns */}
          <div className="row g-3 mb-3">
            
            {/* Search */}
            <div className="col-12 col-md-4">
              <label className="y2k-label">/// SEARCH_ID</label>
              <div className="y2k-input-group d-flex">
                <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">ID:</span>
                <input
                  type="text"
                  name="search"
                  placeholder="Enter Order ID..."
                  className="y2k-input flex-grow-1 p-2"
                  value={filters.search}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Status */}
            <div className="col-6 col-md-4">
              <label className="y2k-label">/// STATUS</label>
              <div className="y2k-input-group d-flex">
                <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">ST:</span>
                <select
                  name="status"
                  className="y2k-select flex-grow-1 p-2"
                  value={filters.status}
                  onChange={handleChange}
                >
                  <option value="">[ ALL_STATUS ]</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="preparing">Preparing</option>
                  <option value="on_the_way">On The Way</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Payment */}
            <div className="col-6 col-md-4">
              <label className="y2k-label">/// PAYMENT</label>
              <div className="y2k-input-group d-flex">
                <span className="y2k-input-prefix px-2 py-2 text-cyan border-end border-cyan">PAY:</span>
                <select
                  name="paymentStatus"
                  className="y2k-select flex-grow-1 p-2"
                  value={filters.paymentStatus}
                  onChange={handleChange}
                >
                  <option value="">[ ALL_PAYMENTS ]</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row g-3 align-items-end">
            
            {/* From Date */}
            <div className="col-6 col-md-3">
              <label className="y2k-label">/// FROM_DATE</label>
              <div className="y2k-input-group d-flex">
                <input
                  type="date"
                  name="from"
                  className="y2k-input flex-grow-1 p-2"
                  value={filters.from}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* To Date */}
            <div className="col-6 col-md-3">
              <label className="y2k-label">/// TO_DATE</label>
              <div className="y2k-input-group d-flex">
                <input
                  type="date"
                  name="to"
                  className="y2k-input flex-grow-1 p-2"
                  value={filters.to}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-12 col-md-6 d-flex justify-content-md-end justify-content-between gap-3 mt-4 mt-md-0">
              <button
                className="y2k-btn-reset d-flex align-items-center"
                onClick={resetFilters}
              >
                &lt; RESET_DATABANK &gt;
              </button>
              
              <button
                className="y2k-btn-execute px-4 py-2 font-monospace fw-bold"
                onClick={applyFilters}
              >
                [ EXECUTE_QUERY ]
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  /* Local Component Theme Overrides */
  :root {
    --cyan: #00e5ff;
    --magenta: #ff0055;
    --cyan-dim: rgba(0, 229, 255, 0.1);
  }

  /* Container Panel */
  .y2k-filter-panel {
    background: transparent;
    border: 1px solid var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    color: #e0e6ed;
    position: relative;
  }
  
  .bg-dark-glass {
    background-color: rgba(0, 0, 0, 0.4);
  }

  /* Terminal Header */
  .y2k-panel-header {
    background: var(--cyan);
    color: #010308;
    letter-spacing: 1px;
  }

  /* Labels */
  .y2k-label {
    display: block;
    font-size: 0.75rem;
    color: var(--magenta);
    margin-bottom: 6px;
    letter-spacing: 1px;
    text-shadow: 0 0 5px rgba(255, 0, 85, 0.4);
  }

  /* Input Groups (Matches the dashboard style) */
  .y2k-input-group {
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(0, 229, 255, 0.4);
    transition: all 0.2s;
  }
  .y2k-input-group:focus-within {
    border-color: var(--cyan);
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.15);
  }
  
  .y2k-input-prefix {
    font-size: 0.8rem;
    background: rgba(0, 229, 255, 0.05);
    min-width: 40px;
    text-align: center;
  }

  /* Inputs & Selects */
  .y2k-input,
  .y2k-select {
    background: transparent;
    border: none;
    color: var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.95rem;
    outline: none;
  }
  
  .y2k-input::placeholder {
    color: rgba(0, 229, 255, 0.3);
  }

  /* Fix dropdown options being invisible in some browsers */
  .y2k-select option {
    background: #010308;
    color: var(--cyan);
  }

  /* Retained your awesome inverted calendar icon hack! */
  .y2k-input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(130deg);
    cursor: pointer;
    opacity: 0.8;
  }
  .y2k-input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  /* Primary Execute Button */
  .y2k-btn-execute {
    background: rgba(0, 229, 255, 0.1);
    border: 1px solid var(--cyan);
    color: var(--cyan);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    text-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
    box-shadow: inset 0 0 10px rgba(0, 229, 255, 0.1);
  }

  .y2k-btn-execute:hover {
    background: var(--cyan);
    color: #010308;
    box-shadow: 0 0 15px var(--cyan);
    text-shadow: none;
  }

  /* Reset Button */
  .y2k-btn-reset {
    background: transparent;
    border: none;
    color: rgba(224, 230, 237, 0.5);
    font-family: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .y2k-btn-reset:hover {
    color: var(--magenta);
    text-shadow: 0 0 8px var(--magenta);
  }
  
  .blink { animation: blinker 1s steps(2, start) infinite; }
  @keyframes blinker { to { visibility: hidden; } }
`;