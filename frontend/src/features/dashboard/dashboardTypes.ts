// ---------- Raw backend shapes ----------

export interface DashboardSummary {
  total_candidates: number;
  total_interviews: number;
  total_sessions: number;
  completed_sessions: number;
  evaluated_sessions: number;
  average_score: number | null;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface ScoreDistributionPoint {
  score: number;
  count: number;
}

export interface ActivityDataPoint {
  date: string;
  interviews_created: number;
  sessions_enrolled: number;
  evaluations_completed: number;
}

export interface RecentInterview {
  id: number;
  title: string;
  job_position: string;
  seniority_level: string;
  status: "draft" | "ready" | "ongoing" | "completed" | "cancelled";
  created_at: string;
  candidate_count: number;
  evaluated_count: number;
  average_score: number | null;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  interview_statuses: StatusCount[];
  session_statuses: StatusCount[];
  score_distribution: ScoreDistributionPoint[];
  activity: ActivityDataPoint[];
  recent_interviews: RecentInterview[];
}

// ---------- Redux state ----------

export interface DashboardState {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
}