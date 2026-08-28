from pydantic import BaseModel, Field


class ConversationResponse(BaseModel):
    reply: str = Field(
        description="The AI interviewer's next response."
    )

    question_satisfied: bool = Field(
        description="True if the candidate has sufficiently answered the current blueprint question, meaning the interviewer is ready to move on to the next topic."
    )

    completed: bool = Field(
        description="Whether the interview should end."
    )

    completion_reason: str | None = Field(
        default=None,
        description=(
            "Reason for ending the interview. "
            "Null if completed is false."
        ),
    )