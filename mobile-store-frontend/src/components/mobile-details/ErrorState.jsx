/**
 * ErrorState Component
 * Module: components/mobile-details/ErrorState.jsx
 * 
 * Friendly error display when a requested mobile UUID does not exist or fails to load.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ErrorState = ({
  title = 'Smartphone Not Found',
  message = 'The requested flagship device may have been discontinued or is no longer available in our catalog.',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-dark-900/60 border border-dark-800/80 text-center max-w-lg mx-auto shadow-2xl ${className}`}
    >
      {/* Icon with Ambient Glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative w-20 h-20 rounded-3xl bg-dark-850 border border-dark-750 flex items-center justify-center text-rose-400 shadow-inner">
          <Smartphone className="w-10 h-10 text-neutral-500" />
          <AlertCircle className="w-6 h-6 text-rose-400 absolute -bottom-1 -right-1" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
        {title}
      </h2>

      <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mb-8 font-sans">
        {message}
      </p>

      <Link
        to="/mobiles"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all duration-200 shadow-glow-sm hover:scale-[1.02]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Mobiles Catalog</span>
      </Link>
    </motion.div>
  );
};

export default ErrorState;
