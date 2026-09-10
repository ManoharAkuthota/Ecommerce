/**
 * Home Page API Service
 * Module: services/homeService.js
 * 
 * Centralized service layer for public storefront homepage data:
 * - Fetch top 8 latest flagship smartphones (GET /api/mobiles/latest)
 * - Fetch latest customer reviews / testimonials (GET /api/reviews/latest)
 */

import { axiosClient } from './axiosClient';

// In-memory cache for ultra-fast mobile navigation
let cachedLatestMobiles = null;
let lastLatestMobilesTime = 0;
let cachedFeaturedReviews = null;
let lastFeaturedReviewsTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const homeService = {
  /**
   * Fetch top 8 latest visible flagship smartphones with in-memory caching
   * Endpoint: GET /api/mobiles/latest
   */
  getLatestMobiles: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && cachedLatestMobiles && (now - lastLatestMobilesTime < CACHE_TTL_MS)) {
      return cachedLatestMobiles;
    }
    const response = await axiosClient.get('/mobiles/latest');
    cachedLatestMobiles = response.data;
    lastLatestMobilesTime = Date.now();
    return response.data;
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
