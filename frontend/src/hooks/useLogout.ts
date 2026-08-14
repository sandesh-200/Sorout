// hooks/useLogout.ts
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/api/auth";

export function useLogout(redirectTo = "/login") {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return handleLogout;
}