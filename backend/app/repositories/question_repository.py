from models.question import Question
from models.interview_question import InterviewQuestion
from sqlalchemy.orm import Session


class QuestionRepository:
    @staticmethod
    def create_many(
        db: Session,
        questions: list[dict],
    ) -> list[Question]:
        question_models = [
            Question(**question)
            for question in questions
        ]

        db.add_all(question_models)
        db.flush()
        return question_models

    @classmethod
    def has_questions(
        cls,
        db: Session,
        interview_id: int,
    ) -> bool:
        return (
            db.query(InterviewQuestion)
            .filter_by(interview_id=interview_id)
            .count()
            > 0
        )