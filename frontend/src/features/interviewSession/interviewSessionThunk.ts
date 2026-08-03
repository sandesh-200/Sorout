import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { interviewSessionAPI } from "./interviewSessionAPI";
import type { CurrentQuestion, InterviewSession, SubmitAnswerRequest, SubmitAnswerResponse } from "./interviewSessionTypes";

interface ApiError {
  detail: string;
}

export const startInterview = createAsyncThunk<
  InterviewSession,
  number,
  { rejectValue: string }
>(
  "interviewSession/start",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await interviewSessionAPI.start(sessionId);

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ??
        "Failed to start interview."
      );
    }
  }
);


export const getCurrentQuestion = createAsyncThunk<
  CurrentQuestion,
  number,
  { rejectValue: string }
>(
  "interviewSession/getCurrentQuestion",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response =
        await interviewSessionAPI.getCurrentQuestion(
          sessionId
        );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ??
          "Failed to fetch current question."
      );
    }
  }
);


export const submitAnswer = createAsyncThunk<
  SubmitAnswerResponse,
  {
    sessionId: number;
    data: SubmitAnswerRequest;
  },
  { rejectValue: string }
>(
  "interviewSession/submitAnswer",
  async (
    { sessionId, data },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await interviewSessionAPI.submitAnswer(
          sessionId,
          data
        );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ??
          "Failed to submit answer."
      );
    }
  }
);