/**
 * Customer Compare Service
 * Module: services/compareService.js
 * 
 * Handles network calls for retrieving, adding, removing, and clearing
 * smartphones in the customer's side-by-side comparison list.
 */

import axiosClient from './axiosClient';
import { userTokenStorage } from './userAuthService';

export const compareService = {
  /**
   * Fetch all compared smartphones for the authenticated customer.
   * GET /api/user/compare
   * 
   * @returns {Promise<{ items: Array, count: number, maxLimit: number, message: string }>}
   */
  async getComparison() {
    const token = userTokenStorage.getToken();
    if (!token) {
      return { items: [], count: 0, maxLimit: 4 };
    }

    const response = await axiosClient.get('/user/compare', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  /**
   * Add a smartphone product to the customer's comparison list.
   * POST /api/user/compare/{mobileId}
   * 
   * @param {string} mobileId UUID identifier of the smartphone
   * @returns {Promise<{ items: Array, count: number, maxLimit: number, message: string }>}
   */
  async addToCompare(mobileId) {
    const token = userTokenStorage.getToken();
    if (!token) {
      throw new Error('Customer authentication required');
    }

    const response = await axiosClient.post(
      `/user/compare/${mobileId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  /**
   * Remove a single smartphone from the customer's comparison list.
   * DELETE /api/user/compare/{mobileId}
   * 
   * @param {string} mobileId UUID identifier of the smartphone
   * @returns {Promise<{ items: Array, count: number, maxLimit: number, message: string }>}
   */
  async removeFromCompare(mobileId) {
    const token = userTokenStorage.getToken();
    if (!token) {
      throw new Error('Customer authentication required');
    }

    const response = await axiosClient.delete(`/user/compare/${mobileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  /**
   * Clear all smartphones from the customer's comparison list.
   * DELETE /api/user/compare
   * 
   * @returns {Promise<{ items: Array, count: number, maxLimit: number, message: string }>}
   */
  async clearComparison() {
    const token = userTokenStorage.getToken();
    if (!token) {
      throw new Error('Customer authentication required');
    }

    const response = await axiosClient.delete('/user/compare', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  /**
   * Retrieve total count of compared mobiles.
   * GET /api/user/compare/count
   * 
   * @returns {Promise<{ count: number, maxLimit: number }>}
   */
  async getCompareCount() {
    const token = userTokenStorage.getToken();
    if (!token) {
      return { count: 0, maxLimit: 4 };
    }

    const response = await axiosClient.get('/user/compare/count', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

export default compareService;
