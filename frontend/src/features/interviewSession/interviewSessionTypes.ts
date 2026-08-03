export interface CurrentQuestion {
  question_id: number;
  order: number;
  question_text: string;
  category: "Technical" | "Behavioral";
  total_questions: number;
}

export interface InterviewSession {
  id: number;
  interview_id: number;
  candidate_id: number;
  status: "ongoing" | "completed";
  current_interview_question_id: number | null;
}

export interface SubmitAnswerRequest {
  question_id: number;
  answer_text: string;
}

export interface SubmitAnswerResponse {
  completed: boolean;
  interview_question_id?: number;
  question_id?: number;
  question_text?: string;
  category?: "Technical" | "Behavioral";
  order?: number;
}

export interface InterviewSessionState {
  session: InterviewSession | null;
  currentQuestion: CurrentQuestion | null;

  loading: boolean;
  submitting: boolean;

  error: string | null;
}