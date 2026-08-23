import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AssignCandidatesRequest, AssignCandidatesResponse, CreateInterviewRequest, Interview, UpdateInterviewRequest, CandidateInterview } from "./interviewTypes";
import { interviewAPI } from "./InterviewAPI";
import type { AxiosError } from "axios";

interface ApiError{
    detail:string
}

//create Interview
export const createInterview = createAsyncThunk<
Interview,
CreateInterviewRequest,
{rejectValue:string}
>("interview/create",async(data,{rejectWithValue})=>{
    try {
        const response = await interviewAPI.create(data);
        return response.data
    } catch (error) {
        const err = error as AxiosError<ApiError>;
        return rejectWithValue(
            err.response?.data.detail ?? "Failed to create interview"
        )
    }
})

//Get all interviews
export const getAllInterviews = createAsyncThunk<Interview[],void,{rejectValue:string}>
("interview/getAll",async(_,{rejectWithValue})=>{
    try {
        const response = await interviewAPI.getAll()
        return response.data
    } catch (error) {
        const err = error as AxiosError<ApiError>;
         return rejectWithValue(
      err.response?.data.detail ?? "Failed to fetch interviews"
    );
    }
})

//Get interview by id
export const getInterviewById = createAsyncThunk<
  Interview,
  number,
  { rejectValue: string }
>("interview/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await interviewAPI.getById(id);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;

    return rejectWithValue(
      err.response?.data.detail ?? "Failed to fetch interview"
    );
  }
});

//Update Interview
export const updateInterview = createAsyncThunk<
  Interview,
  { id: number; data: UpdateInterviewRequest },
  { rejectValue: string }
>("interview/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await interviewAPI.update(id, data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;

    return rejectWithValue(
      err.response?.data.detail ?? "Failed to update interview"
    );
  }
});


//Delete Interview
export const deleteInterview = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("interview/delete", async (id, { rejectWithValue }) => {
  try {
    await interviewAPI.delete(id);
    return id;
  } catch (error) {
    const err = error as AxiosError<ApiError>;

    return rejectWithValue(
      err.response?.data.detail ?? "Failed to delete interview"
    );
  }
});


export const assignCandidates = createAsyncThunk<
  AssignCandidatesResponse,
  {
    interviewId: number;
    data: AssignCandidatesRequest;
  },
  {
    rejectValue: string;
  }
>(
  "interview/assignCandidates",
  async ({ interviewId, data }, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.assignCandidates(
        interviewId,
        data
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return rejectWithValue(
        err.response?.data.detail ??
          "Failed to assign candidates"
      );
    }
  }
);

export const getMyInterviews = createAsyncThunk<
  CandidateInterview[],
  void,
  { rejectValue: string }
>(
  "candidate/getMyInterviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.getMyInterviews();
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      return rejectWithValue(
        err.response?.data.detail ?? "Failed to fetch interviews"
      );
    }
  }
);

