/**
 * PageLoadingFallback Component
 * Module: components/common/PageLoadingFallback.jsx
 * 
 * Luxury fallback screen rendered during React.lazy route chunk loading.
 * Ensures zero layout flash and smooth transitions across public & admin views.
 */

import React from 'react';
import { Smartphone, Loader2 } from 'lucide-react';

export const PageLoadingFallback = () => {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 select-none"
    >
      <div className="relative flex flex-col items-center gap-5">
        {/* Outer Glow Pulse */}
        <div className="absolute w-24 h-24 bg-accent-500/20 rounded-full blur-2xl animate-pulse" />

        {/* Brand Icon Badge */}
        <div className="relative w-16 h-16 rounded-2xl bg-dark-900 border border-dark-750 flex items-center justify-center shadow-glow-sm">
          <Smartphone className="w-8 h-8 text-accent-400 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent-600 flex items-center justify-center text-white shadow-sm">
            <Loader2 className="w-3 h-3 animate-spin" />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center space-y-1">
          <span className="text-sm font-black text-white uppercase tracking-wider font-mono">
            MS <span className="text-accent-400">Mobiles</span>
          </span>
          <p className="text-xs text-neutral-400 font-sans tracking-wide">
            Loading experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoadingFallback;
