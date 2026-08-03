import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";

import type { CandidateState } from "./candidateTypes";

import { getMyInterviews, startInterview } from "./candidateThunk";

const initialState: CandidateState = {
  interviews: [],

  session:null,

  loading: false,

  error: null,
};

const candidateSlice = createSlice({
  name: "candidate",

  initialState,

  reducers: {
    clearCandidateError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      getMyInterviews.fulfilled,
      (state, action) => {
        state.loading = false;
        state.interviews = action.payload;
      }
    );

    builder.addCase(
  startInterview.fulfilled,
  (state, action) => {
    state.loading = false;

    state.session = action.payload;

    const interview = state.interviews.find(
      (i) => i.session_id === action.payload.id
    );

    if (interview) {
      interview.status = action.payload.status;
    }
  }
);

    builder.addMatcher(
      isPending(getMyInterviews,startInterview),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isRejected(getMyInterviews,startInterview),
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );
  },
});

export const {
  clearCandidateError,
} = candidateSlice.actions;

export default candidateSlice.reducer;