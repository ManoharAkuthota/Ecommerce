/**
 * Premium Add Mobile Page
 * Module: pages/admin/AddMobile.jsx
 * 
 * Complete smartphone creation console supporting:
 * - Four modular form sections (Basic info, Specs, Inventory, Cloudinary images)
 * - Multipart/form-data upload with progress tracking
 * - Unsaved changes protection modal
 * - Inline validation and server error alerts
 * - Direct navigation back to inventory upon success
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { Button, Card } from '../../components/ui';
import MobileForm from '../../components/admin/MobileForm';
import UploadProgress from '../../components/admin/UploadProgress';
import { mobileService } from '../../services/mobileService';

export const AddMobile = () => {
  const navigate = useNavigate();

  // Submission & Progress State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Uploading images to Cloudinary...');
  const [errorMessage, setErrorMessage] = useState(null);

  // Unsaved Changes Tracking
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Browser level beforeunload protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormDirty, isSubmitting]);

  // Handle Back Navigation with Unsaved Guard
  const handleBackClick = () => {
    if (isFormDirty && !isSubmitting) {
      setShowUnsavedModal(true);
    } else {
      navigate('/admin/mobiles');
    }
  };

  const handleConfirmLeave = () => {
    setShowUnsavedModal(false);
    navigate('/admin/mobiles');
  };

  /**
   * Submit Multipart Payload to Spring Boot Backend
   */
  const handleFormSubmit = async (formData, productName) => {
    setIsSubmitting(true);
    setUploadProgress(5);
    setProgressStatus('Uploading smartphone images to Cloudinary...');
    setErrorMessage(null);

    try {
      await mobileService.createMobile(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Scale upload progress up to 90%, reserve 10% for final persistence
          const scaledPercent = Math.min(90, Math.max(5, Math.round(percent * 0.9)));
          setUploadProgress(scaledPercent);

          if (scaledPercent >= 80) {
            setProgressStatus('Finalizing Cloudinary image transformations...');
          }
        }
      });

      // Complete progress bar
      setUploadProgress(100);
      setProgressStatus('Product successfully registered!');

      // Short delay for user to see completion before navigation
      setTimeout(() => {
        setIsFormDirty(false);
        navigate('/admin/mobiles');
      }, 600);
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.error('[AddMobile] Creation error:', err);
      }

      setIsSubmitting(false);
      setUploadProgress(0);

      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to create smartphone. Please verify that image files are under 5MB and network is active.';
      setErrorMessage(serverMsg);

      // Scroll to error alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800/80">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            disabled={isSubmitting}
            iconLeft={<ArrowLeft className="w-4 h-4" />}
            className="border-dark-700 hover:border-dark-600 text-neutral-300 text-xs"
            aria-label="Back to mobile inventory"
          >
            Back
          </Button>

          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Add New Mobile
            </h1>
            <p className="text-xs text-neutral-400">
              Create a new smartphone listing with premium product details and images.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Server Error Alert Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start justify-between gap-3 shadow-lg"
          >
            <div className="flex items-start gap-2.5 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold text-white">Creation Failed</p>
                <p className="text-rose-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Multi-Section Form */}
      <MobileForm
        onSubmit={handleFormSubmit}
        onCancel={handleBackClick}
        isSubmitting={isSubmitting}
        onFormDirtyChange={setIsFormDirty}
      />

      {/* 4. Animated Upload Progress Overlay */}
      <UploadProgress
        isOpen={isSubmitting}
        progress={uploadProgress}
        statusMessage={progressStatus}
      />

      {/* 5. Unsaved Changes Confirmation Modal */}
      <AnimatePresence>
        {showUnsavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUnsavedModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md z-10"
            >
              <Card
                glass={true}
                className="p-6 sm:p-7 border-amber-500/30 bg-dark-900/95 shadow-2xl relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Unsaved Changes
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      You have entered smartphone details or selected images that have not been published yet.
                      Are you sure you want to leave? Your changes will be lost.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUnsavedModal(false)}
                      className="border-dark-700 hover:border-dark-600 text-neutral-300 text-xs"
                    >
                      Stay on Page
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleConfirmLeave}
                      className="text-xs"
                    >
                      Discard & Leave
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddMobile;
