/**
 * Existing Cloudinary Image Grid Component
 * Module: components/admin/ExistingImageGrid.jsx
 * 
 * Manages active Cloudinary product images for editing:
 * - Thumbnail display with order badges (#1 Primary, #2, etc.)
 * - Replace action opening replacement modal
 * - Remove action enforcing minimum 1 image constraint
 * - Visual indicator for pending image replacements
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trash2, Star, Sparkles, Check } from 'lucide-react';

export const ExistingImageGrid = ({
  images = [],
  replacements = {}, // Map of index -> File
  onReplaceClick,
  onReplace,
  onRemoveClick,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const handleReplace = onReplaceClick || onReplace;
  const handleRemove = onRemoveClick || onRemove;

  if (!images || images.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
        <span>Existing Cloudinary Assets ({images.length})</span>
        <span className="text-[11px] text-accent-400 font-normal">
          Hover to Replace or Remove
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <AnimatePresence mode="popLayout">
          {images.map((imgObj, index) => {
            const isPrimary = index === 0;
            const replacementFile = replacements[index];
            const displayUrl = replacementFile
              ? URL.createObjectURL(replacementFile)
              : imgObj.imageUrl;

            const canRemove = images.length > 1;

            return (
              <motion.div
                key={imgObj.id || imgObj.imageUrl || index}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className={`group relative rounded-2xl overflow-hidden border aspect-square bg-dark-900 flex items-center justify-center shadow-card ${
                  replacementFile
                    ? 'border-amber-500/80 ring-2 ring-amber-500/25'
                    : isPrimary
                    ? 'border-accent-500/80 ring-2 ring-accent-500/20'
                    : 'border-dark-700/80 hover:border-dark-600'
                }`}
              >
                {/* Image Asset */}
                <img
                  src={displayUrl}
                  alt={`Product Asset ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Order Badge (Top-Left) */}
                <div className="absolute top-2 left-2 z-10">
                  {replacementFile ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-500 text-dark-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Replaced</span>
                    </span>
                  ) : isPrimary ? (
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

                {/* Action Buttons (Top-Right on Hover) */}
                {!disabled && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                    {/* Replace Button */}
                    <button
                      type="button"
                      onClick={() => handleReplace && handleReplace(imgObj, index)}
                      className="p-1.5 rounded-xl bg-dark-950/90 text-neutral-200 hover:text-white hover:bg-accent-600 border border-dark-700/80 backdrop-blur-md transition-all shadow-md"
                      title={`Replace image #${index + 1}`}
                      aria-label={`Replace image #${index + 1}`}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => canRemove && handleRemove && handleRemove(imgObj, index)}
                      disabled={!canRemove}
                      className={`p-1.5 rounded-xl border backdrop-blur-md transition-all shadow-md ${
                        canRemove
                          ? 'bg-dark-950/90 text-neutral-300 hover:text-rose-400 hover:bg-rose-500/20 border-dark-700/80'
                          : 'bg-dark-950/50 text-neutral-600 border-dark-800 cursor-not-allowed'
                      }`}
                      title={
                        canRemove
                          ? `Remove image #${index + 1}`
                          : 'Cannot delete the only image'
                      }
                      aria-label={`Remove image #${index + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Subtitle Status Banner on Bottom */}
                {replacementFile && (
                  <div className="absolute bottom-2 inset-x-2 text-center text-[10px] font-mono font-bold text-amber-300 bg-dark-950/90 px-2 py-0.5 rounded-md border border-amber-500/30 truncate pointer-events-none">
                    Pending Save
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExistingImageGrid;
