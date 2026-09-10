/**
 * Delivery Executive & Handover Security OTP Card
 * Module: components/order/DeliveryAgentCard.jsx
 * 
 * Displays delivery partner profile, driver ratings, phone proxy simulator,
 * and 4-digit Delivery Verification OTP.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  Lock,
  Bike,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DeliveryAgentCard = ({ order }) => {
  const toast = useToast();
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  if (!order) return null;

  // Extract or generate a consistent 4-digit OTP from order number or ID
  const rawNumbers = (order.orderNumber || order.id || '9855').replace(/\D/g, '');
  const otpCode = rawNumbers.length >= 4 ? rawNumbers.slice(-4) : '4821';

  const isDelivered = order.orderStatus === 'DELIVERED';
  const isShipped = order.orderStatus === 'SHIPPED';
  const isCancelled = order.orderStatus === 'CANCELLED';

  const carrier = order.carrier || 'Blue Dart Express';

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(otpCode);
    setCopiedOtp(true);
    toast.success(`OTP ${otpCode} copied to clipboard.`);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleCallExecutive = () => {
    setIsCalling(true);
    toast.info('Connecting encrypted proxy call to delivery executive...');
    setTimeout(() => {
      setIsCalling(false);
      toast.success('Executive notified! You will receive an incoming callback on your registered phone.');
    }, 1800);
  };

  if (isCancelled) return null;

  return (
    <div className="rounded-3xl bg-dark-900/90 border border-dark-800 p-6 sm:p-7 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Handover OTP Badge Container */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-dark-950 via-dark-900 to-accent-950/30 border border-accent-500/30 relative overflow-hidden shadow-inner">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-accent-400 text-[11px] font-extrabold uppercase tracking-widest mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Doorstep Verification PIN</span>
            </div>
            <p className="text-xs text-neutral-300">
              {isDelivered
                ? 'OTP was successfully verified at delivery.'
                : 'Share this 4-digit PIN with your delivery partner upon physical box handover.'}
            </p>
          </div>

          {/* OTP Digits */}
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-dark-950 border border-accent-500/50 shadow-glow-sm text-center">
              <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-accent-300">
                {otpCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyOtp}
              title="Copy OTP"
              className="p-2.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-neutral-400 hover:text-white border border-dark-800 transition-colors"
            >
              {copiedOtp ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Partner & Executive Profile */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Assigned Delivery Associate
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>4.9 (1,420+ trips)</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Executive Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-glow-sm">
              RK
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-dark-900" title="Active on duty" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-extrabold text-white truncate">
              Ramesh Kumar
            </h4>
            <p className="text-xs text-accent-400 font-medium truncate">
              Senior Field Associate • {carrier}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
              <Bike className="w-3.5 h-3.5 text-neutral-500" />
              <span>Electric Cargo (TS 09 EQ 4821)</span>
            </div>
          </div>
        </div>

        {/* Contact Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleCallExecutive}
            disabled={isCalling || isDelivered}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all duration-200 ${
              isDelivered
                ? 'bg-dark-950 text-neutral-500 border-dark-800 cursor-not-allowed'
                : 'bg-accent-600 hover:bg-accent-500 text-white border-accent-500/50 shadow-glow-sm'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>
              {isDelivered
                ? 'Delivery Completed'
                : isCalling
                ? 'Connecting Masked Line...'
                : 'Call Executive (Masked Number)'}
            </span>
          </button>
          <p className="text-[10px] text-neutral-500 text-center mt-1.5">
            Your personal contact number remains 100% encrypted and private.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentCard;
