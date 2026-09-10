/**
 * Home Page API Service
 * Module: services/homeService.js
 * 
 * Centralized service layer for public storefront homepage data:
 * - Fetch top 8 latest flagship smartphones (GET /api/mobiles/latest)
 * - Fetch latest customer reviews / testimonials (GET /api/reviews/latest)
 */

import { axiosClient } from './axiosClient';

// In-memory and localStorage cache for instant 0ms mobile page loads
let cachedLatestMobiles = null;
let lastLatestMobilesTime = 0;
let cachedFeaturedReviews = null;
let lastFeaturedReviewsTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const STORAGE_KEY_MOBILES = 'ms_cached_latest_mobiles';
const STORAGE_KEY_REVIEWS = 'ms_cached_featured_reviews';

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const localMobiles = localStorage.getItem(STORAGE_KEY_MOBILES);
    if (localMobiles) {
      cachedLatestMobiles = JSON.parse(localMobiles);
    }
    const localReviews = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (localReviews) {
      cachedFeaturedReviews = JSON.parse(localReviews);
    }
  }
} catch (e) {
  // Safe fallback
}

export const homeService = {
  /**
   * Fetch top 8 latest visible flagship smartphones with offline-first caching
   * Endpoint: GET /api/mobiles/latest
   */
  getLatestMobiles: async (forceRefresh = false) => {
    const now = Date.now();
    // Return cached immediately if within TTL
    if (!forceRefresh && cachedLatestMobiles && (now - lastLatestMobilesTime < CACHE_TTL_MS)) {
      return cachedLatestMobiles;
    }

    try {
      const response = await axiosClient.get('/mobiles/latest');
      if (Array.isArray(response.data) && response.data.length > 0) {
        cachedLatestMobiles = response.data;
        lastLatestMobilesTime = Date.now();
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(STORAGE_KEY_MOBILES, JSON.stringify(response.data));
          }
        } catch (e) {}
        return response.data;
      }
    } catch (err) {
      // If network fails or times out on mobile, fallback to cached data if available
      if (cachedLatestMobiles) {
        return cachedLatestMobiles;
      }
      throw err;
    }

    return cachedLatestMobiles || [];
  },

  /**
   * Return synchronously cached latest mobiles without network delay if available
   */
  getCachedLatestMobiles: () => cachedLatestMobiles,

  /**
   * Fetch the latest customer reviews
   * Endpoint: GET /api/reviews/latest
   */
  getLatestReviews: async () => {
    const response = await axiosClient.get('/reviews/latest');
    return response.data;
  },

  /**
   * Fetch featured customer reviews with in-memory caching
   * Endpoint: GET /api/reviews/featured
   */
  getFeaturedReviews: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && cachedFeaturedReviews && (now - lastFeaturedReviewsTime < CACHE_TTL_MS)) {
      return cachedFeaturedReviews;
    }
    const response = await axiosClient.get('/reviews/featured');
    cachedFeaturedReviews = response.data;
    lastFeaturedReviewsTime = Date.now();
    return response.data;
  },
};

export default homeService;
