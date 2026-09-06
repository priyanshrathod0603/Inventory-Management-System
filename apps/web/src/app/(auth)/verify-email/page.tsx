'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { MailCheck, AlertCircle, CheckCircle2, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

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

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (tokenFromUrl) {
      handleVerifyLink(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleVerifyLink = async (token: string) => {
    setStatus('loading');
    setMessage('Verifying your email token...');
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
    <div className="surface-liquid-glass-auth relative w-full max-w-[460px] mx-auto rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Liquid Glass Top Reflection Sheen */}
      <div className="glass-specular-sheen absolute -top-1 left-0 right-0 h-32 pointer-events-none rounded-t-[28px]" />

      {/* SMS Brand Identity Header */}
      <div className="relative z-10 flex items-center justify-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-500/20 border border-white/40">
          SMS
        </div>
        <div className="text-left">
          <div className="text-sm font-bold text-slate-900 leading-none">Stock Management System</div>
          <div className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">Inventory & POS Operations</div>
        </div>
      </div>

      <div className="relative z-10 text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50/90 text-indigo-600 mb-3 border border-indigo-100 shadow-inner">
          <MailCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Verify Your Email
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
          Enter the 6-digit code sent to your email or click the link in your inbox.
        </p>
      </div>

      {status === 'loading' && (
        <div className="relative z-10 mb-6 p-4 bg-indigo-50/90 border border-indigo-100 rounded-xl flex items-center justify-center gap-3 text-indigo-700 text-xs sm:text-sm shadow-xs animate-in fade-in">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="relative z-10 mb-6 p-3.5 bg-rose-50/90 border border-rose-200/80 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs sm:text-sm shadow-xs animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span className="leading-snug">{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div className="relative z-10 space-y-6 text-center animate-in fade-in">
          <div
            role="status"
            className="p-4 bg-emerald-50/90 border border-emerald-200/80 rounded-xl flex items-start justify-center gap-2.5 text-emerald-700 text-xs sm:text-sm shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span className="leading-snug">{message}</span>
          </div>
          <Link
            href="/login"
            className="glass-primary-button group w-full h-11 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleOtpSubmit} className="relative z-10 space-y-4">
          <div>
            <label
              htmlFor="verify-email"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@example.com"
              disabled={status === 'loading'}
              autoComplete="email"
              className="liquid-glass-input w-full px-3.5 py-2.5 rounded-xl text-slate-900 text-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="otp-code"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              6-Digit Verification Code
            </label>
            <input
              id="otp-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              disabled={status === 'loading'}
              autoComplete="one-time-code"
              className="liquid-glass-input w-full px-4 py-2.5 text-center tracking-[0.4em] font-mono text-xl font-bold rounded-xl text-slate-900 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="glass-primary-button relative group overflow-hidden w-full h-11 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Account</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {resendMsg && (
            <div className="p-2.5 bg-slate-100/90 border border-slate-200/80 rounded-lg text-xs text-slate-600 text-center animate-in fade-in">
              {resendMsg}
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold transition hover:underline cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Sending...' : 'Resend Code / Link'}</span>
            </button>
            <Link href="/login" className="text-slate-500 hover:text-slate-700 font-medium transition">
              Back to Login
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
        <div className="surface-liquid-glass-auth rounded-[24px] p-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Loading verification...</span>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}


