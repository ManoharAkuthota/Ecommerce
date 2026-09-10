/**
 * Replace Image Modal Component
 * Module: components/admin/ReplaceImageModal.jsx
 * 
 * Allows admins to selectively replace a specific Cloudinary image with a new file.
 * Previews both the current image and the staged replacement before applying locally.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, AlertCircle, ArrowRight, Check, Image as ImageIcon } from 'lucide-react';
import { Card, Button } from '../ui';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ReplaceImageModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  currentImageUrl = '',
  imageIndex = 0,
}) => {
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Clean up object URL on unmount or file change
  useEffect(() => {
    if (replacementFile) {
      const url = URL.createObjectURL(replacementFile);
      setReplacementPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setReplacementPreview(null);
    }
  }, [replacementFile]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setReplacementFile(null);
      setError(null);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileSelected = (fileList) => {
    setError(null);
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setError('Invalid format. Please select a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`File exceeds 5MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    setReplacementFile(file);
  };

  const handleConfirm = () => {
    if (replacementFile && typeof onConfirm === 'function') {
      onConfirm(replacementFile, imageIndex);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-lg z-10"
        >
          <Card
            glass={true}
            className="p-6 sm:p-7 bg-dark-900/95 border border-dark-700/80 shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-dark-800">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Replace Image #{imageIndex + 1}
                </h3>
                <p className="text-xs text-neutral-400">
                  Select a replacement file from your device.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comparison Previews */}
            <div className="py-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 items-center">
                {/* Current Image */}
                <div className="space-y-1.5 text-center">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Current Image
                  </span>
                  <div className="aspect-square rounded-2xl border border-dark-750 bg-dark-950 overflow-hidden relative shadow-inner flex items-center justify-center">
                    {currentImageUrl ? (
                      <img
                        src={currentImageUrl}
                        alt="Current"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-neutral-600" />
                    )}
                  </div>
                </div>

                {/* Replacement Image */}
                <div className="space-y-1.5 text-center">
                  <span className="text-[11px] font-bold text-accent-400 uppercase tracking-wider">
                    Replacement
                  </span>
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-dark-700 hover:border-accent-500/60 bg-dark-950 overflow-hidden relative flex items-center justify-center transition-colors">
                    {replacementPreview ? (
                      <img
                        src={replacementPreview}
                        alt="Replacement Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 text-center cursor-pointer flex flex-col items-center justify-center h-full w-full"
                      >
                        <UploadCloud className="w-6 h-6 text-neutral-500 mb-1" />
                        <span className="text-[11px] text-accent-400 font-semibold underline">
                          Choose File
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hidden File Input & Browse Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileSelected(e.target.files)}
                className="hidden"
                aria-label="Select replacement image"
              />

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  iconLeft={<UploadCloud className="w-3.5 h-3.5 text-accent-400" />}
                  className="text-xs border-dark-700"
                >
                  {replacementFile ? 'Change File' : 'Browse Replacement Image'}
                </Button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-dark-700 text-xs"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleConfirm}
                disabled={!replacementFile}
                iconLeft={<Check className="w-4 h-4" />}
                className="text-xs shadow-glow-sm disabled:opacity-50"
              >
                Apply Replacement
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReplaceImageModal;
