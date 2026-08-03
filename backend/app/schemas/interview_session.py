from datetime import datetime

from pydantic import BaseModel

from models.interview_session import InterviewSessionStatus


class InterviewSessionResponse(BaseModel):
    id: int
    interview_id: int
    candidate_id: int
    status: str
    enrolled_at: datetime

    model_config = {
        "from_attributes": True
    }


class SessionQuestionResponse(BaseModel):
    question_id: int
    order: int
    question_text: str
    category: str

from pydantic import BaseModel


class CurrentQuestionResponse(BaseModel):
    interview_question_id: int
    question_id: int
    question_text: str
    category: str
    order: int

    model_config = {
        "from_attributes": True
    }

class NextQuestionResponse(BaseModel):
    completed: bool

    interview_question_id: int | None = None
    question_id: int | None = None
    question_text: str | None = None
    category: str | None = None
    order: int | None = None


class CandidateInterviewResponse(BaseModel):
    session_id: int
    interview_id: int

    title: str
    job_position: str
    seniority_level: str
    max_questions:int

    status: InterviewSessionStatus

    enrolled_at: datetime

    model_config = {
        "from_attributes": True
    }
