/**
 * Reusable Mobile Status Badge Component
 * Module: components/admin/MobileStatusBadge.jsx
 * 
 * Supports both Stock Status and Visibility Status with luxury badges:
 * - Stock: IN_STOCK (Emerald), LIMITED_STOCK (Amber), OUT_OF_STOCK (Rose)
 * - Visibility: Visible (Indigo/Cyan with Eye), Hidden (Slate with EyeOff)
 */

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const STOCK_CONFIG = {
  IN_STOCK: {
    label: 'In Stock',
    pillClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    dotClass: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
  },
  LIMITED_STOCK: {
    label: 'Limited Stock',
    pillClass: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
  },
  OUT_OF_STOCK: {
    label: 'Out of Stock',
    pillClass: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    dotClass: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
  },
};

const VISIBILITY_CONFIG = {
  visible: {
    label: 'Visible',
    icon: Eye,
    pillClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    dotClass: 'bg-indigo-400',
  },
  hidden: {
    label: 'Hidden',
    icon: EyeOff,
    pillClass: 'bg-dark-800/80 text-neutral-400 border-dark-700/60',
    dotClass: 'bg-neutral-500',
  },
};

export const MobileStatusBadge = ({
  type = 'stock',
  status,
  hidden,
  className = '',
}) => {
  if (type === 'stock') {
    const normalized = (status || 'IN_STOCK').toString().toUpperCase().replace(/[-\s]/g, '_');
    const config = STOCK_CONFIG[normalized] || STOCK_CONFIG.IN_STOCK;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm tracking-wide ${config.pillClass} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        <span>{config.label}</span>
      </span>
    );
  }

  if (type === 'visibility') {
    const isHidden = Boolean(hidden);
    const config = isHidden ? VISIBILITY_CONFIG.hidden : VISIBILITY_CONFIG.visible;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm tracking-wide ${config.pillClass} ${className}`}
      >
        <IconComponent className="w-3 h-3 flex-shrink-0" />
        <span>{config.label}</span>
      </span>
    );
  }

  return null;
};

export default MobileStatusBadge;
