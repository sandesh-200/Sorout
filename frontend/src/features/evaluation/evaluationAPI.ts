import api from "@/api/axios";
import type {
  EvaluationStartedResponse,
  EvaluationResultResponse,
} from "./evaluationtypes";

export const evaluationAPI = {
  evaluateInterview: (sessionId: number) =>
    api.post<EvaluationStartedResponse>(
      `/candidate/evaluations/${sessionId}/evaluate`
    ),

  getEvaluationResult: (sessionId: number) =>
    api.get<EvaluationResultResponse>(
      `/candidate/evaluations/${sessionId}/result`
    ),
};