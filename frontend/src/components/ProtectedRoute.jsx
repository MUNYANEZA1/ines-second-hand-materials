// src/components/ProtectedRoute.jsx
// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ requiresAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if admin access is required but the user is not an admin
  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  // If user is authenticated (and isAdmin if necessary), render protected content
  return <Outlet />;
};

export default ProtectedRoute;
