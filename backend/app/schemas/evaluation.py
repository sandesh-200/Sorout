from pydantic import BaseModel,Field


class QuestionEvaluationResponse(BaseModel):
    question: str = Field(
        description="Interview question"
    )
    answer:str
    score: int = Field(
        ge=1,
        le=10,
    )

    feedback: str


class InterviewEvaluationResponse(BaseModel):
    overall_score: int
    overall_feedback: str
    strengths: list[str]
    improvements: list[str]

    questions: list[QuestionEvaluationResponse]