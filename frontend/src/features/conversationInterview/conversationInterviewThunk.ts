import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { conversationInterviewAPI } from "./conversationInterviewAPI";
import type {
  ConversationStartResponse,
  ConversationMessageResponse,
} from "./conversationInterviewTypes";

interface ApiError {
  detail: string;
}



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
