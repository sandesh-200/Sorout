from datetime import datetime

from pydantic import BaseModel, ConfigDict

from models.interview import InterviewStatus


class InterviewCreate(BaseModel):
    title: str
    job_position: str
    seniority_level: str
    max_questions: int = 5


class InterviewResponse(BaseModel):
    id: int
    title: str
    job_position: str
    seniority_level: str
    max_questions: int
    status: InterviewStatus
    created_by: int
    created_at: datetime
    has_questions:bool = False
    model_config = ConfigDict(from_attributes=True)



class InterviewUpdate(BaseModel):
    title: str | None = None
    job_position: str | None = None
    seniority_level: str | None = None
    max_questions: int | None = None

from pydantic import BaseModel, Field

class AssignCandidatesRequest(BaseModel):
    candidate_ids: list[int] = Field(min_length=1)

class AssignCandidatesResponse(BaseModel):
    assigned_count: int
    already_assigned: int
    assigned_candidate_ids: list[int]
    message: str
