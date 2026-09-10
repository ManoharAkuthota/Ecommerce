import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import Container from './ui/Container';

/**
 * High-quality vector SVG Brand Marks for all 12 flagship smartphone manufacturers.
 */
const BrandLogos = {
  Apple: () => (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170" aria-hidden="true">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.78-11.48-20.87-15.19-33.27-3.71-12.4-5.56-23.77-5.56-34.13 0-14.13 3.65-25.79 10.96-34.99 7.31-9.2 16.42-13.91 27.34-14.13 4.13 0 9.07 1.15 14.82 3.44 5.76 2.29 9.38 3.49 10.88 3.59 1.85-.22 5.76-1.54 11.75-3.99 5.98-2.45 11.1-3.53 15.36-3.26 12.83.65 22.84 5.38 30.03 14.2-11.31 6.85-16.86 16.3-16.64 28.36.22 9.57 3.86 17.56 10.93 23.97 7.07 6.42 15.5 10.06 25.3 10.93-2.17 6.74-4.83 13.52-7.98 20.35zM119.22 33.64c0-7.39 2.66-14.19 7.98-20.39 5.33-6.2 11.85-10.23 19.57-12.1 1.09 7.18-.76 13.97-5.56 20.39-4.8 6.42-11.15 10.74-19.06 12.98-.76-.29-1.74-.58-2.93-.88z" />
    </svg>
  ),
  Samsung: () => (
    <svg className="w-16 h-5 fill-current" viewBox="0 0 100 24" aria-hidden="true">
      <path d="M7.5 18c-3.5 0-5.5-1.7-5.5-4.5 0-4 6.5-4.2 9-5.3 1.2-.5 2-1.2 2-2.2 0-1.5-1.5-2.2-3.5-2.2-2.3 0-4 1-4.8 2.5L2 4.8C3.5 2.5 6 1.5 9.5 1.5c4.5 0 6.8 2 6.8 4.8 0 4.2-6.5 4.5-9 5.5-1.2.5-2 1.2-2 2.2 0 1.5 1.8 2.2 4 2.2 2.5 0 4.5-1.2 5.5-3l2.8 1.5C25.5 17 23 18 20 18h-12.5zm16-16.2h3.5l5.5 16h-3.5l-1-3.2h-5.5l-1 3.2h-3.5l5.5-16zm3.5 10.2l-1.8-5.8-1.8 5.8h3.6zm10.5-10.2h4l4.5 10 4.5-10h4v16h-3.2v-11l-4.2 9.5h-2.2l-4.2-9.5v11h-3.2v-16zm23 0h3.5v11.5c0 3-1.8 4.8-5 4.8s-5-1.8-5-4.8V1.8h3.5v11.2c0 1.5.8 2.2 2 2.2s2-.7 2-2.2V1.8zm11 0h3.2l7.5 10.8V1.8h3.2v16h-3.2l-7.5-10.8v10.8h-3.2v-16zm19.5 16.2c-4.5 0-7.8-3.5-7.8-8.2s3.2-8.2 7.8-8.2c3.5 0 6 1.8 7 4.2l-3 1.5c-.8-1.5-2-2.5-4-2.5-2.5 0-4.2 2.2-4.2 5s1.8 5 4.2 5c2 0 3.2-1 4-2.2v-1.5h-4v-3h7.2v6.5c-1.5 2-3.8 3.4-7.2 3.4z" />
    </svg>
  ),
  OnePlus: () => (
    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 7v10M9.5 9.5l2.5-2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17.5 10v4M15.5 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Xiaomi: () => (
    <svg className="w-6 h-6 fill-current text-[#ff6700]" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="currentColor" />
      <path d="M6 8h3.2v8H6V8zm5.2 0h3.5c1.8 0 3.1 1.2 3.1 3v5h-3.2v-4.5c0-.6-.4-1-1-1h-2.4V16h-3.2V8z" fill="#ffffff" />
    </svg>
  ),
  GooglePixel: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  ),
  Nothing: () => (
    <div className="flex items-center gap-1 font-mono tracking-widest text-sm font-black uppercase text-white select-none">
      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse-subtle" />
      <span>(NOTHING)</span>
    </div>
  ),
  Vivo: () => (
    <svg className="w-14 h-5 fill-current text-[#415fff]" viewBox="0 0 80 24" aria-hidden="true">
      <path d="M8.5 2.5L14 17.5 19.5 2.5h5L16.2 21.5h-4.4L4 2.5h4.5zm22 0v19h-4.5V2.5h4.5zm11 0L47 17.5 52.5 2.5h5L49.2 21.5h-4.4L37 2.5h4.5zm25 0c5.5 0 9.5 4.2 9.5 9.5s-4 9.5-9.5 9.5-9.5-4.2-9.5-9.5 4-9.5 9.5-9.5zm0 15c3 0 5-2.5 5-5.5s-2-5.5-5-5.5-5 2.5-5 5.5 2 5.5 5 5.5z" />
    </svg>
  ),
  Oppo: () => (
    <svg className="w-16 h-5 fill-current text-[#048259]" viewBox="0 0 90 24" aria-hidden="true">
      <path d="M14 2c6.6 0 12 4.5 12 10s-5.4 10-12 10S2 17.5 2 12 7.4 2 14 2zm0 16c4 0 7.5-2.7 7.5-6s-3.5-6-7.5-6-7.5 2.7-7.5 6 3.5 6 7.5 6zm20-15.5h8.5c5.5 0 9 3.5 9 8s-3.5 8-9 8H38v7h-4V2.5zm4 12h4.5c3 0 5-1.8 5-4.2s-2-4.2-5-4.2H38v8.4zm23-12h8.5c5.5 0 9 3.5 9 8s-3.5 8-9 8H65v7h-4V2.5zm4 12h4.5c3 0 5-1.8 5-4.2s-2-4.2-5-4.2H65v8.4zm24-12.5c6.6 0 12 4.5 12 10s-5.4 10-12 10-12-4.5-12-10 5.4-10 12-10zm0 16c4 0 7.5-2.7 7.5-6s-3.5-6-7.5-6-7.5 2.7-7.5 6 3.5 6 7.5 6z" />
    </svg>
  ),
  Realme: () => (
    <div className="flex items-center gap-1 font-sans font-black text-sm tracking-tight text-[#ffc915] select-none lowercase">
      <span className="text-base font-extrabold tracking-tighter">realme</span>
    </div>
  ),
  Motorola: () => (
    <svg className="w-6 h-6 fill-current text-[#001428]" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#001428" stroke="#0072ce" strokeWidth="1.2" />
      <path d="M5.5 15.5c1.8-6.2 3.5-9 4.8-9 1.4 0 2.2 3.2 2.8 5.5.6-2.3 1.4-5.5 2.8-5.5 1.3 0 3 2.8 4.8 9-1.8-.8-3.4-1.2-4.6-1.2-1.2 0-2.2 1.6-3 3.8-.8-2.2-1.8-3.8-3-3.8-1.2 0-2.8.4-4.6 1.2z" fill="#ffffff" />
    </svg>
  ),
  IQOO: () => (
    <div className="flex items-center gap-0.5 font-sans font-black text-sm tracking-tight select-none italic">
      <span className="text-white">iQ</span>
      <span className="text-[#ff9900]">OO</span>
    </div>
  ),
  Poco: () => (
    <div className="flex items-center px-2 py-0.5 rounded bg-[#ffd400] text-black font-black text-xs tracking-wider select-none uppercase">
      POCO
    </div>
  ),
};

const BRANDS = [
  { id: 'apple', name: 'Apple', tag: 'A18 Pro Silicon', Logo: BrandLogos.Apple },
  { id: 'samsung', name: 'Samsung', tag: 'Galaxy AI Flagships', Logo: BrandLogos.Samsung },
  { id: 'oneplus', name: 'OnePlus', tag: 'Never Settle', Logo: BrandLogos.OnePlus },
  { id: 'xiaomi', name: 'Xiaomi', tag: 'Leica Master Optics', Logo: BrandLogos.Xiaomi },
  { id: 'google', name: 'Google Pixel', tag: 'Tensor G4 Intelligence', Logo: BrandLogos.GooglePixel },
  { id: 'nothing', name: 'Nothing', tag: 'Glyph Architecture', Logo: BrandLogos.Nothing },
  { id: 'vivo', name: 'Vivo', tag: 'Zeiss Co-Engineered', Logo: BrandLogos.Vivo },
  { id: 'oppo', name: 'Oppo', tag: 'Hasselblad Camera', Logo: BrandLogos.Oppo },
  { id: 'realme', name: 'Realme', tag: 'Speed Edition', Logo: BrandLogos.Realme },
  { id: 'motorola', name: 'Motorola', tag: 'Razr Fold & Edge', Logo: BrandLogos.Motorola },
  { id: 'iqoo', name: 'iQOO', tag: 'Monster Performance', Logo: BrandLogos.IQOO },
  { id: 'poco', name: 'Poco', tag: 'Mad Flagship Killers', Logo: BrandLogos.Poco },
];

/**
 * Premium Infinite Brand Marquee Component
 * Continuous GPU-accelerated horizontal brand carousel with pause-on-hover,
 * edge gradient fades, and staggered entry animations.
 */
const BrandMarquee = () => {
  // Duplicate array for true seamless looping without gaps
  const marqueeItems = [...BRANDS, ...BRANDS];

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden border-t border-b border-dark-850 bg-dark-950/60 select-none">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[18rem] bg-accent-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Container with Staggered Entrance */}
      <Container size="7xl" className="mb-10 sm:mb-14 text-center">
        {/* 1. Small Premium Label */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-glow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          <span>Available Brands</span>
        </motion.div>

        {/* 2. Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
        >
          Shop the World's Top Smartphone Brands
        </motion.h2>

        {/* 3. Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mt-3.5 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          Browse premium smartphones from globally trusted brands with the latest technology, official warranty, and competitive pricing.
        </motion.p>
      </Container>

      {/* 4. Marquee Container with Left & Right Gradient Fade Masks */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="relative w-full overflow-hidden"
      >
        {/* Left Edge Fog Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent z-20" />

        {/* Right Edge Fog Gradient Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-dark-950 via-dark-950/80 to-transparent z-20" />

        {/* Seamless Infinite Scrolling Track */}
        <div className="flex w-max gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] py-3 px-4">
          {marqueeItems.map((brand, idx) => {
            const LogoComponent = brand.Logo;
            return (
              <div
                key={`${brand.id}-${idx}`}
                className="group relative flex items-center gap-4 px-5 sm:px-6 py-4 rounded-2xl bg-dark-900/50 hover:bg-dark-900/90 border border-dark-800/80 hover:border-accent-500/50 backdrop-blur-xl shadow-card hover:shadow-card-hover hover:scale-105 transition-all duration-300 cursor-pointer shrink-0 select-none min-w-[180px] sm:min-w-[220px]"
              >
                {/* Brand Logo Container */}
                <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750 text-white group-hover:border-accent-500/30 group-hover:text-accent-400 transition-colors shrink-0 shadow-sm">
                  <LogoComponent />
                </div>

                {/* Brand Name & Series Tag */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-white group-hover:text-accent-300 transition-colors">
                      {brand.name}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 group-hover:text-accent-400 transition-all duration-200" />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    {brand.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default BrandMarquee;
