from fastapi import APIRouter, HTTPException, status
from fastapi.responses import Response
from schemas.tts import TTSRequest
from services.tts_service import TTSService

router = APIRouter(prefix="/tts", tags=["Text-to-Speech"])

@router.post("", response_class=Response)
async def create_speech(payload: TTSRequest):
    if not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text cannot be empty"
        )
    
    try:
        audio_data = await TTSService.generate_speech(payload.text)
        return Response(content=audio_data, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate speech: {str(e)}"
        )