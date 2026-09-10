/**
 * Unsaved Changes Indicator Pill
 * Module: components/account/ChangeIndicator.jsx
 * 
 * Elegant badge alerting the user that local edits have been made but not yet saved.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChangeIndicator = ({ isDirty = false, label = 'Unsaved changes' }) => {
  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-semibold select-none shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span>{label}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangeIndicator;
