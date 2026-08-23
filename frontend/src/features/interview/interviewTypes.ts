import type { InterviewSessionStatus } from "../candidate/candidateTypes";
export type InterviewStatus =
  | "draft"
  | "ready"
  | "ongoing"
  | "completed"
  | "cancelled";


export interface Interview {
  id: number;
  title: string;
  job_position: string;
  seniority_level: string;
  max_questions: number;
  status: InterviewStatus;
  created_by: number;
  created_at: string;
}

export interface InterviewState {
  interviews: Interview[];
  selectedInterview: Interview | null;
  assignmentResult: AssignCandidatesResponse | null;
  candidateInterviews: CandidateInterview[];
  loading: boolean;
  error: string | null;
}

export interface CreateInterviewRequest {
  title: string;
  job_position: string;
  seniority_level: string;
  max_questions: number;
}

export interface UpdateInterviewRequest {
  title?: string;
  job_position?: string;
  seniority_level?: string;
  max_questions?: number;
}

export interface InterviewQuestion {
  id: number;
  question_text: string;
  category: "Technical" | "Behavioral";
  order_sequence: number;
}

export interface AssignCandidatesRequest {
  candidate_ids: number[];
}

export interface AssignCandidatesResponse {
  assigned_count: number;
  already_assigned: number;
  assigned_candidate_ids: number[];
  message: string;
}

export interface CandidateInterview {
  session_id: number;
  interview_id: number;

  title: string;
  job_position: string;
  seniority_level: string;

  status: InterviewSessionStatus;

  max_questions: number;

  enrolled_at: string;
}