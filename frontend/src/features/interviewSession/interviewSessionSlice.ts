import {
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import type { InterviewSessionState } from "./interviewSessionTypes";
import { getCurrentQuestion, startInterview, submitAnswer } from "./interviewSessionThunk";

const initialState: InterviewSessionState = {
  session: null,
  currentQuestion: null,

  loading: false,
  submitting: false,

  error: null,
};

const interviewSessionSlice = createSlice({
  name: "interviewSession",
  initialState,
  reducers: {
    clearSession(state) {
      state.session = null;
      state.currentQuestion = null;
    },

    clearCurrentQuestion(state) {
      state.currentQuestion = null;
    },

    clearInterviewSessionError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fulfilled
    builder.addCase(
      startInterview.fulfilled,
      (state, action) => {
        state.loading = false;
        state.session = action.payload;
      }
    );

    builder.addCase(
  getCurrentQuestion.fulfilled,
  (state, action) => {
    state.loading = false;
    state.currentQuestion = action.payload;
  }
);

builder.addCase(
  submitAnswer.fulfilled,
  (state, action) => {
    state.submitting = false;

    if (action.payload.completed) {
      state.currentQuestion = null;
    } else {
      state.currentQuestion =
        {
        question_id: action.payload.question_id!,
        order: action.payload.order!,
        question_text: action.payload.question_text!,
        category: action.payload.category!,
        total_questions: state.currentQuestion?.total_questions ?? 10
      };
    }
  }
);

    // Pending
    builder.addMatcher(
      isPending(startInterview,getCurrentQuestion),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
  isPending(submitAnswer),
  (state) => {
    state.submitting = true;
    state.error = null;
  }
);

    // Rejected
    builder.addMatcher(
      isRejected(startInterview,getCurrentQuestion),
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );

    builder.addMatcher(
  isRejected(submitAnswer),
  (state, action) => {
    state.submitting = false;
    state.error = action.payload as string;
  }
);
  },
});

export const {
  clearSession,
  clearCurrentQuestion,
  clearInterviewSessionError,
} = interviewSessionSlice.actions;

export default interviewSessionSlice.reducer;