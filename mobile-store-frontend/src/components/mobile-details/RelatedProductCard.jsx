/**
 * RelatedProductCard Component
 * Module: components/mobile-details/RelatedProductCard.jsx
 * 
 * Reusable luxury product card for related smartphone recommendations:
 * - Primary Cloudinary / Web image with hover zoom
 * - Brand pill, model name, formatted price
 * - Stock badge mapping
 * - Smooth navigation to /mobiles/:id
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smartphone, ArrowRight } from 'lucide-react';
import StockBadge from './StockBadge';
import { formatPrice } from './ProductInfo';

export const RelatedProductCard = ({ mobile }) => {
  const [imageError, setImageError] = useState(false);

  if (!mobile) return null;

  const {
    id,
    brand = 'Smartphone',
    name = 'Flagship Edition',
    price,
    formattedPrice,
    stockStatus = 'IN_STOCK',
  } = mobile;

  const imageUrl =
    mobile.imageUrls?.[0] ||
    mobile.images?.[0]?.imageUrl ||
    mobile.image ||
    null;

  const displayPrice = formatPrice(price, formattedPrice);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between rounded-3xl bg-dark-900/60 hover:bg-dark-900/95 border border-dark-800/80 hover:border-accent-500/40 backdrop-blur-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Top Media Frame */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <StockBadge status={stockStatus} size="sm" />
          <span className="text-[10px] font-bold text-accent-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent-500/10 border border-accent-500/20">
            {brand}
          </span>
        </div>

        <div className="relative w-full aspect-[4/3.2] rounded-2xl overflow-hidden bg-dark-950/80 border border-dark-800/60 flex items-center justify-center p-3">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={`${brand} ${name}`}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <Smartphone className="w-12 h-12 text-neutral-600 group-hover:text-accent-400 transition-colors" />
          )}
        </div>
      </div>

      {/* Content & Action */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-400 block">
            {brand}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5 group-hover:text-accent-300 transition-colors line-clamp-1">
            {name}
          </h3>
        </div>

        <div className="pt-3 border-t border-dark-850 flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {displayPrice}
          </span>

          <Link
            to={`/mobiles/${id}`}
            aria-label={`View details for ${name}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-dark-800 hover:bg-accent-600 border border-dark-700/80 hover:border-accent-500 transition-all duration-200"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RelatedProductCard;
