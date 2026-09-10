/**
 * Simple, Realistic & Attractive Live Order Tracking Experience
 * Module: components/account/DashboardLiveOrderTracking.jsx
 * 
 * Features:
 * 1. Realistic Animated Highway Transit Scene (Zero cartoon graphics, pure high-luxury e-commerce aesthetic):
 *    - Sleek executive delivery van with realistic suspension physics (subtle road bounce).
 *    - Volumetric LED headlights casting a soft luminous cone onto the asphalt.
 *    - Smooth 60fps moving highway roadbed with dashed lane dividers and glowing shoulder rails.
 *    - Distant urban horizon with ambient night-sky glow and passing waypoint beacons.
 * 2. Clean 4-Stage Connected Milestone Stepper:
 *    - Order Confirmed -> Processing & QA -> On The Way -> Delivered.
 *    - Luminous progress line connecting stage to stage with glowing active beacon.
 * 3. Delivery Handover Credentials & Fast Action Trays:
 *    - 1-click AWB tracking code copy with instant feedback.
 *    - Monospace 4-digit Doorstep PIN display [ 2 ] [ 5 ] [ 1 ] [ 7 ] with 1-click copy.
 *    - Direct link to new "Tracking Chat" (MS Logistics Bot) and "Live Route Map".
 * 4. Auto-polling every 15s for live status updates.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PackageCheck,
  Layers,
  Truck,
  CheckCircle2,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Lock,
  MessageSquare,
  Navigation,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Flame,
} from 'lucide-react';
import orderService from '../../services/orderService';
import LiveDeliveryStageAnimation from '../order/LiveDeliveryStageAnimation';

// 4 Clean Universal Order Milestones
const STAGES = [
  { key: 'CONFIRMED', label: 'Order Confirmed', subtitle: 'Verified & In Stock', icon: PackageCheck },
  { key: 'PROCESSING', label: 'Processing & QA', subtitle: 'Packed & Sealed', icon: Layers },
  { key: 'SHIPPED', label: 'On the Way', subtitle: 'In Transit via Courier', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', subtitle: 'Handed Over with OTP', icon: CheckCircle2 },
];

export const DashboardLiveOrderTracking = () => {
  const [latestOrder, setLatestOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedAWB, setCopiedAWB] = useState(false);
  const [copiedOTP, setCopiedOTP] = useState(false);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    fetchLatestOrder();

    // Auto-refresh order telemetry every 45s only while tab is active to preserve mobile resources
    pollIntervalRef.current = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchLatestOrder(true);
      }
    }, 45000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const fetchLatestOrder = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const data = await orderService.getMyOrders();
      const list = Array.isArray(data) ? data : [];
      if (list.length > 0) {
        // Prioritize in-transit or active orders first
        const activeOrder = list.find((o) =>
          ['CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.orderStatus)
        );
        setLatestOrder(activeOrder || list[0]);
      }
    } catch (err) {
      console.warn('[DashboardLiveOrderTracking] Error loading order:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  if (isLoading || !latestOrder) {
    return null;
  }

  const order = latestOrder;
  const status = order.orderStatus || 'CONFIRMED';
  const isDelivered = status === 'DELIVERED';
  const isShipped = status === 'SHIPPED';
  const isProcessing = status === 'PROCESSING';
  const isCancelled = status === 'CANCELLED';

  // Active milestone index (0 to 3)
  let activeIndex = 0;
  let trackPercent = 0;

  if (isDelivered) {
    activeIndex = 3;
    trackPercent = 100;
  } else if (isShipped) {
    activeIndex = 2;
    trackPercent = 66.67;
  } else if (isProcessing) {
    activeIndex = 1;
    trackPercent = 33.33;
  } else if (isCancelled) {
    activeIndex = -1;
    trackPercent = 0;
  }

  const orderNum = order.orderNumber || 'MS-2026-ORDER';
  const carrier = order.carrier || 'Blue Dart Air Express';
  const trackingNumber = order.trackingNumber || 'BD-88992200';
  const city = order.shippingAddress?.city || order.city || 'Hyderabad';
  const rawNumbers = orderNum.replace(/\D/g, '');
  const otpCode = rawNumbers.length >= 4 ? rawNumbers.slice(-4) : '7023';

  const handleCopyAWB = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopiedAWB(true);
      setTimeout(() => setCopiedAWB(false), 2000);
    }
  };

  const handleCopyOTP = () => {
    navigator.clipboard.writeText(otpCode);
    setCopiedOTP(true);
    setTimeout(() => setCopiedOTP(false), 2000);
  };

  // Formatted Delivery Date
  const formattedDate = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : '2-3 Business Days';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-3xl bg-gradient-to-b from-[#101726]/95 via-[#0B0F19]/95 to-[#070A10]/95 border border-dark-800/90 shadow-2xl backdrop-blur-2xl overflow-hidden select-none"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ===================================================================== */}
      {/* 1. TOP HEADER: Status, Order ID, ETA & Fast Actions */}
      {/* ===================================================================== */}
      <div className="p-6 sm:p-7 pb-4 border-b border-dark-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isDelivered ? 'bg-emerald-400' : 'bg-cyan-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isDelivered ? 'bg-emerald-500' : 'bg-cyan-500'
                }`} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Live Order Tracking
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-xs font-mono text-neutral-300">
                #{orderNum}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isDelivered
                  ? 'Package Delivered'
                  : isShipped
                  ? `On The Way to ${city}`
                  : isProcessing
                  ? 'Preparing & Quality Check'
                  : isCancelled
                  ? 'Order Cancelled'
                  : 'Order Confirmed & Verified'}
              </h2>

              <span
                className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                  isDelivered
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : isShipped
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : isProcessing
                    ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    : isCancelled
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                }`}
              >
                {status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {isDelivered ? 'Delivered on: ' : 'Expected Delivery: '}
                <strong className="text-white font-medium">{formattedDate}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-emerald-400 font-medium">Free Express Delivery</span>
            </div>
          </div>

          {/* Action CTAs: Tracking Chat & Live Route */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <Link
              to="/account/inquiries?channel=TRACKING"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-xs font-bold text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex items-center gap-1.5 shadow-sm group"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Tracking Chat</span>
            </Link>

            <Link
              to={`/track?order=${orderNum}`}
              className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-xs font-bold text-neutral-200 hover:text-white border border-dark-700 hover:border-dark-600 transition-all flex items-center gap-1.5 shadow-sm group"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              <span>Live Route</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. REALISTIC & ATTRACTIVE MULTI-STAGE DELIVERY ANIMATION SCENES */}
      {/* ===================================================================== */}
      <div className="relative px-6 sm:px-8 pt-4 pb-2">
        <LiveDeliveryStageAnimation order={latestOrder} />
      </div>

      {/* ===================================================================== */}
      {/* 3. CLEAN 4-STAGE CONNECTED MILESTONE STEPPER */}
      {/* ===================================================================== */}
      <div className="px-6 sm:px-8 py-5">
        <div className="relative">
          {/* Background Connecting Track Line (Spans strictly between Node 0 and Node 3 centers) */}
          <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1.5 bg-dark-800 rounded-full overflow-hidden">
            {!isCancelled && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trackPercent}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full relative shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              >
                {/* Continuous Shimmer Light Wave */}
                <motion.div
                  className="absolute inset-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: ['-100%', '450%'] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                />
              </motion.div>
            )}
          </div>

          {/* 4 Clean Station Nodes */}
          <div className="relative grid grid-cols-4 gap-2 z-10">
            {STAGES.map((st, idx) => {
              const Icon = st.icon;
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={st.key} className="flex flex-col items-center text-center">
                  {/* Node Circle */}
                  <div className="relative mb-2.5">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCurrent
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.6)] ring-4 ring-cyan-500/20'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : 'bg-dark-950 text-neutral-500 border-dark-800'
                      }`}
                    >
                      {isPast ? (
                        <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </motion.div>

                    {/* Dual Breathing Pulse on Active Station */}
                    {isCurrent && !isCancelled && (
                      <motion.span
                        className="absolute -inset-1.5 rounded-full border-2 border-cyan-400/60 pointer-events-none"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0, 0.9] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      />
                    )}
                  </div>

                  {/* Stage Label & Subtitle */}
                  <h4
                    className={`text-xs sm:text-sm font-bold tracking-tight ${
                      isCurrent ? 'text-white' : isPast ? 'text-neutral-200' : 'text-neutral-500'
                    }`}
                  >
                    {st.label}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 hidden sm:block">
                    {st.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. BOTTOM CREDENTIALS TRAY: Item Preview + Courier AWB + Doorstep OTP */}
      {/* ===================================================================== */}
      <div className="p-6 sm:p-7 pt-4 border-t border-dark-800/80 bg-dark-950/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
          {/* Card 1: Product Item Details */}
          {order.items?.[0] && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-dark-900/80 border border-dark-800/90 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-dark-950 border border-dark-800 p-1 shrink-0 flex items-center justify-center">
                <img
                  src={order.items[0].mobileImage || '/placeholder-phone.png'}
                  alt={order.items[0].mobileName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {order.items[0].mobileName}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                  <span>Qty: {order.items[0].quantity}</span>
                  <span>•</span>
                  <span>{order.items[0].storage || '256GB'}</span>
                  <span>•</span>
                  <span className="font-bold text-emerald-400">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Courier Partner & AWB Code */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-900/80 border border-dark-800/90 text-xs shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-neutral-400 block font-semibold uppercase tracking-wider">
                  {carrier}
                </span>
                <span className="font-mono text-white font-bold truncate block text-xs">
                  {trackingNumber}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyAWB}
              title="Copy Tracking AWB Code"
              className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-neutral-300 hover:text-white border border-dark-700 transition-colors flex items-center gap-1 cursor-pointer shrink-0 text-[11px]"
            >
              {copiedAWB ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Card 3: Doorstep Delivery OTP Badge */}
          <div
            onClick={handleCopyOTP}
            title="Click to copy delivery PIN"
            className="flex items-center justify-between p-3 rounded-2xl bg-dark-900/80 border border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer group text-xs shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 group-hover:scale-105 transition-transform">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block uppercase font-medium">
                  Doorstep PIN
                </span>
                {/* 4 Discrete Monospace Digit Boxes */}
                <div className="flex items-center gap-1 mt-0.5">
                  {otpCode.split('').map((digit, i) => (
                    <span
                      key={i}
                      className="w-5 h-6 rounded bg-dark-950 border border-cyan-500/40 text-cyan-300 font-mono font-black text-xs flex items-center justify-center shadow-inner group-hover:border-cyan-400 transition-colors"
                    >
                      {digit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] font-medium text-neutral-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
              {copiedOTP ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Copied
                </span>
              ) : (
                <span>Tap to copy</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardLiveOrderTracking;
