from sqlalchemy.orm import Session


from repositories.interview_session_repository import (
    InterviewSessionRepository,
)


class InterviewSessionService:
    
    @staticmethod
    def get_candidate_interviews(
        db: Session,
        candidate_id: int,
    ):
        return InterviewSessionRepository.get_candidate_sessions(
            db=db,
            candidate_id=candidate_id,
        )