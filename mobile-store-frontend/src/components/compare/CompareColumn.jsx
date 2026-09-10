/**
 * Compare Column Header Component
 * Module: components/compare/CompareColumn.jsx
 * 
 * Renders the top product card for an individual smartphone in the desktop comparison table:
 * - High-res product thumbnail
 * - Brand badge, title, formatted price
 * - Reusable stock badge
 * - Remove action & View Details CTA
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Trash2 } from 'lucide-react';
import { StockBadge } from '../mobiles/MobileCard';
import CompareRemoveButton from './CompareRemoveButton';

const CompareColumn = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const {
    mobileId,
    id,
    name = 'Smartphone',
    brand = 'Flagship',
    price = 0,
    formattedPrice,
    firstImage,
    stock = 'IN_STOCK',
    stockStatus = 'IN_STOCK',
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
    <div className="flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-dark-900/80 border border-dark-800 backdrop-blur-xl relative overflow-hidden group">
      {/* Top Remove Action */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-bold text-accent-400/90 uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent-500/10 border border-accent-500/20">
          {brand}
        </span>
        <CompareRemoveButton mobileId={targetId} mobileName={name} />
      </div>

      {/* Product Image Frame */}
      <div className="relative w-full aspect-square max-h-48 rounded-2xl overflow-hidden bg-dark-950/80 border border-dark-850 flex items-center justify-center p-3 mb-4">
        {firstImage && !imageError ? (
          <img
            src={firstImage}
            alt={`${brand} ${name}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-600 gap-2">
            <Smartphone className="w-10 h-10 text-neutral-600" />
            <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500">
              Flagship
            </span>
          </div>
        )}
      </div>

      {/* Title, Stock & Price */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <StockBadge status={stockStatus || stock} />
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-accent-300 transition-colors">
          {name}
        </h3>

        <div className="text-lg sm:text-xl font-black text-white tracking-tight">
          {displayPrice}
        </div>
      </div>

      {/* View Details Link */}
      <div className="mt-4 pt-3 border-t border-dark-800">
        <Link
          to={`/mobiles/${targetId}`}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-dark-800 hover:bg-accent-600 border border-dark-700/80 hover:border-accent-500 transition-all duration-200"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CompareColumn;
