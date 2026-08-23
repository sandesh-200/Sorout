import type { InterviewState } from "@/features/interview/interviewTypes";
import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import {
  createInterview,
  deleteInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  assignCandidates,
  getMyInterviews
} from "./interviewThunk";

const initialState: InterviewState = {
  interviews: [],
  selectedInterview: null,
  assignmentResult: null,
  candidateInterviews: [],
  loading: false,
  error: null,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    clearSelectedInterview(state) {
      state.selectedInterview = null;
    },

    clearInterviewError(state) {
      state.error = null;
    },

    clearAssignmentResult(state) {
      state.assignmentResult = null;
    },
  },

  extraReducers: (builder) => {
    //fufilled
    builder.addCase(createInterview.fulfilled, (state, action) => {
      state.loading = false;
      state.interviews.unshift(action.payload);
    });

    builder.addCase(getAllInterviews.fulfilled, (state, action) => {
      state.loading = false;
      state.interviews = action.payload;
    });

    builder.addCase(getInterviewById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedInterview = action.payload;
    });

    builder.addCase(updateInterview.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedInterview = action.payload;

      const index = state.interviews.findIndex(
        (interview) => interview.id === action.payload.id
      );

      if (index !== -1) {
        state.interviews[index] = action.payload;
      }
    });

    builder.addCase(deleteInterview.fulfilled, (state, action) => {
      state.loading = false;
      state.interviews = state.interviews.filter(
        (interview) => interview.id !== action.payload
      );

      if (state.selectedInterview?.id === action.payload) {
        state.selectedInterview = null;
      }
    });

    builder.addCase(getMyInterviews.fulfilled, (state, action) => {
      state.loading = false;
      state.candidateInterviews = action.payload;
    });

    //matchers

    //pending
    builder.addMatcher(
      isPending(
        createInterview,
        getAllInterviews,
        getInterviewById,
        updateInterview,
        deleteInterview,
        assignCandidates,
        getMyInterviews
      ),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    //rejected
    builder.addMatcher(
      isRejected(
        createInterview,
        getAllInterviews,
        getInterviewById,
        updateInterview,
        deleteInterview,
        assignCandidates,
        getMyInterviews
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );
  },
})

export const {
  clearSelectedInterview,
  clearInterviewError,
  clearAssignmentResult
} = interviewSlice.actions

export default interviewSlice.reducer