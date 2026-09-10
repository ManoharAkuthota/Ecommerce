/**
 * MapSection Component
 * Module: components/contact/MapSection.jsx
 * 
 * Responsive Google Maps embed with dark theme styling, lazy loading,
 * and direct external directions navigation.
 */

import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

export const MapSection = ({ className = '' }) => {
  // Google Maps embed URL with dark-friendly parameters and lazy loading
  const mapEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.29959648939!2d78.38048227516624!3d17.44533818345244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d69df%3A0x19688ebb557861bc!2sHITEC%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin';

  return (
    <div className={`space-y-6 select-none ${className}`}>
      {/* Header with Directions CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-mono font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-accent-400" />
            <span>Store Location</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Visit Our Flagship Store
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans">
            Experience unboxed flagship smartphones in person at our physical retail concierge center.
          </p>
        </div>

        <a
          href="https://maps.google.com/?q=Cyber+Hills+Hyderabad"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-xs font-bold text-neutral-200 hover:text-white transition-all shadow-sm self-start sm:self-auto group"
        >
          <Navigation className="w-3.5 h-3.5 text-accent-400 group-hover:rotate-45 transition-transform" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3 text-neutral-500" />
        </a>
      </div>

      {/* Map Frame Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-dark-900 border border-dark-800/80 shadow-2xl backdrop-blur-2xl">
        <iframe
          title="MS Mobiles Store Location Map"
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(95%)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />

        {/* Floating Store Badge Overlay */}
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 p-3 px-4 rounded-2xl bg-dark-950/90 border border-dark-750 backdrop-blur-md shadow-lg text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-ping" />
          <div>
            <span className="font-bold text-white block">MS Mobiles Flagship Experience</span>
            <span className="text-[11px] text-neutral-400 font-mono">Cyber Hills, Hyderabad</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
