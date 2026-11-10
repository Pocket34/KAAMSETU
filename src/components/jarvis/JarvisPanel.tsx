'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Square,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Bot,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { soundEngine } from '@/lib/audio';

type JarvisState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface Message {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  results?: any[];
  suggestedActions?: { label: string; action: string; target: string }[];
  usedVoiceFallback?: boolean;
}

interface JarvisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule?: (moduleKey: string) => void;
}

export const JarvisPanel: React.FC<JarvisPanelProps> = ({
  isOpen,
  onClose,
  onNavigateModule,
}) => {
  const [state, setState] = useState<JarvisState>('idle');
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'jarvis',
      text: 'Namaste! Main KAAMSETU JARVIS hoon. Main aapki employment, verified job search, aur zero-rent business setup mein madad karne ke liye taiyar hoon. Aap bolkar ya likhkar batayein: aap kya dhoondh rahe hain?',
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Electrician jobs in Aligarh', action: 'query', target: 'Mujhe Aligarh mein electrician ki job chahiye' },
        { label: 'Start Business Without Money', action: 'query', target: 'Mere paas paise nahi hain business start karna hai' },
      ],
    },
  ]);

  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [audioElem, setAudioElem] = useState<HTMLAudioElement | null>(null);
  const [speechLanguage, setSpeechLanguage] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [omniVoiceStatus, setOmniVoiceStatus] = useState<{
    checked: boolean;
    available: boolean;
    device?: string;
  }>({ checked: false, available: false });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  // Check OmniVoice status on mount
  useEffect(() => {
    fetch('/api/voice/synthesize')
      .then((res) => res.json())
      .then((data) => {
        setOmniVoiceStatus({
          checked: true,
          available: data.available === true,
          device: data.device || 'CPU',
        });
      })
      .catch(() => {
        setOmniVoiceStatus({ checked: true, available: false });
      });
  }, []);

  // Initialize SpeechRecognition if supported
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setState('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        stopMicStream();
        if (event.error !== 'no-speech') {
          setErrorMessage(`Microphone error: ${event.error}. Please check browser permissions.`);
          setState('error');
        } else {
          setState('idle');
        }
      };

      recognition.onend = () => {
        stopMicStream();
        if (state === 'listening') {
          setState('idle');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [speechLanguage, state]);

  const startListening = async () => {
    soundEngine.playClick();
    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);

      if (recognitionRef.current) {
        recognitionRef.current.lang = speechLanguage;
        recognitionRef.current.start();
      } else {
        setErrorMessage('Speech recognition is not natively supported in this browser. Please use text input below.');
        setState('error');
      }
    } catch {
      setErrorMessage('Microphone access denied. Please allow microphone permissions in your browser bar.');
      setState('error');
    }
  };

  const stopMicStream = () => {
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
      setMicStream(null);
    }
  };

  const stopSpeaking = () => {
    soundEngine.playClick();
    if (audioElem) {
      audioElem.pause();
      audioElem.currentTime = 0;
      setAudioElem(null);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setState('idle');
  };

  const speakText = async (text: string) => {
    stopSpeaking();
    setState('speaking');

    // 1. Try official OmniVoice backend first
    try {
      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: speechLanguage.startsWith('hi') ? 'hi' : 'en',
          has_consent: false,
        }),
      });

      if (res.ok && res.headers.get('Content-Type')?.includes('audio/wav')) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        setAudioElem(audio);

        audio.onended = () => {
          setState('idle');
          setAudioElem(null);
        };
        audio.onerror = () => {
          fallbackBrowserTTS(text);
        };

        await audio.play();
        return;
      }
    } catch {
      // OmniVoice offline, proceed to fallback
    }

    // 2. Graceful fallback to Browser SpeechSynthesis (never fake speech)
    fallbackBrowserTTS(text);
  };

  const fallbackBrowserTTS = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLanguage;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setState('idle');
      };
      utterance.onerror = () => {
        setState('idle');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setState('idle');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    soundEngine.playClick();
    setInputQuery('');
    setErrorMessage(null);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setState('thinking');

    try {
      const res = await fetch('/api/jarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          language: speechLanguage.startsWith('hi') ? 'hi' : 'en',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch JARVIS response');
      }

      const data = await res.json();

      const jarvisMsg: Message = {
        id: `j-${Date.now()}`,
        sender: 'jarvis',
        text: data.reply,
        timestamp: 'Just now',
        results: data.results,
        suggestedActions: data.suggestedActions,
        usedVoiceFallback: !omniVoiceStatus.available,
      };

      setMessages((prev) => [...prev, jarvisMsg]);

      // Speak answer
      if (data.spokenText) {
        speakText(data.spokenText);
      } else {
        setState('idle');
      }
    } catch {
      setErrorMessage('Communication error with JARVIS service. Please verify server connection.');
      setState('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-8 z-50 w-[95vw] sm:w-[440px] max-h-[82vh] h-[640px] flex flex-col rounded-3xl bg-[#090B10]/95 border border-[#FF6B00]/30 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-950/80 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/40">
            <Bot className="w-5 h-5 text-[#FF8F3D]" />
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${
                state === 'listening'
                  ? 'bg-red-500 animate-ping'
                  : state === 'thinking'
                  ? 'bg-amber-400 animate-pulse'
                  : state === 'speaking'
                  ? 'bg-green-400 animate-pulse'
                  : 'bg-[#FF6B00]'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">KAAMSETU JARVIS</h3>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                AI Voice
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <span>Status:</span>
              <span
                className={`font-medium ${
                  state === 'listening'
                    ? 'text-red-400'
                    : state === 'thinking'
                    ? 'text-amber-400'
                    : state === 'speaking'
                    ? 'text-green-400'
                    : 'text-zinc-300'
                }`}
              >
                {state.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <button
            onClick={() => {
              const next = speechLanguage === 'hi-IN' ? 'en-IN' : 'hi-IN';
              setSpeechLanguage(next);
            }}
            className="px-2 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white cursor-pointer font-medium"
            title="Toggle input speech language"
          >
            {speechLanguage === 'hi-IN' ? 'हिंदी (IN)' : 'English'}
          </button>

          <button
            onClick={onClose}
            aria-label="Close JARVIS"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* OmniVoice Engine Status Banner */}
      <div className="px-4 py-1.5 bg-zinc-900/90 border-b border-white/5 text-[11px] flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-1.5">
          {omniVoiceStatus.available ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>OmniVoice Engine Active ({omniVoiceStatus.device})</span>
            </>
          ) : (
            <>
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>OmniVoice Offline &bull; Browser TTS fallback</span>
            </>
          )}
        </div>
        <span className="text-[10px] text-zinc-500">600+ Lang Support</span>
      </div>

      {/* Message Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-black font-medium shadow-md'
                  : 'bg-zinc-900/90 border border-white/10 text-zinc-100 shadow-md'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

              {/* Verified results cards */}
              {m.results && m.results.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-1 text-[11px] text-[#FFE066] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Registry Records:</span>
                  </div>
                  {m.results.map((res: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-200"
                    >
                      <div className="font-semibold text-white">{res.title}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {res.employer || res.targetAudience} &bull; {res.location || 'Pan-India'}
                      </div>
                      {res.salaryPublished && (
                        <div className="text-[#FF8F3D] font-medium text-[11px] mt-1">
                          {res.salaryPublished}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                          {res.verificationStatus || 'Verified Source'}
                        </span>
                        {res.officialApplicationUrl || res.officialPortalUrl ? (
                          <a
                            href={res.officialApplicationUrl || res.officialPortalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF8F3D] hover:underline flex items-center gap-1"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Action Quick Chips */}
              {m.suggestedActions && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
                  {m.suggestedActions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (act.action === 'query') {
                          handleSendMessage(act.target);
                        } else if (act.action === 'navigate_module' && onNavigateModule) {
                          onNavigateModule(act.target);
                        } else if (act.action === 'open_url') {
                          window.open(act.target, '_blank');
                        }
                      }}
                      className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] text-zinc-200 hover:text-white transition-all cursor-pointer"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {state === 'thinking' && (
          <div className="flex items-center gap-2 text-xs text-amber-400 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>JARVIS is searching verified databases & checking eligibility...</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 text-xs text-red-300 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Audio Waveform Live Reaction (Microphone or Audio playback) */}
      {(state === 'listening' || state === 'speaking') && (
        <div className="px-4 py-2 bg-zinc-950 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AudioVisualizer
              isActive={state === 'listening' || state === 'speaking'}
              stream={micStream}
              audioElement={audioElem}
              barColor={state === 'listening' ? '#EF4444' : '#FF6B00'}
              width={180}
              height={32}
            />
            <span className="text-xs text-zinc-400">
              {state === 'listening' ? 'Listening to speech...' : 'Speaking reply...'}
            </span>
          </div>

          {state === 'speaking' && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 text-xs transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          )}
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-3 bg-zinc-950/90 border-t border-white/10 flex items-center gap-2">
        <button
          onClick={state === 'listening' ? stopMicStream : startListening}
          aria-label={state === 'listening' ? 'Stop Listening' : 'Start Microphone Voice'}
          className={`p-3 rounded-full transition-all cursor-pointer shadow-lg ${
            state === 'listening'
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-zinc-800 text-[#FF8F3D] hover:bg-[#FF6B00] hover:text-black'
          }`}
          title="Click to talk with JARVIS"
        >
          {state === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex-1 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type your query (Hindi or English)..."
            className="flex-1 px-4 py-2.5 rounded-full bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || state === 'thinking'}
            aria-label="Send message"
            className="p-2.5 rounded-full bg-[#FF6B00] text-black hover:bg-[#FF8F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
