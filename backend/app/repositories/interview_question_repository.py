from sqlalchemy.orm import Session

from models.interview_question import InterviewQuestion
from models.interview_session import InterviewSession
from models.question import Question


class InterviewQuestionRepository:

    @staticmethod
    def create_many(
        db: Session,
        interview_id: int,
        questions,
    ):
        mappings = [
            InterviewQuestion(
                interview_id=interview_id,
                question_id=question.id,
                order_sequence=index + 1,
            )
            for index, question in enumerate(questions)
        ]

        db.add_all(mappings)

        db.flush()
    
    @staticmethod
    def get_questions_for_session(
        db: Session,
        session_id: int,
    ):
        return (
            db.query(InterviewQuestion)
            .join(
                InterviewSession,
                InterviewSession.interview_id == InterviewQuestion.interview_id,
            )
            .join(
                Question,
                Question.id == InterviewQuestion.question_id,
            )
            .filter(
                InterviewSession.id == session_id
            )
            .order_by(
                InterviewQuestion.order_sequence
            )
            .all()
        )

    @staticmethod
    def get_first_question(
    db: Session,
    interview_id: int,
):
        return (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview_id
        )
        .order_by(
            InterviewQuestion.order_sequence
        )
        .first()
    )

    @staticmethod
    def get_next_question(
    db: Session,
    interview_id: int,
    current_order: int,
):
        return (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview_id,
            InterviewQuestion.order_sequence >current_order,
        )
        .order_by(InterviewQuestion.order_sequence)
        .first()
    )

    @staticmethod
    def get_by_id(
    db: Session,
    interview_question_id: int,
):
        return (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.id == interview_question_id
        )
        .first()
    )

    @staticmethod
    def get_by_interview(
    db: Session,
    interview_id: int,
):
        return (
        db.query(InterviewQuestion)
        .join(Question)
        .filter(
            InterviewQuestion.interview_id == interview_id
        )
        .order_by(InterviewQuestion.order_sequence)
        .all()
    )

