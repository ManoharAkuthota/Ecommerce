/**
 * Admin Empty State Component
 * Module: components/admin/EmptyState.jsx
 * 
 * Displays a luxury placeholder when no products match current filters or when
 * the inventory catalog is empty.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Plus, RotateCcw } from 'lucide-react';
import { Button, Card } from '../ui';

export const EmptyState = ({
  title = 'No Smartphones Found',
  description = 'No products matched your current search or filter criteria.',
  isFiltered = false,
  onResetFilters,
  onAddMobile,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full py-16 px-4 text-center ${className}`}
    >
      <Card
        glass={true}
        className="max-w-md mx-auto p-8 sm:p-10 border-dashed border-dark-800 bg-dark-900/40 relative overflow-hidden"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          {/* Glowing Icon Badge */}
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-dark-800 to-dark-750 border border-dark-700/80 text-accent-400 flex items-center justify-center shadow-card">
            <Smartphone className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xs mx-auto">
              {description}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {isFiltered && onResetFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                iconLeft={<RotateCcw className="w-3.5 h-3.5 text-accent-400" />}
                className="text-xs border-dark-700 hover:border-dark-600"
              >
                Reset Filters
              </Button>
            )}

            {onAddMobile && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAddMobile}
                iconLeft={<Plus className="w-4 h-4" />}
                className="text-xs shadow-glow-sm"
              >
                Add Smartphone
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EmptyState;
