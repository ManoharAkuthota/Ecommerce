/**
 * API Service Adapter
 * Module: services/api.js
 * 
 * Re-exports the centralized axiosClient to maintain full backward compatibility
 * with any existing code importing from services/api.
 */

import axiosClient, { setUnauthorizedCallback } from './axiosClient';

export { axiosClient, setUnauthorizedCallback };
export default axiosClient;
