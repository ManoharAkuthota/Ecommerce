/**
 * Delete Confirmation Modal Component
 * Module: components/admin/DeleteConfirmModal.jsx
 * 
 * Luxury glassmorphic dialog requesting explicit confirmation prior to permanent
 * smartphone deletion from the catalog.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { Card, Button } from '../ui';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  mobileName = '',
  isDeleting = false,
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={!isDeleting ? onClose : undefined}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md z-10"
          >
            <Card
              glass={true}
              className="p-6 sm:p-7 border-rose-500/20 bg-dark-900/95 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle Red Top Accent Glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              {!isDeleting && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-4">
                {/* Warning Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                {/* Dialog Title & Message */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Delete Smartphone Product
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Are you sure you want to permanently delete{' '}
                    <span className="font-semibold text-rose-300 underline decoration-rose-500/40">
                      "{mobileName}"
                    </span>
                    ? This action cannot be undone. Cloudinary images and store records will be removed.
                  </p>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="border-dark-700 hover:border-dark-600 text-neutral-300 text-xs sm:text-sm"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    isLoading={isDeleting}
                    iconLeft={!isDeleting ? <Trash2 className="w-4 h-4" /> : null}
                    className="text-xs sm:text-sm shadow-[0_0_15px_rgba(244,63,94,0.35)]"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Product'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
