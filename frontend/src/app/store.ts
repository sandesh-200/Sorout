import { configureStore } from '@reduxjs/toolkit'
import interviewReducer from '@/features/interview/interviewSlice'
import candidateReducer from '@/features/candidate/candidateSlice'
import conversationInterviewReducer from '@/features/conversationInterview/conversationInterviewSlice'


export const store = configureStore({
    reducer: {
        interview: interviewReducer,
        candidate: candidateReducer,
        conversationInterview: conversationInterviewReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch