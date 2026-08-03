import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ShimmerLoading } from "@/components/shared/shimmer-loading";

interface ProtectedRouteProps {
  children: React.JSX.Element;
  allowedRoles?: ("admin" | "candidate")[]; // Optional: filter access by role
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Show a loading state while checking the HttpOnly cookie session
  if (loading) {
    return (
      <ShimmerLoading text="Loading Session..."/>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

if (
  allowedRoles &&
  !allowedRoles.includes(user.role)
) {
  return (
    <Navigate
      to={
        user.role === "admin"
          ? "/admin/dashboard"
          : "/candidate/interviews"
      }
      replace
    />
  );
}

  return children;
}