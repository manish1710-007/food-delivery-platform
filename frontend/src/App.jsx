import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/useAuth";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Restaurant from "./pages/Restaurant";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/my" element={<MyOrders />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          </Route>

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
