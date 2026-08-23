import { createAsyncThunk } from '@reduxjs/toolkit'
import { type AxiosError } from 'axios'

import { questionAPI } from './questionAPI'
import { type InterviewQuestion } from './questionTypes'

interface ApiError {
    detail:string
}

export const generateQuestions = createAsyncThunk<
number,
number,
{rejectValue:string}
>(
    "question/generateQuestions",
    async(interviewId,{rejectWithValue})=>{
        try {
            await questionAPI.generateQuestions(interviewId);
            return interviewId;
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            return rejectWithValue(
                err.response?.data.detail ?? "Failed to generate questions"
            )
        }
    }
)

export const getQuestions = createAsyncThunk<
InterviewQuestion[],
number,
{rejectValue:string}
>(
    "question/getQuestions",
    async(interviewId,{rejectWithValue})=>{
        try {
            const response = await questionAPI.getQuestions(interviewId)
            return response.data
        } catch (error) {
            const err = error as AxiosError<ApiError>
            return rejectWithValue(
                err.response?.data.detail?? "Failed to fetch questions"
            )
        }
    }
)

