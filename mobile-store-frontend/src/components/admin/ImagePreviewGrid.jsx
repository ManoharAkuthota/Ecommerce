/**
 * Live Image Preview Grid Component
 * Module: components/admin/ImagePreviewGrid.jsx
 * 
 * Renders selected image files as interactive thumbnails with:
 * - Responsive grid layout (2–5 columns)
 * - Primary cover badge (#1) and order pills
 * - One-click remove button per image
 * - Smooth hover zoom & Framer Motion entrance
 * - Object URL cleanup to avoid memory leaks
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star, Sparkles } from 'lucide-react';

export const ImagePreviewGrid = ({
  files = [],
  onRemove,
  disabled = false,
  className = '',
}) => {
  const [previews, setPreviews] = useState([]);

  // Generate object URLs for previews and clean them up
  useEffect(() => {
    const urls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
    }));

    setPreviews(urls);

    // Cleanup object URLs on unmount or file list update
    return () => {
      urls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
        <span>Image Gallery Preview ({files.length} / 5)</span>
        <span className="text-[11px] text-accent-400 font-normal">
          #1 will be the storefront hero cover
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <AnimatePresence mode="popLayout">
          {previews.map((item, index) => {
            const isPrimary = index === 0;

            return (
              <motion.div
                key={item.name + index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`group relative rounded-2xl overflow-hidden border aspect-square bg-dark-900 flex items-center justify-center shadow-card ${
                  isPrimary
                    ? 'border-accent-500/80 ring-2 ring-accent-500/20'
                    : 'border-dark-700/80 hover:border-dark-600'
                }`}
              >
                {/* Thumbnail Image */}
                <img
                  src={item.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Dark Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Order Badge (Top-Left) */}
                <div className="absolute top-2 left-2 z-10">
                  {isPrimary ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-accent-600 text-white text-[10px] font-black uppercase tracking-wider shadow-glow-sm">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      <span>Primary</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-dark-900/90 text-neutral-300 text-[10px] font-bold border border-dark-700 backdrop-blur-md">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Remove Button (Top-Right) */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-dark-950/80 text-neutral-300 hover:text-rose-400 hover:bg-rose-500/20 border border-dark-700/80 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-all shadow-md"
                    title={`Remove image ${index + 1}`}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* File size info badge (Bottom-Left on hover) */}
                <div className="absolute bottom-2 left-2 right-2 truncate text-[10px] font-mono text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="text-neutral-400">{item.size}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImagePreviewGrid;
