import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { AuthContext } from "./AuthContext";
import type {
    GetMeResponse,
    AuthProviderProps,
    MembershipInfo,
} from "@/types/auth";

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<GetMeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeOrg, setActiveOrg] = useState<MembershipInfo | null>(null);

    const fetchUser = async () => {
        try {
            const data = await getMe();
            setUser(data);
            if (data.memberships.length > 0 && !activeOrg) {
                setActiveOrg(data.memberships[0]);
            }

            return data;
        } catch {
            setUser(null);
            setActiveOrg(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                fetchUser,
                activeOrg,
                setActiveOrg,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}