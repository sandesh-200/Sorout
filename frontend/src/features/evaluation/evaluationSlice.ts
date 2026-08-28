import {
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import type {
  EvaluationState,
  EvaluationInProgressResponse,
  InterviewEvaluation,
} from "./evaluationtypes";

import {
  evaluateInterview,
  getEvaluationResult,
} from "./evaluationThunk";

const initialState: EvaluationState = {
  evaluation: null,
  status: "idle",
  error: null,
};

function isEvaluationInProgress(
  result: InterviewEvaluation | EvaluationInProgressResponse
): result is EvaluationInProgressResponse {
  return "status" in result && result.status === "evaluating";
}

const evaluationSlice = createSlice({
  name: "evaluation",

  initialState,

  reducers: {
    clearEvaluation: (state) => {
      state.evaluation = null;
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      evaluateInterview.fulfilled,
      (state) => {
        state.status = "evaluating";
        state.error = null;
      }
    );

    builder.addCase(
      getEvaluationResult.fulfilled,
      (state, action) => {
        const result = action.payload;

        if (isEvaluationInProgress(result)) {
          state.status = "evaluating";
          state.error = null;
          return;
        }

        state.status = "completed";
        state.evaluation = result;
        state.error = null;
      }
    );

    builder.addMatcher(
      isPending(evaluateInterview, getEvaluationResult),
      (state) => {
        state.status = "loading";
        state.error = null;
      }
    );

    builder.addMatcher(
      isRejected(evaluateInterview, getEvaluationResult),
      (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      }
    );
  },
});

export const { clearEvaluation } = evaluationSlice.actions;

export default evaluationSlice.reducer;