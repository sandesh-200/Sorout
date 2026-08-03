import { configureStore } from '@reduxjs/toolkit'
import  interviewReducer  from '@/features/interview/interviewSlice'
import interviewSessionReducer from '@/features/interviewSession/interviewSessionSlice'
import candidateReducer from '@/features/candidate/candidateSlice'
import conversationInterviewReducer from '@/features/conversationInterview/conversationInterviewSlice'


export const store = configureStore({
    reducer:{
        interview:interviewReducer,
        interviewSession:interviewSessionReducer,
        candidate:candidateReducer,
        conversationInterview:conversationInterviewReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch