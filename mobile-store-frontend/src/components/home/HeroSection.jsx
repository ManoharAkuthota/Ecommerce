/**
 * Flagship Hero Section Component
 * Module: components/home/HeroSection.jsx
 * 
 * Luxury hero banner inspired by Apple, Nothing, and Tesla:
 * - Headline: "Premium Smartphones. Exceptional Experience."
 * - Subheadline: "Discover flagship devices from Apple, Samsung, OnePlus, Nothing, Xiaomi, and more."
 * - CTAs: "Explore Mobiles" (/mobiles) & "Contact Store" (/contact)
 * - Floating glassmorphic smartphone mockups and ambient glow accents
 * - Staggered Framer Motion entrance
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Smartphone,
  Cpu,
  Layers,
  Star,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import CTAButton from './CTAButton';

const FEATURED_SHOWCASE = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    edition: 'Natural Titanium • Grade 5 Frame',
    price: '₹1,44,999',
    emi: 'From ₹6,041/mo (0% EMI)',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    chip: 'Apple A18 Pro (3nm)',
    display: '6.9" 120Hz ProMotion',
    stock: 'In Stock • Ready for Dispatch',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    edition: 'Titanium Black • Built-in S-Pen',
    price: '₹1,34,999',
    emi: 'From ₹5,624/mo (0% EMI)',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    chip: 'Snapdragon 8 Elite (3nm)',
    display: '6.8" 120Hz Dynamic AMOLED',
    stock: 'In Stock • Cyber Hills Showroom',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    name: 'OnePlus 13',
    brand: 'OnePlus',
    edition: 'Midnight Black • Hasselblad Pro',
    price: '₹69,999',
    emi: 'From ₹2,916/mo (0% EMI)',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    chip: 'Snapdragon 8 Elite (3nm)',
    display: '6.82" 2K 120Hz LTPO',
    stock: 'In Stock • Same-Day Dispatch',
  },
];

export const HeroSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FEATURED_SHOWCASE.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentDevice = FEATURED_SHOWCASE[activeIdx];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* 1. Ambient Lighting & Floating Decorative Background Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        {/* Top-Right Primary Indigo Glow */}
        <div className="absolute -top-24 right-1/4 w-[32rem] sm:w-[46rem] h-[32rem] sm:h-[46rem] bg-accent-500/15 rounded-full blur-[140px]" />

        {/* Mid-Left Secondary Violet Glow */}
        <div className="absolute top-1/3 -left-28 w-80 sm:w-[36rem] h-80 sm:h-[36rem] bg-indigo-600/12 rounded-full blur-[130px]" />

        {/* Bottom Ambient Glow */}
        <div className="absolute -bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px]" />

        {/* Radial Matrix Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.9) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* 2. Left Column: Typography, Tagline, & Action Buttons */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-bold tracking-wide uppercase font-mono shadow-glow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-pulse" />
              <span>Next-Generation Flagships • 2026 Collection</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
                Premium Smartphones.
              </h1>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] bg-gradient-to-r from-white via-neutral-200 to-accent-300 bg-clip-text text-transparent">
                Exceptional Experience.
              </h2>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Discover flagship devices from Apple, Samsung, OnePlus, Nothing, Xiaomi, and more. Certified genuine specifications, official global warranties, and white-glove insured delivery.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <CTAButton
                to="/mobiles"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Explore Mobiles
              </CTAButton>

              <CTAButton
                to="/contact"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Contact Store
              </CTAButton>
            </motion.div>

            {/* Quick Guarantees Pill Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-neutral-400 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine Devices & Official Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-accent-400" />
                <span>Express Delivery & Insured Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Transparent Flagship Pricing</span>
              </div>
            </motion.div>
          </div>

          {/* 3. Right Column: Realistic Flagship Showcase Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Behind-Card Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-600/20 via-sky-600/15 to-purple-600/20 rounded-3xl filter blur-3xl -z-10 transform scale-95 pointer-events-none" />

            <div className="relative w-full max-w-sm sm:max-w-md p-6 rounded-3xl bg-dark-900/90 border border-dark-750 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.15)] space-y-5 select-none">
              {/* Interactive Device Selector Tabs */}
              <div className="flex items-center justify-between gap-1.5 p-1 rounded-2xl bg-dark-950/80 border border-dark-800">
                {FEATURED_SHOWCASE.map((dev, idx) => (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all truncate text-center ${
                      activeIdx === idx
                        ? 'bg-accent-600 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-dark-900'
                    }`}
                  >
                    {dev.brand}
                  </button>
                ))}
              </div>

              {/* Top Status & Stock Indicator */}
              <div className="flex items-center justify-between text-xs pb-1 border-b border-dark-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-mono text-[11px] text-emerald-300 font-semibold">{currentDevice.stock}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-300 border border-accent-500/25">
                  1-Year Brand Warranty
                </span>
              </div>

              {/* Realistic High-Res Phone Visual with Smooth Cross-fade */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 border border-dark-800 p-5 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDevice.id}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    {/* Realistic Product Photography Container */}
                    <div className="relative mx-auto w-full h-52 rounded-xl overflow-hidden bg-dark-950 border border-dark-800/80 shadow-inner flex items-center justify-center group">
                      <img
                        src={currentDevice.image}
                        alt={currentDevice.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                          {currentDevice.name}
                        </h3>
                        <span className="text-sm sm:text-base font-black text-accent-400 font-mono">
                          {currentDevice.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{currentDevice.edition}</span>
                        <span className="text-emerald-400 font-semibold font-mono">{currentDevice.emi}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Realistic Hardware Telemetry Chips */}
              <div className="grid grid-cols-2 gap-2.5 text-left text-xs">
                <div className="p-2.5 rounded-2xl bg-dark-950/70 border border-dark-800/80 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono truncate">Processor</span>
                    <span className="text-xs font-bold text-white truncate block">{currentDevice.chip}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-dark-950/70 border border-dark-800/80 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono truncate">Display</span>
                    <span className="text-xs font-bold text-white truncate block">{currentDevice.display}</span>
                  </div>
                </div>
              </div>

              {/* Direct Inspect Button */}
              <Link
                to={`/mobiles/${currentDevice.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-dark-850 hover:bg-accent-600 text-neutral-200 hover:text-white border border-dark-750 hover:border-accent-500 text-xs font-bold transition-all duration-200 shadow-sm group"
              >
                <span>Inspect {currentDevice.name} Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
