from sqlalchemy.orm import Session
from fastapi import HTTPException

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
from ai.segmentation.pipeline import InterviewSegmentationPipeline

class EvaluationService:

    @staticmethod
    def evaluate_session(
        session_id: int,
        pipeline:InterviewSegmentationPipeline
    ):
        from core.database import SessionLocal

        db = SessionLocal()

        try:
            session = InterviewSessionRepository.get_by_id(
                db,
                session_id,
            )

            if not session:
                raise ValueError("Session not found.")

            if session.status != InterviewSessionStatus.completed:
                raise ValueError(
                    "Interview must be completed before the evaluation."
                )

            # Mark evaluation as in progress
            session.status = InterviewSessionStatus.evaluating

            InterviewSessionRepository.update(
                db=db,
                session=session,
            )

            db.commit()

            # Get conversation messages
            messages = ConversationRepository.get_by_session(
                db,
                session.id,
            )

            # Build evaluation context
            context = EvaluationContextService.build(
                interview=session.interview,
                messages=messages,
            )

            print("=" * 80)
            print("EVALUATION CONTEXT")
            print("=" * 80)
            print(context)
            print("=" * 80)

            # ---------------------------------------------------------
            # NEW EVALUATION PIPELINE
            # ---------------------------------------------------------

            result = InterviewEvaluator.evaluate_new(
    position=context["position"],
    level=context["level"],
    messages=messages,
    pipeline=pipeline,
)

            print("=" * 80)
            print("NEW EVALUATION RESULT")
            print("=" * 80)
            print(result)
            print("=" * 80)

            # Result structure:
            #
            # {
            #     "segments": [...],
            #     "evaluations": [...],
            #     "synthesis": SynthesisResult(...)
            # }

            segments = result["segments"]
            evaluations = result["evaluations"]
            synthesis = result["synthesis"]

            # ---------------------------------------------------------
            # CALCULATE OVERALL SCORE
            # ---------------------------------------------------------

            scores = [
                evaluation.score
                for evaluation in evaluations
            ]

            overall_score = (
                round(sum(scores) / len(scores))
                if scores
                else 0
            )

            # ---------------------------------------------------------
            # PREPARE SEGMENT EVALUATIONS FOR JSONB STORAGE
            # ---------------------------------------------------------
            #
            # We are temporarily using the existing
            # `question_evaluations` JSONB column.
            #
            # Later we should rename this DB column to
            # `segment_evaluations`.
            #

            segment_evaluations = []

            for segment, evaluation in zip(
                segments,
                evaluations,
            ):
                segment_evaluations.append(
                    {
                        "discussion": segment.discussion,
                        "score": evaluation.score,
                        "strengths": evaluation.strengths,
                        "weaknesses": evaluation.weaknesses,
                        "feedback": evaluation.feedback,
                    }
                )

            # ---------------------------------------------------------
            # CREATE INTERVIEW EVALUATION
            # ---------------------------------------------------------

            interview_evaluation = (
                InterviewEvaluationRepository.create(
                    db=db,
                    session_id=session_id,
                    overall_score=overall_score,
                    overall_feedback=synthesis.overall_feedback,
                    strengths=synthesis.strengths,
                    improvements=synthesis.improvements,
                    evaluator_model="openai/gpt-oss-120b",
                    question_evaluations=segment_evaluations,
                )
            )

            # Mark session as evaluated
            session.status = InterviewSessionStatus.evaluated

            InterviewSessionRepository.update(
                db=db,
                session=session,
            )

            db.commit()

            db.refresh(interview_evaluation)

            return interview_evaluation

        except Exception as e:
            print(f"Evaluation failed: {e}")

            session = InterviewSessionRepository.get_by_id(
                db,
                session_id,
            )

            if session:
                session.status = InterviewSessionStatus.evaluation_failed

                InterviewSessionRepository.update(
                    db=db,
                    session=session,
                )

                db.commit()

            raise

        finally:
            db.close()

    @staticmethod
    def get_result(
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
                detail="Session not found",
            )

        if session.candidate_id != candidate_id:
            raise HTTPException(
                status_code=403,
                detail="Forbidden",
            )

        # Evaluation is still running
        if session.status == InterviewSessionStatus.evaluating:
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=202,
                content={
                    "status": "evaluating",
                    "message": "Evaluation in progress",
                },
            )

        # Evaluation failed
        if session.status == InterviewSessionStatus.evaluation_failed:
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=500,
                content={
                    "status": "evaluation_failed",
                    "message": "Evaluation failed",
                },
            )

        evaluation = (
            InterviewEvaluationRepository.get_by_session(
                db,
                session_id,
            )
        )

        if not evaluation:
            raise HTTPException(
                status_code=404,
                detail="Evaluation not found",
            )
        segments = [
            {
                "discussion": item["discussion"],
                "evaluation": {
                    "score": item["score"],
                    "strengths": item["strengths"],
                    "weaknesses": item["weaknesses"],
                    "feedback": item["feedback"],
                },
            }
            for item in (evaluation.question_evaluations or [])
        ]

        return {
            "overall_score": evaluation.overall_score,
            "overall_feedback": evaluation.overall_feedback,
            "strengths": evaluation.strengths,
            "improvements": evaluation.improvements,
            "segments": segments,
        }