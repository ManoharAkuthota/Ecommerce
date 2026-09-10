/**
 * Compare Toolbar Component
 * Module: components/compare/CompareToolbar.jsx
 * 
 * Top management action bar for /compare page:
 * - Real-time comparison count display (e.g., 2/4 Mobiles Selected)
 * - "Continue Browsing" navigation trigger to /mobiles
 * - "Clear All" modal confirmation trigger
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, ArrowLeftRight, Sparkles } from 'lucide-react';
import ClearConfirmModal from './ClearConfirmModal';

const CompareToolbar = ({
  count = 0,
  maxLimit = 4,
  onClearAll,
}) => {
  const [showClearModal, setShowClearModal] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-xl">
        {/* Left: Live Count Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-bold font-mono">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>
              {count} / {maxLimit} Selected
            </span>
          </div>

          <span className="text-xs text-neutral-400 hidden sm:inline">
            {count === maxLimit
              ? 'Comparison limit reached (4 of 4)'
              : `Can add ${maxLimit - count} more ${maxLimit - count === 1 ? 'mobile' : 'mobiles'}`}
          </span>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add more flagships */}
          {count < maxLimit && (
            <Link
              to="/mobiles"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-dark-750 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-accent-400" />
              <span>Add More</span>
            </Link>
          )}

          {/* Continue Browsing */}
          <Link
            to="/mobiles"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-dark-750 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </Link>

          {/* Clear Comparison */}
          {count > 0 && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ClearConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={onClearAll}
        count={count}
      />
    </>
  );
};

export default CompareToolbar;
