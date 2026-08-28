import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { evaluationAPI } from "./evaluationAPI";
import {
  type EvaluationResultResponse,
  type EvaluationStartedResponse,
} from "./evaluationtypes";

interface ApiError {
  detail: string;
}

export const evaluateInterview = createAsyncThunk<
  EvaluationStartedResponse,
  number,
  { rejectValue: string }
>("evaluation/evaluateInterview", async (sessionId, { rejectWithValue }) => {
  try {
    const response = await evaluationAPI.evaluateInterview(sessionId);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;

    return rejectWithValue(
      err.response?.data.detail ?? "Failed to evaluate interview"
    );
  }
});

export const getEvaluationResult = createAsyncThunk<
  EvaluationResultResponse,
  number,
  { rejectValue: string }
>("evaluation/getEvaluationResult", async (sessionId, { rejectWithValue }) => {
  try {
    const response = await evaluationAPI.getEvaluationResult(sessionId);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;

    return rejectWithValue(
      err.response?.data.detail ?? "Failed to load evaluation result"
    );
  }
});