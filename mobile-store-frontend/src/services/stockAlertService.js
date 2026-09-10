/**
 * Stock Restock Alerts API Service
 * Module: services/stockAlertService.js
 * 
 * Provides customer subscription integration for out-of-stock devices
 * and administrative restock demand metrics.
 */

import { axiosClient } from './axiosClient';
import { userTokenStorage } from './userAuthService';
import { tokenStorage } from '../utils/tokenStorage';

export const stockAlertService = {
  /**
   * Subscribe for restock alert notification
   * Endpoint: POST /api/stock-alerts
   * 
   * @param {Object} data { mobileId, email, phoneNumber }
   * @returns {Promise<Object>} StockAlertResponse
   */
  subscribe: async (data) => {
    const token = userTokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.post('/stock-alerts', data, { headers });
    return response.data;
  },

  /**
   * Retrieve active alerts subscribed by the current customer
   * Endpoint: GET /api/stock-alerts/my-alerts
   * 
   * @returns {Promise<Array>} List of StockAlertResponse
   */
  getMyAlerts: async () => {
    const token = userTokenStorage.getToken();
    if (!token) return [];
    const response = await axiosClient.get('/stock-alerts/my-alerts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Cancel / Unsubscribe from restock alert
   * Endpoint: DELETE /api/stock-alerts/{id}
   */
  unsubscribe: async (id) => {
    const token = userTokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axiosClient.delete(`/stock-alerts/${id}`, { headers });
  },

  /**
   * Admin: Get total pending restock demand count
   * Endpoint: GET /api/stock-alerts/admin/metrics
   */
  getAdminMetrics: async () => {
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get('/stock-alerts/admin/metrics', { headers });
    return response.data;
  },
};

export default stockAlertService;
