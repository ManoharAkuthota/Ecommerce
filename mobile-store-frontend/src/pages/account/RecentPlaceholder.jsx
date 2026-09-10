/**
 * Recently Viewed Placeholder Page
 * Module: pages/account/RecentPlaceholder.jsx
 * Route: /account/recent
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Smartphone, ArrowRight, Layers, Cpu, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const RecentPlaceholder = () => {
  return (
    <>
      <SEO
        title="Recently Viewed — MS Mobiles"
        description="Review smartphones and flagships you recently explored on MS Mobiles."
        canonicalUrl="http://localhost:5173/account/recent"
      />
      <div className="space-y-8">
        {/* Header Intro */}
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Browsing History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recently Viewed
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Quickly return to smartphones, flagships, and spec sheets you recently inspected.
          </p>
        </div>

        {/* Teaser Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-8 sm:p-10 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500/20 to-blue-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto shadow-glow-sm">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white">
              Recently Viewed coming next
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Your device browsing trail and comparative spec memories will automatically appear here across all your sessions.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <Compass className="w-5 h-5 text-indigo-400 mb-2" />
              <span className="text-xs font-bold text-white">Device History</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Track every inspected phone</span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <Layers className="w-5 h-5 text-sky-400 mb-2" />
              <span className="text-xs font-bold text-white">Side-by-Side Compare</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Quick specs comparison</span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <Cpu className="w-5 h-5 text-emerald-400 mb-2" />
              <span className="text-xs font-bold text-white">Benchmark Cache</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Camera and chipset stats</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/mobiles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-dark-800 hover:bg-dark-750 text-white border border-dark-700 transition-all group select-none"
            >
              <span>Browse Flagship Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RecentPlaceholder;
