/**
 * Admin Mobile Management API Service
 * Module: services/mobileService.js
 * 
 * Provides centralized REST API integration for mobile device management:
 * - Inventory querying (with hidden devices included for administrative control)
 * - Multi-criteria search and sorting
 * - Stock status modification (IN_STOCK, LIMITED_STOCK, OUT_OF_STOCK)
 * - Catalog visibility management (hidden/visible)
 * - Device deletion
 * - Catalog filter facets
 */

import { axiosClient } from './axiosClient';

export const mobileService = {
  /**
   * Fetch all smartphone devices (administrative list including hidden products).
   * 
   * @param {Object} params Optional query parameters (e.g. { includeHidden: true })
   * @returns {Promise<Array>} List of MobileResponse DTOs
   */
  getMobiles: async (params = {}) => {
    const response = await axiosClient.get('/mobiles', {
      params: {
        includeHidden: true,
        ...params,
      },
    });
    return response.data;
  },

  /**
   * Search and filter smartphones with server-side pagination and sorting.
   * 
   * @param {Object} params Criteria (name, brand, ram, storage, processor, page, size, sort)
   * @returns {Promise<Object>} Spring Data Page object containing content array and pagination metadata
   */
  searchMobiles: async (params = {}) => {
    const response = await axiosClient.get('/mobiles/search', {
      params,
    });
    return response.data;
  },

  /**
   * Retrieve a single smartphone device by its UUID.
   * 
   * @param {string} id Product UUID
   * @returns {Promise<Object>} MobileResponse DTO
   */
  getMobileById: async (id) => {
    const response = await axiosClient.get(`/mobiles/${id}`);
    return response.data;
  },

  /**
   * Update the inventory stock status of a smartphone.
   * 
   * @param {string} id Product UUID
   * @param {string} stockStatus 'IN_STOCK' | 'LIMITED_STOCK' | 'OUT_OF_STOCK'
   * @returns {Promise<Object>} Updated MobileResponse DTO
   */
  updateStock: async (id, stockStatus) => {
    const response = await axiosClient.patch(`/mobiles/${id}/stock`, {
      stockStatus,
    });
    return response.data;
  },

  /**
   * Update the visibility status (hidden/visible) of a smartphone.
   * 
   * @param {string} id Product UUID
   * @param {boolean} hidden true to hide, false to make visible
   * @returns {Promise<Object>} Updated MobileResponse DTO
   */
  updateVisibility: async (id, hidden) => {
    const response = await axiosClient.patch(`/mobiles/${id}/visibility`, {
      hidden,
    });
    return response.data;
  },

  /**
   * Delete a smartphone device from the catalog.
   * 
   * @param {string} id Product UUID
   * @returns {Promise<void>} HTTP 204 No Content
   */
  deleteMobile: async (id) => {
    const response = await axiosClient.delete(`/mobiles/${id}`);
    return response.data;
  },

  /**
   * Retrieve dynamic catalog filter facets (brands, ram, storage options).
   * 
   * @returns {Promise<Object>} Filter options map
   */
  getFilters: async () => {
    const response = await axiosClient.get('/mobiles/filters');
    return response.data;
  },

  /**
   * Create a new smartphone product with multipart/form-data images.
   * 
   * @param {FormData} formData Multipart payload containing product details and images
   * @param {Function} onUploadProgress Optional Axios progress callback
   * @returns {Promise<Object>} Created MobileResponse DTO
   */
  createMobile: async (formData, onUploadProgress) => {
    const response = await axiosClient.post('/mobiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  /**
   * Update an existing smartphone product.
   * Supports either multipart FormData (with replacement/new images) or JSON payload.
   * 
   * @param {string} id Product UUID
   * @param {FormData|Object} payload Multipart FormData or JSON object
   * @param {Function} onUploadProgress Optional progress callback
   * @returns {Promise<Object>} Updated MobileResponse DTO
   */
  updateMobile: async (id, payload, onUploadProgress) => {
    const isMultipart = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = {
      headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
      onUploadProgress,
    };
    const response = await axiosClient.put(`/mobiles/${id}`, payload, config);
    return response.data;
  },

  /**
   * Delete a specific image from a mobile device.
   * 
   * @param {string} mobileId Product UUID
   * @param {string} imageId Image UUID
   * @returns {Promise<Object>} Updated MobileResponse DTO
   */
  deleteMobileImage: async (mobileId, imageId) => {
    const response = await axiosClient.delete(`/mobiles/${mobileId}/images/${imageId}`);
    return response.data;
  },
};

export default mobileService;
