/**
 * BrandMarquee Component
 * Module: components/home/BrandMarquee.jsx
 *
 * Continuous horizontal marquee ticker for world-class smartphone brands:
 * Apple, Samsung, OnePlus, Nothing, Xiaomi, Vivo, Oppo, Realme, Google, Motorola
 * Features:
 * - Smooth GPU-accelerated CSS marquee
 * - Hover pause
 * - Left/right edge gradient fade masks
 * - Brand vector badges with hover glow
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export const BRAND_LIST = [
  {
    id: 'apple',
    name: 'Apple',
    tag: 'iPhone 16 Pro & Max',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170" aria-hidden="true">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.78-11.48-20.87-15.19-33.27-3.71-12.4-5.56-23.77-5.56-34.13 0-14.13 3.65-25.79 10.96-34.99 7.31-9.2 16.42-13.91 27.34-14.13 4.13 0 9.07 1.15 14.82 3.44 5.76 2.29 9.38 3.49 10.88 3.59 1.85-.22 5.76-1.54 11.75-3.99 5.98-2.45 11.1-3.53 15.36-3.26 12.83.65 22.84 5.38 30.03 14.2-11.31 6.85-16.86 16.3-16.64 28.36.22 9.57 3.86 17.56 10.93 23.97 7.07 6.42 15.5 10.06 25.3 10.93-2.17 6.74-4.83 13.52-7.98 20.35zM119.22 33.64c0-7.39 2.66-14.19 7.98-20.39 5.33-6.2 11.85-10.23 19.57-12.1 1.09 7.18-.76 13.97-5.56 20.39-4.8 6.42-11.15 10.74-19.06 12.98-.76-.29-1.74-.58-2.93-.88z" />
      </svg>
    ),
  },
  {
    id: 'samsung',
    name: 'Samsung',
    tag: 'Galaxy S25 Ultra',
    icon: (
      <svg className="w-14 h-4 fill-current" viewBox="0 0 100 24" aria-hidden="true">
        <path d="M7.5 18c-3.5 0-5.5-1.7-5.5-4.5 0-4 6.5-4.2 9-5.3 1.2-.5 2-1.2 2-2.2 0-1.5-1.5-2.2-3.5-2.2-2.3 0-4 1-4.8 2.5L2 4.8C3.5 2.5 6 1.5 9.5 1.5c4.5 0 6.8 2 6.8 4.8 0 4.2-6.5 4.5-9 5.5-1.2.5-2 1.2-2 2.2 0 1.5 1.8 2.2 4 2.2 2.5 0 4.5-1.2 5.5-3l2.8 1.5C25.5 17 23 18 20 18h-12.5zm16-16.2h3.5l5.5 16h-3.5l-1-3.2h-5.5l-1 3.2h-3.5l5.5-16zm3.5 10.2l-1.8-5.8-1.8 5.8h3.6zm10.5-10.2h4l4.5 10 4.5-10h4v16h-3.2v-11l-4.2 9.5h-2.2l-4.2-9.5v11h-3.2v-16zm23 0h3.5v11.5c0 3-1.8 4.8-5 4.8s-5-1.8-5-4.8V1.8h3.5v11.2c0 1.5.8 2.2 2 2.2s2-.7 2-2.2V1.8zm11 0h3.2l7.5 10.8V1.8h3.2v16h-3.2l-7.5-10.8v10.8h-3.2v-16zm19.5 16.2c-4.5 0-7.8-3.5-7.8-8.2s3.2-8.2 7.8-8.2c3.5 0 6 1.8 7 4.2l-3 1.5c-.8-1.5-2-2.5-4-2.5-2.5 0-4.2 2.2-4.2 5s1.8 5 4.2 5c2 0 3.2-1 4-2.2v-1.5h-4v-3h7.2v6.5c-1.5 2-3.8 3.4-7.2 3.4z" />
      </svg>
    ),
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    tag: 'Never Settle',
    icon: (
      <svg className="w-5 h-5 fill-current text-rose-500" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M12 7v10M9.5 9.5l2.5-2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17.5 10v4M15.5 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'nothing',
    name: 'Nothing',
    tag: 'Phone (3) Flagship',
    icon: (
      <div className="flex items-center gap-1 font-mono tracking-widest text-xs font-black uppercase text-white select-none">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span>(NOTHING)</span>
      </div>
    ),
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    tag: 'Leica Master Optics',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#ff6700]" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="currentColor" />
        <path d="M6 8h3.2v8H6V8zm5.2 0h3.5c1.8 0 3.1 1.2 3.1 3v5h-3.2v-4.5c0-.6-.4-1-1-1h-2.4V16h-3.2V8z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'google',
    name: 'Google Pixel',
    tag: 'Tensor G4 & Gemini AI',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    id: 'vivo',
    name: 'Vivo',
    tag: 'ZEISS Co-Engineered',
    icon: (
      <svg className="w-12 h-4 fill-current text-[#415fff]" viewBox="0 0 80 24" aria-hidden="true">
        <path d="M8.5 2.5L14 17.5 19.5 2.5h5L16.2 21.5h-4.4L4 2.5h4.5zm22 0v19h-4.5V2.5h4.5zm11 0L47 17.5 52.5 2.5h5L49.2 21.5h-4.4L37 2.5h4.5zm25 0c5.5 0 9.5 4.2 9.5 9.5s-4 9.5-9.5 9.5-9.5-4.2-9.5-9.5 4-9.5 9.5-9.5zm0 15c3 0 5-2.5 5-5.5s-2-5.5-5-5.5-5 2.5-5 5.5 2 5.5 5 5.5z" />
      </svg>
    ),
  },
  {
    id: 'oppo',
    name: 'Oppo',
    tag: 'Hasselblad Portrait',
    icon: (
      <svg className="w-12 h-4 fill-current text-[#048259]" viewBox="0 0 90 24" aria-hidden="true">
        <path d="M14 2c6.6 0 12 4.5 12 10s-5.4 10-12 10S2 17.5 2 12 7.4 2 14 2zm0 16c4 0 7.5-2.7 7.5-6s-3.5-6-7.5-6-7.5 2.7-7.5 6 3.5 6 7.5 6zm20-15.5h8.5c5.5 0 9 3.5 9 8s-3.5 8-9 8H38v7h-4V2.5zm4 12h4.5c3 0 5-1.8 5-4.2s-2-4.2-5-4.2H38v8.4zm23-12h8.5c5.5 0 9 3.5 9 8s-3.5 8-9 8H65v7h-4V2.5zm4 12h4.5c3 0 5-1.8 5-4.2s-2-4.2-5-4.2H65v8.4zm24-12.5c6.6 0 12 4.5 12 10s-5.4 10-12 10-12-4.5-12-10 5.4-10 12-10zm0 16c4 0 7.5-2.7 7.5-6s-3.5-6-7.5-6-7.5 2.7-7.5 6 3.5 6 7.5 6z" />
      </svg>
    ),
  },
  {
    id: 'realme',
    name: 'Realme',
    tag: 'GT Ultra Series',
    icon: (
      <div className="font-sans font-black text-sm tracking-tight text-[#ffc915] select-none lowercase">
        <span className="text-sm font-extrabold tracking-tighter">realme</span>
      </div>
    ),
  },
  {
    id: 'motorola',
    name: 'Motorola',
    tag: 'Razr Fold & Edge',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#0072ce]" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#001428" stroke="#0072ce" strokeWidth="1.2" />
        <path d="M5.5 15.5c1.8-6.2 3.5-9 4.8-9 1.4 0 2.2 3.2 2.8 5.5.6-2.3 1.4-5.5 2.8-5.5 1.3 0 3 2.8 4.8 9-1.8-.8-3.4-1.2-4.6-1.2-1.2 0-2.2 1.6-3 3.8-.8-2.2-1.8-3.8-3-3.8-1.2 0-2.8.4-4.6 1.2z" fill="#ffffff" />
      </svg>
    ),
  },
];

export const BrandMarquee = () => {
  // Triple items array for flawless continuous loop across any ultrawide monitor
  const marqueeItems = [...BRAND_LIST, ...BRAND_LIST, ...BRAND_LIST];

  return (
    <section className="relative w-full py-12 sm:py-16 overflow-hidden border-y border-dark-850 bg-dark-950/70 select-none backdrop-blur-md">
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[14rem] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Subtle Section Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          Official Global Retailer • Authorized Flagship Partners
        </p>
      </div>

      {/* Marquee viewport container */}
      <div className="relative w-full overflow-hidden">
        {/* Left Edge Fog Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-dark-950 via-dark-950/85 to-transparent z-20" />

        {/* Right Edge Fog Gradient Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-dark-950 via-dark-950/85 to-transparent z-20" />

        {/* Seamless Infinite Scrolling Track */}
        <div className="flex w-max gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] py-2 px-4">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="group relative flex items-center gap-3.5 px-5 py-3 rounded-xl bg-dark-900/60 hover:bg-dark-900 border border-dark-800 hover:border-accent-500/50 backdrop-blur-xl shadow-card hover:shadow-card-hover hover:scale-[1.03] transition-all duration-300 cursor-pointer shrink-0 select-none min-w-[190px] sm:min-w-[210px]"
            >
              {/* Brand Logo Container */}
              <div className="p-2 rounded-lg bg-dark-850 border border-dark-750 text-white group-hover:border-accent-500/30 group-hover:text-accent-400 transition-colors shrink-0 shadow-inner">
                {brand.icon}
              </div>

              {/* Brand Name & Series Tag */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-white group-hover:text-accent-300 transition-colors">
                    {brand.name}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500 opacity-0 group-hover:opacity-100 group-hover:text-accent-400 transition-opacity" />
                </div>
                <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  {brand.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandMarquee;
