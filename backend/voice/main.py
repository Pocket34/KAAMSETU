"""
KAAMSETU OmniVoice FastAPI Service
Provides authenticated, high-performance voice synthesis endpoints for KAAMSETU JARVIS.
"""

import os
import io
import base64
import logging
from typing import Optional
from fastapi import FastAPI, HTTPException, Header, Depends, UploadFile, File, Form, status
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from omnivoice_service import OmniVoiceService

logger = logging.getLogger("kaamsetu.voice_server")

app = FastAPI(
    title="KAAMSETU OmniVoice Service",
    description="Dedicated Python TTS Service powered by official k2-fsa/OmniVoice",
    version="1.0.0"
)

# Allow local Next.js frontend calls
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "http://localhost:3000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = OmniVoiceService.get_instance()


class SynthesizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Text to synthesize")
    language: Optional[str] = Field("en", description="Target ISO language code ('en', 'hi', etc.)")
    ref_audio_base64: Optional[str] = Field(None, description="Base64 encoded reference audio (optional)")
    has_consent: Optional[bool] = Field(False, description="Explicit user consent flag for voice cloning")


@app.get("/health")
@app.get("/api/voice/health")
async def health_check():
    """Health check & accelerator diagnostic status."""
    status_info = service.get_status()
    is_healthy = status_info["status"] == "ready"
    return JSONResponse(
        status_code=status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE,
        content=status_info
    )


@app.post("/api/voice/synthesize")
async def synthesize_speech(req: SynthesizeRequest):
    """
    Main TTS endpoint for KAAMSETU JARVIS.
    Synthesizes text into 24kHz WAV audio stream.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text prompt cannot be empty.")

    ref_audio_path = None
    temp_file_to_clean = None

    if req.ref_audio_base64:
        if not req.has_consent:
            raise HTTPException(
                status_code=403,
                detail="Voice cloning requires explicit user consent. Flag 'has_consent' must be true."
            )
        try:
            audio_bytes = base64.b64decode(req.ref_audio_base64)
            temp_file_to_clean = f"/tmp/ref_audio_{os.getpid()}.wav"
            with open(temp_file_to_clean, "wb") as f:
                f.write(audio_bytes)
            ref_audio_path = temp_file_to_clean
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 reference audio: {str(e)}")

    try:
        wav_bytes = service.synthesize(
            text=req.text,
            language=req.language or "en",
            ref_audio_path=ref_audio_path,
            has_consent=req.has_consent or False
        )

        return Response(
            content=wav_bytes,
            media_type="audio/wav",
            headers={
                "Content-Disposition": 'inline; filename="jarvis_speech.wav"',
                "Cache-Control": "no-cache"
            }
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in synthesize: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Voice synthesis error: {str(e)}")
    finally:
        if temp_file_to_clean and os.path.exists(temp_file_to_clean):
            try:
                os.remove(temp_file_to_clean)
            except OSError:
                pass


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
