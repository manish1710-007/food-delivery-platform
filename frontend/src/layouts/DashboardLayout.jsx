import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        // 1. Added 'w-100' so the entire layout stretches across your monitor
        <div className="d-flex w-100" style={{ minHeight: "100vh"}}>

            {/* Sidebar */}
            <DashboardSidebar />
            
            {/* Main Content Wrapper */}
            {/* 2. Added 'w-100', 'd-flex flex-column', and 'overflow-hidden' to force the right side to stretch and behave */}
            <div className="flex-grow-1 w-100 d-flex flex-column overflow-hidden">

                {/* Top Navbar */}
                <DashboardNavbar />
                
                {/* Page Content */}
                {/* 3. REMOVED the hardcoded 'bg-light' so your Admin Dark Mode can finally breathe! */}
                <div className="p-4" style={{ minHeight: "100vh" }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}