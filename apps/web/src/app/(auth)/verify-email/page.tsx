'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

function InventoryLogo() {
  return (
    <div className="flex items-center gap-3 justify-center mb-6 select-none">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-coral-500/25 shrink-0">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </div>
      <div>
        <span className="text-xl font-extrabold tracking-tight text-navy-950 font-sans block leading-tight">
          IMS
        </span>
        <span className="text-[10px] text-content-muted font-semibold tracking-wider uppercase block">
          Inventory Management System
        </span>
      </div>
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
    <div className="bg-white text-navy-950 w-full max-w-[480px] mx-auto rounded-[32px] sm:rounded-[36px] p-8 sm:p-10 border border-border shadow-popover transition-all duration-300">
      <InventoryLogo />

      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-950 font-sans">
          Verify Email
        </h2>
        <p className="text-xs sm:text-sm text-content-secondary mt-1.5 max-w-xs mx-auto font-normal leading-relaxed">
          Enter the 6-digit confirmation code sent to your inbox.
        </p>
      </div>

      {status === 'loading' && (
        <div className="mb-6 p-4 bg-coral-50 border border-coral-100 rounded-2xl flex items-center justify-center gap-3 text-coral-800 text-xs sm:text-sm animate-in fade-in">
          <Loader2 className="w-4 h-4 animate-spin text-coral-600" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-2xl flex items-start gap-3 text-danger-700 text-xs sm:text-sm animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-danger-600" />
          <span className="leading-snug font-medium">{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div className="space-y-5 text-center animate-in fade-in">
          <div
            role="status"
            className="p-4 bg-success-50 border border-success-200 rounded-2xl flex items-start justify-center gap-3 text-success-700 text-xs sm:text-sm"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-success-600" />
            <span className="leading-snug font-semibold">{message}</span>
          </div>
          <Link
            href="/login"
            className="pill-btn-coral w-full h-12 text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label htmlFor="verify-email" className="block text-xs font-semibold text-navy-950 mb-1.5">
              Registered Email
            </label>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@store.com"
              disabled={status === 'loading'}
              autoComplete="email"
              className="pill-input w-full px-5 py-3.5 text-sm font-medium text-navy-950 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="otp-code" className="block text-xs font-semibold text-navy-950 mb-1.5 text-center">
              6-Digit Confirmation PIN
            </label>
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
              className="pill-input w-full px-5 py-3.5 text-center tracking-[0.5em] font-mono text-2xl font-black text-navy-950 focus:outline-none placeholder:text-border-dark"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="pill-btn-coral w-full h-12 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer mt-3 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
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
            <div className="p-3 bg-surface-subtle border border-border rounded-xl text-xs font-medium text-navy-800 text-center animate-in fade-in">
              {resendMsg}
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 text-coral-500 hover:text-coral-600 font-semibold transition hover:underline cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Sending...' : 'Resend PIN'}</span>
            </button>
            <Link href="/login" className="text-content-secondary hover:text-navy-950 font-medium transition">
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
        <div className="bg-white rounded-[32px] p-8 text-center text-content-secondary text-sm flex items-center justify-center gap-2 border border-border">
          <Loader2 className="w-5 h-5 animate-spin text-coral-500" />
          <span className="font-semibold">Loading verification module...</span>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
