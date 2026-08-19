import { z } from "zod";
import { type ReactNode } from "react";

export const registerFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  send_verification: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export type RegisterRequest = Omit<
  RegisterFormData,
  "confirmPassword"
>;


export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof loginSchema>;

export interface AuthResponse {
  message: string;
}

export interface MembershipInfo {
  id: number;
  organization_id: number;
  organization_name: string;
  role: "admin" | "candidate";
  joined_at: string;
}

export interface GetMeResponse {
  id: number;
  name: string | null;
  email: string;
  is_onboarded: boolean;
  memberships: MembershipInfo[];
}

export interface AuthContextType {
  user: GetMeResponse | null;
  setUser: React.Dispatch<React.SetStateAction<GetMeResponse | null>>;
  loading: boolean;
  fetchUser: () => Promise<GetMeResponse | null>;
  activeOrg: MembershipInfo | null;
  setActiveOrg: (org: MembershipInfo | null) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}