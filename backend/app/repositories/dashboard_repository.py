from datetime import datetime, timedelta, timezone

from sqlalchemy import case, cast, Date, func
from sqlalchemy.orm import Session

from models.interview import Interview, InterviewStatus
from models.interview_evaluation import InterviewEvaluation
from models.interview_session import (
    InterviewSession,
    InterviewSessionStatus,
)
from models.organization_membership import (
    OrganizationMembership,
    MembershipRole,
)
from models.user import User


class DashboardRepository:
    @staticmethod
    def get_summary(
        db: Session,
        organization_id: int,
    ) -> dict:
        candidate_count = (
            db.query(func.count(func.distinct(OrganizationMembership.user_id)))
            .filter(
                OrganizationMembership.organization_id == organization_id,
                OrganizationMembership.role == MembershipRole.candidate,
            )
            .scalar()
            or 0
        )

        interview_count = (
            db.query(func.count(Interview.id))
            .filter(
                Interview.organization_id == organization_id,
            )
            .scalar()
            or 0
        )

        session_count = (
            db.query(func.count(InterviewSession.id))
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                Interview.organization_id == organization_id,
            )
            .scalar()
            or 0
        )

        completed_count = (
            db.query(func.count(InterviewSession.id))
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                Interview.organization_id == organization_id,
                InterviewSession.status
                == InterviewSessionStatus.completed,
            )
            .scalar()
            or 0
        )

        evaluated_count = (
            db.query(func.count(InterviewSession.id))
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                Interview.organization_id == organization_id,
                InterviewSession.status
                == InterviewSessionStatus.evaluated,
            )
            .scalar()
            or 0
        )

        average_score = (
            db.query(func.avg(InterviewEvaluation.overall_score))
            .join(
                InterviewSession,
                InterviewSession.id == InterviewEvaluation.session_id,
            )
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                Interview.organization_id == organization_id,
            )
            .scalar()
        )

        return {
            "total_candidates": candidate_count,
            "total_interviews": interview_count,
            "total_sessions": session_count,
            "completed_sessions": completed_count,
            "evaluated_sessions": evaluated_count,
            "average_score": (
                round(float(average_score), 2)
                if average_score is not None
                else None
            ),
        }

    @staticmethod
    def get_interview_statuses(
        db: Session,
        organization_id: int,
    ) -> list[dict]:
        rows = (
            db.query(
                Interview.status,
                func.count(Interview.id).label("count"),
            )
            .filter(
                Interview.organization_id == organization_id,
            )
            .group_by(Interview.status)
            .all()
        )

        counts = {
            row.status: int(row.count)
            for row in rows
        }

        return [
            {
                "status": status,
                "count": counts.get(status, 0),
            }
            for status in InterviewStatus
        ]

    @staticmethod
    def get_session_statuses(
        db: Session,
        organization_id: int,
    ) -> list[dict]:
        rows = (
            db.query(
                InterviewSession.status,
                func.count(InterviewSession.id).label("count"),
            )
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                Interview.organization_id == organization_id,
            )
            .group_by(InterviewSession.status)
            .all()
        )

        counts = {
            row.status: int(row.count)
            for row in rows
        }

        return [
            {
                "status": status,
                "count": counts.get(status, 0),
            }
            for status in InterviewSessionStatus
        ]

    @staticmethod
    def get_score_distribution(
        db: Session,
        organization_id: int,
    ) -> list[dict]:
        rows = (
            db.query(
                InterviewEvaluation.overall_score.label("score"),
                func.count(InterviewEvaluation.id).label("count"),
            )
            .join(
                InterviewSession,
                InterviewSession.id == InterviewEvaluation.session_id,
            )
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                Interview.organization_id == organization_id,
            )
            .group_by(
                InterviewEvaluation.overall_score,
            )
            .all()
        )

        counts = {
            int(row.score): int(row.count)
            for row in rows
        }

        return [
            {
                "score": score,
                "count": counts.get(score, 0),
            }
            for score in range(1, 11)
        ]

    @staticmethod
    def get_activity(
        db: Session,
        organization_id: int,
        days: int,
    ) -> list[dict]:
        now = datetime.now(timezone.utc)
        start = now - timedelta(days=days - 1)

        interview_rows = (
            db.query(
                cast(Interview.created_at, Date).label("activity_date"),
                func.count(Interview.id).label("count"),
            )
            .filter(
                Interview.organization_id == organization_id,
                Interview.created_at >= start,
            )
            .group_by(
                cast(Interview.created_at, Date),
            )
            .all()
        )

        session_rows = (
            db.query(
                cast(InterviewSession.enrolled_at, Date).label(
                    "activity_date"
                ),
                func.count(InterviewSession.id).label("count"),
            )
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                Interview.organization_id == organization_id,
                InterviewSession.enrolled_at >= start,
            )
            .group_by(
                cast(InterviewSession.enrolled_at, Date),
            )
            .all()
        )

        evaluation_rows = (
            db.query(
                cast(InterviewEvaluation.evaluated_at, Date).label(
                    "activity_date"
                ),
                func.count(InterviewEvaluation.id).label("count"),
            )
            .join(
                InterviewSession,
                InterviewSession.id == InterviewEvaluation.session_id,
            )
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                Interview.organization_id == organization_id,
                InterviewEvaluation.evaluated_at >= start,
            )
            .group_by(
                cast(InterviewEvaluation.evaluated_at, Date),
            )
            .all()
        )

        interviews_by_date = {
            row.activity_date: int(row.count)
            for row in interview_rows
        }

        sessions_by_date = {
            row.activity_date: int(row.count)
            for row in session_rows
        }

        evaluations_by_date = {
            row.activity_date: int(row.count)
            for row in evaluation_rows
        }

        result = []

        for offset in range(days):
            activity_date = (
                start.date() + timedelta(days=offset)
            )

            result.append(
                {
                    "date": activity_date,
                    "interviews_created": interviews_by_date.get(
                        activity_date,
                        0,
                    ),
                    "sessions_enrolled": sessions_by_date.get(
                        activity_date,
                        0,
                    ),
                    "evaluations_completed": evaluations_by_date.get(
                        activity_date,
                        0,
                    ),
                }
            )

        return result

    @staticmethod
    def get_recent_interviews(
        db: Session,
        organization_id: int,
        limit: int = 5,
    ) -> list[dict]:
        session_count = func.count(
            func.distinct(InterviewSession.id)
        )

        evaluated_count = func.count(
            func.distinct(
                case(
                    (
                        InterviewSession.status
                        == InterviewSessionStatus.evaluated,
                        InterviewSession.id,
                    )
                )
            )
        )

        average_score = func.avg(
            InterviewEvaluation.overall_score
        )

        rows = (
            db.query(
                Interview.id,
                Interview.title,
                Interview.job_position,
                Interview.seniority_level,
                Interview.status,
                Interview.created_at,
                session_count.label("candidate_count"),
                evaluated_count.label("evaluated_count"),
                average_score.label("average_score"),
            )
            .outerjoin(
                InterviewSession,
                InterviewSession.interview_id == Interview.id,
            )
            .outerjoin(
                InterviewEvaluation,
                InterviewEvaluation.session_id
                == InterviewSession.id,
            )
            .filter(
                Interview.organization_id == organization_id,
            )
            .group_by(
                Interview.id,
                Interview.title,
                Interview.job_position,
                Interview.seniority_level,
                Interview.status,
                Interview.created_at,
            )
            .order_by(
                Interview.created_at.desc(),
            )
            .limit(limit)
            .all()
        )

        return [
            {
                "id": row.id,
                "title": row.title,
                "job_position": row.job_position,
                "seniority_level": row.seniority_level,
                "status": row.status,
                "created_at": row.created_at,
                "candidate_count": int(row.candidate_count),
                "evaluated_count": int(row.evaluated_count),
                "average_score": (
                    round(float(row.average_score), 2)
                    if row.average_score is not None
                    else None
                ),
            }
            for row in rows
        ]