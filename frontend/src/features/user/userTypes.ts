import type { GetMeResponse } from "@/types/auth";

export type UserRole = "admin" | "candidate";

export interface UserOnboardingPayload {
  role: UserRole;
  displayName: string;
}

export interface UserState {
  user: GetMeResponse | null;
  loading: boolean;
  error: string | null;
}