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
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';

interface AuthCardProps {
  initialMode?: 'login' | 'register';
}

// Stock Management System Brand Emblem (Coral / Navy Theme)
function InventoryLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-coral-500/25 shrink-0">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </div>
      <div>
        <span className="text-lg sm:text-xl font-extrabold tracking-tight text-navy-950 font-sans block leading-tight">
          SMS
        </span>
        <span className="text-[10px] text-content-muted font-semibold tracking-wider uppercase block">
          Stock Management System
        </span>
      </div>
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
    if (!pwd) return { score: 0, label: '', color: 'bg-surface-muted' };
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
        return { score: 3, label: 'Good', color: 'bg-coral-500' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: 'Too Short', color: 'bg-border' };
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
    <div className="auth-split-shell relative w-full max-w-[1180px] rounded-[32px] sm:rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px] transition-all duration-300 bg-surface border border-border shadow-popover">
      {/* ========================================================= */}
      {/* LEFT COLUMN: WARM EDITORIAL HERO PANEL                    */}
      {/* ========================================================= */}
      <div className="lg:col-span-6 xl:col-span-6 bg-surface-subtle bg-subtle-grid text-navy-950 p-7 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border">
        {/* Top Tagline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-xs font-semibold text-content-secondary shadow-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
            <span>Real-time inventory &amp; POS</span>
          </div>
          <p className="text-xs sm:text-sm text-content-secondary font-normal tracking-wide max-w-sm leading-relaxed">
            Smart stock control made simple – online inventory solutions for modern retail.
          </p>
        </div>

        {/* Center Typography & Phone Dashboard Mockup */}
        <div className="relative z-10 my-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.06] mb-8 font-sans">
            Manage <br />
            your items
          </h1>

          {/* Smartphone Dashboard Mockup in Warm Luxury Style */}
          <div className="relative max-w-[300px] sm:max-w-[320px] mx-auto lg:mx-0">
            <div className="phone-mockup-frame-warm p-4 text-navy-950 bg-white">
              {/* Phone Top Notch & Time */}
              <div className="flex items-center justify-between px-2 pt-0.5 pb-2 text-[10px] text-content-muted font-medium">
                <span>09:41</span>
                <div className="w-12 h-3 bg-navy-950 rounded-full mx-auto" />
                <span className="font-mono">100%</span>
              </div>

              {/* Total Stock Value Card */}
              <div className="mt-1 px-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-content-muted">Total Valuation</div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black font-sans tracking-tight text-navy-950 tabular-nums">
                    ₹8,97,420
                  </span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <span>↑ 14.8%</span>
                  <span className="text-content-muted font-normal">turnover velocity</span>
                </div>
              </div>

              {/* Mini Weekly Velocity Bar Chart */}
              <div className="my-3 p-2 bg-surface-subtle rounded-xl border border-border">
                <div className="flex items-end justify-between gap-1 h-14 px-1 pt-2">
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-border-dark rounded-t h-6" />
                    <span className="text-[8px] text-content-muted font-mono">M</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-border-dark rounded-t h-8" />
                    <span className="text-[8px] text-content-muted font-mono">T</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-border-dark rounded-t h-7" />
                    <span className="text-[8px] text-content-muted font-mono">W</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-border-dark rounded-t h-9" />
                    <span className="text-[8px] text-content-muted font-mono">T</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 relative">
                    <div className="w-full bg-gradient-to-t from-coral-600 to-coral-400 rounded-t h-12 shadow-sm shadow-coral-500/30" />
                    <span className="text-[8px] text-coral-600 font-bold font-mono">F</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-border-dark rounded-t h-5" />
                    <span className="text-[8px] text-content-muted font-mono">S</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-border-dark rounded-t h-8" />
                    <span className="text-[8px] text-content-muted font-mono">S</span>
                  </div>
                </div>
              </div>

              {/* Stock Category Preview Cards */}
              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between text-[10px] text-content-muted px-1">
                  <span className="font-semibold uppercase tracking-wider">Categories</span>
                  <Search className="w-3 h-3 text-content-muted" />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-surface-subtle p-2 rounded-xl border border-border">
                    <span className="text-[11px] font-bold text-navy-950 block tabular-nums">₹9.50 L</span>
                    <span className="text-[9px] text-content-secondary block mt-0.5">Electronics</span>
                  </div>
                  <div className="bg-surface-subtle p-2 rounded-xl border border-border">
                    <span className="text-[11px] font-bold text-navy-950 block tabular-nums">₹7.85 L</span>
                    <span className="text-[9px] text-content-secondary block mt-0.5">Hardware</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Platform Indicator */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-content-secondary">
          <div className="w-5 h-5 rounded-full bg-coral-100 border border-coral-200 flex items-center justify-center text-coral-600 text-[10px]">
            ⚡
          </div>
          <span className="font-medium">Production-Grade Enterprise Inventory Platform</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM                        */}
      {/* ========================================================= */}
      <div className="lg:col-span-6 xl:col-span-6 bg-white text-navy-950 p-7 sm:p-10 lg:p-14 flex flex-col justify-between relative">
        <div>
          {/* Top Bar: Brand Logo + Top-Right Switch Button */}
          <div className="flex items-center justify-between mb-8">
            <InventoryLogo />

            {/* Quick Switch Button (Sign Up / Sign In) */}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-content-secondary hover:text-coral-500 transition cursor-pointer group px-3 py-1.5 rounded-full hover:bg-surface-subtle"
            >
              <User className="w-4 h-4 text-content-muted group-hover:text-coral-500 transition-colors" />
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
            {/* Form Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-950 font-sans">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-xs sm:text-sm text-content-secondary mt-1.5">
                {mode === 'login'
                  ? 'Enter your credentials to access your store dashboard.'
                  : 'Start managing your products, sales, and inventory today.'}
              </p>
            </div>

            {/* Global Error Banner */}
            {mode === 'login' && loginError && (
              <div
                role="alert"
                className="mb-5 p-4 bg-danger-50 border border-danger-200 rounded-2xl flex items-start gap-3 text-danger-700 text-xs sm:text-sm animate-in fade-in duration-200"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-danger-600" />
                <span className="leading-snug font-medium">{loginError}</span>
              </div>
            )}

            {mode === 'register' && registerError && (
              <div
                role="alert"
                className="mb-5 p-4 bg-danger-50 border border-danger-200 rounded-2xl flex items-start gap-3 text-danger-700 text-xs sm:text-sm animate-in fade-in duration-200"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-danger-600" />
                <span className="leading-snug font-medium">{registerError}</span>
              </div>
            )}

            {/* Register Success Banner */}
            {mode === 'register' && registerSuccess && (
              <div
                role="status"
                className="mb-5 p-4 bg-success-50 border border-success-200 rounded-2xl flex items-start gap-3 text-success-700 text-xs sm:text-sm animate-in fade-in duration-200"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-success-600" />
                <span className="leading-snug font-medium">{registerSuccess}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* LOGIN FORM                                                */}
            {/* ========================================================= */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-identifier" className="block text-xs font-semibold text-navy-950 mb-1.5">
                    Email or Username
                  </label>
                  <input
                    id="login-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@store.com or admin"
                    disabled={isLoginSubmitting}
                    autoComplete="username"
                    className="pill-input w-full px-5 py-3.5 text-sm font-medium text-navy-950 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-xs font-semibold text-navy-950">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-coral-500 hover:text-coral-600 transition hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoginSubmitting}
                      autoComplete="current-password"
                      className="pill-input w-full pl-5 pr-12 py-3.5 text-sm font-medium text-navy-950 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-content-muted hover:text-navy-950 transition cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 px-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoginSubmitting}
                      className="w-4 h-4 rounded border-border text-coral-500 focus:ring-coral-500 cursor-pointer"
                    />
                    <span className="text-xs text-content-secondary font-medium">Remember this device (30 days)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className="pill-btn-coral w-full h-12 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoginSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* REGISTER FORM                                             */}
            {/* ========================================================= */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="reg-fullname" className="block text-xs font-semibold text-navy-950 mb-1">
                    Full Name
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Priyansh Rathod"
                    disabled={isRegisterSubmitting}
                    autoComplete="name"
                    className="pill-input w-full px-5 py-3 text-sm font-medium text-navy-950 focus:outline-none"
                    required
                  />
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-danger-600 mt-1 pl-2 font-medium">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-semibold text-navy-950 mb-1">
                      Email Address
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@store.com"
                      disabled={isRegisterSubmitting}
                      autoComplete="email"
                      className="pill-input w-full px-5 py-3 text-sm font-medium text-navy-950 focus:outline-none"
                      required
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-danger-600 mt-1 pl-2 font-medium">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-username" className="block text-xs font-semibold text-navy-950 mb-1">
                      Username
                    </label>
                    <input
                      id="reg-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="priyansh"
                      disabled={isRegisterSubmitting}
                      autoComplete="username"
                      className="pill-input w-full px-5 py-3 text-sm font-medium text-navy-950 focus:outline-none"
                      required
                    />
                    {fieldErrors.username && (
                      <p className="text-[11px] text-danger-600 mt-1 pl-2 font-medium">{fieldErrors.username}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-xs font-semibold text-navy-950 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showRegisterPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      disabled={isRegisterSubmitting}
                      autoComplete="new-password"
                      className="pill-input w-full pl-5 pr-12 py-3 text-sm font-medium text-navy-950 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-content-muted hover:text-navy-950 transition cursor-pointer"
                    >
                      {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-danger-600 mt-1 pl-2 font-medium">{fieldErrors.password}</p>
                  )}

                  {/* Password Strength Indicator */}
                  {registerPassword && (
                    <div className="mt-2 px-1">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-content-muted">Security:</span>
                        <span className="font-semibold text-navy-950">{passwordStrength.label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score >= step ? passwordStrength.color : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-semibold text-navy-950 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={isRegisterSubmitting}
                    autoComplete="tel"
                    className="pill-input w-full px-5 py-3 text-sm font-medium text-navy-950 focus:outline-none"
                  />
                  {fieldErrors.phone && (
                    <p className="text-[11px] text-danger-600 mt-1 pl-2 font-medium">{fieldErrors.phone}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isRegisterSubmitting}
                  className="pill-btn-coral w-full h-12 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRegisterSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                <span className="bg-white px-3 text-content-muted">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="pill-btn-secondary w-full h-12 text-navy-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Image
                src="/icons/google.png"
                alt="Google"
                width={18}
                height={18}
                className="shrink-0"
              />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Bottom Switch Link */}
        <div className="mt-6 pt-4 border-t border-border-subtle text-center text-xs text-content-secondary">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-bold text-coral-500 hover:text-coral-600 transition hover:underline cursor-pointer"
              >
                Sign up for free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-bold text-coral-500 hover:text-coral-600 transition hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
