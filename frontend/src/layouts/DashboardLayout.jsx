import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="d-flex" style={{ minHeight: "100vh"}}>

            {/* Sidebar */}
            <DashboardSidebar />
            
            {/* Main Content */}
            <div className="flex-grow-1">

                {/* Top Navbar */}
                <DashboardNavbar />
                
                {/* Page Content */}
                <div className="p-4 bg-light" style={{ minHeight: "100vh"}}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}