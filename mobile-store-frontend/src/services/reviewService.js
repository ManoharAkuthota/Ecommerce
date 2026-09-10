/**
 * Review API Service
 * Module: services/reviewService.js
 * 
 * Centralized service layer for Customer Review administration:
 * - Fetch all reviews or paginated subsets
 * - Fetch review by ID
 * - Delete customer review (Admin protected)
 * - Fetch global average rating score
 */

import { axiosClient } from './axiosClient';

export const reviewService = {
  /**
   * Fetch customer reviews with optional pagination
   * Endpoint: GET /api/reviews?page={page}&size={size}
   * 
   * @param {Object} [params]
   * @param {number} [params.page] Zero-based page index
   * @param {number} [params.size] Items per page
   * @returns {Promise<Array|Object>} Array of reviews or Spring Data Page object
   */
  getReviews: async (params = {}) => {
    const queryParams = {};
    if (params.page !== undefined && params.page !== null) {
      queryParams.page = params.page;
    }
    if (params.size !== undefined && params.size !== null) {
      queryParams.size = params.size;
    }

    const response = await axiosClient.get('/reviews', { params: queryParams });
    return response.data;
  },

  /**
   * Fetch all customer reviews without pagination
   * Endpoint: GET /api/reviews
   * 
   * @returns {Promise<Array>} List of ReviewResponse objects
   */
  getAllReviews: async () => {
    const response = await axiosClient.get('/reviews');
    return response.data;
  },

  /**
   * Fetch latest 8 reviews for showcase
   * Endpoint: GET /api/reviews/latest
   * 
   * @returns {Promise<Array>} List of latest ReviewResponse objects
   */
  getLatestReviews: async () => {
    const response = await axiosClient.get('/reviews/latest');
    return response.data;
  },

  /**
   * Fetch top 12 featured reviews for marquee
   * Endpoint: GET /api/reviews/featured
   * 
   * @returns {Promise<Array>} List of featured ReviewResponse objects
   */
  getFeaturedReviews: async () => {
    const response = await axiosClient.get('/reviews/featured');
    return response.data;
  },

  /**
   * Fetch a single review by its UUID
   * Endpoint: GET /api/reviews/{id}
   * 
   * @param {string} id Review UUID
   * @returns {Promise<Object>} ReviewResponse object
   */
  getReviewById: async (id) => {
    const response = await axiosClient.get(`/reviews/${id}`);
    return response.data;
  },

  /**
   * Delete a review by UUID (Requires ROLE_ADMIN)
   * Endpoint: DELETE /api/reviews/{id}
   * 
   * @param {string} id Review UUID
   * @returns {Promise<void>}
   */
  deleteReview: async (id) => {
    const response = await axiosClient.delete(`/reviews/${id}`);
    return response.data;
  },

  /**
   * Fetch global average rating metric
   * Endpoint: GET /api/reviews/average
   * 
   * @returns {Promise<{ averageRating: number }>}
   */
  getAverageRating: async () => {
    const response = await axiosClient.get('/reviews/average');
    return response.data;
  },

  /**
   * Submit a customer review after purchasing a smartphone
   * Endpoint: POST /api/reviews
   * 
   * @param {Object} reviewData
   * @param {string} reviewData.customerName
   * @param {string} [reviewData.customerImage]
   * @param {string} reviewData.purchasedPhone
   * @param {number} reviewData.rating (1-5)
   * @param {string} reviewData.reviewText
   * @returns {Promise<Object>} ReviewResponse
   */
  addReview: async (reviewData) => {
    const response = await axiosClient.post('/reviews', reviewData);
    return response.data;
  },
};

export default reviewService;
