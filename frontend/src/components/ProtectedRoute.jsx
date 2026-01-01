import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until auth is restored
  if (loading) {
    return null; // or spinner
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Support two usage patterns:
  // 1) <Route element={<ProtectedRoute />}>
  //      <Route path="/x" element={<X/>} />
  //    </Route>
  //    (ProtectedRoute should render an <Outlet /> for child routes)
  // 2) <Route path="/x" element={<ProtectedRoute><X/></ProtectedRoute>} />
  //    (ProtectedRoute simply returns its children)
  if (children) return children;

  return <Outlet />;
}
  