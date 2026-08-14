from pydantic import BaseModel, Field

class TTSRequest(BaseModel):
    text: str = Field(..., description="The text to be converted to speech")