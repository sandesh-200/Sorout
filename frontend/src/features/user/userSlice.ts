import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";

import type { UserState } from "./userTypes";
import { completeUserOnboarding } from "./userThunk";

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(completeUserOnboarding.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addMatcher(isPending(completeUserOnboarding), (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isRejected(completeUserOnboarding), (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUserError, setUser } = userSlice.actions;

export default userSlice.reducer;