from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime


from models.interview_session import InterviewSessionStatus
from repositories.interview_session_repository import (
    InterviewSessionRepository,
)
from repositories.interview_question_repository import InterviewQuestionRepository
from repositories.answer_repository import AnswerRepository
from schemas.interview_session import SessionQuestionResponse,CurrentQuestionResponse,NextQuestionResponse
from services.evaluation import EvaluationService


class InterviewSessionService:

    @staticmethod
    def start_interview(
        db: Session,
        session_id: int,
        candidate_id: int,
    ):
        session = InterviewSessionRepository.get_by_id(
    db=db,
    session_id=session_id,
)

        if not session:
            raise HTTPException(
        status_code=404,
        detail="Interview session not found.",
    )

        if session.candidate_id != candidate_id:
            raise HTTPException(
        status_code=403,
        detail="You don't have permission to access this interview.",
    )

        if session.status != InterviewSessionStatus.not_started:
            raise HTTPException(
        status_code=400,
        detail="Interview has already been started.",
    )
        
        session.status = InterviewSessionStatus.ongoing
        InterviewSessionRepository.update(
            db=db,
            session=session
        )
        db.commit()
        db.refresh(session)
        return session
    
    @staticmethod
    def get_questions(
        db: Session,
        session_id: int,
        candidate_id: int,
    ):
        session = InterviewSessionRepository.get_by_id(
            db,
            session_id,
        )

        if not session:
            raise HTTPException(
                status_code=404,
                detail="Session not found.",
            )

        if session.candidate_id != candidate_id:
            raise HTTPException(
                status_code=403,
                detail="Unauthorized.",
            )

        mappings = (
            InterviewQuestionRepository.get_questions_for_session(
                db,
                session_id,
            )
        )

        return [
            SessionQuestionResponse(
                question_id=m.question.id,
                order=m.order_sequence,
                question_text=m.question.question_text,
                category=m.question.category,
            )
            for m in mappings
        ]
    
    @staticmethod
    def get_current_question(
    db: Session,
    session_id: int,
    candidate_id: int,
):
        session = InterviewSessionRepository.get_by_id(
        db,
        session_id,
    )

        if not session:
            raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

        if session.candidate_id != candidate_id:
            raise HTTPException(
            status_code=403,
            detail="You don't have access to this interview session.",
        )

        if session.current_interview_question_id is None:
            raise HTTPException(
            status_code=400,
            detail="Interview has already been completed.",
        )

        interview_question = (
        InterviewQuestionRepository.get_by_id(
            db,
            session.current_interview_question_id,
        )
    )

        return CurrentQuestionResponse(
        interview_question_id=interview_question.id,
        question_id=interview_question.question.id,
        question_text=interview_question.question.question_text,
        category=interview_question.question.category,
        order=interview_question.order_sequence,
    )


    @staticmethod
    def submit_answer(
        db: Session,
        session_id: int,
        candidate_id: int,
        question_id: int,
        answer_text: str,
    ):
        session = InterviewSessionRepository.get_by_id(
            db,
            session_id,
        )

        if not session:
            raise HTTPException(
                status_code=404,
                detail="Interview session not found.",
            )

        if session.candidate_id != candidate_id:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to access this session.",
            )

        if session.current_interview_question_id is None:
            raise HTTPException(
                status_code=400,
                detail="Interview has already been completed.",
            )

        current_question = (
            InterviewQuestionRepository.get_by_id(
                db,
                session.current_interview_question_id,
            )
        )

        if current_question.question_id != question_id:
            raise HTTPException(
                status_code=400,
                detail="This is not the current interview question.",
            )

        AnswerRepository.create(
            db=db,
            session_id=session.id,
            question_id=question_id,
            answer_text=answer_text,
        )

        next_question = (
            InterviewQuestionRepository.get_next_question(
                db=db,
                interview_id=session.interview_id,
                current_order=current_question.order_sequence,
            )
        )

        if next_question:

            session.current_interview_question_id = next_question.id

            InterviewSessionRepository.update(
                db=db,
                session=session,
            )

            db.commit()

            return NextQuestionResponse(
                completed=False,
                interview_question_id=next_question.id,
                question_id=next_question.question.id,
                question_text=next_question.question.question_text,
                category=next_question.question.category,
                order=next_question.order_sequence,
            )

        session.current_interview_question_id = None
        session.status = InterviewSessionStatus.completed
        session.completed_at = datetime.utcnow()

        InterviewSessionRepository.update(
            db=db,
            session=session,
        )

        db.commit()

        EvaluationService.evaluate_session(
            db=db,
            session_id=session.id
        )

        return NextQuestionResponse(
            completed=True,
        )
    
    @staticmethod
    def get_candidate_interviews(
        db: Session,
        candidate_id: int,
    ):
        return InterviewSessionRepository.get_candidate_sessions(
            db=db,
            candidate_id=candidate_id,
        )