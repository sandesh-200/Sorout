import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { conversationInterviewAPI } from "./conversationInterviewAPI";
import type {
  ConversationStartResponse,
  ConversationMessageResponse,
  InterviewEvaluation,
} from "./conversationInterviewTypes";

interface ApiError {
  detail: string;
}

/**
 * Starts interview.
 * Returns the very first AI message.
 */
export const startConversation = createAsyncThunk<
  ConversationStartResponse,
  number,
  { rejectValue: string }
>(
  "conversation/startConversation",

  async (sessionId, { rejectWithValue }) => {
    try {
      const response =
        await conversationInterviewAPI.startConversation(
          sessionId
        );

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

/**
 * Sends candidate message.
 * Returns AI reply + completed flag.
 */
export const sendMessage = createAsyncThunk<
  ConversationMessageResponse,
  {
    sessionId: number;
    message: string;
  },
  { rejectValue: string }
>(
  "conversation/sendMessage",

  async (data, { rejectWithValue }) => {
    try {
      const response =
        await conversationInterviewAPI.sendMessage(
          data.sessionId,
          data.message
        );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ??
          "Failed to send message."
      );
    }
  }
);

/**
 * Evaluate completed interview.
 */
export const evaluateInterview = createAsyncThunk<
  InterviewEvaluation,
  number,
  { rejectValue: string }
>(
  "conversation/evaluateInterview",

  async (sessionId, { rejectWithValue }) => {
    try {
      const response =
        await conversationInterviewAPI.evaluateInterview(
          sessionId
        );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ??
          "Failed to evaluate interview."
      );
    }
  }
);