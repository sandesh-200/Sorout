import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { Candidate } from "./candidateTypes";
import { candidateAPI } from "./candidateAPI";

interface ApiError {
  detail: string;
}

export const getAllCandidates = createAsyncThunk<
  Candidate[],
  void,
  { rejectValue: string }
>("adminCandidate/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await candidateAPI.getAllCandidates();
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(
      err.response?.data.detail ?? "Failed to fetch candidates"
    );
  }
});

export const getAvailableCandidates = createAsyncThunk<
  Candidate[],
  number,
  { rejectValue: string }
>(
  "adminCandidate/getAvailableCandidates",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await candidateAPI.getAvailableCandidates(interviewId);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      return rejectWithValue(
        err.response?.data.detail ?? "Failed to fetch available candidates"
      );
    }
  }
);
