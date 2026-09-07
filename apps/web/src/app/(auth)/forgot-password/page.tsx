'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

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
    <div className="bg-white text-navy-950 w-full max-w-[480px] mx-auto rounded-[32px] sm:rounded-[36px] p-8 sm:p-10 border border-border shadow-popover transition-all duration-300">
      <InventoryLogo />

      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-950 font-sans">
          Reset Password
        </h2>
        <p className="text-xs sm:text-sm text-content-secondary mt-1.5 max-w-xs mx-auto font-normal leading-relaxed">
          Enter your registered email address to receive secure recovery instructions.
        </p>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="mb-5 p-4 bg-danger-50 border border-danger-200 rounded-2xl flex items-start gap-3 text-danger-700 text-xs sm:text-sm animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-danger-600" />
          <span className="leading-snug font-medium">{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div className="space-y-5 animate-in fade-in">
          <div
            role="status"
            className="p-4 bg-success-50 border border-success-200 rounded-2xl flex items-start gap-3 text-success-700 text-xs sm:text-sm"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-success-600" />
            <span className="leading-snug font-medium">{message}</span>
          </div>
          <Link
            href="/login"
            className="pill-btn-secondary w-full h-12 text-navy-950 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-xs font-semibold text-navy-950 mb-1.5">
              Registered Email
            </label>
            <input
              id="reset-email"
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

          <button
            type="submit"
            disabled={status === 'loading'}
            className="pill-btn-coral w-full h-12 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer mt-3 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Dispatching instructions...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <div className="pt-4 mt-3 border-t border-border-subtle text-center text-xs text-content-secondary font-medium">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="text-coral-500 hover:text-coral-600 font-bold transition hover:underline"
            >
              Sign In here
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
