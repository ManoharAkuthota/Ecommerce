/**
 * Order & Checkout API Service
 * Module: services/orderService.js
 * 
 * Provides centralized REST API integration for customer orders, checkout processing,
 * promo coupon validation, and administrative fulfillment management.
 */

import { axiosClient } from './axiosClient';
import { userTokenStorage } from './userAuthService';
import { tokenStorage } from '../utils/tokenStorage';

export const orderService = {
  // =========================================================================
  // Customer Methods (Using Customer JWT)
  // =========================================================================

  /**
   * Place a new checkout order.
   * Endpoint: POST /api/orders
   * 
   * @param {Object} orderData CreateOrderRequest payload
   * @returns {Promise<Object>} OrderResponse DTO
   */
  createOrder: async (orderData) => {
    const token = userTokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.post('/orders', orderData, { headers });
    return response.data;
  },

  /**
   * Retrieve all orders for the authenticated customer.
   * Endpoint: GET /api/account/orders
   * 
   * @returns {Promise<Array>} List of OrderResponse DTOs
   */
  getMyOrders: async () => {
    const token = userTokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get('/account/orders', { headers });
    return response.data;
  },

  /**
   * Retrieve single order details with full invoice & fulfillment tracking.
   * Endpoint: GET /api/account/orders/{id}
   * 
   * @param {string} orderId Order UUID
   * @returns {Promise<Object>} OrderResponse DTO
   */
  getMyOrderById: async (orderId) => {
    const token = userTokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get(`/account/orders/${orderId}`, { headers });
    return response.data;
  },

  /**
   * Public lookup by human-readable order number (e.g. MS-2026-8812).
   * Endpoint: GET /api/orders/lookup/{orderNumber}
   * 
   * @param {string} orderNumber
   * @returns {Promise<Object>} OrderResponse DTO
   */
  lookupOrderByNumber: async (orderNumber) => {
    const response = await axiosClient.get(`/orders/lookup/${orderNumber}`);
    return response.data;
  },

  /**
   * Complete simulated payment verification.
   * Endpoint: POST /api/orders/{id}/verify-payment
   * 
   * @param {string} orderId
   * @param {Object} paymentData
   * @returns {Promise<Object>} OrderResponse DTO
   */
  verifyPayment: async (orderId, paymentData) => {
    const response = await axiosClient.post(`/orders/${orderId}/verify-payment`, paymentData);
    return response.data;
  },

  /**
   * Cancel an active order.
   * Endpoint: POST /api/account/orders/{id}/cancel
   * 
   * @param {string} orderId
   * @param {string} reason
   * @returns {Promise<Object>} OrderResponse DTO
   */
  cancelOrder: async (orderId, reason) => {
    const token = userTokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.post(
      `/account/orders/${orderId}/cancel`,
      { reason },
      { headers }
    );
    return response.data;
  },

  /**
   * Validate promotional discount coupon against current cart subtotal.
   * Endpoint: POST /api/orders/coupon/validate
   * 
   * @param {string} code
   * @param {number} subtotal
   * @returns {Promise<Object>} CouponResponse DTO
   */
  validateCoupon: async (code, subtotal) => {
    const response = await axiosClient.post('/orders/coupon/validate', {
      code,
      subtotal,
    });
    return response.data;
  },

  // =========================================================================
  // Admin Methods (Using Admin JWT)
  // =========================================================================

  /**
   * Administrative order listing with pagination, status filter, and search.
   * Endpoint: GET /api/admin/orders
   * 
   * @param {Object} params { status, search, page, size }
   * @returns {Promise<Object>} Spring Data Page object
   */
  getAdminOrders: async (params = {}) => {
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get('/admin/orders', {
      params,
      headers,
    });
    return response.data;
  },

  /**
   * Admin inspect single order.
   * Endpoint: GET /api/admin/orders/{id}
   * 
   * @param {string} id
   * @returns {Promise<Object>} OrderResponse DTO
   */
  getAdminOrderById: async (id) => {
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get(`/admin/orders/${id}`, { headers });
    return response.data;
  },

  /**
   * Admin advance fulfillment status and update tracking details.
   * Endpoint: PATCH /api/admin/orders/{id}/status
   * 
   * @param {string} id
   * @param {Object} statusData { orderStatus, paymentStatus, trackingNumber, carrier, notes }
   * @returns {Promise<Object>} OrderResponse DTO
   */
  updateAdminOrderStatus: async (id, statusData) => {
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.patch(`/admin/orders/${id}/status`, statusData, { headers });
    return response.data;
  },

  /**
   * Admin fetch key order and revenue metrics.
   * Endpoint: GET /api/admin/orders/metrics
   * 
   * @returns {Promise<Object>} Metrics map
   */
  getAdminOrderMetrics: async () => {
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get('/admin/orders/metrics', { headers });
    return response.data;
  },
};

export default orderService;
