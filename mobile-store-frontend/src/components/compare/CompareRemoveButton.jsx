/**
 * Compare Remove Button Component
 * Module: components/compare/CompareRemoveButton.jsx
 * 
 * Interactive discard button for removing a specific smartphone from comparison.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { useCompare } from '../../hooks/useCompare';

const CompareRemoveButton = ({
  mobileId,
  mobileName = 'device',
  variant = 'icon', // 'icon' | 'badge'
  className = '',
}) => {
  const { removeFromCompare } = useCompare();

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCompare(mobileId);
  };

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleRemove}
        aria-label={`Remove ${mobileName} from comparison`}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all duration-200 ${className}`}
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Remove</span>
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleRemove}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Remove ${mobileName} from comparison`}
      title="Remove from comparison"
      className={`p-1.5 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 ${className}`}
    >
      <X className="w-4 h-4" />
    </motion.button>
  );
};

export default CompareRemoveButton;
