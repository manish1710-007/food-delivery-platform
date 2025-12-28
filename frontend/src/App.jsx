import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/useAuth";


import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Restaurant from "./pages/Restaurant";

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

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderSuccess />} />
            <Route path="/orders/my" element={<MyOrders />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
