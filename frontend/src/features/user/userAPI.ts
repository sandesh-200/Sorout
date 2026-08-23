import api from "@/api/axios";
import type { GetMeResponse } from "@/types/auth";
import type { UserOnboardingPayload } from "./userTypes";

export const userAPI = {

  //done
  completeOnboarding: (payload: UserOnboardingPayload) =>api.post<GetMeResponse>("/users/onboarding", payload),
};