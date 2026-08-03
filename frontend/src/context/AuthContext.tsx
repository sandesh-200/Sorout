import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";
import {  type GetMeResponse, type AuthContextType,type AuthProviderProps } from "@/types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }:AuthProviderProps) {
  const [user, setUser] = useState<GetMeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
      return data
    } catch (err) {
      setUser(null);
      return null
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};