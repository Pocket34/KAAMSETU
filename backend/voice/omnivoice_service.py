"""
KAAMSETU OmniVoice Speech Service
Integration with official k2-fsa/OmniVoice: https://github.com/k2-fsa/OmniVoice

Hardware-aware: Auto-detects CUDA / XPU / MPS / CPU.
Initializes model once per process (singleton).
Includes consent enforcement for voice cloning.
"""

import io
import os
import sys
import logging
from typing import Optional, Dict, Any, Tuple

logger = logging.getLogger("kaamsetu.omnivoice")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


class OmniVoiceService:
    _instance: Optional["OmniVoiceService"] = None

    def __init__(self):
        self.device = self._detect_hardware()
        self.model = None
        self.is_ready = False
        self.error_message: Optional[str] = None
        self._init_model()

    @classmethod
    def get_instance(cls) -> "OmniVoiceService":
        if cls._instance is None:
            cls._instance = OmniVoiceService()
        return cls._instance

    def _detect_hardware(self) -> Tuple[str, Any]:
        """Detect best available hardware accelerator."""
        try:
            import torch

            if torch.cuda.is_available():
                gpu_name = torch.cuda.get_device_name(0)
                gpu_mem = torch.cuda.get_device_properties(0).total_memory / (1024**3)
                logger.info(f"CUDA accelerator detected: {gpu_name} ({gpu_mem:.2f} GB VRAM)")
                return "cuda:0", torch.float16
            
            if hasattr(torch, "xpu") and torch.xpu.is_available():
                logger.info("Intel XPU accelerator detected.")
                return "xpu:0", torch.float16

            if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
                logger.info("Apple Silicon MPS accelerator detected.")
                return "mps", torch.float16

            logger.warning("No GPU accelerator detected. Falling back to CPU. Note: CPU inference for diffusion TTS requires substantial compute.")
            return "cpu", torch.float32

        except ImportError:
            logger.warning("PyTorch not installed in current Python environment.")
            return "cpu", None

    def _init_model(self):
        """Loads OmniVoice model once per process."""
        try:
            from omnivoice import OmniVoice
            import torch

            device_map, dtype = self.device
            logger.info(f"Loading official k2-fsa/OmniVoice model on {device_map} with dtype {dtype}...")
            
            # Load official pretrained checkpoint
            self.model = OmniVoice.from_pretrained(
                "k2-fsa/OmniVoice",
                device_map=device_map,
                dtype=dtype,
                load_asr=True
            )
            self.is_ready = True
            logger.info("OmniVoice model successfully loaded and ready for synthesis.")
        except ImportError as e:
            self.is_ready = False
            self.error_message = f"OmniVoice dependency missing: {str(e)}. Run: pip install omnivoice soundfile torch"
            logger.warning(self.error_message)
        except Exception as e:
            self.is_ready = False
            self.error_message = f"Failed to initialize OmniVoice model: {str(e)}"
            logger.error(self.error_message)

    def synthesize(
        self,
        text: str,
        language: str = "en",
        ref_audio_path: Optional[str] = None,
        has_consent: bool = False,
        voice_params: Optional[Dict[str, Any]] = None
    ) -> bytes:
        """
        Synthesizes text into high-fidelity 24kHz WAV audio.
        
        Args:
            text: Text prompt to synthesize.
            language: Target ISO language code or name (e.g. 'en', 'hi').
            ref_audio_path: Path to user-provided reference audio for voice cloning (optional).
            has_consent: Verified user consent flag for voice cloning.
            voice_params: Optional dict controlling voice design attributes (gender, age, pitch, accent).
        
        Returns:
            bytes: WAV file bytes.
        """
        if not self.is_ready or self.model is None:
            raise RuntimeError(f"OmniVoice service unavailable: {self.error_message or 'Model not initialized'}")

        if not text or not text.strip():
            raise ValueError("Text prompt cannot be empty.")

        # Guard against unauthorized voice cloning
        if ref_audio_path:
            if not has_consent:
                raise PermissionError("Explicit user consent is mandatory before reference audio voice cloning.")
            if not os.path.exists(ref_audio_path):
                raise FileNotFoundError(f"Reference audio file not found: {ref_audio_path}")

        try:
            import soundfile as sf
            import numpy as np

            logger.info(f"Synthesizing {len(text)} characters [Lang: {language}]...")

            # Call OmniVoice generation API
            gen_kwargs = {
                "text": text.strip()
            }
            if ref_audio_path and has_consent:
                gen_kwargs["ref_audio"] = ref_audio_path

            audio_output = self.model.generate(**gen_kwargs)

            # audio_output is a list/array of audio waveforms at 24000 Hz
            sample_rate = 24000
            waveform = audio_output[0]

            # Convert to WAV bytes
            buffer = io.BytesIO()
            sf.write(buffer, waveform, sample_rate, format="WAV")
            buffer.seek(0)
            return buffer.read()

        except Exception as e:
            logger.error(f"Error during OmniVoice synthesis: {str(e)}")
            raise

    def get_status(self) -> Dict[str, Any]:
        """Returns service status, device diagnostics and availability."""
        device_map, dtype = self.device
        return {
            "status": "ready" if self.is_ready else "unavailable",
            "device": device_map,
            "dtype": str(dtype),
            "engine": "k2-fsa/OmniVoice",
            "supported_languages": "600+",
            "voice_cloning_supported": True,
            "error": self.error_message
        }
