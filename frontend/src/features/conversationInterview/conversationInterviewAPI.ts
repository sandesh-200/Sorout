import api from "@/api/axios";

export const conversationInterviewAPI = {
  startConversation: (sessionId: number) =>api.post(`candidate/conversations/${sessionId}/start`),
  sendMessage: (sessionId: number,message: string) =>api.post(`/candidate/conversations/${sessionId}/message`,{message,}),
};