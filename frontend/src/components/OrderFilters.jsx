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
    <div className="card p-3 mb-4 shadow-sm">
      <div className="row g-3">

        {/* Search */}
        <div className="col-md-3">
          <input
            type="text"
            name="search"
            placeholder="Search Order ID"
            className="form-control"
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div className="col-md-2">
          <select
            name="status"
            className="form-select"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All Status</option>
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
          <select
            name="paymentStatus"
            className="form-select"
            value={filters.paymentStatus}
            onChange={handleChange}
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* From Date */}
        <div className="col-md-2">
          <input
            type="date"
            name="from"
            className="form-control"
            value={filters.from}
            onChange={handleChange}
          />
        </div>

        {/* To Date */}
        <div className="col-md-2">
          <input
            type="date"
            name="to"
            className="form-control"
            value={filters.to}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="col-md-1 d-flex gap-2">
          <button
            className="btn btn-primary w-100"
            onClick={applyFilters}
          >
            Apply
          </button>
        </div>

      </div>

      <div className="mt-3 text-end">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
