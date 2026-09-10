/**
 * Administrative Customer Management API Service
 * Module: services/customerService.js
 * 
 * Provides administrative integration for customer accounts, CRM records,
 * lifetime spend calculations, and customer connect capabilities.
 */

import { axiosClient } from './axiosClient';
import { tokenStorage } from '../utils/tokenStorage';

export const customerService = {
  /**
   * Fetch all registered customers with aggregate metrics.
   * Endpoint: GET /api/admin/customers
   * 
   * @returns {Promise<Array>} List of CustomerSummaryResponse objects
   */
  getAdminCustomers: async () => {
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get('/admin/customers', { headers });
    return response.data;
  },

  /**
   * Fetch complete profile and full order history for an individual customer.
   * Endpoint: GET /api/admin/customers/{id}
   * 
   * @param {string} customerId
   * @returns {Promise<Object>} CustomerSummaryResponse object
   */
  getAdminCustomerById: async (customerId) => {
    if (!customerId) throw new Error('Customer ID is required');
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get(`/admin/customers/${customerId}`, { headers });
    return response.data;
  },
};

export default customerService;
