import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardDataAPI } from "./dashboardAPI";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDashboardDataAPI();
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unexpected error occurred loading dashboard metrics.");
    }
  }
);