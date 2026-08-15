import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import type { GetMeResponse } from "@/types/auth";
import { userAPI } from "./userAPI";
import type { UserOnboardingPayload } from "./userTypes";

interface ApiError {
  detail: string;
}

export const completeUserOnboarding = createAsyncThunk<
  GetMeResponse,
  UserOnboardingPayload,
  { rejectValue: string }
>(
  "user/completeOnboarding",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userAPI.completeOnboarding(payload);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ?? "Failed to complete onboarding"
      );
    }
  }
);