from sqlalchemy.orm import Session
from models.interview_session import InterviewSession,InterviewSessionStatus
from models.interview import Interview


class InterviewSessionRepository:
    @staticmethod
    def create(db:Session,interview_id:int,candidate_id:int,current_interview_question_id:int)->InterviewSession:
        session = InterviewSession(interview_id=interview_id,candidate_id=candidate_id,current_interview_question_id=current_interview_question_id)
        db.add(session)
        db.flush()
        return session
    
    @staticmethod
    def create_many(
        db: Session,
        interview_id: int,
        candidate_ids: list[int],
        current_question_id: int,
    ):
        existing_candidate_ids = {
            session.candidate_id
            for session in (
                db.query(InterviewSession)
                .filter(
                    InterviewSession.interview_id == interview_id,
                    InterviewSession.candidate_id.in_(candidate_ids),
                )
                .all()
            )
        }

        new_candidate_ids = [
            candidate_id
            for candidate_id in candidate_ids
            if candidate_id not in existing_candidate_ids
        ]

        sessions = [
            InterviewSession(
                interview_id=interview_id,
                candidate_id=candidate_id,
                status=InterviewSessionStatus.not_started,
                current_interview_question_id=current_question_id,
            )
            for candidate_id in new_candidate_ids
        ]

        if sessions:
            db.add_all(sessions)
            db.flush()

        return {
            "sessions": sessions,
            "assigned_count": len(sessions),
            "already_assigned": len(existing_candidate_ids),
        }
    
    @staticmethod
    def get_by_id(db:Session,session_id:int):
        return (
            db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
        )
    
    @staticmethod
    def get_by_interview_and_candidate(db:Session,interview_id:int,candidate_id:int):
        return (db.query(InterviewSession).filter(InterviewSession.interview_id==interview_id,InterviewSession.candidate_id==candidate_id).first())
    
    @staticmethod
    def update(
    db: Session,
    session,
):
        db.add(session)
        db.flush()

        return session
    
    @staticmethod
    def get_candidate_sessions(
        db: Session,
        candidate_id: int,
    ):
        return (
            db.query(
                InterviewSession.id.label("session_id"),
                Interview.id.label("interview_id"),
                Interview.title,
                Interview.job_position,
                Interview.seniority_level,
                Interview.max_questions,
                InterviewSession.status,
                InterviewSession.enrolled_at,
            )
            .join(
                Interview,
                Interview.id == InterviewSession.interview_id,
            )
            .filter(
                InterviewSession.candidate_id == candidate_id,
            )
            .order_by(
                InterviewSession.enrolled_at.desc()
            )
            .all()
        )