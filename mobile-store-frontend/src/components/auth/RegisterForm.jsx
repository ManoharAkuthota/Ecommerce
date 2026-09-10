/**
 * Customer Registration Form Component
 * Module: components/auth/RegisterForm.jsx
 * 
 * Luxury customer account registration:
 * - Real-time client-side validations matching Spring Boot constraints
 * - Integrated live PasswordStrength meter & requirements checklist
 * - Confirm password match verification
 * - Password visibility toggles with cursor preservation
 * - Elegant animated success card with countdown redirect to /login
 * - Decoupled integration with UserAuthContext
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Input, Button } from '../ui';
import PasswordStrength from './PasswordStrength';
import { evaluatePasswordStrength } from '../../utils/passwordStrength';
import SocialDivider from './SocialDivider';

const RegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Field validation error states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success redirect countdown
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const { register, login } = useUserAuth();
  const navigate = useNavigate();

  // Automatic redirect timer upon registration success
  useEffect(() => {
    let timer;
    if (registrationSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (registrationSuccess && countdown === 0) {
      navigate('/account', {
        state: { message: 'Account created successfully! Welcome to MS Mobiles.' },
      });
    }
    return () => clearTimeout(timer);
  }, [registrationSuccess, countdown, navigate]);

  // Toggle password visibility with cursor preservation
  const toggleVisibility = (ref, setter) => {
    const input = ref.current;
    if (input) {
      const cursorStart = input.selectionStart;
      const cursorEnd = input.selectionEnd;
      setter((prev) => !prev);
      requestAnimationFrame(() => {
        if (input) {
          input.focus();
          input.setSelectionRange(cursorStart, cursorEnd);
        }
      });
    } else {
      setter((prev) => !prev);
    }
  };

  const validate = () => {
    const errs = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) {
      errs.phoneNumber = 'Phone number is required';
    } else if (!/^[+]?[0-9\s\-()]{7,20}$/.test(cleanPhone)) {
      errs.phoneNumber = 'Please enter a valid phone number (e.g. +91 98765 43210)';
    }

    const pwdStrength = evaluatePasswordStrength(password);
    if (!password) {
      errs.password = 'Password is required';
    } else if (!pwdStrength.isValid) {
      errs.password =
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      errs.terms = 'You must agree to the Terms of Service';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
      });

      // Auto login so customer is instantly authenticated
      try {
        await login({ email: email.trim(), password });
      } catch (loginErr) {
        console.warn('Auto-login deferred:', loginErr);
      }

      setRegistrationSuccess(true);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed. Please check your information and try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully registered, show luxury success card
  if (registrationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto p-8 rounded-3xl bg-dark-900/80 border border-dark-750 backdrop-blur-xl text-center space-y-5"
      >
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Account Created!
          </h2>
          <p className="text-sm text-neutral-300 mt-2">
            Welcome to MS Mobiles,{' '}
            <span className="text-white font-semibold">{fullName}</span>.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Your customer profile is active and saved permanently in the cloud.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-950/60 border border-dark-800 text-xs text-neutral-300 flex items-center justify-between">
          <span>Entering your account...</span>
          <span className="font-mono font-bold text-accent-400">
            {countdown}s
          </span>
        </div>

        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => navigate('/account')}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Go to My Account
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Your Account
        </h1>
        <p className="text-sm text-neutral-400 mt-2">
          Join MS Mobiles and discover premium smartphones.
        </p>
      </div>

      {/* Server Error Alert */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3 text-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-rose-200">Registration Error: </span>
              {serverError}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Full Name */}
        <div>
          <Input
            id="register-fullname"
            type="text"
            label="Full Name"
            placeholder="Arthur Dent"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
            }}
            disabled={isSubmitting}
            error={errors.fullName}
            required
            autoComplete="name"
            iconLeft={<User className="w-4 h-4" />}
          />
        </div>

        {/* Email Address */}
        <div>
          <Input
            id="register-email"
            type="email"
            label="Email Address"
            placeholder="arthur@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            disabled={isSubmitting}
            error={errors.email}
            required
            autoComplete="email"
            iconLeft={<Mail className="w-4 h-4" />}
          />
        </div>

        {/* Phone Number */}
        <div>
          <Input
            id="register-phone"
            type="tel"
            label="Phone Number"
            placeholder="+91 98450 11223"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
            }}
            disabled={isSubmitting}
            error={errors.phoneNumber}
            required
            autoComplete="tel"
            iconLeft={<Phone className="w-4 h-4" />}
          />
        </div>

        {/* Password Field */}
        <div>
          <Input
            ref={passwordRef}
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            disabled={isSubmitting}
            error={errors.password}
            helperText={!errors.password && !password ? "At least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special symbol (e.g. Pass@123)" : undefined}
            required
            autoComplete="new-password"
            iconLeft={<Lock className="w-4 h-4" />}
            iconRight={
              <button
                type="button"
                onClick={() => toggleVisibility(passwordRef, setShowPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Real-Time Password Strength Meter */}
          <PasswordStrength password={password} />
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            ref={confirmPasswordRef}
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            disabled={isSubmitting}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            iconLeft={<Lock className="w-4 h-4" />}
            iconRight={
              <button
                type="button"
                onClick={() => toggleVisibility(confirmPasswordRef, setShowConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="inline-flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
              }}
              disabled={isSubmitting}
              className="mt-0.5 w-4 h-4 rounded border-dark-700 bg-dark-950 text-accent-500 focus:ring-accent-500/20 focus:ring-offset-dark-950"
            />
            <span className="text-xs text-neutral-400 leading-relaxed">
              I agree to the{' '}
              <span className="text-neutral-200 underline decoration-dark-700">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-neutral-200 underline decoration-dark-700">
                Privacy Policy
              </span>
            </span>
          </label>
          {errors.terms && (
            <p className="text-[11px] text-rose-400 mt-1 pl-6">{errors.terms}</p>
          )}
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
            Create Account
          </Button>
        </div>
      </form>

      <SocialDivider label="Already have an account?" />

      {/* Switch to Login */}
      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-dark-750 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500"
        >
          Sign In to Your Account
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
