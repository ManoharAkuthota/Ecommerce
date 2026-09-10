/**
 * Drag-and-Drop Image Uploader Component
 * Module: components/admin/ImageUploader.jsx
 * 
 * Features:
 * - Drag and drop zone with active hover states
 * - Native file browser trigger with hidden input
 * - Validation: 1–5 files max, 5MB size limit, JPG/JPEG/PNG/WEBP formats
 * - Elegant inline warning/error messages for rejected files
 */

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

export const ImageUploader = ({
  onFilesSelected,
  currentCount = 0,
  maxFiles = 5,
  disabled = false,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const remainingSlots = Math.max(0, maxFiles - currentCount);

  const validateAndProcessFiles = (fileList) => {
    setErrorMessage(null);
    if (!fileList || fileList.length === 0) return;

    if (remainingSlots <= 0) {
      setErrorMessage(`Maximum limit of ${maxFiles} images already reached.`);
      return;
    }

    const rawFiles = Array.from(fileList);
    const validFiles = [];
    const errors = [];

    for (const file of rawFiles) {
      if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        errors.push(`"${file.name}" is not a valid format (only JPG, PNG, WEBP allowed).`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" exceeds 5MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
        continue;
      }
      validFiles.push(file);
    }

    if (errors.length > 0) {
      setErrorMessage(errors[0]); // Show the first error
    }

    if (validFiles.length > 0) {
      const allowedToTake = validFiles.slice(0, remainingSlots);
      if (validFiles.length > remainingSlots) {
        setErrorMessage(
          `Only ${remainingSlots} more image(s) allowed. First ${remainingSlots} were added.`
        );
      }
      if (typeof onFilesSelected === 'function') {
        onFilesSelected(allowedToTake);
      }
    }

    // Reset input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && remainingSlots > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || remainingSlots <= 0) return;

    if (e.dataTransfer && e.dataTransfer.files) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled && remainingSlots > 0 && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files) {
      validateAndProcessFiles(e.target.files);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        disabled={disabled || remainingSlots <= 0}
        className="hidden"
        aria-label="Upload smartphone images"
      />

      {/* Drag and Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled || remainingSlots <= 0 ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`relative p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all duration-300 text-center cursor-pointer select-none flex flex-col items-center justify-center group ${
          disabled || remainingSlots <= 0
            ? 'opacity-50 cursor-not-allowed border-dark-800 bg-dark-950/40'
            : isDragOver
            ? 'border-accent-400 bg-accent-500/10 scale-[1.01] shadow-glow-sm'
            : 'border-dark-700 hover:border-accent-500/60 bg-dark-900/40 hover:bg-dark-900/70'
        }`}
      >
        {/* Animated Glow on Drag Over */}
        {isDragOver && (
          <div className="absolute inset-0 bg-accent-500/10 rounded-3xl blur-xl pointer-events-none" />
        )}

        {/* Upload Icon Badge */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-200 shadow-card ${
            isDragOver
              ? 'bg-accent-500 text-white scale-110'
              : 'bg-dark-800 text-accent-400 group-hover:scale-105 group-hover:bg-dark-750'
          }`}
        >
          <UploadCloud className="w-7 h-7" />
        </div>

        {/* Text Guidelines */}
        <div className="space-y-1.5 max-w-sm">
          <p className="text-sm font-bold text-white tracking-tight">
            {remainingSlots > 0 ? (
              <>
                <span className="text-accent-400 underline underline-offset-4 decoration-accent-500/40 group-hover:decoration-accent-400">
                  Click to browse
                </span>{' '}
                or drag & drop images here
              </>
            ) : (
              'Maximum 5 images reached'
            )}
          </p>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Upload 1 to 5 flagship images in JPG, PNG, or WEBP (up to 5MB each).
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 text-[11px] font-mono text-neutral-500">
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-accent-400" />
              {currentCount} / {maxFiles} images added
            </span>
            <span>•</span>
            <span>First image is primary cover</span>
          </div>
        </div>
      </div>

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
