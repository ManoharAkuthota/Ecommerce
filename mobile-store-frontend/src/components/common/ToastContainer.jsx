/**
 * ToastContainer Component
 * Module: components/common/ToastContainer.jsx
 * 
 * Floating toast stack container with Framer Motion slide/fade physics,
 * type-based color accents, and manual dismiss support.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

const TOAST_VARIANTS = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    borderColor: 'border-emerald-500/30',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    borderColor: 'border-rose-500/30',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    borderColor: 'border-amber-500/30',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  },
  info: {
    icon: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    borderColor: 'border-sky-500/30',
    glow: 'shadow-[0_0_20px_rgba(14,165,233,0.15)]',
  },
};

export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = TOAST_VARIANTS[toast.type] || TOAST_VARIANTS.info;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className={`pointer-events-auto p-4 rounded-2xl bg-dark-900/95 backdrop-blur-2xl border ${config.borderColor} ${config.glow} shadow-2xl flex items-start gap-3 select-none`}
            >
              {config.icon}

              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(toast.id)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
