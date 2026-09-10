/**
 * ProductGallery Component
 * Module: components/mobile-details/ProductGallery.jsx
 * 
 * Cloudinary-powered multi-image product gallery:
 * - Large main showcase image with interactive ImageZoom
 * - Ordered ThumbnailStrip for switching
 * - Smooth fade transitions and zero layout shifts
 */

import React, { useState, useEffect, useMemo } from 'react';
import ImageZoom from './ImageZoom';
import ThumbnailStrip from './ThumbnailStrip';

export const ProductGallery = ({ mobile, className = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Extract all valid image URLs in order
  const imageList = useMemo(() => {
    if (!mobile) return [];

    if (Array.isArray(mobile.imageUrls) && mobile.imageUrls.length > 0) {
      return mobile.imageUrls;
    }

    if (Array.isArray(mobile.images) && mobile.images.length > 0) {
      // Sort by imageOrder if present
      const sorted = [...mobile.images].sort(
        (a, b) => (a.imageOrder || 0) - (b.imageOrder || 0)
      );
      return sorted.map((img) => img.imageUrl).filter(Boolean);
    }

    if (mobile.image) {
      return [mobile.image];
    }

    return [];
  }, [mobile]);

  // Reset selected image if mobile changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [mobile?.id]);

  const activeImage = imageList[selectedIndex] || imageList[0] || null;
  const productName = mobile?.name || 'Smartphone';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Main Zoomable Image Frame */}
      <ImageZoom
        src={activeImage}
        alt={`${mobile?.brand || ''} ${productName}`}
      />

      {/* 2. Thumbnail Selector Strip (if more than 1 image) */}
      <ThumbnailStrip
        images={imageList}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
        productName={productName}
      />
    </div>
  );
};

export default ProductGallery;
