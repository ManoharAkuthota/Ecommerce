/**
 * Floating Save Bar Component
 * Module: components/account/SaveBar.jsx
 * 
 * Elegant floating action bar positioned at the bottom of the viewport
 * when unsaved profile modifications are detected.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';

const SaveBar = ({
  show = false,
  onSave,
  onDiscard,
  isSaving = false,
  hasErrors = false,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 sm:left-auto z-40 max-w-lg select-none"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 px-5 py-3.5 rounded-2xl bg-dark-900/95 border border-dark-750 backdrop-blur-2xl shadow-2xl shadow-dark-950/80">
            {/* Left: Unsaved Changes Badge */}
            <div className="flex items-center gap-2.5 text-xs text-neutral-300">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="font-semibold text-white">Unsaved modifications</span>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Discard Button */}
              <button
                type="button"
                onClick={onDiscard}
                disabled={isSaving}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-dark-800 border border-dark-750 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Discard</span>
              </button>

              {/* Save Button */}
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving || hasErrors}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-accent-600 hover:bg-accent-500 text-white shadow-glow-sm hover:shadow-glow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveBar;
