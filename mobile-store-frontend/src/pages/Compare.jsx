/**
 * Compare Mobiles Page
 * Module: pages/Compare.jsx
 * Route: /compare (Protected by UserProtectedRoute)
 * 
 * Luxury flagship smartphone comparison experience:
 * - Apple / Samsung inspired design with glassmorphic cards
 * - Real-time MySQL synchronization
 * - Side-by-side desktop specification matrix & horizontal mobile drawer
 * - Comparison counter (e.g. 2/4)
 * - Clear All confirmation modal & live optimistic updates
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCompare } from '../hooks/useCompare';
import SEO from '../components/common/SEO';
import Container from '../components/ui/Container';
import CompareToolbar from '../components/compare/CompareToolbar';
import CompareTable from '../components/compare/CompareTable';
import CompareMobileDrawer from '../components/compare/CompareMobileDrawer';
import CompareEmptyState from '../components/compare/CompareEmptyState';

const Compare = () => {
  const { items, count, maxLimit, isLoading, clearCompare } = useCompare();

  return (
    <>
      <SEO
        title="Compare Smartphones — MS Mobiles"
        description="Compare flagship smartphones side by side. Analyze processor benchmarks, display specs, battery capacity, camera features, and verified pricing."
        canonicalUrl="http://localhost:5173/compare"
      />

      <div className="min-h-screen py-8 sm:py-12">
        <Container size="7xl">
          <div className="space-y-6 sm:space-y-8">
            {/* 1. Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hardware Analysis</span>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Compare Mobiles
                  </h1>
                  {count > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-600 text-white text-xs font-black font-mono shadow-sm">
                      {count}/{maxLimit}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                  Compare your favorite smartphones side by side. Inspect processing units, RAM, display refresh rates, battery performance, and verified pricing.
                </p>
              </div>
            </div>

            {/* 2. Loading State */}
            {isLoading && items.length === 0 ? (
              <div className="p-12 rounded-3xl bg-dark-900/40 border border-dark-800 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-neutral-400 font-mono">
                  Loading your comparison list...
                </p>
              </div>
            ) : items.length === 0 ? (
              /* 3. Empty State */
              <CompareEmptyState />
            ) : (
              /* 4. Comparison View */
              <div className="space-y-6">
                {/* Management Toolbar */}
                <CompareToolbar
                  count={count}
                  maxLimit={maxLimit}
                  onClearAll={clearCompare}
                />

                {/* Desktop Spec Table */}
                <div className="hidden md:block">
                  <CompareTable items={items} />
                </div>

                {/* Mobile Touch Drawer */}
                <div className="block md:hidden">
                  <CompareMobileDrawer items={items} />
                </div>

                {/* Bottom Trust Assurance */}
                <div className="p-4 rounded-2xl bg-dark-900/40 border border-dark-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <ShieldCheck className="w-4 h-4 text-accent-400 shrink-0" />
                    <span>Official Manufacturer Specifications & Real-Time Stock Status</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Syncs automatically across devices
                  </span>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Compare;
