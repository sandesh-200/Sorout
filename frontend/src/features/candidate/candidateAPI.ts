import api from "@/api/axios";

export const candidateAPI = {
  getMyInterviews: () => api.get("/candidate/interviews"),
  startInterview:(sessionId:number)=>api.post(`/interview_session/${sessionId}/start`)
};