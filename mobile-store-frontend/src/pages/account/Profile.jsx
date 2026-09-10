/**
 * Customer Profile Management Page
 * Module: pages/account/Profile.jsx
 * Route: /account/profile
 * 
 * Luxury full-stack profile editor featuring:
 * - Profile summary card with real-time avatar badge
 * - Profile photo upload with client-side preview and Cloudinary integration
 * - Personal contact information form with live inline validation
 * - Unsaved changes detection engine and floating Save Bar
 * - Seamless UserAuthContext synchronization across the application
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Calendar, Phone, Sparkles, AlertCircle } from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useToast } from '../../context/ToastContext';
import profileService from '../../services/profileService';
import ProfileHeader from '../../components/account/ProfileHeader';
import ProfileAvatarUploader from '../../components/account/ProfileAvatarUploader';
import ProfileForm from '../../components/account/ProfileForm';
import SaveBar from '../../components/account/SaveBar';
import ChangeIndicator from '../../components/account/ChangeIndicator';
import SEO from '../../components/common/SEO';

const PHONE_REGEX = /^[+]?[0-9\s\-().]{7,25}$/;

const Profile = () => {
  const { user, updateUser, refreshUser } = useUserAuth();
  const toast = useToast();

  // Initial loaded server data
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Editable Form Draft State
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    memberSince: '',
  });

  // Avatar Draft State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isMarkedForRemoval, setIsMarkedForRemoval] = useState(false);

  // Validation & Submission State
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial profile from backend
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const data = await profileService.getProfile();

      const memberDate = data.createdAt || data.createdDate;
      const formattedDate = memberDate
        ? new Date(memberDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })
        : '2026';

      const populated = {
        id: data.id,
        fullName: data.fullName || data.name || '',
        phoneNumber: data.phoneNumber || data.phone || '',
        email: data.email || '',
        profileImage: data.profileImage || null,
        memberSince: `Member since ${formattedDate}`,
      };

      setInitialData(populated);
      setFormData({
        fullName: populated.fullName,
        phoneNumber: populated.phoneNumber,
        email: populated.email,
        memberSince: populated.memberSince,
      });

      // Synchronize active auth context
      updateUser(populated);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load profile details. Please check your connection.';
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle avatar file selection from uploader
  const handleFileSelect = (file) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsMarkedForRemoval(false);
  };

  // Handle avatar removal
  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsMarkedForRemoval(true);
  };

  // Handle form field text modification
  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time inline validation
    setErrors((prev) => {
      const next = { ...prev };
      if (name === 'fullName') {
        const trimmed = value.trim();
        if (!trimmed) {
          next.fullName = 'Full name is required';
        } else if (trimmed.length < 2) {
          next.fullName = 'Full name must be at least 2 characters';
        } else if (trimmed.length > 100) {
          next.fullName = 'Full name cannot exceed 100 characters';
        } else {
          delete next.fullName;
        }
      }

      if (name === 'phoneNumber') {
        const trimmed = value.trim();
        if (!trimmed) {
          next.phoneNumber = 'Phone number is required';
        } else if (!PHONE_REGEX.test(trimmed)) {
          next.phoneNumber = 'Please enter a valid phone number (e.g. +91 98765 43210)';
        } else {
          delete next.phoneNumber;
        }
      }

      return next;
    });
  };

  // Unsaved changes dirty detection
  const isDirty = useMemo(() => {
    if (!initialData) return false;

    const nameChanged = (formData.fullName || '').trim() !== (initialData.fullName || '').trim();
    const phoneChanged = (formData.phoneNumber || '').trim() !== (initialData.phoneNumber || '').trim();
    const fileSelected = selectedFile !== null;
    const removalChanged = isMarkedForRemoval === true && Boolean(initialData.profileImage);

    return nameChanged || phoneChanged || fileSelected || removalChanged;
  }, [formData, initialData, selectedFile, isMarkedForRemoval]);

  const hasValidationErrors = Boolean(errors.fullName || errors.phoneNumber);

  // Discard all unsaved modifications
  const handleDiscard = () => {
    if (!initialData) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsMarkedForRemoval(false);

    setFormData({
      fullName: initialData.fullName,
      phoneNumber: initialData.phoneNumber,
      email: initialData.email,
      memberSince: initialData.memberSince,
    });

    setErrors({});
    toast.info('Modifications discarded.');
  };

  // Save changes to backend
  const handleSave = async () => {
    if (hasValidationErrors || !isDirty || isSaving) return;

    // Final pre-submit validation check
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!PHONE_REGEX.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const updated = await profileService.updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        imageFile: selectedFile,
        removeImage: isMarkedForRemoval,
      });

      // Update initial baseline
      const memberDate = updated.createdAt || updated.createdDate || initialData.memberSince;
      const formattedDate =
        typeof memberDate === 'string' && memberDate.startsWith('Member')
          ? memberDate
          : `Member since ${new Date(memberDate).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}`;

      const refreshed = {
        id: updated.id || initialData.id,
        fullName: updated.fullName || updated.name || formData.fullName,
        phoneNumber: updated.phoneNumber || updated.phone || formData.phoneNumber,
        email: updated.email || formData.email,
        profileImage: updated.profileImage || null,
        memberSince: formattedDate,
      };

      setInitialData(refreshed);
      setFormData({
        fullName: refreshed.fullName,
        phoneNumber: refreshed.phoneNumber,
        email: refreshed.email,
        memberSince: refreshed.memberSince,
      });

      // Reset draft photo states
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsMarkedForRemoval(false);
      setErrors({});

      // Synchronize UserAuthContext across full app
      updateUser(refreshed);
      refreshUser().catch(() => {});

      toast.success('Profile changes saved successfully!');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save profile modifications. Please try again.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Skeleton Loading Fallback
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-dark-850 rounded-2xl" />
        <div className="h-32 bg-dark-900 rounded-3xl border border-dark-800" />
        <div className="h-44 bg-dark-900 rounded-3xl border border-dark-800" />
        <div className="h-64 bg-dark-900 rounded-3xl border border-dark-800" />
      </div>
    );
  }

  // Fetch Error Screen
  if (fetchError && !initialData) {
    return (
      <div className="p-8 rounded-3xl bg-dark-900 border border-dark-800 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Unable to Load Profile</h2>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">{fetchError}</p>
        <button
          type="button"
          onClick={fetchProfile}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-600 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  const effectiveAvatarImage = isMarkedForRemoval
    ? null
    : previewUrl || initialData?.profileImage;

  const currentInitial = (formData.fullName || 'C').charAt(0).toUpperCase();

  return (
    <>
      <SEO
        title="Personal Profile — MS Mobiles"
        description="Manage your MS Mobiles account credentials, profile photo, and phone number."
        canonicalUrl="http://localhost:5173/account/profile"
      />

      <div className="space-y-8 pb-20">
        {/* 1. Header with Title and Unsaved Change Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <ProfileHeader />
          <ChangeIndicator isDirty={isDirty} label="Unsaved modifications" />
        </div>

        {/* 2. Profile Summary Card (Real-time Mirror) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5 text-center sm:text-left">
              {/* Avatar Preview */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-accent-600 via-sky-500 to-indigo-500 p-0.5 shadow-glow-sm flex-shrink-0">
                <div className="w-full h-full bg-dark-950 rounded-[22px] overflow-hidden flex items-center justify-center text-accent-400 font-extrabold text-2xl sm:text-3xl select-none">
                  {effectiveAvatarImage ? (
                    <img
                      src={effectiveAvatarImage}
                      alt={formData.fullName}
                      className="w-full h-full object-cover rounded-[22px]"
                    />
                  ) : (
                    currentInitial
                  )}
                </div>
              </div>

              {/* Identity Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {formData.fullName || 'Valued Customer'}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Verified Customer
                  </span>
                </div>

                <p className="text-xs text-neutral-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{formData.email}</span>
                </p>

                <p className="text-[11px] text-neutral-500 flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{formData.memberSince}</span>
                </p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                Security Profile
              </span>
              <span className="text-xs font-semibold text-accent-300 mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent-400" />
                Cloudinary Synced
              </span>
            </div>
          </div>
        </motion.div>

        {/* 3. Profile Avatar Uploader */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ProfileAvatarUploader
            currentImageUrl={initialData?.profileImage}
            displayName={formData.fullName}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onRemovePhoto={handleRemovePhoto}
            isMarkedForRemoval={isMarkedForRemoval}
            isUploading={isSaving}
          />
        </motion.div>

        {/* 4. Personal Information Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <ProfileForm
            formData={formData}
            onChange={handleFormChange}
            errors={errors}
            disabled={isSaving}
          />
        </motion.div>
      </div>

      {/* 5. Floating Save Bar (Triggered by unsaved modifications) */}
      <SaveBar
        show={isDirty}
        onSave={handleSave}
        onDiscard={handleDiscard}
        isSaving={isSaving}
        hasErrors={hasValidationErrors}
      />
    </>
  );
};

export default Profile;
