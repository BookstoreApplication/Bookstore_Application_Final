import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && role) {
    const userRoles = Array.isArray(role) ? role : [role];
    const hasPermission = userRoles.some(r => allowedRoles.includes(r));
    if (!hasPermission) return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
