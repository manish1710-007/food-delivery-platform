import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/useAuth";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import RestaurantLayout from "./pages/RestaurantLayout";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Restaurant from "./pages/Restaurant";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* Admin pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminProducts from "./pages/admin/AdminProducts";

/* Restaurant pages */
import RestaurantOrders from "./pages/RestaurantOrders";
import RestaurantProfile from "./pages/RestaurantProfile";
import RestaurantMenu from "./pages/RestaurantMenu";
import RestaurantMenuForm from "./pages/RestaurantMenuForm";

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


          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/my" element={<MyOrders />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />

          </Route>


          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>

              <Route element={<DashboardLayout />}>

                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                <Route path="/admin/analytics" element={<AdminAnalytics />} />

                <Route path="/admin/users" element={<AdminUsers />} />

                <Route path="/admin/restaurants" element={<AdminRestaurants />} />

                <Route path="/admin/orders" element={<AdminOrders />} />

                <Route path="/admin/products" element={<AdminProducts />} />

              </Route>

            </Route>
          </Route>


          {/* RESTAURANT OWNER ROUTES */}
          <Route element={<ProtectedRoute />}>

            <Route element={<RestaurantLayout />}>

              <Route path="/restaurant/dashboard" element={<RestaurantOrders />} />

              <Route path="/restaurant/profile" element={<RestaurantProfile />} />

              <Route path="/restaurant/menu" element={<RestaurantMenu />} />

              <Route path="/restaurant/menu/add" element={<RestaurantMenuForm />} />

            </Route>

          </Route>


          {/* fallback */}
          <Route path="*" element={<Home />} />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
