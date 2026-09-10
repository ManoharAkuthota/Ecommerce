/**
 * Mobile Storefront API Service
 * Module: services/mobileStoreService.js
 * 
 * Centralized service layer for customer storefront mobile catalog browsing,
 * multi-criteria search, filtering (brand, ram, storage), backend sorting, and pagination.
 * 
 * Target Backend Endpoints:
 * - GET /api/mobiles/search?name=&brand=&ram=&storage=&processor=&page=&size=&sort=
 * - GET /api/mobiles/{id}
 */

import { axiosClient } from './axiosClient';

export const mobileStoreService = {
  /**
   * Search and filter smartphones with backend pagination and sorting.
   * Endpoint: GET /api/mobiles/search
   * 
   * @param {Object} params Query parameters
   * @param {string} [params.name] Partial name query
   * @param {string} [params.brand] Brand filter (e.g. 'Apple', 'Samsung')
   * @param {string} [params.ram] RAM filter (e.g. '8GB', '12GB', '16GB')
   * @param {string} [params.storage] Storage filter (e.g. '128GB', '256GB', '512GB')
   * @param {string} [params.processor] Processor filter
   * @param {number} [params.page=0] Zero-based page index
   * @param {number} [params.size=12] Page size
   * @param {string} [params.sort='normal'] Sort directive: 'normal', 'price_asc', 'price_desc', 'latest'
   * @returns {Promise<Object>} Spring Data Page object containing content, totalElements, totalPages, number, etc.
   */
  searchMobiles: async (params = {}) => {
    const cleanParams = {};

    if (params.name && params.name.trim()) cleanParams.name = params.name.trim();
    if (params.brand && params.brand.trim()) cleanParams.brand = params.brand.trim();
    if (params.ram && params.ram.trim()) cleanParams.ram = params.ram.trim();
    if (params.storage && params.storage.trim()) cleanParams.storage = params.storage.trim();
    if (params.processor && params.processor.trim()) cleanParams.processor = params.processor.trim();

    cleanParams.page = typeof params.page === 'number' ? Math.max(0, params.page) : 0;
    cleanParams.size = typeof params.size === 'number' ? params.size : 12;
    cleanParams.sort = params.sort || 'normal';

    const response = await axiosClient.get('/mobiles/search', { params: cleanParams });
    return response.data;
  },

  /**
   * Alias for searchMobiles to support standard catalog fetching
   */
  getMobiles: async (params = {}) => {
    return mobileStoreService.searchMobiles(params);
  },

  /**
   * Fetch single mobile details by UUID.
   * Endpoint: GET /api/mobiles/{id}
   */
  getMobileById: async (id) => {
    const response = await axiosClient.get(`/mobiles/${id}`);
    return response.data;
  },

  /**
   * Helper utility to apply new filters while resetting page index to 0.
   */
  applyFilters: (newFilters = {}, currentParams = {}) => {
    return {
      ...currentParams,
      ...newFilters,
      page: 0, // Reset to first page whenever filter changes
    };
  },

  /**
   * Helper utility to apply a new sorting order while resetting page index to 0.
   */
  applySorting: (sortOption, currentParams = {}) => {
    return {
      ...currentParams,
      sort: sortOption || 'normal',
      page: 0,
    };
  },
};

export default mobileStoreService;
