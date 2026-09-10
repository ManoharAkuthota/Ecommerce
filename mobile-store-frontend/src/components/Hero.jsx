import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  ChevronDown,
  MessageSquare,
  Cpu,
  Layers,
} from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';

/**
 * Premium Hero Section
 * Two-column layout with staggered text animations, floating smartphone mockup,
 * decorative background gradients, feature highlight cards, and scroll indicator.
 */
const Hero = () => {
  const scrollToContent = () => {
    const nextSection = document.getElementById('features-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      icon: <Truck className="w-4 h-4 text-accent-400" />,
      title: 'Fast Delivery',
      desc: 'Express insured dispatch with white-glove courier handling.',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-accent-400" />,
      title: 'Genuine Warranty',
      desc: '100% authentic devices backed by global manufacturer guarantees.',
    },
    {
      icon: <Tag className="w-4 h-4 text-accent-400" />,
      title: 'Best Prices',
      desc: 'Competitive flagship pricing with verified trade-in values.',
    },
  ];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Decorative Background Lighting & Abstract Shapes */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute -top-32 right-1/4 w-[28rem] sm:w-[42rem] h-[28rem] sm:h-[42rem] bg-accent-500/12 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -left-24 w-80 sm:w-[32rem] h-80 sm:h-[32rem] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/8 rounded-full blur-[140px]" />

        {/* Subtle Background Radial Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 mask-radial" />
      </div>

      <Container size="7xl" className="my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* 1. Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
              className="w-fit"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-bold uppercase tracking-wider shadow-glow-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                <span>Premium Mobile Collection</span>
              </div>
            </motion.div>

            {/* 2. Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-5 text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.1]"
            >
              Experience the{' '}
              <span className="text-gradient-accent">Future</span> of Smartphones
            </motion.h1>

            {/* 3. Subheading / Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
              className="mt-5 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl"
            >
              A premium collection featuring Apple, Samsung, OnePlus, Xiaomi,
              Google Pixel, Nothing, Vivo, Oppo, and Realme.
            </motion.p>

            {/* 4. CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Primary Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.48, ease: 'easeOut' }}
              >
                <Link to="/mobiles">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="shadow-glow-md"
                  >
                    Explore Mobiles
                  </Button>
                </Link>
              </motion.div>

              {/* Secondary Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.58, ease: 'easeOut' }}
              >
                <Link to="/contact">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={<MessageSquare className="w-4 h-4 text-neutral-400" />}
                  >
                    Contact Store
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* 5. Feature Highlights (Three Cards) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.72, ease: 'easeOut' }}
              className="mt-10 pt-8 border-t border-dark-850 grid grid-cols-1 sm:grid-cols-3 gap-3.5"
            >
              {featureCards.map((feat) => (
                <div
                  key={feat.title}
                  className="p-3.5 rounded-2xl bg-dark-900/50 border border-dark-800/80 backdrop-blur-md transition-all duration-300 hover:border-dark-700 hover:bg-dark-900/80"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-dark-850 border border-dark-750 text-accent-400">
                      {feat.icon}
                    </div>
                    <h2 className="text-xs font-bold text-white tracking-wide">
                      {feat.title}
                    </h2>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN (SMARTPHONE SHOWCASE) ================= */}
          <div className="lg:col-span-5 flex items-center justify-center relative mt-6 lg:mt-0">
            {/* 6. Phone Showcase Container (Delay 0.88s) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.88, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-[290px] sm:max-w-[340px] xl:max-w-[370px]"
            >
              {/* Backlight Aura Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-600/30 to-purple-600/30 rounded-[3rem] blur-2xl transform scale-95 pointer-events-none" />

              {/* Floating Framer Motion Device */}
              <motion.div
                animate={{
                  y: [-9, 9, -9],
                  rotate: [-1, 1.4, -1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 select-none"
              >
                {/* Modern Smartphone Mockup Chassis */}
                <div className="relative rounded-[2.8rem] sm:rounded-[3.2rem] p-3 sm:p-3.5 bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-950 border-2 border-neutral-700/60 shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden">
                  {/* Outer Gloss Reflection Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20 rounded-[3rem]" />

                  {/* Speaker Grill & Dynamic Island Cutout */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-5 bg-black rounded-full flex items-center justify-end px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
                  </div>

                  {/* High-Resolution Flagship Screen */}
                  <div className="relative rounded-[2.3rem] sm:rounded-[2.7rem] overflow-hidden aspect-[9/18.5] bg-dark-950 flex flex-col justify-between">
                    <img
                      src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
                      alt="Flagship Smartphone in Titanium Finish"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Overlay for Depth & High-End Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-black/50 pointer-events-none" />

                    {/* On-Screen Status Elements */}
                    <div className="relative z-10 pt-3 px-6 flex justify-between items-center text-[10px] font-bold text-white/90">
                      <span>09:41</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>5G</span>
                      </div>
                    </div>

                    {/* On-Screen Bottom Flagship Widget */}
                    <div className="relative z-10 p-5 space-y-2">
                      <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-accent-400 tracking-wider">
                            Titanium Pro
                          </span>
                          <span className="text-[10px] text-white/75 font-semibold">
                            3.2 GHz
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white mt-0.5">
                          ProMotion 120Hz OLED
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Architectural Badge Chip (Left) */}
                <motion.div
                  animate={{ y: [6, -6, 6] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex absolute -left-8 top-1/4 z-30 p-2.5 rounded-xl bg-dark-900/90 backdrop-blur-xl border border-dark-700 shadow-card items-center gap-2"
                >
                  <div className="p-1.5 rounded-lg bg-accent-600/20 text-accent-400">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white">Silicon A18 / 8 Gen 3</p>
                    <p className="text-[9px] text-neutral-400">3nm Architecture</p>
                  </div>
                </motion.div>

                {/* Floating Camera Optic Badge Chip (Right) */}
                <motion.div
                  animate={{ y: [-7, 7, -7] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex absolute -right-6 bottom-1/4 z-30 p-2.5 rounded-xl bg-dark-900/90 backdrop-blur-xl border border-dark-700 shadow-card items-center gap-2"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white">48MP Periscope</p>
                    <p className="text-[9px] text-neutral-400">5x Optical Zoom</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* ================= SCROLL INDICATOR ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="mt-10 sm:mt-6 flex flex-col items-center justify-center text-center select-none"
      >
        <button
          onClick={scrollToContent}
          type="button"
          aria-label="Scroll to feature details"
          className="group inline-flex flex-col items-center gap-1.5 text-neutral-500 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg p-2"
        >
          {/* Animated Mouse Body with Scrolling Wheel */}
          <div className="w-5 h-8 rounded-full border-2 border-neutral-600 group-hover:border-accent-400 transition-colors p-1 flex justify-center">
            <motion.div
              animate={{
                y: [0, 8, 0],
                opacity: [1, 0.2, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1 h-1.5 bg-accent-400 rounded-full"
            />
          </div>

          {/* Bouncing Chevron Arrow */}
          <motion.div
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ChevronDown className="w-4 h-4 text-neutral-500 group-hover:text-accent-400 transition-colors" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
