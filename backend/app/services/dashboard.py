from sqlalchemy.orm import Session

from repositories.dashboard_repository import DashboardRepository
from schemas.dashboard import AdminDashboardResponse


class DashboardService:
    @staticmethod
    def get_admin_dashboard(
        db: Session,
        organization_id: int,
        activity_days: int = 30,
    ) -> AdminDashboardResponse:
        summary = DashboardRepository.get_summary(
            db=db,
            organization_id=organization_id,
        )

        interview_statuses = (
            DashboardRepository.get_interview_statuses(
                db=db,
                organization_id=organization_id,
            )
        )

        session_statuses = (
            DashboardRepository.get_session_statuses(
                db=db,
                organization_id=organization_id,
            )
        )

        score_distribution = (
            DashboardRepository.get_score_distribution(
                db=db,
                organization_id=organization_id,
            )
        )

        activity = DashboardRepository.get_activity(
            db=db,
            organization_id=organization_id,
            days=activity_days,
        )

        recent_interviews = (
            DashboardRepository.get_recent_interviews(
                db=db,
                organization_id=organization_id,
                limit=5,
            )
        )

        return AdminDashboardResponse(
            summary=summary,
            interview_statuses=interview_statuses,
            session_statuses=session_statuses,
            score_distribution=score_distribution,
            activity=activity,
            recent_interviews=recent_interviews,
        )