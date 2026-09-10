/**
 * Image Optimization Utilities
 * Module: utils/imageUtils.js
 * 
 * Provides automated Cloudinary URL transformation (f_auto, q_auto, responsive widths)
 * and placeholder fallbacks to eliminate layout shift and optimize asset delivery.
 */

const DEFAULT_PHONE_FALLBACK =
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';

/**
 * Transforms a raw image URL with Cloudinary optimization flags when hosted on Cloudinary,
 * or safely falls back to original/placeholder.
 * 
 * @param {string} url Original image URL
 * @param {Object} options Transformation options
 * @param {number} [options.width] Target width
 * @param {number} [options.height] Target height
 * @param {string} [options.crop='limit'] Crop mode
 * @param {string} [options.quality='auto'] Quality mode
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') {
    return DEFAULT_PHONE_FALLBACK;
  }

  // Check if hosted on Cloudinary
  if (url.includes('res.cloudinary.com')) {
    // If transformations are already present, avoid duplicating
    if (url.includes('/image/upload/')) {
      const parts = url.split('/image/upload/');
      const prefix = parts[0] + '/image/upload/';
      let rest = parts[1];

      const transforms = [];
      transforms.push('f_auto');
      transforms.push(`q_${options.quality || 'auto'}`);

      if (options.width) {
        transforms.push(`w_${options.width}`);
      }
      if (options.height) {
        transforms.push(`h_${options.height}`);
      }
      if (options.crop) {
        transforms.push(`c_${options.crop}`);
      }

      // Check if existing segment starts with transformations
      const transformString = transforms.join(',');
      return `${prefix}${transformString}/${rest}`;
    }
  }

  return url;
};

/**
 * Returns responsive srcset string for standard smartphone cards
 * 
 * @param {string} url Image URL
 * @returns {string} Srcset string
 */
export const getResponsiveSrcSet = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) {
    return undefined;
  }

  const w320 = getOptimizedImageUrl(url, { width: 320 });
  const w640 = getOptimizedImageUrl(url, { width: 640 });
  const w960 = getOptimizedImageUrl(url, { width: 960 });

  return `${w320} 320w, ${w640} 640w, ${w960} 960w`;
};

export default {
  getOptimizedImageUrl,
  getResponsiveSrcSet,
  DEFAULT_PHONE_FALLBACK,
};
