from pydantic import BaseModel, Field

class ConversationSegment(BaseModel):
    topic: str = Field(
        description="The main technical topic or competency discussed in this segment."
    )

    discussion: str = Field(
        description=(
            "The relevant interviewer and candidate discussion belonging "
            "to this segment. Preserve the actual meaning of the conversation."
        )
    )


class SegmentEvaluationResult(BaseModel):
    score: int = Field(
        ge=1,
        le=10,
        description=(
            "Score for the candidate's performance in this specific "
            "technical discussion."
        ),
    )

    strengths: list[str] = Field(
        description=(
            "Specific things the candidate demonstrated well in this "
            "discussion. Maximum 2."
        )
    )

    weaknesses: list[str] = Field(
        description=(
            "Specific gaps, inaccuracies, or missing depth in this "
            "discussion. Maximum 2."
        )
    )

    feedback: str = Field(
        description=(
            "Concise, evidence-based feedback explaining the score. "
            "Maximum 50 words."
        )
    )

class SynthesisResult(BaseModel):
    overall_feedback: str = Field(description="Overall feedback for the candidate. (Max 80 words)")
    strengths: list[str] = Field(description="List of maximum 3 specific strengths.")
    improvements: list[str] = Field(description="List of maximum 3 specific improvements.")


class ConversationSegments(BaseModel):
    segments: list[ConversationSegment]
