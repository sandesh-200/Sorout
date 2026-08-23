import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminJoinLinkAPI } from "./joinLinkAPI";
import type { AxiosError } from "axios";

export const getJoinLinks = createAsyncThunk(
  "adminJoinLink/getJoinLinks",
  async (orgId: number, { rejectWithValue }) => {
    try {
      const response = await adminJoinLinkAPI.getJoinLinks(orgId);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Failed to fetch join links"
      );
    }
  }
);

export const createJoinLink = createAsyncThunk(
  "adminJoinLink/createJoinLink",
  async (
    { orgId, expires_at }: { orgId: number; expires_at?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminJoinLinkAPI.createJoinLink(orgId, {
        expires_at,
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Failed to create join link"
      );
    }
  }
);

export const deactivateJoinLink = createAsyncThunk(
  "adminJoinLink/deactivateJoinLink",
  async (
    { orgId, linkId }: { orgId: number; linkId: number },
    { rejectWithValue }
  ) => {
    try {
      await adminJoinLinkAPI.deactivateJoinLink(orgId, linkId);
      return linkId;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Failed to deactivate join link"
      );
    }
  }
);