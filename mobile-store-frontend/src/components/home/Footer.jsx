/**
 * Luxury Footer Component
 * Module: components/home/Footer.jsx
 *
 * Enterprise four-section footer for MS Mobiles:
 * 1. Company: About MS Mobiles, Mobiles Catalog (/mobiles), Contact Concierge (/contact)
 * 2. Brands: Apple, Samsung, OnePlus, Nothing
 * 3. Contact: Store Address, Customer Phone, Concierge Email
 * 4. Bottom: Copyright © 2026 MS Mobiles, Legal, and Admin Portal link
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Lock,
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Explore Mobiles', to: '/mobiles' },
    { label: 'Track Order', to: '/track' },
    { label: 'Contact Concierge', to: '/contact' },
    { label: 'Verified Reviews', to: '/#customer-reviews-section' },
  ];

  const brandLinks = [
    { name: 'Apple', tag: 'iPhone 16 Pro & Max', to: '/mobiles' },
    { name: 'Samsung', tag: 'Galaxy S25 Ultra', to: '/mobiles' },
    { name: 'OnePlus', tag: 'OnePlus 13 Series', to: '/mobiles' },
    { name: 'Nothing', tag: 'Nothing Phone (2) & (3)', to: '/mobiles' },
  ];

  return (
    <footer className="relative bg-dark-950 border-t border-dark-850 text-neutral-400 text-sm overflow-hidden select-none">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[48rem] h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-accent-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Multi-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-600 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-accent-300 transition-colors">
                MS <span className="text-accent-400">Mobiles</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans pr-2">
              Premier destination for authentic flagship smartphones. Authorized partner for Apple, Samsung, OnePlus, and Nothing with nationwide insured delivery.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Certified Genuine Guarantee</span>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-600 opacity-0 group-hover:opacity-100 group-hover:text-accent-400 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Flagship Brands */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Brands
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {brandLinks.map((brand, idx) => (
                <li key={idx}>
                  <Link
                    to={brand.to}
                    className="hover:text-white transition-colors flex items-center justify-between group py-0.5"
                  >
                    <span className="group-hover:text-accent-300 transition-colors">
                      {brand.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono group-hover:text-neutral-400">
                      {brand.tag}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Concierge */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Contact Concierge
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <span className="text-neutral-300">
                  Plot 42, Tech Vista Corridor, Cyber Hills, Hyderabad, TS 500081
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  +91 (800) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <a
                  href="mailto:concierge@msmobiles.com"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  concierge@msmobiles.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal */}
        <div className="mt-12 pt-8 border-t border-dark-850/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-neutral-500 font-mono text-center sm:text-left">
            © {currentYear} <strong className="text-neutral-300 font-semibold">MS Mobiles</strong>. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/mobiles"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Catalog
            </Link>
            <Link
              to="/contact"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Support
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-accent-400 transition-colors font-mono"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
