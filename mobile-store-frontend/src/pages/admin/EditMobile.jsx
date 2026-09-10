/**
 * Premium Edit Mobile Page Component
 * Module: pages/admin/EditMobile.jsx
 * 
 * Enterprise smartphone editor providing:
 * - Direct REST hydration from GET /api/mobiles/{id}
 * - Selective Cloudinary image replacement and removal
 * - Addition of new images up to 5 total limit
 * - Realtime change detection with subtle ChangeIndicators
 * - Floating SaveBar with Discard and Save triggers
 * - Multipart/JSON PUT updates with upload progress
 * - Secondary Delete Product shortcut with DeleteConfirmModal
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Smartphone,
  Cpu,
  Boxes,
  Image as ImageIcon,
  DollarSign,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import FormSection from '../../components/admin/FormSection';
import FormField from '../../components/admin/FormField';
import ChangeIndicator from '../../components/admin/ChangeIndicator';
import ExistingImageGrid from '../../components/admin/ExistingImageGrid';
import ReplaceImageModal from '../../components/admin/ReplaceImageModal';
import ImageUploader from '../../components/admin/ImageUploader';
import ImagePreviewGrid from '../../components/admin/ImagePreviewGrid';
import SaveBar from '../../components/admin/SaveBar';
import UploadProgress from '../../components/admin/UploadProgress';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import MobileForm from '../../components/admin/MobileForm';
import { mobileService } from '../../services/mobileService';

const BRAND_SUGGESTIONS = [
  'Apple',
  'Samsung',
  'Google',
  'OnePlus',
  'Xiaomi',
  'Nothing',
  'Vivo',
  'Motorola',
  'Asus',
  'Sony',
];

const RAM_OPTIONS = ['6GB', '8GB', '12GB', '16GB', '24GB'];
const STORAGE_OPTIONS = ['128GB', '256GB', '512GB', '1TB', '2TB'];

const STOCK_STATUS_OPTIONS = [
  { value: 'IN_STOCK', label: 'In Stock' },
  { value: 'LIMITED_STOCK', label: 'Limited Stock' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

export const EditMobile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Loading & Error State
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Baseline Initial Data Snapshot (for change tracking)
  const [initialData, setInitialData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    price: '',
    ram: '',
    storage: '',
    processor: '',
    display: '',
    battery: '',
    stockStatus: 'IN_STOCK',
    hidden: false,
  });

  // Images State
  const [existingImages, setExistingImages] = useState([]); // [{ id, imageUrl, imageOrder }]
  const [replacements, setReplacements] = useState({}); // { index: File }
  const [newImages, setNewImages] = useState([]); // [File, ...]

  // Modals & UI Controls
  const [replaceModal, setReplaceModal] = useState({
    isOpen: false,
    image: null,
    index: -1,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isDeleting: false,
  });
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Progress & Validation Errors
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Saving changes...');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Hydrate Mobile Data from Backend
   */
  const loadMobileData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await mobileService.getMobileById(id);

      const baselineForm = {
        brand: data.brand || '',
        name: data.name || '',
        price: data.price ? data.price.toString() : '',
        ram: data.ram || '12GB',
        storage: data.storage || '256GB',
        processor: data.processor || '',
        display: data.display || '',
        battery: data.battery || '',
        stockStatus: data.stockStatus || 'IN_STOCK',
        hidden: Boolean(data.hidden),
      };

      // Extract images list with fallback
      const initialImgs = Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : (data.imageUrls || []).map((url, idx) => ({
            id: `legacy-${idx}`,
            imageUrl: url,
            imageOrder: idx + 1,
          }));

      setInitialData({
        ...baselineForm,
        images: initialImgs,
      });

      setFormData(baselineForm);
      setExistingImages(initialImgs);
      setReplacements({});
      setNewImages([]);
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.error('[EditMobile] Failed to load mobile:', err);
      }
      setLoadError(
        err?.response?.data?.message ||
          'Failed to load smartphone details. It may have been removed or the ID is invalid.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMobileData();
  }, [loadMobileData]);

  // Handle Field Edits
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /**
   * Change Tracking Computation
   */
  const changedFields = useMemo(() => {
    if (!initialData) return {};

    const changes = {};
    const textKeys = ['brand', 'name', 'price', 'ram', 'storage', 'processor', 'display', 'battery', 'stockStatus', 'hidden'];

    textKeys.forEach((key) => {
      if (key === 'price') {
        const p1 = parseFloat(formData.price) || 0;
        const p2 = parseFloat(initialData.price) || 0;
        if (p1 !== p2) changes.price = true;
      } else if (key === 'hidden') {
        if (Boolean(formData.hidden) !== Boolean(initialData.hidden)) changes.hidden = true;
      } else {
        if ((formData[key] || '').trim() !== (initialData[key] || '').trim()) {
          changes[key] = true;
        }
      }
    });

    return changes;
  }, [formData, initialData]);

  const hasImageChanges = useMemo(() => {
    if (!initialData) return false;
    const initialCount = initialData.images?.length || 0;
    const currentExistingCount = existingImages.length;
    const hasRemoved = currentExistingCount !== initialCount;
    const hasReplaced = Object.keys(replacements).length > 0;
    const hasAdded = newImages.length > 0;
    return hasRemoved || hasReplaced || hasAdded;
  }, [initialData, existingImages, replacements, newImages]);

  const totalChangesCount = useMemo(() => {
    let count = Object.keys(changedFields).length;
    if (hasImageChanges) count += 1;
    return count;
  }, [changedFields, hasImageChanges]);

  const hasUnsavedChanges = totalChangesCount > 0;

  // Browser beforeunload protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && !isSaving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, isSaving]);

  // Navigation Guard
  const handleBackClick = () => {
    if (hasUnsavedChanges && !isSaving) {
      setShowUnsavedModal(true);
    } else {
      navigate('/admin/mobiles');
    }
  };

  const handleDiscardChanges = () => {
    if (initialData) {
      setFormData({
        brand: initialData.brand,
        name: initialData.name,
        price: initialData.price,
        ram: initialData.ram,
        storage: initialData.storage,
        processor: initialData.processor,
        display: initialData.display,
        battery: initialData.battery,
        stockStatus: initialData.stockStatus,
        hidden: initialData.hidden,
      });
      setExistingImages(initialData.images);
      setReplacements({});
      setNewImages([]);
      setErrors({});
      setErrorMessage(null);
    }
  };

  /**
   * Image Management Handlers
   */
  const handleOpenReplaceModal = (imgObj, index) => {
    setReplaceModal({
      isOpen: true,
      image: imgObj,
      index,
    });
  };

  const handleConfirmReplacement = (replacementFile, index) => {
    setReplacements((prev) => ({ ...prev, [index]: replacementFile }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleRemoveExistingImage = (imgObj, index) => {
    if (existingImages.length <= 1 && newImages.length === 0) {
      setErrorMessage('A smartphone listing must retain at least one product image.');
      return;
    }

    setExistingImages((prev) => prev.filter((_, idx) => idx !== index));
    // Also remove replacement entry for that index if present
    setReplacements((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleAddNewImages = (files) => {
    setNewImages((prev) => [...prev, ...files]);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const totalEffectiveImages = existingImages.length + newImages.length;

  /**
   * Form Validation
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand.trim()) newErrors.brand = 'Brand name is required';
    if (!formData.name.trim()) newErrors.name = 'Product name is required';

    const numericPrice = parseFloat(formData.price);
    if (!formData.price || isNaN(numericPrice) || numericPrice <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.ram.trim()) newErrors.ram = 'RAM is required';
    if (!formData.storage.trim()) newErrors.storage = 'Storage is required';
    if (!formData.processor.trim()) newErrors.processor = 'Processor is required';
    if (!formData.display.trim()) newErrors.display = 'Display is required';
    if (!formData.battery.trim()) newErrors.battery = 'Battery is required';

    if (totalEffectiveImages === 0) {
      newErrors.images = 'A smartphone listing must have at least 1 image.';
    } else if (totalEffectiveImages > 5) {
      newErrors.images = 'Maximum 5 images allowed per smartphone.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Save Changes Handler
   */
  const handleSaveChanges = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    setSaveProgress(10);
    setProgressStatus('Updating smartphone specifications...');
    setErrorMessage(null);

    try {
      const hasReplacementFiles = Object.keys(replacements).length > 0;
      const hasNewImageFiles = newImages.length > 0;
      const isMultipartNeeded = hasReplacementFiles || hasNewImageFiles;

      const basePayload = {
        brand: formData.brand.trim(),
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        ram: formData.ram.trim(),
        storage: formData.storage.trim(),
        processor: formData.processor.trim(),
        display: formData.display.trim(),
        battery: formData.battery.trim(),
        stockStatus: formData.stockStatus,
        hidden: Boolean(formData.hidden),
      };

      if (isMultipartNeeded) {
        // Build FormData payload
        const payload = new FormData();
        payload.append('mobile', JSON.stringify(basePayload));

        Object.entries(basePayload).forEach(([key, val]) => {
          payload.append(key, val);
        });

        // Collect final image files:
        // For existing images: if replaced by file, append replacement file;
        // For new images: append new files.
        const allNewFiles = [];

        Object.values(replacements).forEach((file) => {
          allNewFiles.push(file);
        });

        newImages.forEach((file) => {
          allNewFiles.push(file);
        });

        allNewFiles.forEach((file) => {
          payload.append('images', file);
        });

        await mobileService.updateMobile(id, payload, (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const scaled = Math.min(90, Math.max(10, Math.round(percent * 0.9)));
            setSaveProgress(scaled);
            if (scaled >= 75) {
              setProgressStatus('Processing Cloudinary image transformations...');
            }
          }
        });
      } else {
        // Send JSON payload with retained existing image URLs
        const retainedUrls = existingImages.map((img) => img.imageUrl);
        const jsonPayload = {
          ...basePayload,
          imageUrls: retainedUrls,
        };

        setSaveProgress(50);
        await mobileService.updateMobile(id, jsonPayload);
      }

      setSaveProgress(100);
      setProgressStatus('Changes saved successfully!');

      setTimeout(() => {
        setIsSaving(false);
        navigate('/admin/mobiles');
      }, 500);
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.error('[EditMobile] Save error:', err);
      }
      setIsSaving(false);
      setSaveProgress(0);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to save changes. Please verify that files are under 5MB and network is connected.';
      setErrorMessage(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Delete Product Handler
   */
  const handleConfirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await mobileService.deleteMobile(id);
      navigate('/admin/mobiles');
    } catch (err) {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      setErrorMessage(
        err?.response?.data?.message || 'Failed to delete smartphone.'
      );
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-dark-900/80 border border-dark-700/70 hover:border-dark-600 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 transition-all duration-200 outline-none shadow-inner disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* 1. Header with Back Button & Delete Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800/80">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            disabled={isSaving}
            iconLeft={<ArrowLeft className="w-4 h-4" />}
            className="border-dark-700 hover:border-dark-600 text-neutral-300 text-xs"
            aria-label="Back to mobile inventory"
          >
            Back
          </Button>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Edit Mobile
              </h1>
              {formData.name && (
                <span className="hidden sm:inline-block text-xs font-mono text-neutral-500 max-w-xs truncate">
                  ({formData.name})
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400">
              Update product information, inventory specifications, and images for MS Mobiles.
            </p>
          </div>
        </div>

        {/* Delete Shortcut Button */}
        {!isLoading && !loadError && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setDeleteModal({ isOpen: true, isDeleting: false })}
            disabled={isSaving}
            iconLeft={<Trash2 className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Delete Product
          </Button>
        )}
      </div>

      {/* 2. Loading Skeleton State */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="p-8 rounded-3xl bg-dark-950/60 border border-dark-800/80 h-64" />
          <div className="p-8 rounded-3xl bg-dark-950/60 border border-dark-800/80 h-72" />
          <div className="p-8 rounded-3xl bg-dark-950/60 border border-dark-800/80 h-48" />
        </div>
      ) : loadError ? (
        /* 3. Load Error State */
        <div className="p-8 rounded-3xl bg-dark-950/60 border border-rose-500/25 text-center space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Product Not Available</h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
              {loadError}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/mobiles')}
            className="text-xs border-dark-700"
          >
            Return to Inventory
          </Button>
        </div>
      ) : (
        /* 4. Reusable Smartphone Form in Edit Mode */
        <div className="space-y-6">
          {/* Server Error Alert Banner */}
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
                    <p className="font-bold text-white">Update Notice</p>
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

          {/* Reusable MobileForm configured for Edit Mobile */}
          <MobileForm
            isEditMode={true}
            formData={formData}
            onChange={handleChange}
            errors={errors}
            changedFields={changedFields}
            existingImages={existingImages}
            onReplaceExistingImage={handleOpenReplaceModal}
            onRemoveExistingImage={handleRemoveExistingImage}
            selectedImages={newImages}
            onImagesAdded={handleAddNewImages}
            onImageRemoved={handleRemoveNewImage}
            onSubmit={handleSaveChanges}
            hideDefaultActions={true}
            isSubmitting={isSaving}
          />
        </div>
      )}

      {/* 5. Floating Save Action Bar */}
      <SaveBar
        show={hasUnsavedChanges}
        changedCount={totalChangesCount}
        onSave={handleSaveChanges}
        onDiscard={handleDiscardChanges}
        isSaving={isSaving}
      />

      {/* 6. Replace Image Modal */}
      <ReplaceImageModal
        isOpen={replaceModal.isOpen}
        onClose={() => setReplaceModal({ isOpen: false, image: null, index: -1 })}
        onConfirm={handleConfirmReplacement}
        currentImageUrl={replaceModal.image?.imageUrl || ''}
        imageIndex={replaceModal.index}
      />

      {/* 7. Permanent Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        mobileName={formData.name || 'Smartphone'}
        isDeleting={deleteModal.isDeleting}
      />

      {/* 8. Upload & Save Progress Modal */}
      <UploadProgress
        isOpen={isSaving}
        progress={saveProgress}
        statusMessage={progressStatus}
      />

      {/* 9. Unsaved Changes Leave Confirmation Modal */}
      <AnimatePresence>
        {showUnsavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUnsavedModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
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
                      You have modified specifications or images that have not been saved.
                      Are you sure you want to leave? Your changes will be discarded.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUnsavedModal(false)}
                      className="border-dark-700 text-xs text-neutral-300"
                    >
                      Keep Editing
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setShowUnsavedModal(false);
                        navigate('/admin/mobiles');
                      }}
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

export default EditMobile;
