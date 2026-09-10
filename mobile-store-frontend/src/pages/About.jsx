/**
 * About Us Page Component
 * Module: pages/About.jsx
 * Route: /about
 *
 * Luxury brand story and showroom introduction for MS Mobiles:
 * - Brand Story & Heritage (Cyber Hills, Hyderabad flagship showroom)
 * - 4 Pillars: Genuine Stock, Official Warranty, White-glove Concierge, 0% EMI
 * - Showroom Key Performance Stats (15K+ deliveries, 4.98/5 rating)
 * - Interactive CTAs to browse smartphones or contact the store
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Smartphone,
  ShieldCheck,
  Award,
  Truck,
  CreditCard,
  MessageSquare,
  Users,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import Container from '../components/ui/Container';

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const stats = [
    { value: '15,000+', label: 'Flagship Deliveries', sub: 'Across 28 Indian States' },
    { value: '4.98 / 5', label: 'Verified Customer Rating', sub: 'From 2,400+ reviews' },
    { value: '100%', label: 'Certified Genuine Sealed', sub: 'Direct Brand Authorization' },
    { value: '< 24 Hours', label: 'Express Dispatch', sub: 'Insured White-Glove Courier' },
  ];

  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: '100% Sealed Genuine Packaging',
      description:
        'Every device is sourced directly through certified brand channels with untampered manufacturer seals and serial verification before dispatch.',
    },
    {
      icon: <Award className="w-6 h-6 text-accent-400" />,
      title: 'Official 1-Year Brand Warranty',
      description:
        'All purchases include official manufacturer tax-paid GST invoices valid across authorized service centers across India.',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-sky-400" />,
      title: '0% No-Cost EMI & Easy Trade-In',
      description:
        'Instant paperless approval on major credit cards with zero down payment options and competitive old-phone trade-in bonuses.',
    },
    {
      icon: <Truck className="w-6 h-6 text-indigo-400" />,
      title: 'Same-Day Insured Courier Dispatch',
      description:
        'High-security tamper-evident air freight packaging with real-time GPS tracking and OTP verification at handover.',
    },
  ];

  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-dark-950 text-neutral-100 selection:bg-accent-500/30 selection:text-white">
      <SEO
        title="About Us — MS Mobiles Flagship Experience"
        description="Learn about MS Mobiles, India's premier destination for authentic flagship smartphones from Apple, Samsung, OnePlus, Nothing, and Google."
        canonicalUrl="http://localhost:5173/about"
      />

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-1/4 w-[450px] h-[450px] bg-sky-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 py-12 sm:py-20">
        <Container size="7xl">
          {/* Header Badge & Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-400 text-xs font-mono font-bold uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>The MS Mobiles Standard</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
            >
              Redefining Luxury{' '}
              <span className="bg-gradient-to-r from-accent-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                Smartphone Retail
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-neutral-400 text-sm sm:text-base leading-relaxed"
            >
              Born in Hyderabad's Cyber Hills tech corridor, MS Mobiles was built to eliminate counterfeit electronics and grey-market confusion. We provide mobile connoisseurs with certified, sealed flagship smartphones paired with personal store concierge service.
            </motion.p>
          </div>

          {/* Stats Showcase Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20"
          >
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-dark-900/70 border border-dark-800/80 backdrop-blur-xl hover:border-accent-500/30 transition-all duration-300 text-center space-y-1 shadow-xl"
              >
                <div className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-accent-300">
                  {item.label}
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  {item.sub}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Our Showroom & Heritage Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Cyber Hills Flagship Experience Center</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Where Tech Flagships Meet Exceptional Concierge.
              </h2>

              <p className="text-sm text-neutral-300 leading-relaxed">
                At MS Mobiles, we believe buying a ₹1,00,000+ flagship smartphone should feel as premium as the device itself. Our showroom in Cyber Hills, HITEC City Hyderabad features live unboxing lounges, acoustic camera testing booths, and certified device specialists.
              </p>

              <p className="text-sm text-neutral-400 leading-relaxed">
                Whether you order online for nationwide same-day dispatch or visit our retail counter, your device is backed by official brand warranty, tax-paid GST invoices, and our in-house 7-day hassle-free replacement policy.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/mobiles"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs sm:text-sm shadow-glow-sm transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Explore Smartphones</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-neutral-200 hover:text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  <MapPin className="w-4 h-4 text-accent-400" />
                  <span>Visit Showroom</span>
                </Link>
              </div>
            </div>

            {/* Visual Experience Card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-gradient-to-tr from-dark-900 via-dark-850 to-dark-900 border border-dark-750 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-dark-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-600/20 text-accent-400 flex items-center justify-center font-black">
                        MS
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Storefront Concierge Lounge</h3>
                        <p className="text-[11px] text-emerald-400 font-mono">● Showroom Counter Active</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-neutral-500">Est. 2024</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-dark-950/60 border border-dark-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Sealed Manufacturer Stock</span>
                        <span className="text-neutral-400 text-[11px]">Direct brand shipments with tamper-proof security holographic seals.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-dark-950/60 border border-dark-800">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Live Web App Concierge</span>
                        <span className="text-neutral-400 text-[11px]">Instant live chat with store managers — no wait times, no automated runarounds.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-dark-950/60 border border-dark-800">
                      <CheckCircle2 className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Pan-India Insured Dispatch</span>
                        <span className="text-neutral-400 text-[11px]">Express air courier with transit insurance and OTP delivery verification.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-xs text-neutral-400 font-mono">
                    Ground Floor, Cyber Heights, Tech Corridor, HITEC City, Hyderabad - 500081
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="space-y-8 mb-20">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                The 4 Guarantees Every Customer Receives
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
                Built on transparency, certified authenticity, and customer-first service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-dark-900/70 border border-dark-800 backdrop-blur-xl hover:border-accent-500/30 transition-all duration-300 space-y-3"
                >
                  <div className="p-3 rounded-2xl bg-dark-850 border border-dark-750 inline-block shadow-sm">
                    {p.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Call To Action */}
          <div className="rounded-3xl bg-gradient-to-r from-accent-600/20 via-indigo-600/20 to-sky-600/20 border border-accent-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Ready to Experience Flagship Smartphone Retail?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Explore our catalog of Titanium, Ceramic, and Ultra smartphones with same-day dispatch and 0% EMI options.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/mobiles"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm shadow-glow-sm transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Shop Flagship Mobiles</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-dark-900 hover:bg-dark-850 border border-dark-750 text-white font-bold text-sm transition-all"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Contact Store Concierge</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default About;
