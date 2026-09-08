from datetime import date, datetime

from pydantic import BaseModel

from models.interview import InterviewStatus
from models.interview_session import InterviewSessionStatus


class DashboardSummary(BaseModel):
    total_candidates: int
    total_interviews: int
    total_sessions: int
    completed_sessions: int
    evaluated_sessions: int
    average_score: float | None


class InterviewStatusCount(BaseModel):
    status: InterviewStatus
    count: int


class SessionStatusCount(BaseModel):
    status: InterviewSessionStatus
    count: int


class ScoreDistributionItem(BaseModel):
    score: int
    count: int


class DashboardActivityPoint(BaseModel):
    date: date
    interviews_created: int
    sessions_enrolled: int
    evaluations_completed: int


class RecentInterview(BaseModel):
    id: int
    title: str
    job_position: str
    seniority_level: str
    status: InterviewStatus
    created_at: datetime
    candidate_count: int
    evaluated_count: int
    average_score: float | None


class AdminDashboardResponse(BaseModel):
    summary: DashboardSummary
    interview_statuses: list[InterviewStatusCount]
    session_statuses: list[SessionStatusCount]
    score_distribution: list[ScoreDistributionItem]
    activity: list[DashboardActivityPoint]
    recent_interviews: list[RecentInterview]