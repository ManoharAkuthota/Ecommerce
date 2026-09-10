import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cpu, HardDrive, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

/**
 * Stock Badge Component
 * Distinct, luxury-toned visual styling for In Stock, Limited Stock, and Out of Stock states.
 */
export const StockBadge = ({ status }) => {
  const statusMap = {
    IN_STOCK: {
      label: 'In Stock',
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    LIMITED_STOCK: {
      label: 'Limited Stock',
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dot: 'bg-amber-400',
    },
    OUT_OF_STOCK: {
      label: 'Out of Stock',
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      dot: 'bg-rose-400',
    },
  };

  const current = statusMap[status] || statusMap.IN_STOCK;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md ${current.style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse-subtle`} />
      <span>{current.label}</span>
    </div>
  );
};

/**
 * MobileCard Component
 * Reusable product presentation card with image hover zoom, specs metadata,
 * stock badge, and "View Details" call to action.
 */
const MobileCard = ({ mobile }) => {
  const {
    id,
    brand,
    name,
    formattedPrice,
    ram,
    storage,
    processor,
    stockStatus,
    image,
    badgeText,
  } = mobile;

  // Prepared for future `/mobiles/:id` route, currently linking to `/mobiles`
  const targetUrl = id ? `/mobiles` : '/mobiles';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between rounded-3xl bg-dark-900/50 hover:bg-dark-900/90 border border-dark-800/80 hover:border-accent-500/40 backdrop-blur-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Ambient Inner Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Media Area */}
      <div className="relative p-4 sm:p-5 pb-0">
        {/* Top Badges Bar */}
        <div className="flex items-center justify-between gap-2 mb-3 z-10 relative">
          <StockBadge status={stockStatus} />
          {badgeText && (
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-dark-850/80 border border-dark-750">
              {badgeText}
            </span>
          )}
        </div>

        {/* Product Image Frame */}
        <div className="relative w-full aspect-[4/3.5] rounded-2xl overflow-hidden bg-dark-950/70 border border-dark-800/50 flex items-center justify-center p-2">
          <img
            src={image}
            alt={`${brand} ${name}`}
            loading="lazy"
            className="w-full h-full object-cover object-center rounded-xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Content & Specs Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        {/* Titles and Brand */}
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-accent-400">
            {brand}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 group-hover:text-accent-300 transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Specs Micro-Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400">
            <span className="px-2 py-1 rounded-lg bg-dark-850 border border-dark-800 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-neutral-500" />
              <span className="truncate max-w-[110px]">{processor}</span>
            </span>
            <span className="px-2 py-1 rounded-lg bg-dark-850 border border-dark-800 flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-neutral-500" />
              <span>{ram} / {storage}</span>
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 border-t border-dark-850/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
              Flagship Price
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <Link to={targetUrl} aria-label={`View details for ${name}`}>
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />}
              iconPosition="right"
              className="group/btn text-xs font-bold"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * MobileCardSkeleton Component
 * Reusable loading skeleton placeholder matching MobileCard layout.
 */
export const MobileCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-dark-900/40 border border-dark-800/60 p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-20 h-5 bg-dark-800 rounded-full" />
        <div className="w-24 h-4 bg-dark-800 rounded-md" />
      </div>
      <div className="w-full aspect-[4/3.5] bg-dark-850 rounded-2xl" />
      <div className="space-y-2">
        <div className="w-16 h-3 bg-dark-800 rounded" />
        <div className="w-3/4 h-5 bg-dark-800 rounded" />
        <div className="flex gap-2 mt-2">
          <div className="w-24 h-5 bg-dark-850 rounded-lg" />
          <div className="w-20 h-5 bg-dark-850 rounded-lg" />
        </div>
      </div>
      <div className="pt-4 border-t border-dark-850 flex items-center justify-between">
        <div className="w-16 h-7 bg-dark-800 rounded" />
        <div className="w-24 h-8 bg-dark-850 rounded-xl" />
      </div>
    </div>
  );
};

export default MobileCard;
