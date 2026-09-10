/**
 * Accessible Form Field Wrapper Component
 * Module: components/admin/FormField.jsx
 * 
 * Provides consistent layout for form inputs:
 * - Label with optional required asterisk
 * - Helper description text
 * - Framer Motion animated error feedback
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import ChangeIndicator from './ChangeIndicator';

export const FormField = ({
  label,
  id,
  required = false,
  helperText,
  error,
  children,
  className = '',
  isChanged = false,
  extra = null,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="block text-xs font-bold text-neutral-300 tracking-wide uppercase font-sans select-none"
          >
            {label}
            {required && <span className="text-rose-400 ml-1 font-black">*</span>}
          </label>
          {isChanged && <ChangeIndicator isChanged={true} />}
          {extra}
        </div>
      )}

      {/* Input / Control Slot */}
      <div>{children}</div>

      {/* Helper Text (displayed when there is no error) */}
      {helperText && !error && (
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          {helperText}
        </p>
      )}

      {/* Animated Error Feedback */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs text-rose-400 font-medium pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormField;
