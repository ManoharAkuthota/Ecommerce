/**
 * Customer Wishlist Service
 * Module: services/wishlistService.js
 * 
 * Handles network calls for retrieving, adding, and removing saved smartphones
 * from the customer's wishlist.
 */

import axiosClient from './axiosClient';
import { userTokenStorage } from './userAuthService';

export const wishlistService = {
  /**
   * Fetch all saved smartphones for the authenticated customer.
   * GET /api/user/wishlist
   * 
   * @returns {Promise<{ items: Array, count: number, message: string }>}
   */
  async getWishlist() {
    const token = userTokenStorage.getToken();
    if (!token) {
      return { items: [], count: 0 };
    }

    const response = await axiosClient.get('/user/wishlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  /**
   * Add a smartphone product to the customer's wishlist.
   * POST /api/user/wishlist/{mobileId}
   * 
   * @param {string} mobileId UUID identifier of the smartphone
   * @returns {Promise<{ items: Array, count: number, message: string }>}
   */
  async addToWishlist(mobileId) {
    const token = userTokenStorage.getToken();
    if (!token) {
      throw new Error('Customer authentication required');
    }

    const response = await axiosClient.post(
      `/user/wishlist/${mobileId}`,
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
   * Remove a smartphone product from the customer's wishlist.
   * DELETE /api/user/wishlist/{mobileId}
   * 
   * @param {string} mobileId UUID identifier of the smartphone
   * @returns {Promise<{ items: Array, count: number, message: string }>}
   */
  async removeFromWishlist(mobileId) {
    const token = userTokenStorage.getToken();
    if (!token) {
      throw new Error('Customer authentication required');
    }

    const response = await axiosClient.delete(`/user/wishlist/${mobileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  /**
   * Fetch total count of saved wishlist items.
   * GET /api/user/wishlist/count
   * 
   * @returns {Promise<{ count: number }>}
   */
  async getWishlistCount() {
    const token = userTokenStorage.getToken();
    if (!token) {
      return { count: 0 };
    }

    const response = await axiosClient.get('/user/wishlist/count', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

export default wishlistService;
