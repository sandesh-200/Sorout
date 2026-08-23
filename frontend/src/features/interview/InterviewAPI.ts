import api from "@/api/axios";
import type { AssignCandidatesRequest, CreateInterviewRequest, UpdateInterviewRequest } from "./interviewTypes";

export const interviewAPI = {

    //admin
    create:(data:CreateInterviewRequest)=>api.post("admin/interviews",data),
    getAll:()=>api.get("admin/interviews"),
    getById:(id:number)=>api.get(`admin/interviews/${id}`),
    update:(id:number,data:UpdateInterviewRequest)=>api.patch(`admin/interviews/${id}`,data),
    delete:(id:number)=>api.delete(`admin/interviews/${id}`),
    assignCandidates:(interviewId:number,data:AssignCandidatesRequest)=>api.post(`admin/interviews/${interviewId}/assign`,data),

    //candidate
    getMyInterviews: () => api.get("/candidate/interviews"),
}
