export interface SegmentEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
}

export interface EvaluationSegment {
  discussion: string;
  evaluation: SegmentEvaluation;
}

export interface InterviewEvaluation {
  id: number;
  session_id: number;
  overall_score: number;
  overall_feedback: string;
  strengths: string[];
  improvements: string[];
  segments: EvaluationSegment[];
  evaluated_at: string;
  evaluator_model: string;
}

export interface EvaluationStartedResponse {
  message: string;
}

export interface EvaluationInProgressResponse {
  status: "evaluating";
  message: string;
}

export type EvaluationResultResponse =
  | InterviewEvaluation
  | EvaluationInProgressResponse;

export type EvaluationStatus =
  | "idle"
  | "loading"
  | "evaluating"
  | "completed"
  | "failed";

export interface EvaluationState {
  evaluation: InterviewEvaluation | null;
  status: EvaluationStatus;
  error: string | null;
}