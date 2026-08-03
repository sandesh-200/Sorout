from datetime import datetime
from pydantic import BaseModel


class ConversationStartResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }

class ConversationMessageRequest(BaseModel):
    message: str


class ConversationResponseMessage(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class ConversationMessageResponse(BaseModel):
    message: ConversationResponseMessage
    completed: bool