'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';
import { KeyRound, Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

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
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
          Enter your registered email address to receive secure password recovery instructions.
        </p>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="relative z-10 mb-5 p-3.5 bg-rose-50/90 border border-rose-200/80 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs sm:text-sm shadow-xs animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span className="leading-snug">{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div className="relative z-10 space-y-5 animate-in fade-in">
          <div
            role="status"
            className="p-4 bg-emerald-50/90 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 text-emerald-700 text-xs sm:text-sm shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span className="leading-snug">{message}</span>
          </div>
          <Link
            href="/login"
            className="glass-secondary-button group w-full h-11 text-slate-800 font-semibold text-sm rounded-xl flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Registered Email Address
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                  isFocused ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="e.g. rahul@example.com"
                disabled={status === 'loading'}
                autoComplete="email"
                className="liquid-glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-900 text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="glass-primary-button relative group overflow-hidden w-full h-11 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                <span>Sending instructions...</span>
              </>
            ) : (
              <>
                <span>Send Reset Instructions</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}


