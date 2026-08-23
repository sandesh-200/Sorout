import {
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import type { QuestionState } from "./questionTypes";

import {
  generateQuestions,
  getQuestions,
} from "./questionThunk";

const initialState: QuestionState = {
  questions: [],
  generatingId: null,
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "question",

  initialState,

  reducers: {
    clearQuestions(state) {
      state.questions = [];
    },

    clearQuestionError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // getQuestions fulfilled
    builder.addCase(
      getQuestions.fulfilled,
      (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      }
    );

    // generateQuestions fulfilled
    builder.addCase(
      generateQuestions.fulfilled,
      (state) => {
        state.generatingId = null;
      }
    );

    // getQuestions pending
    builder.addMatcher(
      isPending(getQuestions),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // getQuestions rejected
    builder.addMatcher(
      isRejected(getQuestions),
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );

    // generateQuestions pending
    builder.addMatcher(
      isPending(generateQuestions),
      (state, action) => {
        state.error = null;
        state.generatingId = action.meta.arg;
      }
    );

    // generateQuestions rejected
    builder.addMatcher(
      isRejected(generateQuestions),
      (state, action) => {
        state.generatingId = null;
        state.error = action.payload as string;
      }
    );
  },
});

export const {
  clearQuestions,
  clearQuestionError,
} = questionSlice.actions;

export default questionSlice.reducer;