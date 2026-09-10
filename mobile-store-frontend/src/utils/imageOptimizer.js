/**
 * Image Optimization Utility for Fast Mobile & Web Performance
 * Module: utils/imageOptimizer.js
 * 
 * Automatically downscales and compresses Unsplash and Cloudinary images
 * using dynamic query params and transforms, reducing bandwidth consumption
 * by up to 90% on cellular mobile networks.
 */

export const getOptimizedImageUrl = (url, width = 450) => {
  if (!url || typeof url !== 'string') return null;

  // Unsplash dynamic optimization: webp/avif, width constraint, 70% quality
  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    return `${base}?auto=format&fit=crop&w=${width}&q=70`;
  }

  // Cloudinary dynamic optimization: auto-format, auto-quality, max width
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('/upload/w_') && !url.includes('/upload/c_')) {
      return url.replace('/upload/', `/upload/w_${width},c_limit,q_auto,f_auto/`);
    }
  }

  return url;
};

export default getOptimizedImageUrl;
