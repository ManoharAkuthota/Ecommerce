/**
 * Premium Admin Login Page
 * Module: pages/admin/AdminLogin.jsx
 * 
 * Luxury split-screen administrative authentication portal inspired by Stripe, Linear, and Apple.
 * Features:
 * - Desktop luxury decorative showcase with ambient drifting orbs & hardware security telemetry
 * - Glassmorphic authentication card with backdrop blur and Cyber Indigo glowing accents
 * - Full password visibility toggle with smooth icon animation and cursor preservation
 * - Real-time client-side validation with inline error messaging
 * - Real JWT authentication integration via Spring Boot (POST /api/admin/login)
 * - Automatic redirection to originating route or admin dashboard
 * - Complete mobile responsiveness across 320px–414px, tablets, and desktops
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone,
  Cpu,
  Database,
  Activity,
  CheckCircle2,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input, Button } from '../../components/ui';
import Spinner from '../../components/ui/Spinner';
import { fadeInUp, fadeIn, scaleIn } from '../../utils/animations';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field-level validation error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [localError, setLocalError] = useState(null);

  const { login, isAuthenticated, error: contextError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/admin/dashboard';

  // If session is already authenticated, forward immediately to target destination
  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, destination, navigate]);

  // Clean errors when typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
    if (localError || contextError) {
      setLocalError(null);
      clearError();
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
    if (localError || contextError) {
      setLocalError(null);
      clearError();
    }
  };

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setEmailError('Administrator email is required.');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        setEmailError('Please enter a valid email address format.');
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError('Security password is required.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'user@antigravity.com' || (!cleanEmail.includes('admin') && cleanEmail.endsWith('@antigravity.com'))) {
      setLocalError('customer_redirect');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    clearError();

    try {
      await login({ email: email.trim(), password });
      navigate(destination, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setLocalError('Invalid email or password. Please verify your administrator credentials.');
      } else if (!err.response) {
        setLocalError('Authentication server is unreachable. Please verify the backend is running on port 8080.');
      } else {
        setLocalError(err.response?.data?.message || 'Authentication failed. Please check your credentials and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || contextError;

  return (
    <div className="min-h-screen w-full bg-dark-950 text-white flex flex-col lg:grid lg:grid-cols-12 relative overflow-x-hidden select-none">
      {/* Background Ambient Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            y: [-12, 12, -12],
            opacity: [0.2, 0.35, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-[450px] h-[450px] bg-accent-600/15 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            y: [12, -12, 12],
            opacity: [0.15, 0.3, 0.15],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-purple-600/15 rounded-full blur-[130px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-600/5 rounded-full blur-[160px]" />
      </div>

      {/* ========================================================================= */}
      {/* LEFT COLUMN: Luxury Decorative Showcase (Desktop only - lg:flex)          */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-12 xl:p-16 relative z-10 border-r border-dark-850/80">
        {/* Top Branding */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3"
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-500 text-white shadow-glow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider uppercase font-sans">
              MS <span className="text-accent-400 font-extrabold">Mobiles</span>
            </span>
            <span className="text-[11px] font-semibold text-neutral-400 tracking-widest uppercase">
              Flagship eCommerce Console
            </span>
          </div>
        </motion.div>

        {/* Center Decorative Hardware Showcase Card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.15 }}
          className="my-auto max-w-lg xl:max-w-xl"
        >
          {/* Main Floating Glass Container */}
          <div className="relative rounded-3xl border border-white/10 bg-dark-900/60 backdrop-blur-2xl p-8 xl:p-10 shadow-2xl shadow-black/70 overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Live Security Telemetry Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-dark-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Security Gateway Active
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-[11px] font-bold tracking-wider uppercase">
                JWT • HMAC-SHA256
              </div>
            </div>

            {/* Mock Hardware Platform Specs */}
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-950/70 border border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent-500/10 text-accent-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Cryptographic Sessions</p>
                    <p className="text-[11px] text-neutral-400">Stateless Spring Security 6 Authorization</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-950/70 border border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Cloudinary & MySQL Pipelines</p>
                    <p className="text-[11px] text-neutral-400">Atomic Multi-Image Uploads & CRUD</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-950/70 border border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Real-Time Inventory Engine</p>
                    <p className="text-[11px] text-neutral-400">Stock Availability & Instant Catalog Visibility</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Micro Benchmark Footer */}
            <div className="pt-4 border-t border-dark-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-accent-400" /> Backend Engine: Spring Boot 3.3.5
              </span>
              <span className="text-emerald-400 font-semibold">Ready for Operations</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Marketing Copy */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>Secure Administrative Environment</span>
          </div>
          <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
            Engineered for Total Storefront Control
          </h2>
          <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
            Manage flagship mobile inventories, curate authentic customer reviews, and execute instant visibility updates with zero-latency synchronization.
          </p>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Luxury Login Card                                           */}
      {/* ========================================================================= */}
      <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-4 sm:p-8 md:p-12 relative z-10">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md my-auto"
        >
          {/* Mobile-Only Header Brand Badge */}
          <div className="lg:hidden flex flex-col items-center mb-8 text-center">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-500 text-white shadow-glow-sm mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-wider uppercase font-sans">
              MS <span className="text-accent-400 font-extrabold">Mobiles</span>
            </span>
            <span className="text-xs text-neutral-400 uppercase tracking-widest mt-0.5">
              Admin Dashboard
            </span>
          </div>

          {/* Glassmorphic Login Card */}
          <div className="relative rounded-3xl bg-dark-900/70 border border-dark-800/80 backdrop-blur-2xl p-7 sm:p-10 shadow-2xl shadow-black/80">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-28 h-28 bg-accent-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Portal Switcher Tabs */}
            <div className="flex rounded-2xl bg-dark-950 p-1.5 mb-6 border border-dark-800 shadow-inner">
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-dark-900 transition-all duration-200"
              >
                <User className="w-3.5 h-3.5 text-accent-400" />
                <span>Customer Portal</span>
              </Link>
              <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-accent-600 text-white shadow-sm cursor-default">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </div>
            </div>

            {/* Desktop Card Header */}
            <div className="text-left mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-400 mb-4 shadow-card">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                Sign In
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
                Enter your administrative credentials to access the management console.
              </p>
            </div>

            {/* Animated Server / Authentication Error Banner */}
            <AnimatePresence mode="wait">
              {activeError && (
                <motion.div
                  key="auth-error"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed select-none ${
                    activeError === 'customer_redirect'
                      ? 'bg-accent-500/10 border-accent-500/30 text-accent-300 shadow-glow-sm'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                  role="alert"
                >
                  {activeError === 'customer_redirect' ? (
                    <>
                      <User className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <p className="font-bold text-white text-sm">
                          Customer Account Detected
                        </p>
                        <p className="text-neutral-300 text-xs leading-relaxed">
                          You entered a Customer account (<span className="font-mono text-accent-300">{email}</span>). You are currently on the <strong>Admin Portal</strong>.
                        </p>
                        <div className="pt-1">
                          <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>Switch to Customer Portal</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                      <span>{activeError}</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              {/* Email Input */}
              <div className="space-y-1">
                <Input
                  label="Administrator Email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="admin@antigravity.com"
                  iconLeft={<Mail className="w-4 h-4" />}
                  error={emailError}
                  disabled={isSubmitting}
                  required
                  autoComplete="email"
                  autoFocus
                  aria-required="true"
                  aria-invalid={Boolean(emailError)}
                />
              </div>

              {/* Password Input with Interactive Visibility Toggle */}
              <div className="space-y-1">
                <Input
                  label="Security Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  iconLeft={<Lock className="w-4 h-4" />}
                  error={passwordError}
                  disabled={isSubmitting}
                  required
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={Boolean(passwordError)}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-accent-500 select-none"
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <motion.div
                        key={showPassword ? 'visible' : 'hidden'}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-accent-400" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </motion.div>
                    </button>
                  }
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  icon={!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="shadow-glow-sm hover:shadow-glow-md transition-all duration-200"
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In'}
                </Button>
              </div>
            </form>

            {/* Back to Storefront Navigation */}
            <div className="mt-8 pt-6 border-t border-dark-800/80 text-center space-y-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors select-none group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                <span>Return to Customer Storefront</span>
              </Link>
              <p className="text-[11px] text-neutral-500 tracking-wide">
                Protected by 256-bit cryptographic Bearer token authentication.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
