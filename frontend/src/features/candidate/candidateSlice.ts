import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import type { AdminCandidateState } from "./candidateTypes";
import { getAllCandidates, getAvailableCandidates } from "./candidateThunk";

const initialState: AdminCandidateState = {
  candidates: [],
  availableCandidates: [],
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: "adminCandidate",

  initialState,

  reducers: {
    clearCandidateError(state) {
      state.error = null;
    },
    clearAvailableCandidates(state) {
      state.availableCandidates = [];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllCandidates.fulfilled, (state, action) => {
      state.loading = false;
      state.candidates = action.payload;
    });

    builder.addCase(getAvailableCandidates.fulfilled, (state, action) => {
      state.loading = false;
      state.availableCandidates = action.payload;
    });

    builder.addMatcher(isPending(getAllCandidates, getAvailableCandidates), (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isRejected(getAllCandidates, getAvailableCandidates), (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCandidateError, clearAvailableCandidates } = candidateSlice.actions;

export default candidateSlice.reducer;
