/**
 * Multi-Stage Order Placement & Celebration Animation Overlay
 * Module: components/order/OrderPlacementAnimation.jsx
 * 
 * Spectacular full-screen celebration sequence:
 * - Stage 1: Stock reservation & factory box packaging
 * - Stage 2: Courier waybill assignment & GST tax invoice generation
 * - Stage 3: Order confirmed celebration with confetti, COD cash alert & handover OTP
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Sparkles,
  Banknote,
  Lock,
  ArrowRight,
  ShieldCheck,
  FileText,
  Barcode,
} from 'lucide-react';

const CONFETTI_PIECES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (i % 10) * 10 - 45 + (Math.random() * 10 - 5),
  y: -20 - Math.random() * 40,
  destY: 150 + Math.random() * 100,
  destX: (i % 10) * 20 - 90 + (Math.random() * 30 - 15),
  rotation: Math.random() * 720 - 360,
  scale: 0.6 + Math.random() * 0.7,
  color: [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#10b981',
    '#f59e0b',
    '#06b6d4',
    '#3b82f6',
  ][i % 7],
}));

const OrderPlacementAnimation = ({
  isOpen,
  stage = 1,
  order = null,
  paymentMethod = 'COD',
  totalAmount = 0,
  onComplete,
}) => {
  const [internalStage, setInternalStage] = useState(stage);

  useEffect(() => {
    setInternalStage(stage);
  }, [stage]);

  if (!isOpen) return null;

  const orderNum = order?.orderNumber || 'MS-2026-PRO';
  const isCod = paymentMethod === 'COD' || order?.paymentMethod === 'COD';
  const finalAmount = order?.totalAmount || totalAmount || 0;
  const rawNumbers = (orderNum || '9855').replace(/\D/g, '');
  const otpCode = rawNumbers.length >= 4 ? rawNumbers.slice(-4) : '4821';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-3xl bg-dark-900/95 border border-dark-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center"
      >
        {/* Confetti Particles (Fires on Stage 3) */}
        {internalStage === 3 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CONFETTI_PIECES.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: p.destX * 3,
                  y: p.destY * 3,
                  opacity: [1, 1, 0],
                  scale: p.scale,
                  rotate: p.rotation,
                }}
                transition={{
                  duration: 2.2,
                  ease: 'easeOut',
                  delay: Math.random() * 0.15,
                }}
                style={{
                  backgroundColor: p.color,
                  width: `${8 + (p.id % 4) * 3}px`,
                  height: `${12 + (p.id % 3) * 4}px`,
                  borderRadius: p.id % 2 === 0 ? '3px' : '50%',
                }}
                className="absolute top-1/3 left-1/2"
              />
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STAGE 1: Stock Reservation & Packaging */}
        {/* ------------------------------------------------------------- */}
        {internalStage === 1 && (
          <motion.div
            key="stage-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 py-4"
          >
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Spinning Pulsing Halo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-3xl border-2 border-dashed border-accent-500/50"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-600 text-white flex items-center justify-center shadow-glow-md shadow-accent-500/40"
              >
                <Package className="w-10 h-10" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-accent-500/10 text-accent-300 border border-accent-500/20">
                STEP 1 OF 3 • FACTORY PACKAGING
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Reserving Flagship Inventory
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Allocating sealed device from MS Mobiles Central Showroom Hub with official IMEI registration.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-spin" />
              <span>Checking tamper-proof holographic seals...</span>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STAGE 2: Logistics Manifest & Waybill */}
        {/* ------------------------------------------------------------- */}
        {internalStage === 2 && (
          <motion.div
            key="stage-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 py-4"
          >
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-glow-md shadow-cyan-500/40"
              >
                <Truck className="w-10 h-10" />
              </motion.div>

              {/* Laser Scanning Line */}
              <motion.div
                animate={{ y: [-35, 35, -35] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-2 right-2 h-0.5 bg-cyan-400 shadow-glow-sm pointer-events-none"
              />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                STEP 2 OF 3 • COURIER MANIFEST
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Generating Courier AWB Waybill
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Handing electronic manifest to <strong className="text-white">Blue Dart Express</strong> and generating official 18% GST invoice.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-dark-950 border border-dark-800 font-mono text-xs text-neutral-300 max-w-xs mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-cyan-400" />
                <span>WAYBILL: BD-98421048</span>
              </div>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STAGE 3: Confirmed & Celebration */}
        {/* ------------------------------------------------------------- */}
        {internalStage === 3 && (
          <motion.div
            key="stage-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 180 }}
            className="space-y-6"
          >
            {/* 3D Success Checkmark Pop */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 220, delay: 0.1 }}
              className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-md shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm">
                ORDER CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isCod ? 'Cash on Delivery Reserved!' : 'Order Placed Successfully!'}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-dark-950 border border-dark-800 text-xs text-neutral-300">
                <span>Order Reference:</span>
                <strong className="text-accent-400 font-mono tracking-wider text-sm">
                  {orderNum}
                </strong>
              </div>
            </div>

            {/* Cash on Delivery Interactive Callout */}
            {isCod ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-dark-950 to-dark-950 border border-amber-500/30 text-left space-y-3 shadow-inner"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                    <Banknote className="w-4 h-4" />
                    <span>Cash Amount to Pay on Delivery</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ZERO PREPAYMENT
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-neutral-400">Total Payable at Doorstep:</span>
                  <span className="text-2xl font-black font-mono text-white">
                    ₹{finalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed border-t border-dark-800 pt-2">
                  You can pay with <strong className="text-neutral-200">Cash notes</strong> or scan the courier executive's <strong className="text-neutral-200">UPI QR code</strong> when your package arrives.
                </p>
              </motion.div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-300 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Payment captured securely. Electronic GST Tax Invoice sent to your email.</span>
              </div>
            )}

            {/* Doorstep Verification PIN */}
            <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Doorstep Verification PIN
                </span>
                <span className="text-xs text-neutral-300">Share with courier at delivery</span>
              </div>
              <div className="px-4 py-1.5 rounded-xl bg-dark-900 border border-accent-500/40 text-accent-300 font-mono text-xl font-black tracking-widest shadow-glow-sm">
                {otpCode}
              </div>
            </div>

            {/* Action CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="w-full py-3.5 px-6 rounded-2xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow-md transition-all duration-200"
            >
              <span>View Live Tracking & Official Tax Invoice</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderPlacementAnimation;
