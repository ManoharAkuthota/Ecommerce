/**
 * Contact Concierge API Service
 * Module: services/contactService.js
 * 
 * Service layer for customer concierge inquiry submissions.
 * Submits validated contact messages directly to the Spring Boot backend:
 * - POST /api/contact
 */

import { axiosClient } from './axiosClient';
import { userTokenStorage } from './userAuthService';

export const contactService = {
  /**
   * Submit a customer contact inquiry message to the backend.
   * Endpoint: POST /api/contact (Public / Customer)
   * 
   * @param {Object} data Contact form data
   * @param {string} data.name Customer's full name
   * @param {string} data.email Customer's email address
   * @param {string} [data.subject] Inquiry subject
   * @param {string} data.message Customer's message body
   * @param {string} [data.phone] Optional phone number
   * @returns {Promise<Object>} ContactResponse DTO
   */
  sendMessage: async (data) => {
    if (!data) throw new Error('Contact data is required');

    const subjectPrefix = data.subject?.trim() ? `[Subject: ${data.subject.trim()}]\n\n` : '';
    const formattedMessage = `${subjectPrefix}${data.message?.trim() || ''}`;

    const payload = {
      name: data.name?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim() || '+1 (800) 555-0199',
      message: formattedMessage,
      subject: data.subject?.trim(),
    };

    const response = await axiosClient.post('/contact', payload);
    return response.data;
  },

  /**
   * Fetch all customer contact inquiries for the Admin / Shop Owner Inbox.
   * Endpoint: GET /api/contact (Requires ROLE_ADMIN)
   * 
   * @returns {Promise<Array>} List of ContactResponse objects
   */
  getAllMessages: async () => {
    const response = await axiosClient.get('/contact');
    return response.data;
  },

  /**
   * Fetch a single contact inquiry by UUID.
   * Endpoint: GET /api/contact/{id} (Requires ROLE_ADMIN)
   * 
   * @param {string} id Inquiry UUID
   * @returns {Promise<Object>} ContactResponse
   */
  getMessageById: async (id) => {
    const response = await axiosClient.get(`/contact/${id}`);
    return response.data;
  },

  /**
   * Submit an in-app administrator response to a customer inquiry.
   * Endpoint: PUT /api/contact/{id}/reply (Requires ROLE_ADMIN)
   * 
   * @param {string} id Inquiry UUID
   * @param {Object} data
   * @param {string} data.replyMessage In-app response text
   * @param {string} [data.status] Optional updated status (e.g. 'REPLIED', 'RESOLVED')
   * @returns {Promise<Object>} Updated ContactResponse
   */
  replyToMessage: async (id, data) => {
    const response = await axiosClient.put(`/contact/${id}/reply`, data);
    return response.data;
  },

  /**
   * Update the status of a customer inquiry (e.g. 'PENDING', 'REPLIED', 'RESOLVED').
   * Endpoint: PATCH /api/contact/{id}/status?status={status} (Requires ROLE_ADMIN)
   * 
   * @param {string} id Inquiry UUID
   * @param {string} status New status string
   * @returns {Promise<Object>} Updated ContactResponse
   */
  updateStatus: async (id, status) => {
    const response = await axiosClient.patch(`/contact/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  /**
   * Delete an inquiry from the admin inbox.
   * Endpoint: DELETE /api/contact/{id} (Requires ROLE_ADMIN)
   * 
   * @param {string} id Inquiry UUID
   * @returns {Promise<void>}
   */
  deleteMessage: async (id) => {
    const response = await axiosClient.delete(`/contact/${id}`);
    return response.data;
  },

  /**
   * Retrieve all inquiries submitted by the currently logged-in customer.
   * Endpoint: GET /api/user/inquiries (Requires ROLE_USER)
   * 
   * @returns {Promise<Array>} List of ContactResponse objects for this customer
   */
  getUserInquiries: async () => {
    const token = userTokenStorage.getToken();
    if (!token) {
      return [];
    }

    const response = await axiosClient.get('/user/inquiries', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default contactService;
