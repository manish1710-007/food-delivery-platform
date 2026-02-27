import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // Array of admin modules to keep our code clean and mapping easy
  const adminModules = [
    { 
      title: "Analytics", 
      path: "/admin/analytics", 
      icon: "📈", 
      desc: "View sales, traffic, and platform revenue." 
    },
    { 
      title: "Restaurants", 
      path: "/admin/restaurants", 
      icon: "🏪", 
      desc: "Approve and manage partner restaurants." 
    },
    { 
      title: "Products", 
      path: "/admin/products", 
      icon: "🍔", 
      desc: "Manage global menu items and categories." 
    },
    { 
      title: "Orders", 
      path: "/admin/orders", 
      icon: "🛵", 
      desc: "Track active deliveries and order history." 
    },
    { 
      title: "Users", 
      path: "/admin/users", 
      icon: "👥", 
      desc: "Manage customer, driver, and admin accounts." 
    },
  ];

  return (
    <div className="container-fluid p-4 p-md-5">
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">Welcome to your control center.</p>
        </div>
      </div>

      {/* Grid of Module Cards */}
      <div className="row g-4">
        {adminModules.map((mod, index) => (
          <div className="col-xl-4 col-lg-6 col-md-6" key={index}>
            <Link to={mod.path} className="text-decoration-none">
              <div 
                className="card custom-card h-100 shadow-sm border-0 rounded-4 p-4 admin-card-hover"
              >
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="d-flex justify-content-center align-items-center bg-light rounded-circle me-3 shadow-sm"
                    style={{ width: "60px", height: "60px", fontSize: "28px" }}
                  >
                    {mod.icon}
                  </div>
                  <h4 className="fw-bold text-body m-0">{mod.title}</h4>
                </div>
                <p className="text-muted mb-0">{mod.desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}