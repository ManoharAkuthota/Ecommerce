/**
 * Luxury Authentication Illustration Panel
 * Module: components/auth/AuthIllustration.jsx
 * 
 * Desktop decorative showcase inspired by Apple, Stripe, and Linear.
 * Features:
 * - Ambient gradient orbs with subtle Framer Motion drift
 * - Glassmorphic flagship smartphone preview card with hardware specs
 * - Authentic trust metrics, verification badges, and customer testimonials
 * - Fully responsive (hidden on mobile/tablet, displayed on lg+ viewports)
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  ShieldCheck,
  Zap,
  Sparkles,
  Star,
  CheckCircle2,
  Truck,
  Cpu,
  Layers,
} from 'lucide-react';

const AuthIllustration = () => {
  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col justify-between p-10 xl:p-14 overflow-hidden select-none bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 border-r border-dark-800/80">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Header / Branding */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-dark-850/80 border border-dark-750/80 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          <span className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            MS Mobiles
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>
      </div>

      {/* Center Interactive Showcase */}
      <div className="relative z-10 my-auto py-8">
        {/* Main Glassmorphic Hardware Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="relative max-w-sm mx-auto p-6 rounded-3xl bg-dark-900/60 border border-dark-700/80 backdrop-blur-xl shadow-card"
        >
          {/* Card Top bar */}
          <div className="flex items-center justify-between pb-4 border-b border-dark-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  Flagship Experience
                </h4>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Sealed • Official Warranty
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified
            </span>
          </div>

          {/* Card Spec Highlights */}
          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800/80">
              <div className="flex items-center gap-1.5 text-accent-400 mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Processor
                </span>
              </div>
              <p className="text-xs font-bold text-neutral-200">
                Snapdragon 8 Elite
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800/80">
              <div className="flex items-center gap-1.5 text-sky-400 mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Display
                </span>
              </div>
              <p className="text-xs font-bold text-neutral-200">
                120Hz LTPO OLED
              </p>
            </div>
          </div>

          {/* Floating Feature Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>100% Authentic Indian retail packaging</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Full manufacturer brand warranty</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Trust Pills */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
          className="absolute -bottom-4 left-4 p-3 rounded-2xl bg-dark-850/90 border border-dark-750/90 backdrop-blur-xl shadow-lg flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Express Delivery</p>
            <p className="text-[10px] text-neutral-400">Pan-India dispatch</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
          className="absolute -top-4 right-4 p-3 rounded-2xl bg-dark-850/90 border border-dark-750/90 backdrop-blur-xl shadow-lg flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Zero Fraud</p>
            <p className="text-[10px] text-neutral-400">Tamper-proof sealed</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Customer Trust Section */}
      <div className="relative z-10 pt-4 border-t border-dark-800/80">
        <div className="flex items-center gap-1 text-amber-400 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
          <span className="text-xs font-bold text-white ml-1.5">4.9 / 5.0</span>
          <span className="text-xs text-neutral-400 ml-1">Rating</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed max-w-md">
          &ldquo;The definitive shopping destination for flagship smartphones.
          Authentic units, pristine packaging, and exceptional concierge care.&rdquo;
        </p>
        <p className="text-[11px] text-neutral-400 font-mono mt-1">
          Joined by 50,000+ smartphone enthusiasts
        </p>
      </div>
    </div>
  );
};

export default AuthIllustration;
