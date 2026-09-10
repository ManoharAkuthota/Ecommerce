/**
 * Compare Card Component (Mobile & Tablet Viewports)
 * Module: components/compare/CompareCard.jsx
 * 
 * Standalone smartphone card for responsive mobile comparison view:
 * - High-res product thumbnail
 * - Brand pill badge, model title, formatted price
 * - Reusable stock badge
 * - Stacked specs chips (Processor, RAM, Storage, Display, Battery)
 * - Remove action & View Details CTA
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Cpu,
  HardDrive,
  Tv,
  BatteryCharging,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { StockBadge } from '../mobiles/MobileCard';
import CompareRemoveButton from './CompareRemoveButton';

const CompareCard = ({ item }) => {
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
    ram,
    storage,
    processor,
    display,
    battery,
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
    <div className="flex flex-col justify-between w-[280px] sm:w-[320px] shrink-0 rounded-3xl bg-dark-900/80 border border-dark-800 backdrop-blur-xl p-5 shadow-card hover:border-accent-500/30 transition-all duration-300 relative overflow-hidden">
      {/* Top Media & Actions */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold text-accent-400/90 uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent-500/10 border border-accent-500/20">
            {brand}
          </span>
          <CompareRemoveButton mobileId={targetId} mobileName={name} />
        </div>

        {/* Thumbnail Frame */}
        <div className="relative w-full aspect-[4/3.2] rounded-2xl overflow-hidden bg-dark-950/80 border border-dark-850 flex items-center justify-center p-3 mb-4">
          {firstImage && !imageError ? (
            <img
              src={firstImage}
              alt={`${brand} ${name}`}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain object-center"
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

        {/* Name, Stock & Price */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between gap-2">
            <StockBadge status={stockStatus || stock} />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
            {name}
          </h3>
          <div className="text-xl font-black text-white tracking-tight">
            {displayPrice}
          </div>
        </div>

        {/* Specs Table List */}
        <div className="space-y-2.5 pt-3 border-t border-dark-800 text-xs">
          {processor && (
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-dark-850/60 border border-dark-800/60">
              <Cpu className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Processor</span>
                <span className="text-neutral-200 font-semibold truncate block">{processor}</span>
              </div>
            </div>
          )}

          {(ram || storage) && (
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-dark-850/60 border border-dark-800/60">
              <HardDrive className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">RAM & Storage</span>
                <span className="text-neutral-200 font-semibold truncate block">
                  {ram ? `${ram} RAM` : ''}
                  {ram && storage ? ' • ' : ''}
                  {storage ? `${storage}` : ''}
                </span>
              </div>
            </div>
          )}

          {display && (
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-dark-850/60 border border-dark-800/60">
              <Tv className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Display</span>
                <span className="text-neutral-200 font-semibold truncate block">{display}</span>
              </div>
            </div>
          )}

          {battery && (
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-dark-850/60 border border-dark-800/60">
              <BatteryCharging className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Battery</span>
                <span className="text-neutral-200 font-semibold truncate block">{battery}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="mt-5 pt-3 border-t border-dark-800">
        <Link
          to={`/mobiles/${targetId}`}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-dark-800 hover:bg-accent-600 border border-dark-700 hover:border-accent-500 transition-all duration-200"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CompareCard;
