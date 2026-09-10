/**
 * Profile Avatar Uploader Component
 * Module: components/account/ProfileAvatarUploader.jsx
 * 
 * Luxury avatar manager featuring:
 * - Circular preview with glowing gradient ring
 * - Drag-and-drop & click-to-browse file selection
 * - Live client-side preview without instant uploading (deferred to Save)
 * - Photo removal capability reverting to default initial badge
 * - Inline format (JPG, PNG, WEBP) & file size (<= 5 MB) validation
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Trash2, AlertCircle, Sparkles, Check } from 'lucide-react';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ProfileAvatarUploader = ({
  currentImageUrl = null,
  displayName = 'Customer',
  previewUrl = null,
  onFileSelect,
  onRemovePhoto,
  isMarkedForRemoval = false,
  isUploading = false,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const initial = (displayName || 'C').charAt(0).toUpperCase();

  // Effective display image: local draft preview takes precedence, then current server image (unless marked for removal)
  const displayImage = isMarkedForRemoval ? null : previewUrl || currentImageUrl;

  const validateAndHandleFile = (file) => {
    setValidationError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setValidationError('Unsupported format. Please choose a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setValidationError('File exceeds 5 MB. Please choose a smaller photo.');
      return;
    }

    onFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndHandleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndHandleFile(file);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-dark-800/80 pb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Profile Photo</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            This photo will represent you across MS Mobiles.
          </p>
        </div>

        {isMarkedForRemoval && (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Marked for removal
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        {/* Circular Avatar with Interactive Hover Overlay */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer flex-shrink-0 select-none ${
            isDragging ? 'ring-4 ring-accent-500/50 rounded-full' : ''
          }`}
          title="Click to select or drag and drop a new profile image"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload profile photo"
        >
          {/* Radiant Gradient Ring */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-accent-600 via-sky-500 to-indigo-500 p-1 shadow-glow-md">
            <div className="w-full h-full bg-dark-950 rounded-full overflow-hidden flex items-center justify-center relative">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl sm:text-5xl font-extrabold text-accent-400">
                  {initial}
                </span>
              )}

              {/* Hover Dark Overlay with Camera Icon */}
              <div className="absolute inset-0 bg-dark-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-white backdrop-blur-[2px]">
                <Camera className="w-6 h-6 text-accent-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-200">
                  Change
                </span>
              </div>
            </div>
          </div>

          {/* Camera Badge in bottom-right corner */}
          <div className="absolute bottom-0 right-0 p-2 rounded-full bg-dark-900 border border-dark-750 text-accent-400 group-hover:scale-110 shadow-md transition-transform">
            <Upload className="w-4 h-4" />
          </div>
        </div>

        {/* Action Controls & Guidelines */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Upload New Photo</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Drag and drop an image or click above to browse. Supports JPG, PNG, or WEBP up to 5 MB.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-white border border-dark-750 hover:border-accent-500/40 transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-accent-400" />
              <span>Choose Photo</span>
            </button>

            {/* Remove Photo Button */}
            {(displayImage || previewUrl) && (
              <button
                type="button"
                onClick={onRemovePhoto}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            )}
          </div>

          {/* Inline Validation Alert */}
          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pending Upload Notice */}
          {previewUrl && !isMarkedForRemoval && (
            <div className="flex items-center gap-1.5 text-[11px] text-accent-400 font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Photo selected. Save changes to finalize upload.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarUploader;
