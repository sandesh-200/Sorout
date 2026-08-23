import {
  createSlice,
  isPending,
} from "@reduxjs/toolkit";

import type {
  ConversationInterviewState,
} from "./conversationInterviewTypes";

import {
  startConversation,
  sendMessage,
} from "./conversationInterviewThunk";

const initialState: ConversationInterviewState = {
  sessionId: null,

  messages: [],

  completed: false,

  loading: false,

  sendingMessage: false,

  error: null,
};

const conversationInterviewSlice = createSlice({
  name: "conversationInterview",

  initialState,

  reducers: {
    setSessionId(state, action) {
      state.sessionId = action.payload;
    },

    addCandidateMessage(state, action) {
      state.messages.push({
        id: Date.now(),

        role: "candidate",

        content: action.payload,

        created_at: new Date().toISOString(),
      });
    },

    resetConversation(state) {
      state.sessionId = null;
      state.messages = [];
      state.completed = false;
      state.loading = false;
      state.sendingMessage = false;
      state.error = null;
    },

    clearConversationError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      startConversation.fulfilled,
      (state, action) => {
        state.loading = false;

        state.messages = [action.payload];
      }
    );

    builder.addCase(
      sendMessage.fulfilled,
      (state, action) => {
        state.sendingMessage = false;

        state.messages.push(action.payload.message);

        state.completed = action.payload.completed;
      }
    );

    builder.addMatcher(
      isPending(startConversation),
      (state) => {
        state.loading = true;

        state.error = null;
      }
    );

    builder.addMatcher(
      isPending(sendMessage),
      (state) => {
        state.sendingMessage = true;

        state.error = null;
      }
    );
  },
});

export const {
  setSessionId,
  addCandidateMessage,
  resetConversation,
  clearConversationError,
} = conversationInterviewSlice.actions;

export default conversationInterviewSlice.reducer;