/**
 * Admin Smartphone Creation Form Component
 * Module: components/admin/MobileForm.jsx
 * 
 * Manages four modular form sections:
 * 1. Basic Information (Brand, Name, Price)
 * 2. Specifications (RAM, Storage, Processor, Display, Battery)
 * 3. Inventory & Visibility (Stock Status, Storefront Hidden Toggle)
 * 4. Image Upload & Gallery Preview (1–5 Cloudinary Assets)
 */

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Cpu,
  Boxes,
  Image as ImageIcon,
  DollarSign,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import FormSection from './FormSection';
import FormField from './FormField';
import ImageUploader from './ImageUploader';
import ImagePreviewGrid from './ImagePreviewGrid';
import ExistingImageGrid from './ExistingImageGrid';
import ChangeIndicator from './ChangeIndicator';
import { Button } from '../ui';

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

export const MobileForm = ({
  // Controlled or Uncontrolled Form State
  formData: controlledFormData,
  onChange: controlledOnChange,
  isEditMode = false,
  changedFields = {},

  // Existing Cloudinary Media (Edit Mode)
  existingImages = [],
  onReplaceExistingImage,
  onRemoveExistingImage,

  // Newly Selected Image Files
  selectedImages: controlledSelectedImages,
  onImagesAdded: controlledOnImagesAdded,
  onImageRemoved: controlledOnImageRemoved,

  // Validation & Submission
  errors: controlledErrors,
  onSubmit,
  onCancel,
  isSubmitting = false,
  onFormDirtyChange,
  hideDefaultActions = false,
}) => {
  // Internal fallback state (used when uncontrolled in Add mode)
  const [internalFormData, setInternalFormData] = useState({
    brand: '',
    name: '',
    price: '',
    ram: '12GB',
    storage: '256GB',
    processor: '',
    display: '',
    battery: '',
    stockStatus: 'IN_STOCK',
    hidden: false,
  });

  const [internalSelectedImages, setInternalSelectedImages] = useState([]);
  const [internalErrors, setInternalErrors] = useState({});

  // Resolve active data sources (controlled vs internal)
  const formData = controlledFormData || internalFormData;
  const selectedImages = controlledSelectedImages || internalSelectedImages;
  const errors = controlledErrors || internalErrors;

  // Track dirty state in uncontrolled mode
  useEffect(() => {
    if (!controlledFormData) {
      const isDirty =
        Boolean(formData.brand?.trim()) ||
        Boolean(formData.name?.trim()) ||
        Boolean(formData.price) ||
        Boolean(formData.processor?.trim()) ||
        Boolean(formData.display?.trim()) ||
        Boolean(formData.battery?.trim()) ||
        selectedImages.length > 0;

      if (typeof onFormDirtyChange === 'function') {
        onFormDirtyChange(isDirty);
      }
    }
  }, [formData, selectedImages, controlledFormData, onFormDirtyChange]);

  const handleChange = (field, value) => {
    if (typeof controlledOnChange === 'function') {
      controlledOnChange(field, value);
    } else {
      setInternalFormData((prev) => ({ ...prev, [field]: value }));
      if (internalErrors[field]) {
        setInternalErrors((prev) => ({ ...prev, [field]: null }));
      }
    }
  };

  const handleImagesAdded = (newFiles) => {
    if (typeof controlledOnImagesAdded === 'function') {
      controlledOnImagesAdded(newFiles);
    } else {
      setInternalSelectedImages((prev) => [...prev, ...newFiles]);
      if (internalErrors.images) {
        setInternalErrors((prev) => ({ ...prev, images: null }));
      }
    }
  };

  const handleImageRemoved = (indexToRemove) => {
    if (typeof controlledOnImageRemoved === 'function') {
      controlledOnImageRemoved(indexToRemove);
    } else {
      setInternalSelectedImages((prev) =>
        prev.filter((_, idx) => idx !== indexToRemove)
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand name is required';
    } else if (formData.brand.length > 50) {
      newErrors.brand = 'Brand cannot exceed 50 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length > 150) {
      newErrors.name = 'Product name cannot exceed 150 characters';
    }

    const numericPrice = parseFloat(formData.price);
    if (!formData.price || isNaN(numericPrice) || numericPrice <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.ram.trim()) {
      newErrors.ram = 'RAM specification is required';
    }

    if (!formData.storage.trim()) {
      newErrors.storage = 'Internal storage specification is required';
    }

    if (!formData.processor.trim()) {
      newErrors.processor = 'Processor specification is required';
    } else if (formData.processor.length > 100) {
      newErrors.processor = 'Processor cannot exceed 100 characters';
    }

    if (!formData.display.trim()) {
      newErrors.display = 'Display specification is required';
    } else if (formData.display.length > 150) {
      newErrors.display = 'Display specification cannot exceed 150 characters';
    }

    if (!formData.battery.trim()) {
      newErrors.battery = 'Battery specification is required';
    } else if (formData.battery.length > 100) {
      newErrors.battery = 'Battery specification cannot exceed 100 characters';
    }

    // Image count validation
    const totalImageCount = isEditMode
      ? (existingImages?.length || 0) + (selectedImages?.length || 0)
      : selectedImages.length;

    if (totalImageCount === 0) {
      newErrors.images = 'At least 1 product image is required (max 5)';
    } else if (totalImageCount > 5) {
      newErrors.images = 'Maximum 5 images allowed per smartphone';
    }

    if (!controlledErrors) {
      setInternalErrors(newErrors);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to top of form or first error
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    // Build multipart FormData
    const payload = new FormData();

    // Prepare clean JSON payload for Spring Boot
    const mobileData = {
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

    // 1. Append JSON string part (supported by MobileController resolveMobileRequest)
    payload.append('mobile', JSON.stringify(mobileData));

    // 2. Also append individual form attributes for dual-format compatibility
    Object.entries(mobileData).forEach(([key, val]) => {
      payload.append(key, val);
    });

    // 3. Append 1 to 5 image files under the 'images' part
    selectedImages.forEach((file) => {
      payload.append('images', file);
    });

    if (typeof onSubmit === 'function') {
      onSubmit(payload, mobileData.name);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-dark-900/80 border border-dark-700/70 hover:border-dark-600 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 transition-all duration-200 outline-none shadow-inner disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECTION 1: Basic Information */}
      <FormSection
        icon={<Smartphone className="w-5 h-5" />}
        title="Basic Information"
        subtitle="General product identity, brand name, and public retail price."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brand Field with Datalist Suggestions */}
          <FormField
            label="Brand"
            id="brand"
            required={true}
            error={errors.brand}
            isChanged={Boolean(changedFields?.brand)}
            helperText="Manufacturer (e.g. Apple, Samsung, Google, OnePlus)"
          >
            <div className="relative">
              <input
                id="brand"
                type="text"
                list="brand-suggestions"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                disabled={isSubmitting}
                placeholder="Select or enter brand..."
                className={inputClass}
              />
              <datalist id="brand-suggestions">
                {BRAND_SUGGESTIONS.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
          </FormField>

          {/* Product Retail Price */}
          <FormField
            label="Retail Price (USD)"
            id="price"
            required={true}
            error={errors.price}
            isChanged={Boolean(changedFields?.price)}
            helperText="Numerical price in USD (e.g. 999.99)"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <DollarSign className="w-4 h-4 text-accent-400" />
              </div>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                disabled={isSubmitting}
                placeholder="0.00"
                className={`${inputClass} pl-10 font-mono`}
              />
            </div>
          </FormField>
        </div>

        {/* Product Name */}
        <FormField
          label="Smartphone Model Name"
          id="name"
          required={true}
          error={errors.name}
          isChanged={Boolean(changedFields?.name)}
          helperText="Full product title displayed to customers (e.g. Galaxy S25 Ultra 5G)"
        >
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. iPhone 16 Pro Max"
            className={inputClass}
          />
        </FormField>
      </FormSection>

      {/* SECTION 2: Technical Specifications */}
      <FormSection
        icon={<Cpu className="w-5 h-5" />}
        title="Technical Specifications"
        subtitle="Hardware specifications used in comparison tables and catalog filtering."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* RAM Capacity */}
          <FormField
            label="RAM Capacity"
            id="ram"
            required={true}
            error={errors.ram}
            isChanged={Boolean(changedFields?.ram)}
            helperText="System memory (e.g. 12GB, 16GB)"
          >
            <div className="relative">
              <select
                id="ram"
                value={formData.ram}
                onChange={(e) => handleChange('ram', e.target.value)}
                disabled={isSubmitting}
                className={`${inputClass} appearance-none pr-10 cursor-pointer`}
              >
                {RAM_OPTIONS.map((r) => (
                  <option key={r} value={r} className="bg-dark-900 text-white">
                    {r} RAM
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </FormField>

          {/* Internal Storage Capacity */}
          <FormField
            label="Internal Storage"
            id="storage"
            required={true}
            error={errors.storage}
            isChanged={Boolean(changedFields?.storage)}
            helperText="Storage tier (e.g. 256GB, 512GB, 1TB)"
          >
            <div className="relative">
              <select
                id="storage"
                value={formData.storage}
                onChange={(e) => handleChange('storage', e.target.value)}
                disabled={isSubmitting}
                className={`${inputClass} appearance-none pr-10 cursor-pointer`}
              >
                {STORAGE_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-dark-900 text-white">
                    {s} Storage
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </FormField>
        </div>

        {/* Processor / Chipset */}
        <FormField
          label="Processor / Chipset"
          id="processor"
          required={true}
          error={errors.processor}
          isChanged={Boolean(changedFields?.processor)}
          helperText="Silicon architecture (e.g. Apple A18 Pro (3nm), Snapdragon 8 Elite)"
        >
          <input
            id="processor"
            type="text"
            value={formData.processor}
            onChange={(e) => handleChange('processor', e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Snapdragon 8 Elite (3nm)"
            className={inputClass}
          />
        </FormField>

        {/* Display Specifications */}
        <FormField
          label="Display Specifications"
          id="display"
          required={true}
          error={errors.display}
          isChanged={Boolean(changedFields?.display)}
          helperText="Panel size, resolution, and refresh rate (e.g. 6.9-inch Super Retina XDR OLED 120Hz)"
        >
          <input
            id="display"
            type="text"
            value={formData.display}
            onChange={(e) => handleChange('display', e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. 6.8-inch Dynamic AMOLED 2X 120Hz"
            className={inputClass}
          />
        </FormField>

        {/* Battery & Charging */}
        <FormField
          label="Battery & Charging"
          id="battery"
          required={true}
          error={errors.battery}
          isChanged={Boolean(changedFields?.battery)}
          helperText="Capacity and charging speed (e.g. 5000 mAh (45W Fast Charging))"
        >
          <input
            id="battery"
            type="text"
            value={formData.battery}
            onChange={(e) => handleChange('battery', e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. 5000 mAh (45W Fast Charging)"
            className={inputClass}
          />
        </FormField>
      </FormSection>

      {/* SECTION 3: Inventory & Visibility */}
      <FormSection
        icon={<Boxes className="w-5 h-5" />}
        title="Inventory & Visibility"
        subtitle="Stock availability status and customer storefront visibility."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Stock Status Selection */}
          <FormField
            label="Initial Stock Availability"
            id="stockStatus"
            required={true}
            isChanged={Boolean(changedFields?.stockStatus)}
            helperText="Inventory availability badge shown to customers"
          >
            <div className="relative">
              <select
                id="stockStatus"
                value={formData.stockStatus}
                onChange={(e) => handleChange('stockStatus', e.target.value)}
                disabled={isSubmitting}
                className={`${inputClass} appearance-none pr-10 cursor-pointer`}
              >
                {STOCK_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </FormField>

          {/* Catalog Visibility Toggle */}
          <FormField
            label="Storefront Visibility"
            id="hidden"
            isChanged={Boolean(changedFields?.hidden)}
            helperText="Control whether this device appears publicly in search and catalog"
          >
            <div
              onClick={() => !isSubmitting && handleChange('hidden', !formData.hidden)}
              className="flex items-center justify-between p-3 rounded-2xl bg-dark-900/80 border border-dark-700/70 hover:border-dark-600 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                {formData.hidden ? (
                  <>
                    <EyeOff className="w-4 h-4 text-neutral-400" />
                    <span>Hidden from Storefront</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-indigo-400" />
                    <span>Visible to Customers</span>
                  </>
                )}
              </div>

              {/* iOS-Style Toggle Pill */}
              <div
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${
                  !formData.hidden ? 'bg-accent-500' : 'bg-dark-750 border border-dark-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-md ${
                    !formData.hidden ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </FormField>
        </div>
      </FormSection>

      {/* SECTION 4: Cloudinary Image Upload & Previews */}
      <FormSection
        icon={<ImageIcon className="w-5 h-5" />}
        title="Product Images"
        subtitle={
          isEditMode
            ? 'Manage existing Cloudinary images, replace selected photos, and upload new assets (max 5 total).'
            : 'Upload 1 to 5 flagship product shots stored in Cloudinary. The first asset will serve as the primary storefront hero.'
        }
      >
        {/* Existing Images Grid (Edit Mode) */}
        {isEditMode && existingImages?.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Current Product Images ({existingImages.length})
              </span>
              {changedFields?.images && (
                <ChangeIndicator isChanged={true} />
              )}
            </div>
            <ExistingImageGrid
              images={existingImages}
              onReplace={onReplaceExistingImage}
              onRemove={onRemoveExistingImage}
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* New Image Uploader (if under 5 total images) */}
        {((isEditMode ? existingImages.length : 0) + selectedImages.length) < 5 && (
          <FormField error={errors.images}>
            <ImageUploader
              onFilesSelected={handleImagesAdded}
              currentCount={(isEditMode ? existingImages.length : 0) + selectedImages.length}
              maxFiles={5}
              disabled={isSubmitting}
            />
          </FormField>
        )}

        {/* Live Preview Grid */}
        {selectedImages.length > 0 && (
          <div className="space-y-2 mt-4">
            {isEditMode && (
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Newly Added Images ({selectedImages.length})
              </span>
            )}
            <ImagePreviewGrid
              files={selectedImages}
              onRemove={handleImageRemoved}
              disabled={isSubmitting}
            />
          </div>
        )}
      </FormSection>

      {/* SECTION 5: Form Action Controls (Omitted when floating SaveBar is used) */}
      {!hideDefaultActions && (
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto border-dark-700 hover:border-dark-600 text-neutral-300"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            iconLeft={!isSubmitting ? <Sparkles className="w-4 h-4" /> : null}
            className="w-full sm:w-auto shadow-glow-sm"
          >
            {isSubmitting ? 'Publishing Smartphone...' : 'Create Smartphone'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default MobileForm;
