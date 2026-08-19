import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingAnimation } from "@/components/shared/loading-animation";

interface ProtectedRouteProps {
    children: React.JSX.Element;
    allowedRoles?: ("admin" | "candidate")[];
}

export function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {
    const { user, loading, activeOrg } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingAnimation text="Loading Session..." />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Not onboarded → redirect to onboarding
    if (!user.is_onboarded && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />;
    }

    // Already onboarded, trying to revisit onboarding
    if (user.is_onboarded && location.pathname === "/onboarding") {
        const role = activeOrg?.role ?? user.memberships[0]?.role;

        return (
            <Navigate
                to={
                    role === "admin"
                        ? "/admin/dashboard"
                        : "/candidate/interviews"
                }
                replace
            />
        );
    }

    // Role check against active organization membership
    if (allowedRoles && activeOrg) {
        if (!allowedRoles.includes(activeOrg.role)) {
            const fallback =
                activeOrg.role === "admin"
                    ? "/admin/dashboard"
                    : "/candidate/interviews";

            return <Navigate to={fallback} replace />;
        }
    }

    return children;
}