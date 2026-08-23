import api from "@/api/axios";

export const questionAPI = {
    generateQuestions: (id: number) => api.post(`admin/questions/${id}/generate`),
    getQuestions: (id: number) => api.get(`admin/questions/${id}`),

}
