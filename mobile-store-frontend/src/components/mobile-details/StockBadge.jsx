/**
 * StockBadge Component
 * Module: components/mobile-details/StockBadge.jsx
 * 
 * Centralized stock status indicator mapping:
 * - IN_STOCK: Emerald (In Stock)
 * - LIMITED_STOCK: Amber (Limited Stock)
 * - OUT_OF_STOCK: Rose (Out of Stock)
 */

import React from 'react';

export const StockBadge = ({ status = 'IN_STOCK', size = 'md', className = '' }) => {
  const statusMap = {
    IN_STOCK: {
      label: 'In Stock',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      dotClass: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    },
    LIMITED_STOCK: {
      label: 'Limited Stock',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    },
    OUT_OF_STOCK: {
      label: 'Out of Stock',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
      dotClass: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    },
  };

  const current = statusMap[status] || statusMap.IN_STOCK;

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[11px]'
      : 'px-3 py-1 text-xs';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide border backdrop-blur-md ${sizeClasses} ${current.badgeClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass} animate-pulse`} />
      <span>{current.label}</span>
    </div>
  );
};

export default StockBadge;
