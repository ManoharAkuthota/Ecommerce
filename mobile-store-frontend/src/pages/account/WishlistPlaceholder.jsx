/**
 * Customer Wishlist Placeholder Page
 * Module: pages/account/WishlistPlaceholder.jsx
 * Route: /account/wishlist
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Smartphone, ArrowRight, Bell, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const WishlistPlaceholder = () => {
  return (
    <>
      <SEO
        title="Saved Wishlist — MS Mobiles"
        description="View your saved flagship smartphones, price alert triggers, and instant buy queue."
        canonicalUrl="http://localhost:5173/account/wishlist"
      />
      <div className="space-y-8">
        {/* Header Intro */}
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest mb-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Devices</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Wishlist
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Keep track of your dream smartphones, monitor price fluctuations, and receive stock drop alerts.
          </p>
        </div>

        {/* Feature Teaser Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-8 sm:p-10 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500/20 to-pink-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-glow-sm">
            <Heart className="w-8 h-8 fill-rose-500/20" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white">
              Wishlist coming next
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We are finalizing persistent multi-device wishlists. Soon, you will be able to bookmark luxury flagships directly from the catalog and receive real-time price alerts.
            </p>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <Zap className="w-5 h-5 text-amber-400 mb-2" />
              <span className="text-xs font-bold text-white">Price Alerts</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Instant drop notifications</span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <Bell className="w-5 h-5 text-sky-400 mb-2" />
              <span className="text-xs font-bold text-white">Stock Restock</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Never miss rare editions</span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
              <span className="text-xs font-bold text-white">One-Click Cart</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Seamless checkout flow</span>
            </div>
          </div>

          {/* Action to Storefront */}
          <div className="pt-2">
            <Link
              to="/mobiles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-accent-600 hover:bg-accent-500 text-white shadow-glow-sm transition-all group select-none"
            >
              <span>Explore Mobile Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default WishlistPlaceholder;
