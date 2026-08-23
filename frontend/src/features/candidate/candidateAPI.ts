import api from "@/api/axios";

export const candidateAPI = {
  // Admin endpoints
  getAllCandidates: () => api.get("/admin/candidates"),
  getAvailableCandidates: (interviewId: number) => api.get(`/admin/candidates/available/${interviewId}`),
};
