import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ThumbsUp,
  Box,
  Layers,
} from 'lucide-react';

/**
 * LiveDeliveryStageAnimation
 * 
 * Professional, high-end animated logistics visualizer:
 * 1. CONFIRMED: High-tech packaging bay with automated box lid, phone outline, and holographic QA seal.
 * 2. PROCESSING: Warehouse loading dock with motorized roller conveyor shifting parcel into the MS Mobiles van.
 * 3. SHIPPED: The signature realistic highway expressway transit scene with moving road dashes, city skyline, and volumetric headlights.
 * 4. DELIVERED: Continuous cinematic delivery handover:
 *    - Friendly delivery executive at doorstep holding package, giving cheerful Thumbs-Up (👍) with speech bubble:
 *      "Package Delivered! Verified with OTP. Thank you for choosing MS Mobiles!"
 *    - Executive walks to the van, enters cabin, driver door closes.
 *    - Van accelerates with bright headlights and exhaust puffs, driving off and smoothly cycling.
 *    - Seamless, continuous, high-fidelity experience (NO replay buttons, NO popup overlays, NEVER empty).
 */
export default function LiveDeliveryStageAnimation({ order = {}, className = '' }) {
  const rawStatus = (order?.orderStatus || 'CONFIRMED').toUpperCase();

  // Map order status to stage index (0 to 3)
  const getStageFromStatus = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 3;
      case 'SHIPPED':
        return 2;
      case 'PROCESSING':
        return 1;
      case 'CONFIRMED':
      default:
        return 0;
    }
  };

  const [activeStage, setActiveStage] = useState(() => getStageFromStatus(rawStatus));

  // Sync if order status changes
  useEffect(() => {
    setActiveStage(getStageFromStatus(rawStatus));
  }, [rawStatus]);

  // Stage 4 Continuous Seamless Cycle:
  // 0s-5s: 'celebrate' (thumbs-up & speech bubble)
  // 5s-7.5s: 'walk' (agent walks to driver door)
  // 7.5s-11s: 'drive_away' (van accelerates to the right)
  // 11s-13s: 'reset_in' (van smoothly arrives and parks, agent steps out)
  const [deliveredPhase, setDeliveredPhase] = useState('celebrate');

  useEffect(() => {
    if (activeStage !== 3) return;

    let isMounted = true;
    let timer1, timer2, timer3, timer4;

    const runDeliveredCycle = () => {
      if (!isMounted) return;
      setDeliveredPhase('celebrate');

      timer1 = setTimeout(() => {
        if (!isMounted) return;
        setDeliveredPhase('walk');
      }, 5000);

      timer2 = setTimeout(() => {
        if (!isMounted) return;
        setDeliveredPhase('drive_away');
      }, 7500);

      timer3 = setTimeout(() => {
        if (!isMounted) return;
        setDeliveredPhase('reset_in');
      }, 11000);

      timer4 = setTimeout(() => {
        if (!isMounted) return;
        runDeliveredCycle();
      }, 13000);
    };

    runDeliveredCycle();

    return () => {
      isMounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [activeStage]);

  const destinationCity = order?.shippingAddress?.city || order?.city || 'Hyderabad';
  const orderId = order?.orderNumber || 'MS-2026-ORDER';

  const stages = [
    { id: 0, key: 'CONFIRMED', label: '1. Packaging Bay', icon: Box },
    { id: 1, key: 'PROCESSING', label: '2. Loading to Van', icon: Layers },
    { id: 2, key: 'SHIPPED', label: '3. Highway Transit', icon: Truck },
    { id: 3, key: 'DELIVERED', label: '4. Handover & Delivery', icon: ThumbsUp },
  ];

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0B1120] via-[#070B14] to-[#04060A] border border-dark-800/90 shadow-2xl ${className}`}>
      
      {/* Top Header: Clean Waypoint Telemetry & Subtle Interactive Stage Pills */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-dark-800/80 flex flex-wrap items-center justify-between gap-2.5 bg-[#060A14]/80 backdrop-blur-md select-none">
        
        {/* Interactive Stage Preview Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {stages.map((st) => {
            const Icon = st.icon;
            const isSelected = activeStage === st.id;
            const isActualStatus = getStageFromStatus(rawStatus) === st.id;

            return (
              <button
                key={st.id}
                onClick={() => setActiveStage(st.id)}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                    : 'bg-dark-900/60 hover:bg-dark-850 text-neutral-400 hover:text-neutral-200 border border-dark-750/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`} />
                <span>{st.label}</span>
                {isActualStatus && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Order Status" />
                )}
              </button>
            );
          })}
        </div>

        {/* Live Telemetry Pill */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-dark-900/90 border border-dark-750 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>
              {activeStage === 0 && 'Packaging Bay • Device Boxing & Holographic QA'}
              {activeStage === 1 && 'Dock Conveyor • Shifting Cargo into Van'}
              {activeStage === 2 && `Highway Express • 58 km/h to ${destinationCity}`}
              {activeStage === 3 && 'Doorstep Handover • Verified with OTP 👍'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Animation Container (Always Visible, Exactly 180px-210px high) */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden flex flex-col justify-end select-none">
        
        {/* Soft Ambient Horizon Light */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-blue-950/20 to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* ========================================================================= */}
          {/* SCENE 1: CONFIRMED - HIGH-TECH PACKAGING BAY */}
          {/* ========================================================================= */}
          {activeStage === 0 && (
            <motion.div
              key="stage-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center px-4"
            >
              {/* Cleanroom Neon Grid */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px]" />
              
              {/* Overhead Soft Spotlight */}
              <div className="absolute top-0 w-80 h-32 bg-gradient-to-b from-cyan-400/15 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

              {/* Packaging Pedestal & Device Box */}
              <div className="relative w-full max-w-lg h-full flex flex-col items-center justify-center">
                
                {/* Robotic Stamping Seal Plunger */}
                <motion.div
                  className="absolute top-2 z-20 flex flex-col items-center pointer-events-none"
                  animate={{ y: [0, 42, 42, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2, times: [0, 0.35, 0.65, 1], ease: 'easeInOut' }}
                >
                  <div className="w-3 h-10 bg-dark-600 border border-dark-500 rounded-sm" />
                  <div className="w-14 h-3.5 bg-gradient-to-r from-dark-800 via-cyan-500 to-dark-800 rounded border border-cyan-400/60 shadow-[0_0_10px_rgba(56,189,248,0.5)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-ping" />
                  </div>
                  <div className="w-8 h-2 bg-cyan-400 rounded-b shadow-[0_0_10px_#38BDF8]" />
                </motion.div>

                {/* Packaging Pedestal Surface */}
                <div className="relative w-72 sm:w-88 h-32 flex items-center justify-center mt-8">
                  <div className="absolute bottom-2 inset-x-0 h-5 bg-gradient-to-b from-dark-750 via-dark-800 to-dark-900 rounded-xl border border-dark-700 shadow-xl flex items-center justify-between px-4 text-[9px] font-mono text-neutral-400">
                    <span>BAY-04 QA AUTOMATION</span>
                    <span>100% GENUINE CHECK</span>
                  </div>

                  {/* Smartphone Packaging Box */}
                  <motion.div
                    className="relative w-56 h-24 rounded-2xl bg-gradient-to-br from-slate-900 via-[#131B2E] to-slate-950 border border-cyan-500/40 shadow-2xl flex flex-col justify-between p-2.5 overflow-hidden"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  >
                    {/* Metallic Light Sweep */}
                    <motion.div
                      className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
                      animate={{ x: ['-100%', '300%'] }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                    />

                    {/* Brand Header */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md">
                          <Package className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-[10px] font-black tracking-wider text-white">MS MOBILES</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[8px] font-mono border border-blue-500/30">
                        ORIGINAL SEAL
                      </span>
                    </div>

                    {/* Smartphone Tray Outline */}
                    <div className="relative mx-auto w-40 h-9 rounded-lg bg-dark-900/90 border border-dark-700/80 flex items-center justify-between px-2.5 z-10 shadow-inner">
                      <div className="w-3.5 h-5.5 rounded bg-dark-950 border border-cyan-500/40 flex flex-col items-center justify-around py-0.5">
                        <div className="w-1 h-1 rounded-full bg-cyan-400" />
                      </div>
                      <span className="text-[9px] font-bold text-neutral-200">Device Sealed & Foam Packed</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>

                    {/* Barcode & QA Seal Footer */}
                    <div className="relative z-10 flex items-center justify-between border-t border-dark-800 pt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 h-3 bg-white/95 px-1 rounded-sm">
                          <span className="w-0.5 h-2.5 bg-black" />
                          <span className="w-1 h-2.5 bg-black" />
                          <span className="w-0.5 h-2.5 bg-black" />
                          <span className="w-1.5 h-2.5 bg-black" />
                          <span className="w-0.5 h-2.5 bg-black" />
                        </div>
                        <span className="text-[8px] font-mono text-neutral-400">{orderId}</span>
                      </div>

                      <div className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[8px] font-bold text-emerald-300 flex items-center gap-0.5">
                        <Sparkles className="w-2 h-2 text-emerald-400" />
                        <span>QA PASSED</span>
                      </div>
                    </div>

                    {/* Laser Scanner Line */}
                    <motion.div
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#EF4444] pointer-events-none z-20"
                      animate={{ top: ['15%', '85%', '15%'] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 2: PROCESSING - DOCK CONVEYOR LOADING INTO VAN */}
          {/* ========================================================================= */}
          {activeStage === 1 && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col justify-end"
            >
              {/* Dock Bay Sign */}
              <div className="absolute top-2 left-6 pointer-events-none flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400/80 font-bold tracking-widest">LOADING BAY #02</span>
                <span className="text-neutral-600">•</span>
                <span className="text-[10px] font-mono text-emerald-400">Transfer Conveyor Active</span>
              </div>

              {/* Warehouse Floor with Conveyor on Left & Van on Right */}
              <div className="relative w-full h-36 bg-gradient-to-b from-[#111827] via-[#0D121F] to-[#080C14] border-t border-cyan-500/20 overflow-hidden flex items-center justify-between px-4 sm:px-10">
                
                {/* Left: Industrial Roller Conveyor */}
                <div className="relative w-1/2 sm:w-7/12 h-20 flex flex-col justify-center">
                  <div className="relative w-full h-7 bg-gradient-to-b from-dark-700 via-dark-800 to-dark-900 rounded-lg border border-dark-600 shadow-lg flex items-center overflow-hidden px-2">
                    <div className="flex gap-3 w-full">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2.5 h-5 rounded-full bg-gradient-to-b from-neutral-400 to-neutral-700 shrink-0 flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Parcel sliding along conveyor into the van */}
                  <motion.div
                    className="absolute top-1 z-20"
                    animate={{
                      x: ['5%', '90%'],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.8,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="w-18 h-11 rounded-lg bg-gradient-to-br from-amber-800 via-amber-900 to-yellow-950 border border-amber-500/60 shadow-xl flex flex-col justify-between p-1.5 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[7px] font-black text-white">MS MOBILES</span>
                        <ShieldCheck className="w-2 h-2 text-emerald-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-3 h-1.5 bg-white/90 rounded-[1px]" />
                        <span className="text-[6px] font-mono text-amber-200">PRIORITY</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right: MS Mobiles Van Backed into Loading Dock */}
                <div className="relative w-1/2 sm:w-5/12 h-28 flex items-center justify-end">
                  <svg width="200" height="100" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                    <defs>
                      <linearGradient id="dockChassis" x1="0" y1="0" x2="220" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="50%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>
                    </defs>

                    <ellipse cx="120" cy="102" rx="90" ry="6" fill="#000000" opacity="0.8" />

                    <path
                      d="M20 20 C20 12 26 8 34 8 L170 8 C178 8 184 12 184 20 L190 92 C190 96 186 100 180 100 L160 100 C160 90 150 84 140 84 C130 84 120 90 120 100 L70 100 C70 90 60 84 50 84 C40 84 30 90 30 100 L14 100 C10 100 6 96 6 92 Z"
                      fill="url(#dockChassis)"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />

                    <path d="M7 64 L189 64 L189 72 L7 72 Z" fill="#2563EB" opacity="0.9" />

                    <rect x="36" y="16" width="58" height="26" rx="4" fill="#0284C7" opacity="0.3" stroke="#38BDF8" strokeWidth="0.8" />
                    <rect x="100" y="16" width="58" height="26" rx="4" fill="#0284C7" opacity="0.3" stroke="#38BDF8" strokeWidth="0.8" />

                    {/* Illuminated Cargo Bay Opening */}
                    <rect x="32" y="44" width="130" height="42" rx="4" fill="#080D18" stroke="#38BDF8" strokeWidth="1" />
                    
                    <g transform="translate(40, 50)">
                      <rect x="2" y="8" width="22" height="18" rx="2" fill="#D97706" opacity="0.9" />
                      <rect x="28" y="4" width="26" height="22" rx="2" fill="#B45309" />
                      <rect x="58" y="10" width="20" height="16" rx="2" fill="#F59E0B" opacity="0.8" />
                      <rect x="82" y="6" width="24" height="20" rx="2" fill="#0284C7" opacity="0.8" />
                    </g>

                    <rect x="18" y="48" width="4" height="16" rx="1.5" fill="#EF4444" />
                    <rect x="172" y="48" width="4" height="16" rx="1.5" fill="#EF4444" />

                    <circle cx="140" cy="98" r="9" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                    <circle cx="140" cy="98" r="4.5" fill="#64748B" />
                    <circle cx="50" cy="98" r="9" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                    <circle cx="50" cy="98" r="4.5" fill="#64748B" />

                    <text x="97" y="32" fill="#FFFFFF" fontSize="7" fontWeight="900" textAnchor="middle" letterSpacing="0.8">
                      MS MOBILES
                    </text>
                  </svg>

                  <div className="absolute top-1 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[8px] font-mono text-emerald-300 flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    <span>CARGO LOADED</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 3: SHIPPED - THE SIGNATURE REALISTIC HIGHWAY SCENE */}
          {/* ========================================================================= */}
          {activeStage === 2 && (
            <motion.div
              key="stage-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col justify-end"
            >
              {/* City Skyline Silhouette */}
              <div className="absolute inset-x-0 bottom-14 h-16 opacity-20 pointer-events-none flex items-end justify-between px-4">
                <div className="w-8 h-10 bg-blue-400/30 rounded-t-sm" />
                <div className="w-12 h-14 bg-indigo-400/30 rounded-t-sm" />
                <div className="w-6 h-8 bg-cyan-400/30 rounded-t-sm" />
                <div className="w-14 h-12 bg-blue-500/30 rounded-t-sm" />
                <div className="w-10 h-16 bg-sky-400/30 rounded-t-sm" />
                <div className="w-8 h-9 bg-indigo-500/30 rounded-t-sm" />
                <div className="w-16 h-11 bg-blue-400/30 rounded-t-sm" />
                <div className="w-12 h-15 bg-cyan-500/30 rounded-t-sm" />
              </div>

              {/* Moving Highway Roadbed */}
              <div className="relative w-full h-16 bg-gradient-to-b from-[#111622] via-[#0E131C] to-[#080B10] border-t border-cyan-500/20 flex flex-col justify-center overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                
                <div className="w-full overflow-hidden flex items-center h-2 relative">
                  <motion.div
                    className="flex gap-8 shrink-0 min-w-full"
                    animate={{ x: [0, -120] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-12 h-[2px] bg-gradient-to-r from-neutral-500 via-neutral-300 to-neutral-500 rounded-full opacity-60 shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                      />
                    ))}
                  </motion.div>
                </div>
                
                <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              </div>

              {/* Cruising Delivery Van with Realistic Suspension Bounce & Volumetric Headlight */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <motion.div
                  animate={{ y: [0, -1.8, 0, 1.2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                  className="relative flex items-center"
                >
                  {/* Headlight Beam */}
                  <div
                    className="absolute left-[110px] top-[14px] w-48 h-20 pointer-events-none opacity-80"
                    style={{
                      background: 'radial-gradient(ellipse at left top, rgba(56, 189, 248, 0.45) 0%, rgba(56, 189, 248, 0.12) 50%, transparent 80%)',
                      clipPath: 'polygon(0% 20%, 100% 0%, 100% 100%, 0% 70%)',
                      filter: 'blur(1px)',
                    }}
                  />

                  <svg width="130" height="60" viewBox="0 0 130 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                    <defs>
                      <linearGradient id="chassisGradHwy1" x1="0" y1="10" x2="120" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="50%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>
                      <linearGradient id="windshieldGradHwy1" x1="75" y1="12" x2="95" y2="28" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
                      </linearGradient>
                      <radialGradient id="rimGradHwy1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#E2E8F0" />
                        <stop offset="60%" stopColor="#64748B" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </radialGradient>
                    </defs>

                    <ellipse cx="65" cy="56" rx="55" ry="3.5" fill="#000000" opacity="0.75" filter="blur(2px)" />

                    <path
                      d="M10 16 C10 13 12 11 15 11 L74 11 L78 20 L108 22 C114 22 118 26 119 32 L120 44 C120 46 118 48 116 48 L108 48 C108 42 103 38 97 38 C91 38 86 42 86 48 L44 48 C44 42 39 38 33 38 C27 38 22 42 22 48 L13 48 C11 48 10 46 10 44 Z"
                      fill="url(#chassisGradHwy1)"
                      stroke="#334155"
                      strokeWidth="1.2"
                    />

                    <path d="M11 28 L75 28 L77 34 L118 34 L119 36 L11 36 Z" fill="#2563EB" opacity="0.9" />

                    <path
                      d="M79 14 L98 16 C102 16.5 105 19 106 23 L107 27 L78 27 Z"
                      fill="url(#windshieldGradHwy1)"
                      stroke="#0284C7"
                      strokeWidth="0.8"
                    />

                    <line x1="75" y1="12" x2="75" y2="47" stroke="#334155" strokeWidth="1" opacity="0.6" />

                    <text x="22" y="24" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.6">
                      MS MOBILES
                    </text>
                    <text x="22" y="32" fill="#38BDF8" fontSize="4.5" fontWeight="700" fontFamily="sans-serif">
                      EXPRESS LOGISTICS
                    </text>

                    <rect x="9.5" y="22" width="2" height="7" rx="1" fill="#EF4444" />
                    <circle cx="10" cy="25.5" r="3" fill="#EF4444" opacity="0.5" filter="blur(1px)" />

                    <polygon points="118,33 121,34 121,38 117,39" fill="#F8FAFC" />
                    <circle cx="120" cy="36" r="3" fill="#38BDF8" opacity="0.8" />

                    {/* Wheels */}
                    <g transform="translate(97, 48)">
                      <circle cx="0" cy="0" r="8.5" fill="#090D14" stroke="#1E293B" strokeWidth="1" />
                      <circle cx="0" cy="0" r="5.5" fill="url(#rimGradHwy1)" />
                      <motion.g
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.45, ease: 'linear' }}
                      >
                        <line x1="-4" y1="0" x2="4" y2="0" stroke="#FFFFFF" strokeWidth="1" />
                        <line x1="0" y1="-4" x2="0" y2="4" stroke="#FFFFFF" strokeWidth="1" />
                      </motion.g>
                      <circle cx="0" cy="0" r="1.8" fill="#38BDF8" />
                    </g>

                    <g transform="translate(33, 48)">
                      <circle cx="0" cy="0" r="8.5" fill="#090D14" stroke="#1E293B" strokeWidth="1" />
                      <circle cx="0" cy="0" r="5.5" fill="url(#rimGradHwy1)" />
                      <motion.g
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.45, ease: 'linear' }}
                      >
                        <line x1="-4" y1="0" x2="4" y2="0" stroke="#FFFFFF" strokeWidth="1" />
                        <line x1="0" y1="-4" x2="0" y2="4" stroke="#FFFFFF" strokeWidth="1" />
                      </motion.g>
                      <circle cx="0" cy="0" r="1.8" fill="#38BDF8" />
                    </g>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 4: DELIVERED - DOORSTEP HANDOVER (THUMBS UP 👍) & VAN DEPARTURE */}
          {/* ========================================================================= */}
          {activeStage === 3 && (
            <motion.div
              key="stage-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col justify-end"
            >
              {/* Warm Ambient Porch Lighting Glow */}
              <div className="absolute top-0 right-10 w-64 h-48 bg-gradient-to-b from-amber-400/25 via-yellow-500/10 to-transparent blur-3xl pointer-events-none" />

              {/* Roadbed and Curbside Pavement */}
              <div className="relative w-full h-16 bg-gradient-to-b from-[#131A29] via-[#0E131F] to-[#080B12] border-t border-dark-700 flex items-center justify-between px-6">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-dark-600 via-neutral-400 to-dark-600 shadow-sm" />
                
                <div className="w-full flex justify-around opacity-30">
                  <span className="w-16 h-1 bg-white/40 rounded-full" />
                  <span className="w-16 h-1 bg-white/40 rounded-full" />
                  <span className="w-16 h-1 bg-white/40 rounded-full" />
                </div>
              </div>

              {/* Right Side: Customer Doorstep & Modern Residence Entrance */}
              <div className="absolute right-6 sm:right-14 bottom-12 z-20 flex flex-col items-center">
                {/* Warm Wall Light Fixture */}
                <div className="relative flex flex-col items-center mb-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_18px_#F59E0B]" />
                  <div className="w-1 h-3 bg-dark-600" />
                </div>

                {/* Villa Front Door Structure */}
                <div className="relative w-28 sm:w-32 h-34 rounded-t-xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl flex flex-col items-center justify-between p-2">
                  <div className="px-2 py-0.5 rounded bg-dark-950 border border-amber-400/40 text-[9px] font-mono text-amber-300 font-bold">
                    #42 VILLA
                  </div>

                  <div className="w-full h-18 rounded border border-dark-700/80 bg-slate-900/50 flex items-center justify-end px-2">
                    <div className="w-1.5 h-4 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
                  </div>

                  <div className="w-full h-2.5 rounded bg-amber-900/60 border border-amber-600/40 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-amber-200 tracking-wider">WELCOME</span>
                  </div>
                </div>
              </div>

              {/* MS Mobiles Delivery Van */}
              {/* In 'drive_away': animates forward off the screen */}
              {/* In 'reset_in': smoothly returns and settles at curb */}
              <motion.div
                className="absolute bottom-8 z-10 pointer-events-none"
                initial={{ x: 25 }}
                animate={{
                  x:
                    deliveredPhase === 'drive_away'
                      ? [25, 750]
                      : deliveredPhase === 'reset_in'
                      ? [-180, 25]
                      : 25,
                }}
                transition={{
                  duration: deliveredPhase === 'drive_away' ? 2.8 : deliveredPhase === 'reset_in' ? 1.8 : 0.4,
                  ease: [0.42, 0, 0.2, 1],
                }}
              >
                <div className="relative">
                  {/* Exhaust smoke puff during drive-away */}
                  {deliveredPhase === 'drive_away' && (
                    <motion.div
                      className="absolute -left-6 bottom-4 flex gap-1 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.8], x: [-5, -25] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <span className="w-3 h-3 rounded-full bg-neutral-400/50 blur-sm" />
                      <span className="w-4 h-4 rounded-full bg-neutral-500/40 blur-sm" />
                    </motion.div>
                  )}

                  {/* High Detail MS Mobiles Delivery Van */}
                  <svg width="136" height="64" viewBox="0 0 130 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                    <defs>
                      <linearGradient id="chassisGradDeliv" x1="0" y1="10" x2="120" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="50%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>
                    </defs>

                    <ellipse cx="65" cy="56" rx="55" ry="3.5" fill="#000000" opacity="0.75" filter="blur(2px)" />

                    <path
                      d="M10 16 C10 13 12 11 15 11 L74 11 L78 20 L108 22 C114 22 118 26 119 32 L120 44 C120 46 118 48 116 48 L108 48 C108 42 103 38 97 38 C91 38 86 42 86 48 L44 48 C44 42 39 38 33 38 C27 38 22 42 22 48 L13 48 C11 48 10 46 10 44 Z"
                      fill="url(#chassisGradDeliv)"
                      stroke="#334155"
                      strokeWidth="1.2"
                    />

                    <path d="M11 28 L75 28 L77 34 L118 34 L119 36 L11 36 Z" fill="#2563EB" opacity="0.9" />

                    <path
                      d="M79 14 L98 16 C102 16.5 105 19 106 23 L107 27 L78 27 Z"
                      fill="#38BDF8"
                      fillOpacity="0.7"
                      stroke="#0284C7"
                      strokeWidth="0.8"
                    />

                    <text x="22" y="24" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.6">
                      MS MOBILES
                    </text>
                    <text x="22" y="32" fill="#38BDF8" fontSize="4.5" fontWeight="700" fontFamily="sans-serif">
                      EXPRESS LOGISTICS
                    </text>

                    {/* Amber Hazard Blinker / Park Light */}
                    <circle cx="120" cy="36" r="3" fill="#F59E0B" className="animate-pulse" />
                    <circle cx="10" cy="25.5" r="3" fill="#EF4444" opacity="0.7" />

                    {/* Wheels */}
                    <g transform="translate(97, 48)">
                      <circle cx="0" cy="0" r="8.5" fill="#090D14" stroke="#1E293B" strokeWidth="1" />
                      <circle cx="0" cy="0" r="5.5" fill="#64748B" />
                      <motion.g
                        animate={{
                          rotate: deliveredPhase === 'drive_away' || deliveredPhase === 'reset_in' ? 720 : 0,
                        }}
                        transition={{ duration: 2.5, ease: 'easeIn' }}
                      >
                        <line x1="-4" y1="0" x2="4" y2="0" stroke="#FFFFFF" strokeWidth="1" />
                        <line x1="0" y1="-4" x2="0" y2="4" stroke="#FFFFFF" strokeWidth="1" />
                      </motion.g>
                      <circle cx="0" cy="0" r="1.8" fill="#38BDF8" />
                    </g>

                    <g transform="translate(33, 48)">
                      <circle cx="0" cy="0" r="8.5" fill="#090D14" stroke="#1E293B" strokeWidth="1" />
                      <circle cx="0" cy="0" r="5.5" fill="#64748B" />
                      <motion.g
                        animate={{
                          rotate: deliveredPhase === 'drive_away' || deliveredPhase === 'reset_in' ? 720 : 0,
                        }}
                        transition={{ duration: 2.5, ease: 'easeIn' }}
                      >
                        <line x1="-4" y1="0" x2="4" y2="0" stroke="#FFFFFF" strokeWidth="1" />
                        <line x1="0" y1="-4" x2="0" y2="4" stroke="#FFFFFF" strokeWidth="1" />
                      </motion.g>
                      <circle cx="0" cy="0" r="1.8" fill="#38BDF8" />
                    </g>
                  </svg>
                </div>
              </motion.div>

              {/* Delivery Executive Character with Thumbs Up (👍) & Speech Bubble */}
              {deliveredPhase !== 'drive_away' && (
                <motion.div
                  className="absolute bottom-12 z-30 flex flex-col items-center pointer-events-none"
                  initial={{ x: 'calc(100% - 150px)', opacity: 0 }}
                  animate={{
                    x: deliveredPhase === 'walk' ? 115 : 'calc(100% - 150px)',
                    opacity: deliveredPhase === 'walk' ? [1, 0.9, 0] : 1,
                  }}
                  transition={{
                    duration: deliveredPhase === 'walk' ? 1.8 : 0.4,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Floating Frosted Speech Bubble with Thumbs-Up Message */}
                  {deliveredPhase === 'celebrate' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="relative mb-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600/95 via-teal-600/95 to-cyan-700/95 text-white shadow-2xl border border-emerald-300/50 flex flex-col items-center max-w-[210px] text-center backdrop-blur-md"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-base">👍</span>
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100">
                          Package Delivered!
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-white leading-tight">
                        "Verified with OTP. Thank you for choosing MS Mobiles!"
                      </p>

                      {/* Bubble Pointer */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-600 rotate-45 border-r border-b border-emerald-300/50" />
                    </motion.div>
                  )}

                  {/* Delivery Executive SVG Character */}
                  <div className="relative">
                    <svg width="44" height="68" viewBox="0 0 44 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="22" cy="66" rx="14" ry="2.5" fill="#000000" opacity="0.6" />

                      {/* Cap */}
                      <path d="M14 12 C14 7 20 6 25 6 C30 6 34 8 34 12 L36 14 L12 14 Z" fill="#1D4ED8" />
                      <path d="M12 14 L37 14 L39 16 L10 16 Z" fill="#1E40AF" />
                      <rect x="22" y="8" width="4" height="2" rx="1" fill="#38BDF8" />

                      {/* Head & Smiling Face */}
                      <circle cx="23" cy="18" r="6" fill="#FCD34D" />
                      <circle cx="21" cy="17" r="0.8" fill="#1E293B" />
                      <circle cx="25" cy="17" r="0.8" fill="#1E293B" />
                      <path d="M21 20 Q23 22 25 20" stroke="#B45309" strokeWidth="0.8" fill="none" strokeLinecap="round" />

                      {/* Uniform Jacket */}
                      <path d="M14 24 L32 24 L34 44 L12 44 Z" fill="#1E3A8A" />
                      <line x1="23" y1="24" x2="23" y2="44" stroke="#38BDF8" strokeWidth="1" />
                      <rect x="16" y="27" width="4" height="3" rx="0.5" fill="#38BDF8" />

                      {/* Left Hand: Holding Parcel */}
                      <g transform="translate(4, 32)">
                        <rect x="0" y="0" width="12" height="10" rx="1.5" fill="#D97706" stroke="#F59E0B" strokeWidth="0.5" />
                        <line x1="6" y1="0" x2="6" y2="10" stroke="#FEF3C7" strokeWidth="0.8" />
                        <line x1="0" y1="5" x2="12" y2="5" stroke="#FEF3C7" strokeWidth="0.8" />
                      </g>

                      {/* Right Hand: Raised Cheerful Thumbs Up (👍) */}
                      <motion.g
                        animate={{
                          rotate: deliveredPhase === 'celebrate' ? [0, -8, 0, 8, 0] : 0,
                        }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                        style={{ transformOrigin: '30px 28px' }}
                      >
                        <path d="M30 28 L38 23" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="39" cy="22" r="2.5" fill="#FCD34D" />
                        <path d="M39 21 L39 17" stroke="#FCD34D" strokeWidth="1.8" strokeLinecap="round" />
                      </motion.g>

                      {/* Legs & Shoes */}
                      <rect x="16" y="44" width="4.5" height="18" fill="#1E293B" />
                      <rect x="25" y="44" width="4.5" height="18" fill="#1E293B" />
                      <rect x="14" y="60" width="7" height="4" rx="1.5" fill="#0F172A" />
                      <rect x="25" y="60" width="7" height="4" rx="1.5" fill="#0F172A" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Status Information */}
      <div className="px-4 sm:px-6 py-2 bg-dark-950/90 border-t border-dark-800/80 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
          <span className="text-cyan-400 font-semibold">Active Scene:</span>
          <span>
            {activeStage === 0 && '1. Confirmed • Automated Device Boxing & Holographic QA'}
            {activeStage === 1 && '2. Processing • Conveyor Belt Docking & Cargo Loading'}
            {activeStage === 2 && `3. Shipped • Express Transit Corridor to ${destinationCity}`}
            {activeStage === 3 && '4. Delivered • Doorstep Handover & Departure Sequence'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-neutral-400">
            Order Status: <strong className="text-white font-mono">{rawStatus}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
