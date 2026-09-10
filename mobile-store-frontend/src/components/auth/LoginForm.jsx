/**
 * Customer Login Form Component
 * Module: components/auth/LoginForm.jsx
 * 
 * Luxury customer authentication form:
 * - Real-time client validation (inline error handling)
 * - Full password visibility toggle with cursor preservation
 * - 1-Click "Use Demo Customer" shortcut
 * - Smooth Framer Motion entrance & tactile feedback
 * - Disables inputs/buttons during submission with loading spinner
 * - Integrates with UserAuthContext
 */

import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles, User, ShieldCheck, LogOut } from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Input, Button } from '../ui';
import SocialDivider from './SocialDivider';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Field validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordInputRef = useRef(null);

  const { login, logout, user, isAuthenticated, error: contextError, clearError } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/account';

  // Toggle password with cursor preservation
  const handleTogglePassword = () => {
    const input = passwordInputRef.current;
    if (input) {
      const cursorStart = input.selectionStart;
      const cursorEnd = input.selectionEnd;
      setShowPassword((prev) => !prev);
      requestAnimationFrame(() => {
        if (input) {
          input.focus();
          input.setSelectionRange(cursorStart, cursorEnd);
        }
      });
    } else {
      setShowPassword((prev) => !prev);
    }
  };



  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError('Email address is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!validate()) {
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@antigravity.com' || cleanEmail.startsWith('admin@')) {
      setLocalError('admin_redirect');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate(destination, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Invalid email or password. Please try again.';
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || contextError;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Portal Switcher Tabs */}
      <div className="flex rounded-2xl bg-dark-950 p-1.5 mb-6 border border-dark-800 shadow-inner">
        <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-accent-600 text-white shadow-sm cursor-default">
          <User className="w-3.5 h-3.5" />
          <span>Customer Portal</span>
        </div>
        <Link
          to="/admin/login"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-dark-900 transition-all duration-200"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
          <span>Admin Portal</span>
        </Link>
      </div>

      {/* If already signed in, show explicit active session card so user knows they are logged in */}
      {isAuthenticated && user ? (
        <div className="rounded-3xl bg-dark-900/80 border border-dark-800 backdrop-blur-xl p-7 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-glow-sm">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              ACTIVE SESSION FOUND
            </span>
            <h2 className="text-xl font-extrabold text-white mt-2">
              Signed in as {user.fullName}
            </h2>
            <p className="text-xs font-mono text-neutral-400">{user.email}</p>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
            You are currently authenticated in this browser. You can proceed to your account dashboard, or sign out to enter new credentials.
          </p>

          <div className="space-y-3 pt-2">
            <Button
              fullWidth
              variant="primary"
              size="md"
              onClick={() => navigate(destination)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="shadow-glow-sm"
            >
              Continue to Account Dashboard
            </Button>

            <Button
              fullWidth
              variant="secondary"
              size="md"
              onClick={() => {
                logout();
                setEmail('');
                setPassword('');
              }}
              icon={<LogOut className="w-4 h-4 text-rose-400" />}
            >
              Sign Out & Log In with Another Account
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Sign In
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Sign in to access your MS Mobiles account, wishlist, and orders.
            </p>
          </div>

          {/* Inline Error / Admin Redirect Alert */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                  displayError === 'admin_redirect'
                    ? 'bg-accent-500/10 border-accent-500/30 text-accent-300 shadow-glow-sm'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}
              >
                {displayError === 'admin_redirect' ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <p className="font-bold text-white text-sm">
                        Administrator Account Detected
                      </p>
                      <p className="text-neutral-300 text-xs leading-relaxed">
                        You entered an Administrator account (<span className="font-mono text-accent-300">{email}</span>). You are currently on the <strong>Customer Portal</strong>.
                      </p>
                      <div className="pt-1">
                        <Link
                          to="/admin/login"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Switch to Admin Portal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div>
                        <span className="font-semibold text-rose-200">Authentication Error: </span>
                        <span>{displayError}</span>
                      </div>
                      <p className="text-neutral-300 text-[11px] pt-0.5">
                        New here or customer does not exist yet?{' '}
                        <Link to="/register" className="text-accent-400 font-bold underline hover:text-accent-300">
                          Create an account in 30 seconds →
                        </Link>
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>



          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (localError) setLocalError(null);
                if (contextError) clearError();
              }}
              error={emailError}
              disabled={isSubmitting}
              iconLeft={<Mail className="w-4 h-4 text-neutral-400" />}
              autoComplete="email"
              autoFocus
              required
            />

            {/* Password Field */}
            <div className="space-y-1">
              <Input
                ref={passwordInputRef}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                  if (localError) setLocalError(null);
                  if (contextError) clearError();
                }}
                error={passwordError}
                disabled={isSubmitting}
                iconLeft={<Lock className="w-4 h-4 text-neutral-400" />}
                iconRight={
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    tabIndex={-1}
                    className="text-neutral-400 hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                autoComplete="current-password"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-dark-700 bg-dark-900 text-accent-500 focus:ring-accent-500/20"
                />
                <span className="text-xs text-neutral-300">Keep me signed in</span>
              </label>

              <span className="text-xs text-neutral-500 cursor-not-allowed" title="Contact concierge for account recovery">
                Forgot password?
              </span>
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
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Sign In
              </Button>
            </div>
          </form>

          <SocialDivider label="New to MS Mobiles?" />

          {/* Switch to Register */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-dark-750 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            >
              Create Customer Account
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginForm;
