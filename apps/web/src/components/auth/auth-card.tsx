'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/auth-context';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from 'lucide-react';

interface AuthCardProps {
  initialMode?: 'login' | 'register';
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

  // Active focus trackers for micro-interaction icon highlights
  const [activeField, setActiveField] = useState<string | null>(null);

  const isGoogleConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // Synchronize internal mode if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Smooth mode transition handler
  const switchMode = (targetMode: 'login' | 'register') => {
    if (mode === targetMode || isTransitioning) return;

    // Respect prefers-reduced-motion
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

      // Clear non-persistent errors when switching modes
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
    <div className="surface-liquid-glass-auth relative w-full max-w-5xl rounded-[28px] sm:rounded-[32px] p-3 sm:p-5 lg:p-6 shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Liquid Glass Top Specular Sheen */}
      <div className="glass-specular-sheen absolute -top-1 left-0 right-0 h-32 pointer-events-none rounded-t-[32px]" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* ========================================================= */}
        {/* LEFT COLUMN: AUTHENTICATION FORM                          */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-3 sm:p-5 lg:p-6">
          <div>
            {/* SMS Brand Identity Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-500/20 border border-white/40">
                SMS
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 leading-none">Stock Management System</div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
                  Inventory & POS Operations
                </div>
              </div>
            </div>

            {/* Segmented Glass Mode Switcher */}
            <div className="glass-segmented-track inline-flex p-1 rounded-xl w-full mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                disabled={isSubmitting}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer text-center ${
                  mode === 'login'
                    ? 'glass-segmented-thumb text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                disabled={isSubmitting}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer text-center ${
                  mode === 'register'
                    ? 'glass-segmented-thumb text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Animated Form Container */}
            <div
              className={`transition-all duration-300 ease-out ${
                transitionPhase === 'exiting'
                  ? 'opacity-0 -translate-y-2 scale-[0.985]'
                  : transitionPhase === 'entering'
                  ? 'opacity-0 translate-y-2 scale-[0.985]'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              {/* Heading Area */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
                  {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {mode === 'login'
                    ? 'Sign in to access your inventory and billing workstation'
                    : 'Enter your details to register as a system operator'}
                </p>
              </div>

              {/* Global Error Banner */}
              {mode === 'login' && loginError && (
                <div
                  role="alert"
                  className="mb-4 p-3.5 bg-rose-50/90 border border-rose-200/80 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs sm:text-sm shadow-xs animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span className="leading-snug">{loginError}</span>
                </div>
              )}

              {mode === 'register' && registerError && (
                <div
                  role="alert"
                  className="mb-4 p-3.5 bg-rose-50/90 border border-rose-200/80 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs sm:text-sm shadow-xs animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span className="leading-snug">{registerError}</span>
                </div>
              )}

              {/* Register Success Banner */}
              {mode === 'register' && registerSuccess && (
                <div
                  role="status"
                  className="mb-4 p-3.5 bg-emerald-50/90 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 text-emerald-700 text-xs sm:text-sm shadow-xs animate-in fade-in duration-200"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                  <span className="leading-snug">{registerSuccess}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-identifier"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Username or Email
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                          activeField === 'login-identifier' ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="login-identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        onFocus={() => setActiveField('login-identifier')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. rahul_cashier or rahul@example.com"
                        disabled={isLoginSubmitting}
                        autoComplete="username"
                        className="liquid-glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="login-password"
                        className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700"
                      >
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                          activeField === 'login-password' ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onFocus={() => setActiveField('login-password')}
                        onBlur={() => setActiveField(null)}
                        placeholder="••••••••••••"
                        disabled={isLoginSubmitting}
                        autoComplete="current-password"
                        className="liquid-glass-input w-full pl-10 pr-10 py-2.5 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center pt-0.5">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoginSubmitting}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 text-xs text-slate-600 font-medium cursor-pointer select-none"
                    >
                      Remember this terminal (30 days)
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoginSubmitting}
                    className="glass-primary-button relative group overflow-hidden w-full h-11 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoginSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* SIGN UP FORM */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label
                      htmlFor="register-fullname"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                          activeField === 'register-fullname' ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
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
                        onFocus={() => setActiveField('register-fullname')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. Rahul Sharma"
                        disabled={isRegisterSubmitting}
                        autoComplete="name"
                        className="liquid-glass-input w-full pl-10 pr-4 py-2 rounded-xl text-slate-900 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    {fieldErrors.fullName && (
                      <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="register-email"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                          activeField === 'register-email' ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                      </div>
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
                        onFocus={() => setActiveField('register-email')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. rahul@example.com"
                        disabled={isRegisterSubmitting}
                        autoComplete="email"
                        className="liquid-glass-input w-full pl-10 pr-4 py-2 rounded-xl text-slate-900 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="register-username"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                          activeField === 'register-username' ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
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
                        onFocus={() => setActiveField('register-username')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. rahul_cashier"
                        disabled={isRegisterSubmitting}
                        autoComplete="username"
                        className="liquid-glass-input w-full pl-10 pr-4 py-2 rounded-xl text-slate-900 text-sm font-mono focus:outline-none"
                        required
                      />
                    </div>
                    {fieldErrors.username && (
                      <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {fieldErrors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="register-password"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Password (min 8 chars) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                          activeField === 'register-password' ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                      </div>
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
                        onFocus={() => setActiveField('register-password')}
                        onBlur={() => setActiveField(null)}
                        placeholder="••••••••••••"
                        disabled={isRegisterSubmitting}
                        autoComplete="new-password"
                        className="liquid-glass-input w-full pl-10 pr-10 py-2 rounded-xl text-slate-900 text-sm focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      >
                        {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="register-phone"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Phone Number <span className="text-slate-400 lowercase text-[10px] font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                          activeField === 'register-phone' ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                      </div>
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
                        onFocus={() => setActiveField('register-phone')}
                        onBlur={() => setActiveField(null)}
                        placeholder="+91 98765 43210"
                        disabled={isRegisterSubmitting}
                        autoComplete="tel"
                        className="liquid-glass-input w-full pl-10 pr-4 py-2 rounded-xl text-slate-900 text-sm font-mono focus:outline-none"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isRegisterSubmitting}
                    className="glass-primary-button relative group overflow-hidden w-full h-11 mt-2 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isRegisterSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200/80" />
                <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-slate-200/80" />
              </div>

              {/* Google Authentication Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting || !isGoogleConfigured}
                className={`glass-secondary-button w-full h-11 text-slate-700 font-medium text-sm rounded-xl flex items-center justify-center gap-2.5 cursor-pointer ${
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
                    : 'Google Sign-In not configured'}
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Navigation Mode Switch Link */}
          <div className="mt-6 pt-2 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  disabled={isSubmitting}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold transition hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  disabled={isSubmitting}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold transition hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: DEDICATED VISUAL HERO CONTAINER             */}
        {/* ========================================================= */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between rounded-[22px] sm:rounded-[26px] p-6 lg:p-8 overflow-hidden bg-gradient-to-br from-indigo-50/70 via-slate-50/50 to-indigo-100/30 border border-white/70 shadow-inner">
          {/* Inner ambient glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-[10%] -right-[10%] w-[320px] h-[320px] bg-gradient-to-br from-indigo-300/30 to-purple-200/20 rounded-full blur-[60px]" />
            <div className="absolute -bottom-[15%] -left-[10%] w-[320px] h-[320px] bg-gradient-to-tr from-emerald-200/25 to-indigo-200/20 rounded-full blur-[70px]" />
            <div className="absolute inset-0 bg-operations-grid opacity-30" />
          </div>

          {/* Top Hero Heading & Subtitle */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/95 shadow-xs text-xs font-semibold text-indigo-700">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Inventory & Point of Sale Platform
            </div>
            <h2 className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight mt-4 leading-tight">
              Streamlined operations for modern stock management.
            </h2>
            <p className="text-xs xl:text-sm text-slate-500 mt-2 leading-relaxed max-w-md">
              Real-time multi-warehouse tracking, lightning-fast barcode billing, and audit-ready reporting all in one unified workspace.
            </p>
          </div>

          {/* Center 3D Character Illustration */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-4 min-h-[300px]">
            <div className="relative w-full h-[320px] xl:h-[360px]">
              <Image
                src="/images/auth-characters.png"
                alt="Stock Management System Team"
                fill
                priority
                sizes="(min-width: 1280px) 550px, (min-width: 1024px) 450px, 100vw"
                className="object-contain object-center drop-shadow-lg select-none pointer-events-none transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Bottom Micro-Feature Highlights */}
          <div className="relative z-10 pt-4 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1" />
              <span className="font-semibold text-slate-800 text-[11px] block">Live Sync</span>
              <span className="text-[10px] text-slate-500 block">Real-time counts</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mx-auto mb-1" />
              <span className="font-semibold text-slate-800 text-[11px] block">Multi-Location</span>
              <span className="text-[10px] text-slate-500 block">Warehouses & stores</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-amber-500 mx-auto mb-1" />
              <span className="font-semibold text-slate-800 text-[11px] block">Instant POS</span>
              <span className="text-[10px] text-slate-500 block">Fast checkout & tax</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
