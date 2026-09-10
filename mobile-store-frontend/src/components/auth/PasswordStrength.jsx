/**
 * Password Strength Indicator Component
 * Module: components/auth/PasswordStrength.jsx
 * 
 * Renders a smooth 4-stage progress bar and live criteria checklist:
 * - 4-stage strength rating: Weak (rose), Fair (amber), Good (sky), Strong (emerald)
 * - Criteria breakdown with animated checkmarks
 * - Seamless Framer Motion transitions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { evaluatePasswordStrength } from '../../utils/passwordStrength';

const PasswordStrength = ({ password = '', showRequirements = true }) => {
  const strength = evaluatePasswordStrength(password);

  if (!password) {
    return null;
  }

  const stages = [1, 2, 3, 4];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full space-y-2.5 pt-1.5"
    >
      {/* 4-Stage Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400 font-medium">Password Strength</span>
          <span className={`font-semibold tracking-wide ${strength.textColor}`}>
            {strength.label || 'Too Weak'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {stages.map((stage) => {
            const isActive = strength.score >= stage;
            return (
              <div
                key={stage}
                className="h-1.5 rounded-full overflow-hidden bg-dark-800"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`h-full ${isActive ? strength.color : 'bg-transparent'}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Granular Checklist */}
      {showRequirements && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {strength.requirements.map((req) => (
            <div
              key={req.id}
              className="flex items-center gap-1.5 text-[11px] transition-colors duration-200"
            >
              {req.met ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
              )}
              <span className={req.met ? 'text-neutral-300' : 'text-neutral-400'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PasswordStrength;
