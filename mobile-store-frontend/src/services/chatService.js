/**
 * Live Chat API Service
 * Module: services/chatService.js
 * 
 * Provides conversational chat capabilities between customer and store admin/owner:
 * - Customer endpoints: /api/chat/messages
 * - Admin endpoints: /api/admin/chat/conversations
 */

import { axiosClient } from './axiosClient';
import { userTokenStorage } from './userAuthService';
import { tokenStorage } from '../utils/tokenStorage';

export const chatService = {
  // ==========================================
  // Customer & Visitor Chat Methods (User/Guest Token)
  // ==========================================

  /**
   * Initialize an instant guest live chat session for a storefront visitor.
   * Endpoint: POST /api/auth/guest-session
   * 
   * @param {Object} guestData { fullName, email, phoneNumber }
   * @returns {Promise<Object>} UserLoginResponse
   */
  createGuestSession: async (guestData = {}) => {
    const response = await axiosClient.post('/auth/guest-session', guestData);
    if (response.data?.token) {
      userTokenStorage.saveToken(response.data.token);
      userTokenStorage.saveProfile({
        id: response.data.id,
        fullName: response.data.fullName || 'Store Visitor',
        email: response.data.email,
        role: response.data.role || 'ROLE_USER',
        isGuest: true,
      });
    }
    return response.data;
  },

  /**
   * Check whether a customer or visitor session token currently exists.
   * @returns {boolean}
   */
  hasSession: () => {
    return Boolean(userTokenStorage.getToken());
  },

  /**
   * Fetch the customer's private chat conversation thread with the store.
   * Endpoint: GET /api/chat/messages?channel=SUPPORT|TRACKING&markRead=true|false
   * 
   * @param {string} [channel] Optional filter ('SUPPORT' or 'TRACKING')
   * @param {boolean} [markRead=false] Whether to mark returned messages as read
   * @returns {Promise<Array>} List of ChatMessageResponse objects
   */
  getCustomerChat: async (channel, markRead = false) => {
    const token = userTokenStorage.getToken();
    if (!token) return [];

    const params = {};
    if (channel) params.channel = channel;
    if (markRead) params.markRead = true;

    const response = await axiosClient.get('/chat/messages', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Send a chat message from the customer to the store owner or logistics bot.
   * Endpoint: POST /api/chat/messages
   * 
   * @param {string} message Message text
   * @param {string} [channel='SUPPORT'] Channel to post into ('SUPPORT' or 'TRACKING')
   * @returns {Promise<Object>} ChatMessageResponse
   */
  sendCustomerMessage: async (message, channel = 'SUPPORT') => {
    if (!message || !message.trim()) {
      throw new Error('Message cannot be empty');
    }

    const token = userTokenStorage.getToken();
    if (!token) throw new Error('Customer authentication required');

    const response = await axiosClient.post(
      '/chat/messages',
      { message: message.trim(), channel: channel || 'SUPPORT' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Mark all unread store replies as read by customer, optionally for a specific channel.
   * Endpoint: POST /api/chat/read?channel=SUPPORT|TRACKING
   * 
   * @param {string} [channel] Optional channel to mark as read
   */
  markCustomerChatRead: async (channel) => {
    const token = userTokenStorage.getToken();
    if (!token) return;

    const params = channel ? { channel } : {};
    await axiosClient.post(
      '/chat/read',
      {},
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // ==========================================
  // Admin Chat Methods (Admin Token)
  // ==========================================

  /**
   * Fetch all active customer conversations for the Admin Messenger Console.
   * Endpoint: GET /api/admin/chat/conversations
   * 
   * @returns {Promise<Array>} List of ChatConversationResponse objects
   */
  getAdminConversations: async () => {
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get('/admin/chat/conversations', { headers });
    return response.data;
  },

  /**
   * Fetch full chat history with a specific customer.
   * Endpoint: GET /api/admin/chat/conversations/{customerId}
   * 
   * @param {string} customerId Customer UUID
   * @returns {Promise<Array>} List of ChatMessageResponse objects
   */
  getAdminCustomerChat: async (customerId) => {
    if (!customerId) throw new Error('Customer ID is required');
    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.get(`/admin/chat/conversations/${customerId}`, { headers });
    return response.data;
  },

  /**
   * Send an administrator reply directly back to that specific customer's chat screen.
   * Endpoint: POST /api/admin/chat/conversations/{customerId}/reply
   * 
   * @param {string} customerId Customer UUID
   * @param {string} message Reply message text
   * @returns {Promise<Object>} ChatMessageResponse
   */
  sendAdminReply: async (customerId, message) => {
    if (!customerId) throw new Error('Customer ID is required');
    if (!message || !message.trim()) throw new Error('Reply message cannot be empty');

    const token = tokenStorage.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosClient.post(
      `/admin/chat/conversations/${customerId}/reply`,
      { message: message.trim() },
      { headers }
    );
    return response.data;
  },
};

export default chatService;
