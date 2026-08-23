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

export interface EvaluationState {
  evaluation: InterviewEvaluation | null;
  loading: boolean;
  error: string | null;
}