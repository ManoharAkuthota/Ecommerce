/**
 * Stock Restock Alert Modal
 * Module: components/mobiles/StockAlertModal.jsx
 * 
 * Allows storefront visitors and registered customers to register for instant
 * restock notifications on out-of-stock flagship smartphones.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Sparkles,
  Smartphone,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import stockAlertService from '../../services/stockAlertService';

const StockAlertModal = ({ isOpen, onClose, mobile }) => {
  const { user, isAuthenticated } = useUserAuth();

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-fill from authenticated user profile
  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
    }
  }, [user, isOpen]);

  if (!isOpen || !mobile) return null;

  const phoneName = mobile.name || mobile.mobileName || 'Smartphone';
  const phoneBrand = mobile.brand || mobile.mobileBrand || 'MS Flagship';
  const phoneImage = mobile.images?.[0]?.imageUrl || mobile.mobileImage || mobile.image || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await stockAlertService.subscribe({
        mobileId: mobile.id,
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber?.trim() || null,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error('[StockAlertModal] Subscription error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to register alert. Please try again.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-dark-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-dark-900 border border-dark-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header Strip */}
          <div className="relative px-6 pt-6 pb-4 border-b border-dark-800 bg-gradient-to-r from-dark-850 via-dark-900 to-dark-850">
            <button
              onClick={onClose}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-accent-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4 animate-bounce" />
              <span>Priority Restock Alert</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Notify Me When Available</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Be the first to know the moment showroom inventory lands.
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Restock Alert Activated!</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                You are on the priority VIP allocation list for <span className="text-accent-400 font-semibold">{phoneName}</span>. We will notify you via <span className="text-white font-semibold">{email}</span> immediately upon restock!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Product Preview Card */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-dark-850 border border-dark-800/80">
                <div className="w-12 h-14 rounded-xl bg-dark-800 border border-dark-700/60 p-1 shrink-0 flex items-center justify-center">
                  {phoneImage ? (
                    <img src={phoneImage} alt={phoneName} className="w-full h-full object-contain" />
                  ) : (
                    <Smartphone className="w-6 h-6 text-accent-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase text-accent-400">
                    {phoneBrand}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {phoneName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25">
                      Out of Stock
                    </span>
                  </div>
                </div>
              </div>

              {/* VIP Benefits Strip */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-dark-850/60 border border-dark-800/60 text-[11px] text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                  <span>Instant SMS / Email</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero Spam Guarantee</span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3.5">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="alertEmail" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Email Address <span className="text-accent-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="alertEmail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-accent-500 transition-colors"
                    />
                  </div>
                </div>

                {/* WhatsApp / Phone (Optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="alertPhone" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    WhatsApp / Phone Number <span className="text-[10px] text-neutral-500 font-normal lowercase">(optional for SMS)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="alertPhone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-accent-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-dark-700 text-neutral-300 hover:text-white hover:bg-dark-800 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!email || !email.trim() || isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-600 to-indigo-600 hover:from-accent-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-glow-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      Notify Me
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StockAlertModal;
