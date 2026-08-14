from sqlalchemy.orm import Session

from models.interview_evaluation import InterviewEvaluation


class InterviewEvaluationRepository:

    @staticmethod
    def create(
        db: Session,
        session_id: int,
        overall_score: int,
        overall_feedback: str,
        strengths: list[str],
        improvements: list[str],
        evaluator_model: str,
        question_evaluations: list[dict],
    ):
        evaluation = InterviewEvaluation(
            session_id=session_id,
            overall_score=overall_score,
            overall_feedback=overall_feedback,
            strengths=strengths,
            improvements=improvements,
            evaluator_model=evaluator_model,
            question_evaluations=question_evaluations,
        )

        db.add(evaluation)
        db.flush()

        return evaluation

    @staticmethod
    def get_by_session(
        db: Session,
        session_id: int,
    ):
        return (
            db.query(InterviewEvaluation)
            .filter(
                InterviewEvaluation.session_id == session_id
            )
            .first()
        )