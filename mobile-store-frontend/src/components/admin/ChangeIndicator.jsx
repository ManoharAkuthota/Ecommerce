/**
 * Field Change Indicator Component
 * Module: components/admin/ChangeIndicator.jsx
 * 
 * Renders a subtle indicator dot/badge next to fields that have been edited
 * from their loaded baseline values.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChangeIndicator = ({
  isChanged = false,
  label = 'Modified',
  className = '',
}) => {
  return (
    <AnimatePresence>
      {isChanged && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/25 text-[10px] font-bold uppercase tracking-wider font-mono select-none ${className}`}
          title="Field modified from original value"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
          <span>{label}</span>
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default ChangeIndicator;
