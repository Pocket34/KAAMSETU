'use client';

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream?: MediaStream | null;
  audioElement?: HTMLAudioElement | null;
  isActive: boolean;
  barColor?: string;
  height?: number;
  width?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  stream,
  audioElement,
  isActive,
  barColor = '#FF6B00',
  height = 40,
  width = 160,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isActive || (!stream && !audioElement)) {
      // Clear canvas when inactive — no fake waveform
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtxClass();
      }
      const audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      if (stream) {
        const streamSource = audioCtx.createMediaStreamSource(stream);
        streamSource.connect(analyser);
        sourceRef.current = streamSource;
      } else if (audioElement) {
        try {
          const elemSource = audioCtx.createMediaElementSource(audioElement);
          elemSource.connect(analyser);
          analyser.connect(audioCtx.destination);
          sourceRef.current = elemSource;
        } catch {
          // If already connected in DOM
        }
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let animationId: number;

      const draw = () => {
        animationId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 1.6;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.9;

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, '#FF4D00');
          gradient.addColorStop(0.6, barColor);
          gradient.addColorStop(1, '#FFE066');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 1.5, barHeight);

          x += barWidth;
          if (x > width) break;
        }
      };

      draw();

      return () => {
        cancelAnimationFrame(animationId);
        if (sourceRef.current) {
          try {
            sourceRef.current.disconnect();
          } catch {}
        }
      };
    } catch {
      // Audio permission or Web Audio API fallback
    }
  }, [isActive, stream, audioElement, barColor, height, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg bg-zinc-950/60 border border-white/5"
    />
  );
};
