'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

function SpectrumLogo() {
  return (
    <div className="flex items-center gap-2.5 justify-center mb-6 select-none">
      <svg
        className="w-7 h-7 shrink-0"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="20"
          cy="20"
          r="15"
          stroke="url(#spectrum_grad_ve)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="spectrum_grad_ve"
            x1="5"
            y1="5"
            x2="35"
            y2="35"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF4E00" />
            <stop offset="0.3" stopColor="#FFD000" />
            <stop offset="0.6" stopColor="#00E5FF" />
            <stop offset="0.8" stopColor="#7928CA" />
            <stop offset="1" stopColor="#FF0080" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
        Inventory Management System
      </span>
    </div>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  const [otpCode, setOtpCode] = useState('');
  const [email, setEmail] = useState(emailFromUrl || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  useEffect(() => {
    if (tokenFromUrl) {
      handleVerifyLink(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleVerifyLink = async (token: string) => {
    setStatus('loading');
    setMessage('Verifying security token with server...');
    try {
      const res = await apiClient('/auth/verify-email-link', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      setStatus('success');
      setMessage(res.data?.message || 'Email verified successfully! You can now log in.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Invalid or expired verification link.');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !otpCode || otpCode.length !== 6) {
      setStatus('error');
      setMessage('Please enter a valid email and 6-digit verification code.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const res = await apiClient('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), otpCode }),
      });
      setStatus('success');
      setMessage(res.data?.message || 'Email successfully verified! You can now log in.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Invalid or expired verification code.');
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setResendMsg('Please provide your email address to resend.');
      return;
    }
    setIsResending(true);
    setResendMsg(null);
    try {
      const res = await apiClient('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setResendMsg(res.data?.message || 'Verification link & code dispatched.');
    } catch (err: any) {
      setResendMsg(err.message || 'Failed to resend verification.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 w-full max-w-[500px] mx-auto rounded-[36px] p-8 sm:p-10 shadow-2xl transition-all duration-300">
      <SpectrumLogo />

      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 font-sans">
          Verify Email
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xs mx-auto font-normal leading-relaxed">
          Enter the 6-digit confirmation PIN sent to your email.
        </p>
      </div>

      {status === 'loading' && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center gap-3 text-orange-800 text-xs sm:text-sm animate-in fade-in">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF4E00]" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-snug font-medium">{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div className="space-y-6 text-center animate-in fade-in">
          <div
            role="status"
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-center gap-3 text-emerald-800 text-xs sm:text-sm"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-snug font-semibold">{message}</span>
          </div>
          <Link
            href="/login"
            className="pill-btn-coral w-full h-14 text-white font-bold flex items-center justify-center gap-2"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Registered Email Address"
              disabled={status === 'loading'}
              autoComplete="email"
              className="pill-input w-full px-6 py-4 text-sm font-medium text-slate-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              id="otp-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              disabled={status === 'loading'}
              autoComplete="one-time-code"
              className="pill-input w-full px-6 py-4 text-center tracking-[0.5em] font-mono text-2xl font-black text-slate-950 focus:outline-none placeholder:text-slate-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="pill-btn-coral w-full h-14 text-white font-bold text-base flex items-center justify-center gap-2 cursor-pointer mt-3 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Verify & Activate</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {resendMsg && (
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 text-center animate-in fade-in">
              {resendMsg}
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 text-[#FF4E00] hover:text-[#E60067] font-bold transition hover:underline cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Sending...' : 'Resend Code / Link'}</span>
            </button>
            <Link href="/login" className="text-slate-500 hover:text-slate-800 font-semibold transition">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-[36px] p-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF4E00]" />
          <span className="font-semibold">Loading verification module...</span>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}




