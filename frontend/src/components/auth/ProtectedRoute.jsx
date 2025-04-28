// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { currentUser, loading, isAdmin } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If adminOnly is true, check if user is admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  // If user is authenticated and meets role requirements, render children
  return <Outlet />;
};

export default ProtectedRoute;
