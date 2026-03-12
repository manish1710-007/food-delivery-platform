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

      <div className="y2k-panel mb-4 shadow-lg">
        {/* Retro Terminal Header */}
        <div className="y2k-panel-header d-flex justify-content-between px-3 py-1">
          <span>&gt; QUERY_MATRIX.exe</span>
          <span>[SYS.FILTERS]</span>
        </div>

        <div className="p-4">
          <div className="row g-3 align-items-end">

            {/* Search */}
            <div className="col-md-3">
              <label className="y2k-label">/// SEARCH_ID</label>
              <input
                type="text"
                name="search"
                placeholder="Enter Order ID..."
                className="y2k-input w-100"
                value={filters.search}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="col-md-2">
              <label className="y2k-label">/// STATUS</label>
              <select
                name="status"
                className="y2k-select w-100"
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

            {/* Payment */}
            <div className="col-md-2">
              <label className="y2k-label">/// PAYMENT</label>
              <select
                name="paymentStatus"
                className="y2k-select w-100"
                value={filters.paymentStatus}
                onChange={handleChange}
              >
                <option value="">[ ALL_PAYMENTS ]</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* From Date */}
            <div className="col-md-2">
              <label className="y2k-label">/// FROM_DATE</label>
              <input
                type="date"
                name="from"
                className="y2k-input w-100"
                value={filters.from}
                onChange={handleChange}
              />
            </div>

            {/* To Date */}
            <div className="col-md-2">
              <label className="y2k-label">/// TO_DATE</label>
              <input
                type="date"
                name="to"
                className="y2k-input w-100"
                value={filters.to}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="col-md-1 d-flex gap-2">
              <button
                className="y2k-btn w-100 h-100"
                onClick={applyFilters}
              >
                [ EXECUTE ]
              </button>
            </div>
          </div>

          <div className="mt-4 text-end">
            <button
              className="y2k-btn-reset"
              onClick={resetFilters}
            >
              &lt; RESET_DATABANK &gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  /* Container Panel */
  .y2k-panel {
    background: rgba(10, 10, 18, 0.85);
    border: 1px solid var(--cyan);
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.15);
    backdrop-filter: blur(10px);
    font-family: 'VT323', monospace;
    color: #fff;
  }

  /* Terminal Header */
  .y2k-panel-header {
    background: var(--cyan);
    color: #010308;
    font-weight: bold;
    letter-spacing: 0.1em;
    font-size: 1.1rem;
    text-transform: uppercase;
  }

  /* Labels */
  .y2k-label {
    display: block;
    font-size: 0.85rem;
    color: #ff00ff; /* Magenta labels */
    margin-bottom: 5px;
    letter-spacing: 2px;
    text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
  }

  /* Inputs & Selects */
  .y2k-input,
  .y2k-select {
    background: rgba(0, 0, 0, 0.5);
    border: 1px dashed rgba(0, 229, 255, 0.5);
    color: #fff;
    padding: 8px 12px;
    font-family: inherit;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    outline: none;
  }

  /* Fix dropdown options being invisible in some browsers */
  .y2k-select option {
    background: #010308;
    color: var(--cyan);
  }

  /* Glow effect on focus */
  .y2k-input:focus,
  .y2k-select:focus {
    border: 1px solid var(--cyan);
    box-shadow: inset 0 0 10px rgba(0, 229, 255, 0.2), 0 0 10px rgba(0, 229, 255, 0.4);
    background: rgba(0, 229, 255, 0.05);
  }

  /* Invert the calendar icon for date inputs so it's visible on dark bg */
  .y2k-input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(130deg);
    cursor: pointer;
  }

  /* Primary Button */
  .y2k-btn {
    background: transparent;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    font-family: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.2s;
    text-shadow: 0 0 5px var(--cyan);
    padding: 8px 16px;
  }

  .y2k-btn:hover {
    background: var(--cyan);
    color: #010308;
    box-shadow: 0 0 15px var(--cyan);
    text-shadow: none;
  }

  /* Reset Button */
  .y2k-btn-reset {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .y2k-btn-reset:hover {
    color: #ff00ff;
    text-shadow: 0 0 8px #ff00ff;
  }
`;