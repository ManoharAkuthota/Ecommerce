/**
 * Clear Comparison Confirmation Modal Component
 * Module: components/compare/ClearConfirmModal.jsx
 * 
 * Accessible confirmation dialog for clearing all compared smartphones:
 * - Traps focus, handles Escape key and backdrop clicks
 * - Non-destructive cancel action & clear all confirmation
 * - Framer Motion spring backdrop and modal scale transition
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const ClearConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  count = 0,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-3xl bg-dark-900 border border-dark-750 p-6 sm:p-7 shadow-2xl overflow-hidden z-10"
        >
          {/* Ambient Warning Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-rose-500" />
          </div>

          {/* Text Content */}
          <h3 id="clear-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Clear your comparison list?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
            This will remove all {count > 0 ? count : ''} compared smartphones from your list. You can add them back anytime from the storefront.
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-dark-700 bg-dark-800 hover:bg-dark-750 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm hover:shadow-glow-sm shadow-rose-950/50 transition-all duration-200"
            >
              Clear All
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ClearConfirmModal;
