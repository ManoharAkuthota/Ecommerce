/**
 * Wishlist Empty State Component
 * Module: components/wishlist/WishlistEmptyState.jsx
 * 
 * Luxury fallback illustration when the customer's saved collection is empty.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Smartphone, ArrowRight, Sparkles } from 'lucide-react';

const WishlistEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900/90 via-dark-900/60 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-10 sm:p-14 text-center space-y-6 shadow-xl max-w-xl mx-auto"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Heart Icon Badge */}
      <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-pink-500/15 to-purple-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-glow-sm">
        <Heart className="w-10 h-10 fill-rose-500/20" />
        <Sparkles className="w-4 h-4 text-rose-300 absolute -top-1 -right-1 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Explore our collection of flagship smartphones, compare next-gen specifications, and save the ones you love.
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <Link
          to="/mobiles"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold bg-accent-600 hover:bg-accent-500 text-white shadow-glow-sm hover:shadow-glow-md transition-all group select-none"
        >
          <Smartphone className="w-4 h-4" />
          <span>Browse Flagship Mobiles</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default WishlistEmptyState;
