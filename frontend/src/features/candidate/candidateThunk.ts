import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import { candidateAPI } from "./candidateAPI";
import type { CandidateInterview, InterviewSession } from "./candidateTypes";

interface ApiError {
  detail: string;
}

export const getMyInterviews = createAsyncThunk<
  CandidateInterview[],
  void,
  { rejectValue: string }
>(
  "candidate/getMyInterviews",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await candidateAPI.getMyInterviews();

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ??
          "Failed to fetch interviews"
      );
    }
  }
);


export const startInterview = createAsyncThunk<
  InterviewSession,
  number,
  { rejectValue: string }
>(
  "candidate/startInterview",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response =
        await candidateAPI.startInterview(sessionId);

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ??
          "Failed to start interview"
      );
    }
  }
);