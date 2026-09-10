/**
 * Customer Post-Purchase Write Review Modal
 * Module: components/orders/WriteReviewModal.jsx
 * 
 * Provides an interactive 5-star rating and customer review dialog for verified
 * smartphone buyers directly from their order tracking screens.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useUserAuth } from '../../hooks/useUserAuth';

const RATING_DESCRIPTIONS = {
  1: 'Poor — Disappointed with performance or build',
  2: 'Fair — Acceptable but has noticeable limitations',
  3: 'Good — Reliable everyday smartphone experience',
  4: 'Very Good — Impressive features, great camera & battery',
  5: 'Outstanding — Exceptional flagship experience, highly recommended! ⭐',
};

const WriteReviewModal = ({ isOpen, onClose, phone, onReviewSubmitted }) => {
  const { user } = useUserAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !phone) return null;

  const currentDisplayRating = hoverRating || rating;
  const charCount = reviewText.trim().length;
  const isValid = charCount >= 5 && charCount <= 2000 && rating >= 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const customerName = user?.fullName || 'Verified Buyer';
    const customerImage = user?.profileImage || null;
    const purchasedPhone = phone.mobileName || phone.name || 'Smartphone';

    try {
      const response = await reviewService.addReview({
        customerName,
        customerImage,
        purchasedPhone,
        rating,
        reviewText: reviewText.trim(),
      });

      setIsSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(response, phone);
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Error submitting review:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit review. Please try again.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-dark-900 border border-dark-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header Banner */}
          <div className="relative px-6 pt-6 pb-4 border-b border-dark-800 bg-gradient-to-b from-dark-850 to-dark-900">
            <button
              onClick={onClose}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-accent-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Verified Buyer Experience
            </div>
            <h2 className="text-xl font-extrabold text-white">Rate & Review Smartphone</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Share your genuine feedback on camera quality, battery longevity, and real-world speed.
            </p>
          </div>

          {/* Success State Screen */}
          {isSuccess ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Review Published!</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Thank you, <span className="text-white font-semibold">{user?.fullName || 'valued customer'}</span>! Your review for <span className="text-accent-400 font-semibold">{phone.mobileName || phone.name}</span> is live on our storefront.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Product Preview Strip */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-dark-850 border border-dark-800/80">
                <div className="w-12 h-14 rounded-xl bg-dark-800 border border-dark-700/60 p-1 shrink-0 flex items-center justify-center">
                  {phone.mobileImage || phone.image ? (
                    <img
                      src={phone.mobileImage || phone.image}
                      alt={phone.mobileName || phone.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Smartphone className="w-6 h-6 text-accent-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase text-accent-400">
                    {phone.mobileBrand || phone.brand || 'MS Flagship'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {phone.mobileName || phone.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Purchase</span>
                  </div>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= currentDisplayRating;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-neutral-600 hover:scale-110 active:scale-95 transition-all focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-sm font-extrabold text-white ml-2 font-mono">
                    {currentDisplayRating}.0
                  </span>
                </div>
                <p className="text-xs text-accent-400 font-medium h-4">
                  {RATING_DESCRIPTIONS[currentDisplayRating]}
                </p>
              </div>

              {/* Review Text Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="reviewText" className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Detailed Experience
                  </label>
                  <span className={`text-[11px] font-mono ${charCount < 5 ? 'text-neutral-500' : 'text-emerald-400'}`}>
                    {charCount}/2000 chars {charCount < 5 && '(min 5)'}
                  </span>
                </div>
                <textarea
                  id="reviewText"
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Describe display brilliance, battery drain, thermal handling, camera in daylight/night, and gaming frame rates..."
                  className="w-full px-4 py-3 rounded-2xl bg-dark-850 border border-dark-700 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-accent-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Footer Actions */}
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
                  disabled={!isValid || isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-600 to-indigo-600 hover:from-accent-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-glow-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Submit Review
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

export default WriteReviewModal;
