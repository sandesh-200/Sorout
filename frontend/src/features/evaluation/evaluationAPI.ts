import api from "@/api/axios";

export const evaluationAPI = {
  evaluateInterview: (sessionId: number) =>
    api.post(`/candidate/evaluations/${sessionId}/evaluate`),
};