/**
 * Home Page API Service
 * Module: services/homeService.js
 * 
 * Centralized service layer for public storefront homepage data:
 * - Fetch top 8 latest flagship smartphones (GET /api/mobiles/latest)
 * - Fetch latest customer reviews / testimonials (GET /api/reviews/latest)
 */

import { axiosClient } from './axiosClient';

export const homeService = {
  /**
   * Fetch the top 8 latest visible flagship smartphones for the homepage showcase
   * Endpoint: GET /api/mobiles/latest
   * 
   * @returns {Promise<Array>} Array of MobileResponse objects
   */
  getLatestMobiles: async () => {
    const response = await axiosClient.get('/mobiles/latest');
    return response.data;
  },

  /**
   * Fetch the latest customer reviews for the testimonial marquee
   * Endpoint: GET /api/reviews/latest
   * 
   * @returns {Promise<Array>} Array of ReviewResponse objects
   */
  getLatestReviews: async () => {
    const response = await axiosClient.get('/reviews/latest');
    return response.data;
  },

  /**
   * Fetch featured customer reviews for the marquee showcase
   * Endpoint: GET /api/reviews/featured
   * 
   * @returns {Promise<Array>} Array of featured ReviewResponse objects
   */
  getFeaturedReviews: async () => {
    const response = await axiosClient.get('/reviews/featured');
    return response.data;
  },
};

export default homeService;
