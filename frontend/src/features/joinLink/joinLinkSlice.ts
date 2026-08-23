import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getJoinLinks,
  createJoinLink,
  deactivateJoinLink,
} from "./joinLinkThunk";
import type { AdminJoinLinkState, JoinLinkItem } from "./joinLinkTypes";

const initialState: AdminJoinLinkState = {
  joinLinks: [],
  loading: false,
  error: null,
};

const joinLinkSlice = createSlice({
  name: "adminJoinLink",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getJoinLinks
    builder
      .addCase(getJoinLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJoinLinks.fulfilled, (state, action: PayloadAction<JoinLinkItem[]>) => {
        state.loading = false;
        state.joinLinks = action.payload;
      })
      .addCase(getJoinLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createJoinLink
    builder
      .addCase(createJoinLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJoinLink.fulfilled, (state, action: PayloadAction<JoinLinkItem>) => {
        state.loading = false;
        state.joinLinks.unshift(action.payload);
      })
      .addCase(createJoinLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // deactivateJoinLink
    builder
      .addCase(deactivateJoinLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateJoinLink.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.joinLinks = state.joinLinks.filter(
          (link) => link.id !== action.payload
        );
      })
      .addCase(deactivateJoinLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default joinLinkSlice.reducer;