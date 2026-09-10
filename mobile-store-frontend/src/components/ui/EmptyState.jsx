import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../../utils/animations';
import { PackageOpen } from 'lucide-react';

/**
 * Reusable EmptyState component for empty catalogs, search results, orders, or carts.
 */
const EmptyState = ({
  icon = <PackageOpen className="w-10 h-10 text-accent-400" />,
  title = 'No Items Found',
  description = 'There are no records available to display right now.',
  action = null,
  className = '',
}) => {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className={`p-10 sm:p-16 rounded-3xl border border-dashed border-dark-800 bg-dark-900/30 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-accent-500/20 rounded-2xl blur-xl" />
        <div className="relative p-4 rounded-2xl bg-dark-850 border border-dark-700/80 text-accent-400 shadow-card">
          {icon}
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-sm leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
