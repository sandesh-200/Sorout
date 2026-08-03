from pydantic import BaseModel, Field


class QuestionEvaluation(BaseModel):
    question: str = Field(description="Original interview question")

    answer: str = Field(
        description="Concise summary of the candidate's final answer after any follow-up discussion."
    )

    score: int = Field(
        ge=1,
        le=10,
        description="Score for this question."
    )

    feedback: str = Field(
        description="Constructive feedback explaining the score."
    )


class InterviewEvaluation(BaseModel):
    overall_score: int = Field(ge=1, le=10)
    overall_feedback: str
    strengths: list[str]
    improvements: list[str]
    evaluations: list[QuestionEvaluation]