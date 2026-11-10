'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Info
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { soundEngine } from '@/lib/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
  preferredLanguage: 'hi' | 'en' | 'hinglish';
  onLoginSuccess?: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  preferredLanguage,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [language, setLanguage] = useState<'hi' | 'en' | 'hinglish'>(preferredLanguage);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify both fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters in length.');
        return;
      }
      if (!fullName.trim()) {
        setErrorMsg('Full name is required to create your profile.');
        return;
      }
    }

    // Check if live Supabase is configured
    if (!isSupabaseConfigured()) {
      setErrorMsg(
        'Supabase authentication is currently in setup mode: Please provide valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY credentials in your .env.local file to enable live database user accounts. (Simulated fake logins are disabled per integrity policy).'
      );
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setSuccessMsg('Signed in successfully! Loading your profile...');
        if (onLoginSuccess) onLoginSuccess(data.user);
        setTimeout(() => onClose(), 1200);
      } else if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              preferred_language: language,
            },
          },
        });
        if (error) throw error;
        setSuccessMsg('Account registered! A verification link has been sent to your email.');
      } else if (authMode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) throw error;
        setSuccessMsg('Password reset email dispatched to your inbox.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#090B10] border border-white/15 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FF6B00]/20 text-[#FF8F3D]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-[#FF8F3D] uppercase tracking-wider">
              KAAMSETU Secure Authentication
            </span>
          </div>

          <h2 className="text-2xl font-black text-white">
            {authMode === 'signin' && 'Sign in to Your Account'}
            {authMode === 'signup' && 'Create Your KAAMSETU Account'}
            {authMode === 'forgot' && 'Reset Your Password'}
          </h2>

          <p className="text-zinc-400 text-xs">
            {authMode === 'signin' && 'Access verified opportunities, manage your storefront, and sync Hindsight memory.'}
            {authMode === 'signup' && 'Join artisans, skilled workers, and entrepreneurs across India.'}
            {authMode === 'forgot' && 'Enter your email to receive an official recovery link.'}
          </p>
        </div>

        {/* Tab Switcher for Sign In vs Sign Up */}
        {authMode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#FF6B00] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#FF6B00] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Sign Up Fields */}
          {authMode === 'signup' && (
            <>
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rameshwar Kumar"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Preferred Language</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00] cursor-pointer"
                  >
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                    <option value="hinglish">Hinglish</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="text-zinc-300 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide toggle */}
          {authMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-300 font-semibold">Password</label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-[#FF8F3D] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password Field for Signup */}
          {authMode === 'signup' && (
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF6B00]/30 cursor-pointer disabled:opacity-50 mt-3"
          >
            {loading
              ? 'Verifying...'
              : authMode === 'signin'
              ? 'Login to KAAMSETU'
              : authMode === 'signup'
              ? 'Create Free Account'
              : 'Dispatch Recovery Email'}
          </button>
        </form>

        {/* Footer Guidance */}
        <div className="pt-2 text-center text-xs text-zinc-500">
          <p>Protected by Supabase Row-Level Security &bull; Zero Spam</p>
        </div>
      </div>
    </div>
  );
};
