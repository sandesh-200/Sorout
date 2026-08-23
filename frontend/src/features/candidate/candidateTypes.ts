export type InterviewSessionStatus =
  | "not_started"
  | "ongoing"
  | "completed"
  | "evaluated";

export interface Candidate {
  id: number;
  name: string;
  email: string;
}

export interface InterviewSession {
  id: number;
  interview_id: number;
  candidate_id: number;
  status: InterviewSessionStatus;
  enrolled_at: string;
}

export interface CandidateState {
  session: InterviewSession | null;
  loading: boolean;
  error: string | null;
}

// Admin-side candidate state
export interface AdminCandidateState {
  candidates: Candidate[];
  availableCandidates: Candidate[];
  loading: boolean;
  error: string | null;
}
