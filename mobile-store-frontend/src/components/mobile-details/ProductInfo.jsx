/**
 * ProductInfo Component
 * Module: components/mobile-details/ProductInfo.jsx
 * 
 * Right-column flagship device specifications and store concierge actions:
 * - Brand pill badge, product name, formatted price
 * - Quick specs metadata chips (RAM, Storage, Processor, Display, Battery)
 * - Stock availability badge
 * - Trust guarantee badges (Official Warranty, Express Shipping, Genuine Sealed)
 * - Primary CTA: "Contact Store" linking to /contact
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  HardDrive,
  Tv,
  BatteryCharging,
  ShieldCheck,
  Truck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  Plus,
  Minus,
  Zap,
} from 'lucide-react';
import StockBadge from './StockBadge';
import WishlistHeartButton from '../wishlist/WishlistHeartButton';
import CompareAddButton from '../compare/CompareAddButton';
import { useCart } from '../../hooks/useCart';

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

export const ProductInfo = ({ mobile, className = '' }) => {
  if (!mobile) return null;

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const {
    brand = 'Flagship',
    name = 'Smartphone Edition',
    price,
    formattedPrice,
    ram,
    storage,
    processor,
    display,
    battery,
    stockStatus = 'IN_STOCK',
  } = mobile;

  const displayPrice = formatPrice(price, formattedPrice);
  const isOutOfStock = stockStatus === 'OUT_OF_STOCK';

  const handleAddToCart = () => {
    addToCart(mobile, quantity, true, true);
  };

  const handleBuyNow = () => {
    addToCart(mobile, quantity, false, false);
    navigate('/checkout');
  };

  return (
    <div className={`space-y-6 sm:space-y-8 ${className}`}>
      {/* 1. Brand & Stock Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-accent-400" />
          <span>{brand}</span>
        </span>

        <StockBadge status={stockStatus} />
      </div>

      {/* 2. Title & Headline Price */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {name}
          </h1>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <CompareAddButton mobile={mobile} size="lg" />
            <WishlistHeartButton mobile={mobile} size="lg" />
          </div>
        </div>

        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {displayPrice}
          </span>
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Verified Store Price
          </span>
        </div>
      </div>

      {/* 3. Key Specifications Chips */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {ram && (
          <div className="p-3.5 rounded-2xl bg-dark-900/60 border border-dark-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-dark-850 text-accent-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">RAM</span>
              <span className="text-xs font-bold text-white">{ram}</span>
            </div>
          </div>
        )}

        {storage && (
          <div className="p-3.5 rounded-2xl bg-dark-900/60 border border-dark-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-dark-850 text-accent-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Storage</span>
              <span className="text-xs font-bold text-white">{storage}</span>
            </div>
          </div>
        )}

        {processor && (
          <div className="p-3.5 rounded-2xl bg-dark-900/60 border border-dark-800/80 flex items-center gap-3 col-span-2">
            <div className="p-2 rounded-xl bg-dark-850 text-accent-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Processor</span>
              <span className="text-xs font-bold text-white truncate block">{processor}</span>
            </div>
          </div>
        )}

        {display && (
          <div className="p-3.5 rounded-2xl bg-dark-900/60 border border-dark-800/80 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="p-2 rounded-xl bg-dark-850 text-purple-400 shrink-0">
              <Tv className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Display</span>
              <span className="text-xs font-bold text-white truncate block">{display}</span>
            </div>
          </div>
        )}

        {battery && (
          <div className="p-3.5 rounded-2xl bg-dark-900/60 border border-dark-800/80 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="p-2 rounded-xl bg-dark-850 text-emerald-400 shrink-0">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Battery</span>
              <span className="text-xs font-bold text-white truncate block">{battery}</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Action CTAs: Quantity, Add to Cart, Buy Now, Contact */}
      <div className="pt-2 space-y-3">
        {!isOutOfStock ? (
          <>
            {/* Quantity Selector & Add to Cart Row */}
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center bg-dark-900 border border-dark-700/80 rounded-2xl p-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-dark-850 hover:bg-dark-800 border border-dark-700 text-white text-sm font-bold transition-all duration-200 hover:border-accent-500/60"
              >
                <ShoppingBag className="w-4 h-4 text-accent-400" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Buy Now Primary CTA */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-accent-600 hover:bg-accent-500 text-white text-sm font-bold shadow-glow-sm hover:shadow-glow-md transition-all duration-200 hover:scale-[1.01]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now (Express Checkout)</span>
            </button>
          </>
        ) : (
          <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 text-center">
            <span className="text-xs text-rose-400 font-bold block mb-1">
              Currently Out of Stock
            </span>
            <p className="text-[11px] text-neutral-400">
              This flagship device is awaiting restock. Inquire with store team below.
            </p>
          </div>
        )}

        {/* Secondary Contact Concierge Link */}
        <Link
          to="/contact"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Have questions? Inquire with Store Concierge</span>
        </Link>
      </div>

      {/* 5. Trust Guarantees */}
      <div className="p-4 rounded-2xl bg-dark-900/40 border border-dark-800/60 space-y-2.5 text-xs text-neutral-400">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="text-neutral-300">100% Genuine Sealed Box with Global Warranty</span>
        </div>
        <div className="flex items-center gap-2 text-accent-400">
          <Truck className="w-4 h-4 shrink-0" />
          <span className="text-neutral-300">Express Insured Dispatch with White-Glove Handling</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
