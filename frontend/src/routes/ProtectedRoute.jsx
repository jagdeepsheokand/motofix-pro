import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import useAuth from "../hooks/useAuth"; // Adjust path as needed

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // 1. Still checking authentication → show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 2. User is not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. User is authenticated → render the protected page
  return <Outlet />;
};

export default ProtectedRoute;