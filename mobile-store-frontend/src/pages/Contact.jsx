/**
 * Contact Page Component
 * Module: pages/Contact.jsx
 * 
 * Luxury storefront customer support and concierge experience for MS Mobiles:
 * - Hero: "We're Here to Help" headline & flagship support subheadline
 * - Quick Contact action cards: Call Us, Email Us, Visit Store
 * - Two-column contact layout: ContactForm on left, ContactInfoCard & BusinessHours on right
 * - Business Hours schedule with automated current-day highlighting
 * - Responsive dark Google Maps embed
 * - Live Spring Boot API integration (POST /api/contact)
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Headphones,
  ArrowDown,
} from 'lucide-react';
import {
  ContactForm,
  ContactInfoCard,
  BusinessHours,
  MapSection,
} from '../components/contact';
import SEO from '../components/common/SEO';

export const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const quickActionCards = [
    {
      icon: <MessageSquare className="w-5 h-5 text-cyan-400" />,
      title: 'In-App Live Chat',
      detail: 'Chat with Store Manager',
      action: '/account/inquiries',
      subtext: 'Instant replies in web app • 0 email',
    },
    {
      icon: <Phone className="w-5 h-5 text-accent-400" />,
      title: 'Store Hotline',
      detail: '+91 (800) 456-7890',
      action: 'tel:+918004567890',
      subtext: 'Direct showroom line • Cyber Hills',
    },
    {
      icon: <MapPin className="w-5 h-5 text-emerald-400" />,
      title: 'Visit Flagship Store',
      detail: 'Cyber Hills, Hyderabad',
      action: '#store-location',
      subtext: 'Experience centers & instant pickup',
    },
  ];

  return (
    <div className="relative min-h-screen py-10 sm:py-16 select-none overflow-hidden">
      <SEO
        title="Contact MS Mobiles | Customer Concierge & Support"
        description="Reach out to MS Mobiles customer concierge. Inquire about smartphone availability, flagship experience centers, and warranty support."
      />
      {/* Ambient Lighting Background Accents */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[42rem] h-[26rem] bg-accent-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 -left-28 w-96 h-96 bg-indigo-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/7 rounded-full blur-[150px]" />

        {/* Subtle Matrix Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.9) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-20">
        {/* ================= 1. HERO SECTION ================= */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-mono font-bold uppercase tracking-wide shadow-glow-sm">
            <Headphones className="w-3.5 h-3.5 text-accent-400" />
            <span>Customer Concierge & Support</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            We're Here to Help
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-sans max-w-2xl mx-auto">
            Have questions about smartphones, availability, or our store? Reach out anytime.
          </p>
        </motion.section>

        {/* ================= 2. QUICK CONTACT ACTION CARDS ================= */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {quickActionCards.map((card, idx) => (
            <a
              key={idx}
              href={card.action}
              className="group p-6 sm:p-7 rounded-3xl bg-dark-900/60 hover:bg-dark-900/95 border border-dark-800/80 hover:border-accent-500/50 backdrop-blur-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-dark-850 border border-dark-750 group-hover:border-accent-500/30 group-hover:text-accent-400 transition-colors">
                  {card.icon}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider group-hover:text-accent-400 transition-colors">
                  Direct Link
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-accent-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm font-semibold text-neutral-200 mt-0.5">
                  {card.detail}
                </p>
                <p className="text-xs text-neutral-400 mt-1 font-sans">
                  {card.subtext}
                </p>
              </div>
            </a>
          ))}
        </motion.section>

        {/* ================= 3. MAIN CONTACT SECTION (2 COLUMNS) ================= */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start"
        >
          {/* Left Column: Glassmorphic Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Store Information & Business Hours */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <ContactInfoCard />
            <BusinessHours />
          </div>
        </motion.section>

        {/* ================= 4. GOOGLE MAP SECTION ================= */}
        <motion.section
          id="store-location"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="pt-6 sm:pt-10 scroll-mt-20"
        >
          <MapSection />
        </motion.section>
      </div>
    </div>
  );
};

export default Contact;
