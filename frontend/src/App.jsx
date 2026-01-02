import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/useAuth";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import Restaurant from "./pages/Restaurant";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/restaurant/:id" element={<Restaurant />} />

          {/* User protected */}
          <Route element={<ProtectedRoute roles={["User"]} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/my" element={<MyOrders />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
          </Route>

          {/* Restaurant protected */}
          <Route element={<ProtectedRoute roles={["restaurant"]} />}>
            <Route
              path="/restaurant/dashboard"
              element={<RestaurantDashboard />}
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
