# KAAMSETU OmniVoice Speech Service

This microservice provides high-fidelity, multilingual Text-To-Speech (TTS) for **KAAMSETU JARVIS**, powered by the official [k2-fsa/OmniVoice](https://github.com/k2-fsa/OmniVoice) project.

---

## 1. Hardware Requirements & Acceleration
OmniVoice uses a diffusion-based language model architecture. For optimal performance:
- **Recommended**: NVIDIA GPU with >= 8 GB VRAM (CUDA 12.1+).
- **Supported Accelerators**:
  - `CUDA`: NVIDIA GPUs (`torch.cuda.is_available()`)
  - `XPU`: Intel Discrete/Integrated GPUs (`torch.xpu.is_available()`)
  - `MPS`: Apple Silicon Mac (`torch.backends.mps.is_available()`)
  - `CPU`: Supported fallback for environments without discrete GPU. (Note: CPU generation is slower and should not be used for real-time streaming under high concurrency).

---

## 2. Installation

1. Create a Python 3.10+ virtual environment:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

2. Install PyTorch with CUDA (recommended):
```bash
pip install torch soundfile --index-url https://download.pytorch.org/whl/cu121
```

3. Install OmniVoice and API dependencies:
```bash
pip install -r requirements.txt
```

---

## 3. Running the Service

Start the FastAPI server:
```bash
python main.py
```
The service will listen on `http://localhost:8000`.

---

## 4. API Endpoints

### A. Health & Hardware Check
- **URL**: `GET /api/voice/health`
- **Response**:
```json
{
  "status": "ready",
  "device": "cuda:0",
  "dtype": "torch.float16",
  "engine": "k2-fsa/OmniVoice",
  "supported_languages": "600+",
  "voice_cloning_supported": true,
  "error": null
}
```

### B. Synthesize Speech
- **URL**: `POST /api/voice/synthesize`
- **Request Body**:
```json
{
  "text": "नमस्ते, कामसेतु में आपका स्वागत है।",
  "language": "hi",
  "has_consent": false
}
```
- **Response**:
  - `200 OK`: Binary stream (`audio/wav`), 24,000 Hz sample rate.
  - `503 Service Unavailable`: If model is not loaded (KAAMSETU frontend gracefully falls back to browser TTS / text chat).

---

## 5. Voice Cloning & Consent Safety
- OmniVoice supports zero-shot voice cloning from a 3–10 second reference audio.
- **Safety Policy**: Voice cloning is strictly blocked unless the `has_consent` flag is explicitly confirmed.
- Impersonation of public figures or unauthorized persons is prohibited.
