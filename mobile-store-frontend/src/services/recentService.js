/**
 * Recently Viewed Smartphones Service
 * Module: services/recentService.js
 * 
 * Manages client-side recently viewed smartphone history in localStorage.
 * Deduplicates entries and keeps the most recent 20 devices.
 */

const RECENT_KEY = 'ms_recently_viewed_devices';
const MAX_RECENT_ITEMS = 20;

export const recentService = {
  /**
   * Retrieve all recently viewed smartphones.
   * @returns {Array} List of smartphone objects sorted by most recent
   */
  getRecent() {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  /**
   * Add a smartphone to recently viewed history.
   * @param {Object} mobile Smartphone object
   */
  addRecent(mobile) {
    if (!mobile || !mobile.id) return;
    try {
      const current = this.getRecent();
      // Remove existing occurrence to place it at the front
      const filtered = current.filter((item) => item.id !== mobile.id);
      
      const entry = {
        id: mobile.id,
        name: mobile.name,
        brand: mobile.brand,
        price: mobile.price,
        images: mobile.images || [],
        ram: mobile.ram,
        storage: mobile.storage,
        processor: mobile.processor,
        display: mobile.display,
        battery: mobile.battery,
        stockStatus: mobile.stockStatus || (mobile.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK'),
        viewedAt: new Date().toISOString(),
      };

      const updated = [entry, ...filtered].slice(0, MAX_RECENT_ITEMS);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('[recentService] Failed to persist recent mobile:', err);
    }
  },

  /**
   * Remove a single smartphone from history.
   * @param {string} mobileId
   * @returns {Array} Updated list
   */
  removeRecent(mobileId) {
    try {
      const current = this.getRecent();
      const updated = current.filter((item) => item.id !== mobileId);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  /**
   * Clear all recently viewed devices.
   */
  clearRecent() {
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch {
      // Ignored
    }
  },
};

export default recentService;
