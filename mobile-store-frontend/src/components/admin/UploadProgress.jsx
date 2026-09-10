/**
 * Upload Progress Modal Component
 * Module: components/admin/UploadProgress.jsx
 * 
 * Displays an animated progress indicator while images are transmitted and
 * processed through Spring Boot and Cloudinary.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CloudUpload, ShieldCheck } from 'lucide-react';
import { Card } from '../ui';

export const UploadProgress = ({
  isOpen = false,
  progress = 0,
  statusMessage = 'Uploading product images to Cloudinary...',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full max-w-md z-10"
        >
          <Card
            glass={true}
            className="p-8 bg-dark-900/95 border border-accent-500/30 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Spinner & Cloud Icon */}
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-accent-500/20 animate-ping opacity-75" />
                <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-accent-600 to-indigo-500 text-white flex items-center justify-center shadow-glow-md">
                  <CloudUpload className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Publishing Smartphone
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {statusMessage}
                </p>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-2">
                <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden border border-dark-700/80 p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent-500 via-indigo-500 to-accent-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                    initial={{ width: '5%' }}
                    animate={{ width: `${Math.max(5, progress)}%` }}
                    transition={{ ease: 'easeOut', duration: 0.3 }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
                  <span>Transfer progress</span>
                  <span className="font-bold text-accent-300">{progress}%</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
                <span>Please do not close or refresh this page.</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadProgress;
