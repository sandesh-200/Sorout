import edge_tts

class TTSService:
    @staticmethod
    async def generate_speech(text: str, voice: str = "en-US-JennyNeural") -> bytes:
        """
        Converts input text into MP3 audio bytes using Microsoft Edge Neural TTS.
        """
        communicate = edge_tts.Communicate(text, voice)
        audio_bytes = b""
        
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_bytes += chunk["data"]
                
        return audio_bytes