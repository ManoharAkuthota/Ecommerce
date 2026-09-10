/**
 * ContactForm Component
 * Module: components/contact/ContactForm.jsx
 * 
 * Luxury glassmorphic customer concierge inquiry form:
 * - Fields: Full Name, Email, Subject, Message
 * - Real-time React inline validation
 * - Dynamic character counter for Message (max 3000 chars)
 * - Submit button with loading spinner and double-submit prevention
 * - Live Spring Boot API integration via contactService.sendMessage
 * - Seamless transition to SuccessAnimation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  AlertCircle,
  User,
  Mail,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { contactService } from '../../services/contactService';
import SuccessAnimation from './SuccessAnimation';

const MAX_MESSAGE_LENGTH = 3000;

export const ContactForm = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation function
  const validate = (values) => {
    const errs = {};

    // Name: Required, min 2 chars
    if (!values.name || !values.name.trim()) {
      errs.name = 'Full name is required';
    } else if (values.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    // Email: Required, valid email
    if (!values.email || !values.email.trim()) {
      errs.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email.trim())) {
        errs.email = 'Please enter a valid email address';
      }
    }

    // Subject: Required, min 3 chars
    if (!values.subject || !values.subject.trim()) {
      errs.subject = 'Subject is required';
    } else if (values.subject.trim().length < 3) {
      errs.subject = 'Subject must be at least 3 characters';
    }

    // Message: Required, min 10 chars, max 3000 chars
    if (!values.message || !values.message.trim()) {
      errs.message = 'Message is required';
    } else if (values.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    } else if (values.message.trim().length > MAX_MESSAGE_LENGTH) {
      errs.message = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`;
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Revalidate field if already touched
    if (touched[name]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name] || null,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark all fields touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await contactService.sendMessage(formData);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting contact inquiry:', err);
      const serverMessage =
        err.response?.data?.message ||
        'Unable to send your message. Please check your network and try again.';
      setSubmitError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setTouched({});
    setSubmitError(null);
    setIsSuccess(false);
  };

  const remainingChars = MAX_MESSAGE_LENGTH - formData.message.length;

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <SuccessAnimation
            key="success"
            customerName={formData.name}
            onReset={handleResetForm}
          />
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSubmit}
            noValidate
            className="p-6 sm:p-10 rounded-3xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-2xl shadow-2xl space-y-6"
          >
            <div className="border-b border-dark-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                <span>Concierge Message</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Send an Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Fill in the details below and our team will respond within 24 hours.
              </p>
            </div>

            {/* Server / Network Error Alert */}
            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-3 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Field 1: Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-name"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300"
              >
                Full Name <span className="text-accent-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. John Doe"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`w-full pl-10 pr-4 py-3 bg-dark-850/80 hover:bg-dark-850 focus:bg-dark-850 border rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all ${
                    touched.name && errors.name
                      ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-dark-750 focus:border-accent-500/60 focus:ring-accent-500/20'
                  }`}
                />
              </div>
              {touched.name && errors.name && (
                <p id="name-error" className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-sans">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Field 2: Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-email"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300"
              >
                Email Address <span className="text-accent-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full pl-10 pr-4 py-3 bg-dark-850/80 hover:bg-dark-850 focus:bg-dark-850 border rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all ${
                    touched.email && errors.email
                      ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-dark-750 focus:border-accent-500/60 focus:ring-accent-500/20'
                  }`}
                />
              </div>
              {touched.email && errors.email && (
                <p id="email-error" className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-sans">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Field 3: Subject */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-subject"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300"
              >
                Subject <span className="text-accent-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Flagship Device Stock Inquiry"
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  className={`w-full pl-10 pr-4 py-3 bg-dark-850/80 hover:bg-dark-850 focus:bg-dark-850 border rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all ${
                    touched.subject && errors.subject
                      ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-dark-750 focus:border-accent-500/60 focus:ring-accent-500/20'
                  }`}
                />
              </div>
              {touched.subject && errors.subject && (
                <p id="subject-error" className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-sans">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.subject}</span>
                </p>
              )}
            </div>

            {/* Field 4: Message with Character Counter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300"
                >
                  Message <span className="text-accent-400">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    remainingChars < 100 ? 'text-amber-400' : 'text-neutral-500'
                  }`}
                >
                  {remainingChars} characters remaining
                </span>
              </div>
              <div className="relative">
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="How can our smartphone hardware specialists assist you today?"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={`w-full p-4 bg-dark-850/80 hover:bg-dark-850 focus:bg-dark-850 border rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                    touched.message && errors.message
                      ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-dark-750 focus:border-accent-500/60 focus:ring-accent-500/20'
                  }`}
                />
              </div>
              {touched.message && errors.message && (
                <p id="message-error" className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-sans">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-accent-600 hover:bg-accent-500 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-bold shadow-glow-sm hover:shadow-glow-md transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
