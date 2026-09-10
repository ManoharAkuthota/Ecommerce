/**
 * Simple, Realistic & Attractive Logistics Route Map
 * Module: components/order/TrackingRouteMap.jsx
 * 
 * Clean, modern route visualization:
 * - Realistic animated expressway transit scene with moving road dashes and volumetric LED headlights.
 * - 4 Clear transit hubs (Origin -> Air Gateway -> Local Express Hub -> Doorstep).
 * - Connected progress line with luminous shimmer and ambient pulsing station beacons.
 * - Direct link to Tracking Chat and 1-click AWB copy.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Plane,
  Truck,
  Home,
  CheckCircle2,
  Clock,
  Navigation,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import LiveDeliveryStageAnimation from './LiveDeliveryStageAnimation';

const TrackingRouteMap = ({ order }) => {
  const [copiedAWB, setCopiedAWB] = useState(false);

  if (!order) return null;

  const status = order.orderStatus || 'CONFIRMED';
  const isDelivered = status === 'DELIVERED';
  const isShipped = status === 'SHIPPED';
  const isProcessing = status === 'PROCESSING';
  const isCancelled = status === 'CANCELLED';

  // Calculate current progress stage index (0 to 3) & progress percent
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

  const destinationCity = order.shippingAddress?.city || order.city || 'Your City';
  const carrier = order.carrier || 'Blue Dart Express';
  const trackingNumber = order.trackingNumber || 'BD-88992200';

  const hubs = [
    {
      id: 'origin',
      title: 'Order Confirmed',
      location: 'Hyderabad Central Hub',
      desc: 'Inventory Allocated & Verified',
      icon: Building2,
    },
    {
      id: 'gateway',
      title: 'Packaging & QA',
      location: 'RGIA Air Logistics Hub',
      desc: 'IMEI Scanned & Security Sealed',
      icon: Plane,
    },
    {
      id: 'local_hub',
      title: 'Out for Delivery',
      location: `${destinationCity} Express Hub`,
      desc: 'Handed to Courier Driver',
      icon: Truck,
    },
    {
      id: 'doorstep',
      title: 'Delivered',
      location: 'Customer Doorstep',
      desc: isDelivered ? 'Handover Verified with OTP' : 'Estimated Delivery Point',
      icon: Home,
    },
  ];

  const handleCopyAWB = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopiedAWB(true);
      setTimeout(() => setCopiedAWB(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#101726]/95 via-[#0B0F19]/95 to-[#070A10]/95 border border-dark-800/90 shadow-2xl backdrop-blur-2xl overflow-hidden select-none space-y-6">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Bar: Waybill & Courier Badge & Quick Actions */}
      <div className="p-6 sm:p-8 pb-5 border-b border-dark-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isDelivered ? 'bg-emerald-400' : 'bg-cyan-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isDelivered ? 'bg-emerald-500' : 'bg-cyan-500'
                }`} />
              </span>
              <span className="text-xs font-mono text-neutral-400">Shipment #{order.orderNumber}</span>
              <span className="text-neutral-600">•</span>
              <span className="text-xs font-mono text-cyan-400">Live Logistics Route</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isDelivered
                  ? 'Package Delivered'
                  : isShipped
                  ? `In Transit to ${destinationCity}`
                  : isProcessing
                  ? 'Processing & Quality Check'
                  : isCancelled
                  ? 'Order Cancelled'
                  : 'Order Verified'}
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
          </div>

          {/* Action Controls: Tracking Chat & Courier Waybill */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Direct Tracking Chat */}
            <Link
              to="/account/inquiries?channel=TRACKING"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-xs font-bold text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 shadow-sm group"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Tracking Chat</span>
            </Link>

            {/* Courier Partner & AWB Badge */}
            <div className="flex items-center gap-2 bg-dark-950/80 border border-dark-800 rounded-xl px-3 py-1.5 shadow-inner">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <div className="text-left text-xs">
                <span className="text-neutral-400 text-[9px] uppercase font-semibold block">{carrier}</span>
                <span className="font-mono font-bold text-white text-[11px]">{trackingNumber}</span>
              </div>
              <button
                onClick={handleCopyAWB}
                type="button"
                title="Copy AWB Tracking Code"
                className="ml-1.5 p-1 rounded-md text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer"
              >
                {copiedAWB ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REALISTIC & ATTRACTIVE MULTI-STAGE DELIVERY ANIMATION SCENES */}
      <div className="px-6 sm:px-8">
        <LiveDeliveryStageAnimation order={order} />
      </div>

      {/* 3. 4-STAGE MILESTONE CONNECTED STEPPER */}
      <div className="px-6 sm:px-8 py-5">
        <div className="relative">
          <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1.5 bg-dark-800 rounded-full overflow-hidden">
            {!isCancelled && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trackPercent}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full relative shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              >
                <motion.div
                  className="absolute inset-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: ['-100%', '450%'] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                />
              </motion.div>
            )}
          </div>

          <div className="relative grid grid-cols-4 gap-2 z-10">
            {hubs.map((hub, idx) => {
              const HubIcon = hub.icon;
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={hub.id} className="flex flex-col items-center text-center">
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
                        <HubIcon className="w-5 h-5" />
                      )}
                    </motion.div>

                    {isCurrent && !isCancelled && (
                      <motion.span
                        className="absolute -inset-1.5 rounded-full border-2 border-cyan-400/60 pointer-events-none"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0, 0.9] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      />
                    )}
                  </div>

                  <h4
                    className={`text-xs sm:text-sm font-bold tracking-tight ${
                      isCurrent ? 'text-white' : isPast ? 'text-neutral-200' : 'text-neutral-500'
                    }`}
                  >
                    {hub.title}
                  </h4>
                  <p className="text-[11px] font-mono text-cyan-400/90 mt-0.5 truncate hidden sm:block">
                    {hub.location}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
                    {hub.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Security Footnote */}
      <div className="p-6 sm:p-8 pt-4 border-t border-dark-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 bg-dark-950/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official sealed brand warranty with tamper-evident security packaging intact.</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-500 shrink-0">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live Tracking Active</span>
        </div>
      </div>
    </div>
  );
};

export default TrackingRouteMap;
