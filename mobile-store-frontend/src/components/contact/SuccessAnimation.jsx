/**
 * SuccessAnimation Component
 * Module: components/contact/SuccessAnimation.jsx
 * 
 * Luxury animated submission confirmation:
 * - Glowing checkmark with Framer Motion spring physics
 * - Thank-you message and expected response time
 * - "Send Another Message" reset button
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Send, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

export const SuccessAnimation = ({ onReset, customerName = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -12 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-8 sm:p-12 rounded-3xl bg-dark-900/80 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl text-center space-y-6 select-none"
    >
      {/* Animated Success Checkmark Ring */}
      <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
        />
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.15 }}
          className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-glow-sm"
        >
          <Check className="w-8 h-8 stroke-[2.5]" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Inquiry Received</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Thank You{customerName ? `, ${customerName}` : ''}!
        </h3>

        <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed font-sans">
          Your inquiry has been stored securely in the system. The store manager will review your question and post an in-app response directly into your customer portal—no external email needed!
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/account/inquiries"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all duration-200 shadow-glow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Track in Customer Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-white text-xs font-bold border border-dark-700/80 transition-all duration-200 shadow-sm"
        >
          <span>Send Another Message</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SuccessAnimation;
