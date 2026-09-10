/**
 * Remove Wishlist Confirmation Modal Component
 * Module: components/wishlist/RemoveConfirmModal.jsx
 * 
 * Accessible confirmation dialog prompt before permanently removing a smartphone
 * from the customer's saved wishlist collection.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const RemoveConfirmModal = ({
  isOpen = false,
  itemName = 'this smartphone',
  onConfirm,
  onCancel,
  isRemoving = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isRemoving) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, isRemoving]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isRemoving ? onCancel : undefined}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-wishlist-modal-title"
            className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-b from-dark-900 to-dark-950 border border-dark-800 p-6 sm:p-7 shadow-2xl space-y-5 text-center"
          >
            {/* Warning Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-glow-sm">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3
                id="remove-wishlist-modal-title"
                className="text-base sm:text-lg font-bold text-white tracking-tight"
              >
                Remove from Wishlist?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Are you sure you want to remove <strong className="text-white">"{itemName}"</strong> from your saved devices?
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isRemoving}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-dark-850 border border-dark-750 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isRemoving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-glow-sm shadow-rose-950 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isRemoving ? 'Removing...' : 'Remove'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RemoveConfirmModal;
