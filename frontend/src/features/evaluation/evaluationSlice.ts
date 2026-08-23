import { createSlice,isPending,isRejected } from '@reduxjs/toolkit'

import { type EvaluationState } from './evaluationtypes'

import { evaluateInterview } from './evaluationThunk'

const initialState:EvaluationState={
    evaluation:null,
    loading:false,
    error:null
}

const evaluationSlice = createSlice({
    name:"evaluation",
    initialState,
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(
            evaluateInterview.fulfilled,
            (state,action)=>{
                state.loading = false
                state.evaluation = action.payload
            }
        );

        builder.addMatcher(
            isPending(evaluateInterview),
            (state)=>{
                state.loading = true;
                state.error = null;
            }
        );

        builder.addMatcher(
            isRejected(evaluateInterview),
            (state,action)=>{
                state.loading = false;
                state.error = action.payload as string
            }
        )
    }
})

export default evaluationSlice.reducer;

