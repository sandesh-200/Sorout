import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingAnimation } from "@/components/shared/loading-animation";

interface ProtectedRouteProps {
  children: React.JSX.Element;
  allowedRoles?: ("admin" | "candidate")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <LoadingAnimation text="Loading Session..."/>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

if (!user.is_onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

if (user.is_onboarded && location.pathname === "/onboarding") {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/candidate/interviews"}
        replace
      />
    );
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