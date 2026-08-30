from fastapi import APIRouter, UploadFile, File, HTTPException
from core.config import settings
from groq import Groq

router = APIRouter(prefix="/stt", tags=["speech-to-text"])

# Initialize Groq Client securely on backend
try:
    client = Groq(api_key=settings.GROQ_API_KEY)
except Exception as e:
    # If the API key isn't loaded correctly, catch it here but typically settings handles it
    client = None

@router.post("")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if not client:
        raise HTTPException(status_code=500, detail="Groq client is not initialized")
    
    try:
        # Read file content into memory
        file_content = await file.read()
        
        # Call Groq's Whisper Large v3 Turbo
        transcription = client.audio.transcriptions.create(
            file=(file.filename, file_content),
            model="whisper-large-v3-turbo",
            response_format="json"
        )
        
        return {"transcript": transcription.text}
    except Exception as e:
        print(f"Error in STT transcription: {e}")
        raise HTTPException(status_code=500, detail=str(e))
