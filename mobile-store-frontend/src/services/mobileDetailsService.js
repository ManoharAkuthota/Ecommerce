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

export const mobileDetailsService = {
  /**
   * Fetch single mobile details by UUID.
   * Endpoint: GET /api/mobiles/{id}
   * 
   * @param {string} id Product UUID
   * @returns {Promise<Object>} MobileResponse DTO
   */
  getMobileById: async (id) => {
    if (!id) throw new Error('Mobile ID is required');
    const response = await axiosClient.get(`/mobiles/${id}`);
    return response.data;
  },

  /**
   * Fetch related flagship products excluding the current mobile.
   * Endpoint: GET /api/mobiles/latest
   * 
   * @param {string} currentId Product UUID to exclude from results
   * @param {number} [limit=4] Maximum number of recommendations to return
   * @returns {Promise<Array>} Array of up to 4 recommended MobileResponse objects
   */
  getRelatedMobiles: async (currentId, limit = 4) => {
    const response = await axiosClient.get('/mobiles/latest');
    const allLatest = Array.isArray(response.data) ? response.data : [];
    
    // Exclude currently viewed device and limit to requested count
    const filtered = allLatest.filter((item) => item.id !== currentId);
    return filtered.slice(0, limit);
  },
};

export default mobileDetailsService;
