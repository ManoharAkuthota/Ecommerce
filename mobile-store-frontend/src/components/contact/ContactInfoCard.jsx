/**
 * ContactInfoCard Component
 * Module: components/contact/ContactInfoCard.jsx
 * 
 * Luxury store contact details with click-to-action triggers:
 * - Phone: Click to open dialer (tel:)
 * - Email: Click to open email client (mailto:)
 * - Address: Click to view on Google Maps
 * - Store identity and guarantees
 */

import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ContactInfoCard = ({ className = '' }) => {
  const contactDetails = [
    {
      icon: <Phone className="w-5 h-5 text-accent-400 shrink-0" />,
      label: 'Direct Phone Support',
      value: '+91 (800) 456-7890',
      actionText: 'Call Store',
      href: 'tel:+918004567890',
      ariaLabel: 'Call MS Mobiles concierge directly',
    },
    {
      icon: <Mail className="w-5 h-5 text-accent-400 shrink-0" />,
      label: 'Email Concierge',
      value: 'concierge@msmobiles.com',
      actionText: 'Send Email',
      href: 'mailto:concierge@msmobiles.com',
      ariaLabel: 'Send email to MS Mobiles concierge',
    },
    {
      icon: <MapPin className="w-5 h-5 text-accent-400 shrink-0" />,
      label: 'Storefront Experience Center',
      value: 'Plot 42, Tech Vista Corridor, Cyber Hills, Hyderabad, TS 500081',
      actionText: 'Get Directions',
      href: 'https://maps.google.com/?q=Cyber+Hills+Hyderabad',
      target: '_blank',
      rel: 'noopener noreferrer',
      ariaLabel: 'View MS Mobiles location on Google Maps',
    },
  ];

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-2xl shadow-2xl space-y-6 ${className}`}
    >
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent-600 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-lg font-black text-white tracking-tight">
            MS <span className="text-accent-400">Mobiles</span>
          </span>
        </div>
        <p className="text-xs text-neutral-400">
          Official smartphone hardware specialists and authorized retailer.
        </p>
      </div>

      {/* Interactive Contact Channels */}
      <div className="space-y-4">
        {contactDetails.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            target={item.target}
            rel={item.rel}
            aria-label={item.ariaLabel}
            className="group flex items-start gap-4 p-4 rounded-2xl bg-dark-850/60 hover:bg-dark-850 border border-dark-800/80 hover:border-accent-500/40 transition-all duration-200"
          >
            <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-750 group-hover:border-accent-500/30 transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-white group-hover:text-accent-300 transition-colors block truncate mt-0.5">
                {item.value}
              </span>
              <span className="text-xs text-accent-400 font-medium inline-flex items-center gap-1 mt-1 group-hover:underline">
                <span>{item.actionText}</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Trust Guarantee Note */}
      <div className="p-4 rounded-2xl bg-dark-950/60 border border-dark-800/60 text-xs text-neutral-400 space-y-1.5 font-sans">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Official Manufacturer Warranty Guaranteed</span>
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Every device sold by MS Mobiles is 100% genuine with factory seal and verified IMEI registration.
        </p>
      </div>
    </div>
  );
};

export default ContactInfoCard;
