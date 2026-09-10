/**
 * MobileCard Component
 * Module: components/mobiles/MobileCard.jsx
 * 
 * Luxury glassmorphic smartphone product card for the storefront catalog:
 * - Primary Cloudinary / Web image with hover zoom
 * - Brand badge, product name, formatted USD price
 * - RAM, Storage, and Processor chips
 * - Stock badge: IN_STOCK (emerald), LIMITED_STOCK (amber), OUT_OF_STOCK (rose)
 * - View Details CTA button navigating to /mobiles/:id
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cpu, HardDrive, ArrowRight, Smartphone, ShoppingBag } from 'lucide-react';
import WishlistHeartButton from '../wishlist/WishlistHeartButton';
import CompareAddButton from '../compare/CompareAddButton';
import { useCart } from '../../hooks/useCart';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export const StockBadge = ({ status }) => {
  const statusMap = {
    IN_STOCK: {
      label: 'In Stock',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      dotClass: 'bg-emerald-400',
    },
    LIMITED_STOCK: {
      label: 'Limited Stock',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      dotClass: 'bg-amber-400',
    },
    OUT_OF_STOCK: {
      label: 'Out of Stock',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
      dotClass: 'bg-rose-400',
    },
  };

  const current = statusMap[status] || statusMap.IN_STOCK;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md ${current.badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass} animate-pulse`} />
      <span>{current.label}</span>
    </div>
  );
};

export const formatPrice = (price, formattedPrice) => {
  if (formattedPrice) return formattedPrice;
  if (price === null || price === undefined || isNaN(price)) return '$0.00';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  } catch (e) {
    return `$${price}`;
  }
};

export const MobileCard = ({ mobile }) => {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  if (!mobile) return null;

  const {
    id,
    brand = 'Smartphone',
    name = 'Flagship Edition',
    price,
    formattedPrice,
    ram,
    storage,
    processor,
    stockStatus = 'IN_STOCK',
  } = mobile;

  // Primary image extractor with mobile bandwidth optimization
  const rawImageUrl =
    mobile.imageUrls?.[0] ||
    mobile.images?.[0]?.imageUrl ||
    mobile.image ||
    null;
  const imageUrl = getOptimizedImageUrl(rawImageUrl, 420);

  const displayPrice = formatPrice(price, formattedPrice);
  const targetUrl = id ? `/mobiles/${id}` : '/mobiles';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between rounded-3xl bg-dark-900/60 hover:bg-dark-900/95 border border-dark-800/80 hover:border-accent-500/40 backdrop-blur-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Ambient Inner Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Media Area */}
      <div className="relative p-4 sm:p-5 pb-0">
        {/* Top Badges Bar */}
        <div className="flex items-center justify-between gap-2 mb-3 z-10 relative">
          <div className="flex items-center gap-2">
            <StockBadge status={stockStatus} />
            <span className="text-[10px] font-bold text-accent-400/90 uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent-500/10 border border-accent-500/20">
              {brand}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CompareAddButton mobile={mobile} size="sm" />
            <WishlistHeartButton mobile={mobile} size="sm" />
          </div>
        </div>

        {/* Product Image Frame (Clickable / Touch-friendly) */}
        <Link
          to={targetUrl}
          state={{ mobile }}
          aria-label={`View details for ${brand} ${name}`}
          className="block relative w-full aspect-[4/3.4] rounded-2xl overflow-hidden bg-dark-950/80 border border-dark-800/60 flex items-center justify-center p-3 cursor-pointer"
        >
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={`${brand} ${name}`}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-600 gap-2">
              <Smartphone className="w-12 h-12 text-neutral-600 group-hover:text-accent-400 transition-colors" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                Flagship Device
              </span>
            </div>
          )}

          {/* Subtle Dark Bottom Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 via-transparent to-transparent pointer-events-none" />
        </Link>
      </div>

      {/* Content & Specs Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-400 block">
            {brand}
          </span>
          <Link
            to={targetUrl}
            state={{ mobile }}
            className="block group-hover:text-accent-300 transition-colors"
          >
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1 line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Specs Micro-Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400">
            {processor && (
              <span className="px-2 py-1 rounded-lg bg-dark-850 border border-dark-800 flex items-center gap-1 text-neutral-300">
                <Cpu className="w-3 h-3 text-accent-400 shrink-0" />
                <span className="truncate max-w-[120px]">{processor}</span>
              </span>
            )}
            {(ram || storage) && (
              <span className="px-2 py-1 rounded-lg bg-dark-850 border border-dark-800 flex items-center gap-1 text-neutral-300">
                <HardDrive className="w-3 h-3 text-accent-400 shrink-0" />
                <span>
                  {ram ? `${ram}` : ''}
                  {ram && storage ? ' • ' : ''}
                  {storage ? `${storage}` : ''}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 border-t border-dark-850/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
              Price
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {displayPrice}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(mobile, 1, true, true);
              }}
              title="Add to Bag"
              aria-label={`Add ${name} to shopping bag`}
              className="p-2 rounded-xl text-neutral-300 hover:text-white bg-dark-800 hover:bg-accent-600 border border-dark-700/80 hover:border-accent-500 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            <Link
              to={targetUrl}
              state={{ mobile }}
              aria-label={`View details for ${name}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-dark-800 hover:bg-accent-600 border border-dark-700/80 hover:border-accent-500 transition-all duration-200 shadow-sm hover:shadow-glow-sm"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileCard;
