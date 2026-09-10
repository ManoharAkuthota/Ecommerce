/**
 * Mobile Details API Service
 * Module: services/mobileDetailsService.js
 * 
 * Centralized service layer for fetching single product details and
 * related smartphone recommendations.
 * 
 * Target Backend Endpoints:
 * - GET /api/mobiles/{id}
 * - GET /api/mobiles/latest
 */

import { axiosClient } from './axiosClient';
import { homeService } from './homeService';

// In-memory cache for individual smartphone details
const mobileDetailCache = new Map();

export const mobileDetailsService = {
  /**
   * Save a mobile into client cache (e.g. from catalog list or card click)
   */
  setCachedMobile: (mobile) => {
    if (mobile && mobile.id) {
      mobileDetailCache.set(mobile.id, mobile);
    }
  },

  /**
   * Get synchronously cached mobile if available
   */
  getCachedMobile: (id) => {
    if (!id) return null;
    if (mobileDetailCache.has(id)) {
      return mobileDetailCache.get(id);
    }
    const latest = homeService.getCachedLatestMobiles();
    if (Array.isArray(latest)) {
      const found = latest.find((m) => m.id === id);
      if (found) {
        mobileDetailCache.set(id, found);
        return found;
      }
    }
    return null;
  },

  /**
   * Fetch single mobile details by UUID with SWR (stale-while-revalidate) cache.
   * Endpoint: GET /api/mobiles/{id}
   */
  getMobileById: async (id) => {
    if (!id) throw new Error('Mobile ID is required');

    // Return instant cache hit if available
    const cached = mobileDetailsService.getCachedMobile(id);
    if (cached) {
      axiosClient
        .get(`/mobiles/${id}`)
        .then((res) => {
          if (res.data) mobileDetailCache.set(id, res.data);
        })
        .catch(() => {});
      return cached;
    }

    const response = await axiosClient.get(`/mobiles/${id}`);
    if (response.data) {
      mobileDetailCache.set(id, response.data);
    }
    return response.data;
  },

  /**
   * Fetch related flagship products excluding the current mobile.
   * Reuses cached latest mobiles to avoid redundant network hits.
   */
  getRelatedMobiles: async (currentId, limit = 4) => {
    const allLatest = await homeService.getLatestMobiles();
    const list = Array.isArray(allLatest) ? allLatest : [];
    const filtered = list.filter((item) => item.id !== currentId);
    return filtered.slice(0, limit);
  },
};

export default mobileDetailsService;
