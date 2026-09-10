/**
 * Floating Save Action Bar Component
 * Module: components/admin/SaveBar.jsx
 * 
 * Docked floating action bar inspired by Shopify:
 * - Slides up smoothly when changes are detected
 * - Displays change summary
 * - Provides immediate Discard and Save triggers
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RotateCcw, Check, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../ui';

export const SaveBar = ({
  show = false,
  changedCount = 0,
  onSave,
  onDiscard,
  isSaving = false,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-auto max-w-xl shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-3.5 rounded-2xl sm:rounded-full bg-dark-900/95 border border-accent-500/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.25)] select-none">
            {/* Left: Change Counter */}
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span>
                Unsaved changes{' '}
                {changedCount > 0 && (
                  <span className="text-neutral-400 font-normal">
                    ({changedCount} {changedCount === 1 ? 'item' : 'items'} modified)
                  </span>
                )}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDiscard}
                disabled={isSaving}
                iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-xs text-neutral-300 hover:text-white"
              >
                Discard
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                isLoading={isSaving}
                iconLeft={!isSaving ? <Check className="w-4 h-4" /> : null}
                className="text-xs shadow-glow-sm"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveBar;
