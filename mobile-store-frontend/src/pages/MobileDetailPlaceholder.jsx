/**
 * MobileDetailPlaceholder Component
 * Module: pages/MobileDetailPlaceholder.jsx
 * 
 * Elegant placeholder route for /mobiles/:id ensuring zero broken navigation
 * when users click "View Details" on any product card in the catalog.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, Sparkles, ShieldCheck, Truck, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { mobileStoreService } from '../services/mobileStoreService';
import { StockBadge, formatPrice } from '../components/mobiles/MobileCard';

export const MobileDetailPlaceholder = () => {
  const { id } = useParams();
  const [mobile, setMobile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMobile = async () => {
      if (!id) return;
      try {
        const data = await mobileStoreService.getMobileById(id);
        setMobile(data);
      } catch (err) {
        console.warn('Could not load mobile details for preview:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMobile();
  }, [id]);

  const primaryImage =
    mobile?.imageUrls?.[0] || mobile?.images?.[0]?.imageUrl || null;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] py-12 sm:py-16 overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[22rem] bg-accent-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/mobiles"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-accent-400" />
          <span>Back to Mobiles Catalog</span>
        </Link>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="p-8 sm:p-12 rounded-3xl bg-dark-900/70 border border-dark-800/80 backdrop-blur-2xl shadow-2xl space-y-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Image Preview */}
            <div className="w-full md:w-80 aspect-square rounded-2xl bg-dark-950/80 border border-dark-750 flex items-center justify-center p-6 shrink-0">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={mobile?.name || 'Smartphone Preview'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Smartphone className="w-16 h-16 text-neutral-600" />
              )}
            </div>

            {/* Details Preview */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-mono font-bold uppercase">
                  {mobile?.brand || 'MS Mobiles Flagship'}
                </span>
                {mobile?.stockStatus && <StockBadge status={mobile.stockStatus} />}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {mobile?.name || 'Smartphone Details'}
              </h1>

              {mobile?.price && (
                <div className="text-2xl sm:text-3xl font-black text-accent-400">
                  {formatPrice(mobile.price)}
                </div>
              )}

              <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
                {mobile?.display
                  ? `${mobile.display} • ${mobile.battery || ''}`
                  : 'Official smartphone flagship device with manufacturer warranty, sealed box delivery, and trade-in support.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-neutral-400 font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official Warranty</span>
                </div>
                <div className="flex items-center gap-1.5 text-accent-400">
                  <Truck className="w-4 h-4" />
                  <span>Express Insured Shipping</span>
                </div>
              </div>

              <div className="pt-6 border-t border-dark-800 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/mobiles"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all shadow-glow-sm text-center"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-neutral-300 hover:text-white text-xs font-bold border border-dark-700 text-center transition-colors"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileDetailPlaceholder;
