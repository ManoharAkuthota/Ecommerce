/**
 * Wishlist Card Component
 * Module: components/wishlist/WishlistCard.jsx
 * 
 * Luxury glassmorphic card for rendering saved smartphones on the wishlist page:
 * - High-res product thumbnail with smooth scale hover
 * - Brand pill badge, model name, formatted price
 * - RAM & Storage specs chips
 * - Stock badge indicator
 * - "Remove" action trigger & "View Details" deep link
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, HardDrive, Cpu, Trash2, ArrowRight, Sparkles } from 'lucide-react';

const StockPill = ({ status }) => {
  const isOutOfStock = status === 'OUT_OF_STOCK';
  const isLimited = status === 'LIMITED_STOCK';

  if (isOutOfStock) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
        Out of Stock
      </span>
    );
  }

  if (isLimited) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
        Limited
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      In Stock
    </span>
  );
};

const WishlistCard = ({ item, onRemoveClick }) => {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const {
    mobileId,
    id,
    name = 'Flagship Smartphone',
    brand = 'Flagship',
    price = 0,
    formattedPrice,
    firstImage,
    ram,
    storage,
    stock = 'IN_STOCK',
  } = item;

  const targetId = mobileId || id;
  const displayPrice =
    formattedPrice ||
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col justify-between rounded-3xl bg-dark-900/60 hover:bg-dark-900/95 border border-dark-800/80 hover:border-accent-500/40 backdrop-blur-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Top Image & Details Container */}
      <div className="p-4 sm:p-5 pb-0">
        {/* Header Badges Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StockPill status={stock} />
          <span className="text-[10px] font-bold text-accent-400/90 uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent-500/10 border border-accent-500/20">
            {brand}
          </span>
        </div>

        {/* Smartphone Image Container */}
        <Link
          to={`/mobiles/${targetId}`}
          className="relative w-full aspect-[4/3.4] rounded-2xl overflow-hidden bg-dark-950/80 border border-dark-800/60 flex items-center justify-center p-3 group/img block"
        >
          {firstImage && !imageError ? (
            <img
              src={firstImage}
              alt={`${brand} ${name}`}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain object-center transform group-hover/img:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-600 gap-2">
              <Smartphone className="w-12 h-12 text-neutral-600 group-hover/img:text-accent-400 transition-colors" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                Flagship Device
              </span>
            </div>
          )}

          {/* Bottom Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 via-transparent to-transparent pointer-events-none" />
        </Link>

        {/* Model Title & Price */}
        <div className="mt-4 space-y-1">
          <Link
            to={`/mobiles/${targetId}`}
            className="block text-base font-bold text-white group-hover:text-accent-300 transition-colors tracking-tight truncate"
            title={name}
          >
            {name}
          </Link>

          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {displayPrice}
          </div>
        </div>

        {/* Specs Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-dark-800/70">
          {ram && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-dark-850 border border-dark-800 text-[11px] text-neutral-300 font-mono">
              <Cpu className="w-3 h-3 text-accent-400" />
              <span>{ram}</span>
            </span>
          )}
          {storage && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-dark-850 border border-dark-800 text-[11px] text-neutral-300 font-mono">
              <HardDrive className="w-3 h-3 text-sky-400" />
              <span>{storage}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="p-4 sm:p-5 pt-4 mt-4 border-t border-dark-800/70 flex items-center gap-2">
        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemoveClick(item)}
          aria-label={`Remove ${name} from wishlist`}
          className="p-2.5 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-dark-750 hover:border-rose-500/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 select-none flex-shrink-0"
          title="Remove from wishlist"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* View Details Button */}
        <Link
          to={`/mobiles/${targetId}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-dark-850 hover:bg-dark-800 text-white border border-dark-750 hover:border-accent-500/40 shadow-sm transition-all group/btn select-none"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default WishlistCard;
