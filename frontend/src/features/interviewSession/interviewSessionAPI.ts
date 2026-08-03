import api from "@/api/axios";
import type { SubmitAnswerRequest } from "./interviewSessionTypes";

export const interviewSessionAPI = {
  start: (sessionId: number) =>
    api.post(`/interview_session/${sessionId}/start`),

  getCurrentQuestion: (sessionId: number) =>
    api.get(`/interview_session/${sessionId}/current-question`),

  submitAnswer: (
    sessionId: number,
    data: SubmitAnswerRequest
  ) =>
    api.post(
      `/interview_session/${sessionId}/answers`,
      data
    ),
};