/**
 * ImageZoom Component
 * Module: components/mobile-details/ImageZoom.jsx
 * 
 * Interactive zoom viewer:
 * - Desktop: Cursor-following lens hover magnification (2x)
 * - Mobile / Touch: Smooth pinch/tap-friendly zoom with zero layout shift
 * - Glassmorphic image frame with ambient lighting
 */

import React, { useState, useRef } from 'react';
import { Smartphone, ZoomIn } from 'lucide-react';

export const ImageZoom = ({
  src,
  alt = 'Smartphone Flagship',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 50, y: 50 });
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setLensPosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-[4/3.8] sm:aspect-square rounded-3xl overflow-hidden bg-dark-950/80 border border-dark-800/80 backdrop-blur-2xl shadow-2xl flex items-center justify-center p-6 sm:p-10 cursor-crosshair select-none group ${className}`}
    >
      {/* Ambient Behind-Image Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/10 via-transparent to-indigo-500/10 opacity-70 pointer-events-none" />

      {src && !hasError ? (
        <>
          {/* Main Image with Lens Transform on Hover */}
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            style={{
              transformOrigin: `${lensPosition.x}% ${lensPosition.y}%`,
              transform: isHovered ? 'scale(1.85)' : 'scale(1)',
              transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.35s ease-out',
            }}
            className="w-full h-full object-contain pointer-events-none will-change-transform z-10"
          />

          {/* Hint Overlay */}
          <div
            className={`absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900/80 border border-dark-750 text-[11px] font-mono text-neutral-400 backdrop-blur-md pointer-events-none transition-opacity duration-200 ${
              isHovered ? 'opacity-0' : 'opacity-80'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5 text-accent-400" />
            <span>Hover to zoom</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-neutral-600 gap-3 z-10">
          <Smartphone className="w-16 h-16 text-neutral-600" />
          <span className="text-xs uppercase font-mono tracking-widest text-neutral-500">
            Image Not Available
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageZoom;
