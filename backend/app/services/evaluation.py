from sqlalchemy.orm import Session
from fastapi import HTTPException
from schemas.evaluation import QuestionEvaluationResponse, InterviewEvaluationResponse

from ai.chains.interview_evaluator import InterviewEvaluator
from repositories.interview_evaluation_repository import (
    InterviewEvaluationRepository,
)
from repositories.interview_session_repository import (
    InterviewSessionRepository,
)
from services.evaluation_context import EvaluationContextService
from repositories.conversation_repository import ConversationRepository
from models.interview_session import InterviewSessionStatus


class EvaluationService:

    @staticmethod
    def evaluate_session(
        db: Session,
        session_id: int,
    ):
        session = InterviewSessionRepository.get_by_id(
            db,
            session_id
        )

        if not session:
            raise ValueError("Session not found.")
        
        if session.status != InterviewSessionStatus.completed:
            raise ValueError("interview must be completed before the evaluation")

        messages = ConversationRepository.get_by_session(
    db,
    session.id,
)

        context = EvaluationContextService.build(
    interview=session.interview,
    messages=messages,
)

        print("=" * 80)
        print(context)
        print("=" * 80)

        

        

        result = InterviewEvaluator.evaluate(**context)

        # Convert LLM per-question results to plain dicts for JSONB storage
        question_evaluations = [
            {
                "question": e.question,
                "answer": e.answer,
                "score": e.score,
                "feedback": e.feedback,
            }
            for e in result.evaluations
        ]

        interview_evaluation = (
            InterviewEvaluationRepository.create(
                db=db,
                session_id=session_id,
                overall_score=result.overall_score,
                overall_feedback=result.overall_feedback,
                strengths=result.strengths,
                improvements=result.improvements,
                evaluator_model="meta-llama/Llama-3.1-8B-Instruct",
                question_evaluations=question_evaluations,
            )
        )

        session.status = InterviewSessionStatus.evaluated
        InterviewSessionRepository.update(
            db=db,
            session=session
        )

        db.commit()
        db.refresh(interview_evaluation)
        return interview_evaluation

    @staticmethod
    def get_result(
    db: Session,
    session_id: int,
    candidate_id:int
):
        session = InterviewSessionRepository.get_by_id(
            db,
            session_id
        )

        if not session:
            raise HTTPException(
                status_code=404,
                detail = "Session not found"
            )

        if session.candidate_id != candidate_id:
            raise HTTPException(
                status_code=403,
                detail="Forbidden"
            )

        evaluation = (
            InterviewEvaluationRepository.get_by_session(
                db,
                session_id
            )
        )

        if not evaluation:
            raise HTTPException(
                status_code=404,
                detail="Evaluation not found"
            )
        
        # question_evaluations is a JSONB list stored directly on the evaluation row
        questions = [
            QuestionEvaluationResponse(
                question=item["question"],
                answer=item["answer"],
                score=item["score"],
                feedback=item["feedback"],
            )
            for item in (evaluation.question_evaluations or [])
        ]
        
        return InterviewEvaluationResponse(
    overall_score=evaluation.overall_score,
    overall_feedback=evaluation.overall_feedback,
    strengths=evaluation.strengths,
    improvements=evaluation.improvements,
    questions=questions,
)