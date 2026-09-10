/**
 * WhatsApp & SMS Dispatch Notification Simulator
 * Module: components/order/TrackingAlertsModal.jsx
 * 
 * Interactive preview of automated dispatch updates sent to customers via WhatsApp & SMS.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  BellRing,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const TrackingAlertsModal = ({ isOpen, onClose, order }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'sms'
  const [isSubscribing, setIsSubscribing] = useState(false);

  if (!isOpen || !order) return null;

  const orderNum = order.orderNumber || 'MS-2026-19855';
  const customerName = order.customerName || order.shippingAddress?.fullName || 'Valued Customer';
  const carrier = order.carrier || 'Blue Dart Express';
  const trackingNumber = order.trackingNumber || 'BD-98421048';
  const customerPhone = order.shippingAddress?.phoneNumber || '+91 98765 00123';

  const handleSendTestPing = () => {
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      toast.success(`Live tracking dispatch alert sent to ${customerPhone} via ${activeTab === 'whatsapp' ? 'WhatsApp' : 'SMS'}!`);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg rounded-3xl bg-dark-900 border border-dark-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-dark-800 flex items-center justify-between bg-dark-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Instant Delivery Alerts Simulator
                </h3>
                <p className="text-xs text-neutral-400">
                  Real-time WhatsApp & SMS notifications
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="px-6 pt-5 pb-2">
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-dark-950 border border-dark-800">
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Business</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sms')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'sms'
                    ? 'bg-accent-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>DLT Priority SMS</span>
              </button>
            </div>
          </div>

          {/* Message Preview Container */}
          <div className="p-6 overflow-y-auto space-y-5">
            {activeTab === 'whatsapp' ? (
              /* WhatsApp Simulated Bubble */
              <div className="rounded-2xl bg-[#0b141a] p-4 border border-emerald-500/20 space-y-3 font-sans shadow-inner">
                {/* Official Sender Tag */}
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    MS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">MS Mobiles Flagship</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400">Verified Business Account</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-[#1f2c34] p-3.5 rounded-2xl rounded-tl-none text-xs text-neutral-200 space-y-2 max-w-[90%]">
                  <p className="font-semibold text-white">
                    Namaste {customerName},
                  </p>
                  <p className="leading-relaxed text-neutral-300">
                    Your flagship order <strong className="text-emerald-400 font-mono">#{orderNum}</strong> has been dispatched via <strong className="text-white">{carrier}</strong>.
                  </p>
                  <div className="p-2.5 rounded-xl bg-[#111b21] border border-neutral-700/60 font-mono text-[11px] text-neutral-300 space-y-1">
                    <p>AWB: <strong className="text-white">{trackingNumber}</strong></p>
                    <p>Status: <strong className="text-emerald-400">{order.orderStatus}</strong></p>
                    <p>Security PIN: <strong className="text-amber-400">{(orderNum.replace(/\D/g, '') || '9855').slice(-4)}</strong></p>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Track live or view invoice: <span className="text-emerald-400 underline">https://msmobiles.in/track?order={orderNum}</span>
                  </p>
                  <div className="text-right text-[10px] text-neutral-400 font-mono">
                    Just now • ✓✓
                  </div>
                </div>
              </div>
            ) : (
              /* Priority SMS Simulated Bubble */
              <div className="rounded-2xl bg-dark-950 p-4 border border-dark-800 space-y-3 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between text-neutral-400 text-[11px] pb-2 border-b border-dark-800">
                  <span>Sender: <strong className="text-white">VK-MSMOBL</strong></span>
                  <span>DLT Header: GOV-TEL</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-800 text-neutral-200 leading-relaxed space-y-2">
                  <p>
                    Dear {customerName}, Your order {orderNum} is {order.orderStatus} with {carrier} (AWB: {trackingNumber}).
                  </p>
                  <p>
                    Verify package security seal. Share Delivery OTP with associate upon receipt.
                  </p>
                  <p className="text-accent-400 text-[11px]">
                    Track: msmobiles.in/track?order={orderNum}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Subscribes <strong className="text-neutral-200">{customerPhone}</strong> to automated courier milestone updates.</span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-5 border-t border-dark-800 bg-dark-950/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-dark-900 transition-colors"
            >
              Close Preview
            </button>
            <button
              type="button"
              onClick={handleSendTestPing}
              disabled={isSubscribing}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubscribing ? 'Sending Ping...' : 'Send Live Test Ping'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrackingAlertsModal;
