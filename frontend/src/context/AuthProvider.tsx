import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { AuthContext } from "./AuthContext";
import type {
    GetMeResponse,
    AuthProviderProps,
} from "@/types/auth";

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<GetMeResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await getMe();
            setUser(data);
            return data;
        } catch {
            setUser(null);
            return null;
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