'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

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
          stroke="url(#spectrum_grad_fp)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="spectrum_grad_fp"
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setStatus('success');
      setMessage(
        res.data?.message || 'If an account exists with this email, a password reset link has been sent.',
      );
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to submit password reset request.');
    }
  };

  return (
    <div className="bg-white text-slate-900 w-full max-w-[500px] mx-auto rounded-[36px] p-8 sm:p-10 shadow-2xl transition-all duration-300">
      <SpectrumLogo />

      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 font-sans">
          Reset Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xs mx-auto font-normal leading-relaxed">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-snug font-medium">{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div className="space-y-5 animate-in fade-in">
          <div
            role="status"
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-xs sm:text-sm"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-snug font-medium">{message}</span>
          </div>
          <Link
            href="/login"
            className="pill-btn-secondary w-full h-12 text-slate-800 font-bold text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="reset-email"
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

          <button
            type="submit"
            disabled={status === 'loading'}
            className="pill-btn-coral w-full h-14 text-white font-bold text-base flex items-center justify-center gap-2 cursor-pointer mt-3 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Dispatching instructions...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <div className="pt-4 mt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="text-[#FF4E00] hover:text-[#E60067] font-bold transition hover:underline"
            >
              Sign In here
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}




