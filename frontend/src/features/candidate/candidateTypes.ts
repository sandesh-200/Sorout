export type InterviewSessionStatus =
  | "not_started"
  | "ongoing"
  | "completed"
  | "evaluated"
  | "cancelled";



export interface InterviewSession {
  id: number;
  interview_id: number;
  candidate_id: number;

  status: InterviewSessionStatus;

  enrolled_at: string;
}

export interface CandidateInterview {
  session_id: number;
  interview_id: number;

  title: string;
  job_position: string;
  seniority_level: string;

  status: InterviewSessionStatus;

  max_questions:number;

  enrolled_at: string;
}

export interface CandidateState {
  interviews: CandidateInterview[];

  session:InterviewSession | null;

  loading: boolean;

  error: string | null;
}