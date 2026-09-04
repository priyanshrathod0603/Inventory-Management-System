'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';
import { KeyRound, Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
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
    <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8 backdrop-blur-sm">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-inner">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      {status === 'error' && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
          <span>{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
            <span>{message}</span>
          </div>
          <Link
            href="/login"
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Registered Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                disabled={status === 'loading'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold rounded-lg shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition disabled:opacity-70 cursor-pointer"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending reset link...</span>
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            Remembered your password?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition">
              Back to Login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
