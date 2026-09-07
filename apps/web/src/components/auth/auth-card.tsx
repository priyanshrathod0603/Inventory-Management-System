'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/auth-context';
import {
  Eye,
  EyeOff,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogIn,
  UserPlus,
  Globe,
  HelpCircle,
  Search,
} from 'lucide-react';

interface AuthCardProps {
  initialMode?: 'login' | 'register';
}

// Inventory Management System Brand Emblem
function InventoryLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </div>
      <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-sans">
        Inventory Management System
      </span>
    </div>
  );
}

export function AuthCard({ initialMode = 'login' }: AuthCardProps) {
  const { login, register } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'visible' | 'exiting' | 'entering'>('visible');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isGoogleConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // Synchronize internal mode if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Password strength calculation for registration
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-indigo-500' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: 'Too Short', color: 'bg-slate-300' };
    }
  };

  const passwordStrength = calculatePasswordStrength(registerPassword);

  // Smooth mode transition handler
  const switchMode = (targetMode: 'login' | 'register') => {
    if (mode === targetMode || isTransitioning) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setMode(targetMode);
      window.history.pushState(null, '', targetMode === 'login' ? '/login' : '/register');
      return;
    }

    setIsTransitioning(true);
    setTransitionPhase('exiting');

    setTimeout(() => {
      setMode(targetMode);
      window.history.pushState(null, '', targetMode === 'login' ? '/login' : '/register');
      setTransitionPhase('entering');

      setLoginError(null);
      setRegisterError(null);
      setFieldErrors({});

      setTimeout(() => {
        setTransitionPhase('visible');
        setIsTransitioning(false);
      }, 160);
    }, 180);
  };

  // Google OAuth redirect
  const handleGoogleAuth = () => {
    if (!isGoogleConfigured) {
      const msg = `Google authentication is not configured. Please ${
        mode === 'login' ? 'sign in' : 'register'
      } with email and password.`;
      if (mode === 'login') setLoginError(msg);
      else setRegisterError(msg);
      return;
    }
    window.location.href = `${API_BASE}/auth/google`;
  };

  // Login submit handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !loginPassword) {
      setLoginError('Please fill in both identifier and password.');
      return;
    }

    setLoginError(null);
    setIsLoginSubmitting(true);

    try {
      await login(identifier.trim(), loginPassword, rememberMe);
    } catch (err: any) {
      if (err.status === 401) {
        setLoginError('Invalid credentials. Please check your username/email and password.');
      } else if (err.status === 403) {
        setLoginError('Your account has been deactivated. Contact your administrator.');
      } else if (err.status === 429) {
        setLoginError('Too many login attempts. Please try again later.');
      } else {
        setLoginError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  // Validation logic for registration form
  const validateRegisterForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.';
    } else if (fullName.trim().length > 100) {
      errors.fullName = 'Full name must be 100 characters or less.';
    }
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!username.trim()) {
      errors.username = 'Username is required.';
    } else if (username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    } else if (username.trim().length > 50) {
      errors.username = 'Username must be 50 characters or less.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      errors.username = 'Username can only contain letters, numbers, and underscores.';
    }
    if (!registerPassword) {
      errors.password = 'Password is required.';
    } else if (registerPassword.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    return errors;
  };

  // Register submit handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setFieldErrors({});

    const validationErrors = validateRegisterForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsRegisterSubmitting(true);

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password: registerPassword,
        phone: phone.trim() || undefined,
      });

      setRegisterSuccess('Account created! Redirecting to email verification...');
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
      }, 1400);
    } catch (err: any) {
      if (err.details && Array.isArray(err.details)) {
        const mapped: Record<string, string> = {};
        for (const detail of err.details) {
          const msg = detail.message || '';
          if (msg.toLowerCase().includes('email')) mapped.email = msg;
          else if (msg.toLowerCase().includes('username')) mapped.username = msg;
          else if (msg.toLowerCase().includes('password')) mapped.password = msg;
          else if (msg.toLowerCase().includes('full name') || msg.toLowerCase().includes('fullname'))
            mapped.fullName = msg;
          else if (msg.toLowerCase().includes('phone')) mapped.phone = msg;
        }
        if (Object.keys(mapped).length > 0) {
          setFieldErrors(mapped);
        } else {
          setRegisterError(err.message || 'Registration failed. Please check form entries.');
        }
      } else if (err.status === 409) {
        setRegisterError('An account with this email or username already exists.');
      } else if (err.status === 429) {
        setRegisterError('Too many registration attempts. Please try again later.');
      } else {
        setRegisterError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  const isSubmitting = isLoginSubmitting || isRegisterSubmitting;

  return (
    <div className="auth-split-shell relative w-full max-w-[1240px] rounded-[32px] sm:rounded-[44px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px] transition-all duration-300">
      {/* ========================================================= */}
      {/* LEFT COLUMN: HERO PANEL (DEEP SLATE/INDIGO WITH MOCKUP)   */}
      {/* ========================================================= */}
      <div className="lg:col-span-6 xl:col-span-6 concentric-rings-indigo bg-[#0B0F19] text-white p-7 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden border-r border-slate-800/60">
        {/* Top Tagline */}
        <div className="relative z-10">
          <p className="text-xs sm:text-sm text-slate-400 font-normal tracking-wide max-w-sm leading-relaxed">
            Smart stock control made simple – online inventory solutions for you.
          </p>
        </div>

        {/* Center Typography & Phone Dashboard Mockup */}
        <div className="relative z-10 my-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-8 font-sans">
            Manage <br />
            your items
          </h1>

          {/* Smartphone Mockup */}
          <div className="relative max-w-[290px] sm:max-w-[310px] mx-auto lg:mx-0">
            <div className="phone-mockup-frame p-3.5 text-white">
              {/* Phone Top Speaker & Notch */}
              <div className="flex items-center justify-between px-2 pt-1 pb-2">
                <span className="text-[10px] text-slate-400 font-medium">Week 4–10 July</span>
                <div className="w-12 h-3.5 bg-black rounded-full mx-auto" />
                <span className="text-[10px] text-slate-400 font-mono">98%</span>
              </div>

              {/* Main Total Stock Value Card */}
              <div className="mt-1 px-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono tracking-tight text-white">
                    897.00
                  </span>
                  <span className="text-sm font-bold text-slate-300">k ₹</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                  ↑ 14.8% inventory turnover
                </div>
              </div>

              {/* Mini Weekly Bar Chart */}
              <div className="my-3 px-1 py-2 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-end justify-between gap-1 h-14 px-2 pt-2">
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-700/80 rounded-t h-6" />
                    <span className="text-[8px] text-slate-400">Mon</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-700/80 rounded-t h-8" />
                    <span className="text-[8px] text-slate-400">Tue</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-700/80 rounded-t h-7" />
                    <span className="text-[8px] text-slate-400">Wed</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-700/80 rounded-t h-9" />
                    <span className="text-[8px] text-slate-400">Thu</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 relative">
                    <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t h-12 shadow-md shadow-indigo-500/40" />
                    <span className="text-[8px] text-indigo-400 font-bold">Fri</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-700/80 rounded-t h-5" />
                    <span className="text-[8px] text-slate-400">Sat</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-700/80 rounded-t h-8" />
                    <span className="text-[8px] text-slate-400">Sun</span>
                  </div>
                </div>
              </div>

              {/* Stock Category Preview Cards */}
              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>Categories</span>
                  <Search className="w-3 h-3 text-slate-500" />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="text-[11px] font-mono font-bold block">₹950.00 k</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Electronics</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="text-[11px] font-mono font-bold block">₹785.00 k</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Hardware</span>
                  </div>
                </div>
              </div>

              {/* Phone Dock with Indicator */}
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-around">
                <div className="w-4 h-4 rounded bg-white/10" />
                <div className="w-5 h-5 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center shadow-xs shadow-indigo-500/50">
                  <div className="w-full h-full bg-[#0B0F19] rounded-full" />
                </div>
                <div className="w-4 h-4 rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Subtle Indicator */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400">
          <div className="w-5 h-5 rounded-full border border-indigo-500/40 bg-indigo-950/50 flex items-center justify-center text-indigo-400 text-[10px]">
            ⚡
          </div>
          <span>Enterprise Inventory Cloud Platform</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM (WHITE CURVED CARD)    */}
      {/* ========================================================= */}
      <div className="lg:col-span-6 xl:col-span-6 bg-white text-slate-900 p-7 sm:p-10 lg:p-14 flex flex-col justify-between relative rounded-t-[36px] lg:rounded-t-none lg:rounded-l-[44px] shadow-2xl">
        <div>
          {/* Top Bar: Brand Logo + Top-Right Switch Button */}
          <div className="flex items-center justify-between mb-10">
            <InventoryLogo />

            {/* Quick Switch Button (Sign Up / Sign In) */}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition cursor-pointer group"
            >
              <User className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span>{mode === 'login' ? 'Sign Up' : 'Sign In'}</span>
            </button>
          </div>

          {/* Animated Form Container */}
          <div
            className={`transition-all duration-300 ease-out ${
              transitionPhase === 'exiting'
                ? 'opacity-0 -translate-y-2 scale-[0.99]'
                : transitionPhase === 'entering'
                ? 'opacity-0 translate-y-2 scale-[0.99]'
                : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            {/* Form Title */}
            <div className="mb-7">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-sans">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
            </div>

            {/* Global Error Banner */}
            {mode === 'login' && loginError && (
              <div
                role="alert"
                className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-snug font-medium">{loginError}</span>
              </div>
            )}

            {mode === 'register' && registerError && (
              <div
                role="alert"
                className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-snug font-medium">{registerError}</span>
              </div>
            )}

            {/* Register Success Banner */}
            {mode === 'register' && registerSuccess && (
              <div
                role="status"
                className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in duration-200"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                <span className="leading-snug font-medium">{registerSuccess}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* LOGIN FORM (PILL DESIGN)                                  */}
            {/* ========================================================= */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    id="login-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or Username"
                    disabled={isLoginSubmitting}
                    autoComplete="username"
                    className="pill-input w-full px-6 py-4 text-sm font-medium text-slate-900 focus:outline-none"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    disabled={isLoginSubmitting}
                    autoComplete="current-password"
                    className="pill-input w-full pl-6 pr-12 py-4 text-sm font-medium text-slate-900 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 px-1">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center text-xs font-medium text-slate-500 cursor-pointer select-none"
                  >
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoginSubmitting}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-1.5 cursor-pointer"
                    />
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className="pill-btn-indigo w-full h-14 text-white text-base font-bold flex items-center justify-center gap-2 cursor-pointer mt-5 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoginSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* REGISTER FORM (PILL DESIGN)                               */}
            {/* ========================================================= */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <input
                    id="register-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.fullName;
                          return next;
                        });
                      }
                    }}
                    placeholder="Full Name"
                    disabled={isRegisterSubmitting}
                    autoComplete="name"
                    className="pill-input w-full px-6 py-3.5 text-sm font-medium text-slate-900 focus:outline-none"
                    required
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1 px-4 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next.email;
                            return next;
                          });
                        }
                      }}
                      placeholder="Email Address"
                      disabled={isRegisterSubmitting}
                      autoComplete="email"
                      className="pill-input w-full px-6 py-3.5 text-sm font-medium text-slate-900 focus:outline-none"
                      required
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 px-4 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      id="register-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (fieldErrors.username) {
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next.username;
                            return next;
                          });
                        }
                      }}
                      placeholder="Username"
                      disabled={isRegisterSubmitting}
                      autoComplete="username"
                      className="pill-input w-full px-6 py-3.5 text-sm font-medium text-slate-900 focus:outline-none"
                      required
                    />
                    {fieldErrors.username && (
                      <p className="mt-1 px-4 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    id="register-password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.password;
                          return next;
                        });
                      }
                    }}
                    placeholder="Password (min 8 characters)"
                    disabled={isRegisterSubmitting}
                    autoComplete="new-password"
                    className="pill-input w-full pl-6 pr-12 py-3.5 text-sm font-medium text-slate-900 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator Bars */}
                {registerPassword && (
                  <div className="px-3 space-y-1 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>Password Strength:</span>
                      <span className={`font-bold ${passwordStrength.score >= 3 ? (passwordStrength.score === 4 ? 'text-emerald-600' : 'text-indigo-600') : passwordStrength.score === 2 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            step <= passwordStrength.score
                              ? passwordStrength.color
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <input
                    id="register-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.phone;
                          return next;
                        });
                      }
                    }}
                    placeholder="Phone Number (optional)"
                    disabled={isRegisterSubmitting}
                    autoComplete="tel"
                    className="pill-input w-full px-6 py-3.5 text-sm font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRegisterSubmitting}
                  className="pill-btn-indigo w-full h-14 text-white text-base font-bold flex items-center justify-center gap-2 cursor-pointer mt-4 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRegisterSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                or continue with
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google Authentication Pill Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting || !isGoogleConfigured}
              className={`pill-btn-secondary w-full h-12 flex items-center justify-center gap-3 font-semibold text-sm cursor-pointer ${
                !isGoogleConfigured ? 'opacity-60 cursor-not-allowed' : 'disabled:opacity-70'
              }`}
            >
              <Image
                src="/icons/google.png"
                alt="Google logo"
                width={18}
                height={18}
                className="w-[18px] h-[18px] object-contain shrink-0"
              />
              <span>
                {isGoogleConfigured
                  ? mode === 'login'
                    ? 'Continue with Google'
                    : 'Sign up with Google'
                  : 'Continue with Google'}
              </span>
            </button>
          </div>
        </div>

        {/* Form Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-normal gap-2">
          <span>© 2005–2026 Inventory Management System Inc.</span>
          <div className="flex items-center gap-4">
            <button type="button" className="hover:text-slate-700 transition cursor-pointer">
              Contact Us
            </button>
            <button type="button" className="inline-flex items-center gap-1 hover:text-slate-700 transition cursor-pointer">
              <Globe className="w-3.5 h-3.5" />
              <span>English ▾</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


