export interface ConversationMessage {
  id: number;

  role: "ai" | "candidate";

  content: string;

  created_at: string;
}

export type ConversationStartResponse = ConversationMessage;

export interface ConversationMessageResponse {
  message: ConversationMessage;
  completed: boolean;
}

export interface InterviewEvaluation {
  id: number;

  session_id: number;

  overall_score: number;

  overall_feedback: string;

  strengths: string[];

  improvements: string[];

  evaluated_at: string;

  evaluator_model: string;
}

export interface ConversationInterviewState {
  sessionId: number | null;

  messages: ConversationMessage[];

  completed: boolean;

  evaluation: InterviewEvaluation | null;

  loading: boolean;

  sendingMessage: boolean;

  evaluating: boolean;

  error: string | null;
}