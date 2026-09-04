'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { MailCheck, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

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
    if (!email || !otpCode || otpCode.length !== 6) {
      setStatus('error');
      setMessage('Please enter a valid email and 6-digit verification code.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const res = await apiClient('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otpCode }),
      });
      setStatus('success');
      setMessage(res.data?.message || 'Email successfully verified! You can now log in.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Invalid or expired verification code.');
    }
  };

  const handleResend = async () => {
    if (!email) {
      setResendMsg('Please provide your email address to resend.');
      return;
    }
    setIsResending(true);
    setResendMsg(null);
    try {
      const res = await apiClient('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setResendMsg(res.data?.message || 'Verification link & code dispatched.');
    } catch (err: any) {
      setResendMsg(err.message || 'Failed to resend verification.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8 backdrop-blur-sm">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-inner">
          <MailCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Verify Your Email
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter the 6-digit code sent to your email or click the link in your inbox.
        </p>
      </div>

      {status === 'loading' && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center gap-3 text-indigo-700 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
          <span>{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div className="space-y-6 text-center">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start justify-center gap-2.5 text-emerald-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
            <span>{message}</span>
          </div>
          <Link
            href="/login"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@example.com"
              disabled={status === 'loading'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              disabled={status === 'loading'}
              className="w-full px-4 py-2.5 text-center tracking-[0.4em] font-mono text-xl font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition disabled:opacity-70 cursor-pointer"
          >
            <span>Verify Account</span>
          </button>

          {resendMsg && (
            <div className="p-2.5 bg-slate-100 rounded-lg text-xs text-slate-600 text-center">
              {resendMsg}
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
            >
              {isResending ? 'Sending...' : 'Resend Code / Link'}
            </button>
            <Link href="/login" className="text-slate-500 hover:text-slate-700 transition">
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
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
