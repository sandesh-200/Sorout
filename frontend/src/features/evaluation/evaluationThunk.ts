import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { evaluationAPI } from './evaluationAPI'
import { type InterviewEvaluation } from './evaluationtypes'

interface ApiError {
    detail:string
}

export const evaluateInterview = createAsyncThunk<
InterviewEvaluation,
number,
{rejectValue:string}
>("evaluation/evaluateInterview",
    async(sessionId,{rejectWithValue})=>{
try {
    const response = await evaluationAPI.evaluateInterview(sessionId);
    return response.data
} catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(
        err.response?.data.detail??"Failed to evaluate interview"
    )
}
})