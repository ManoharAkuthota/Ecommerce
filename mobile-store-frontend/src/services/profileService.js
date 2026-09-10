/**
 * Customer Profile Management Service
 * Module: services/profileService.js
 * 
 * Handles network requests for customer personal information, profile photo uploads
 * via Spring Boot / Cloudinary, and avatar removal.
 */

import axiosClient from './axiosClient';
import { userTokenStorage } from './userAuthService';

export const profileService = {
  /**
   * Fetch authenticated customer's profile details.
   * GET /api/account/profile
   * 
   * @returns {Promise<Object>} ProfileResponse
   */
  async getProfile() {
    const token = userTokenStorage.getToken();
    if (!token) {
      throw new Error('No user session token found');
    }

    const response = await axiosClient.get('/account/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  /**
   * Update customer profile personal details and/or profile photo.
   * PUT /api/account/profile
   * 
   * @param {Object} params
   * @param {string} params.fullName
   * @param {string} params.phoneNumber
   * @param {File|null} [params.imageFile]
   * @param {boolean} [params.removeImage]
   * @returns {Promise<Object>} Updated ProfileResponse
   */
  async updateProfile({ fullName, phoneNumber, imageFile = null, removeImage = false }) {
    const token = userTokenStorage.getToken();
    if (!token) {
      throw new Error('No user session token found');
    }

    // When an image file is present or image removal is explicitly requested, send multipart/form-data
    if (imageFile || removeImage) {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('phoneNumber', phoneNumber.trim());
      formData.append('removeImage', String(Boolean(removeImage)));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axiosClient.put('/account/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    }

    // Text-only update via JSON payload
    const response = await axiosClient.put(
      '/account/profile',
      {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        removeImage: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  },
};

export default profileService;
