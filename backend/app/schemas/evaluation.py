from pydantic import BaseModel, Field

class SegmentEvaluationResponse(BaseModel):
    score: int = Field(
        ge=1,
        le=10,
    )

    strengths: list[str]

    weaknesses: list[str]

    feedback: str


class SegmentResponse(BaseModel):
    discussion: str

    evaluation: SegmentEvaluationResponse


class InterviewEvaluationResponse(BaseModel):
    overall_score: int

    overall_feedback: str

    strengths: list[str]

    improvements: list[str]

    segments: list[SegmentResponse]