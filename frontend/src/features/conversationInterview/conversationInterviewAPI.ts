import api from "@/api/axios";

export const conversationInterviewAPI = {
  startConversation: (sessionId: number) =>
    api.post(
      `/interview_session/${sessionId}/conversation/start`
    ),

  sendMessage: (
    sessionId: number,
    message: string
  ) =>
    api.post(
      `/interview_session/${sessionId}/conversation/message`,
      {
        message,
      }
    ),

  evaluateInterview: (sessionId: number) =>
    api.post(
      `/candidate/sessions/${sessionId}/evaluate`
    ),
};