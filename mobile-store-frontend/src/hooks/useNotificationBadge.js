/**
 * Custom Hook: useNotificationBadge
 * Module: hooks/useNotificationBadge.js
 * 
 * Manages live notification state for the top navigation bell across:
 * - Storefront header (Navbar.jsx)
 * - Customer Dashboard header (UserHeader.jsx)
 * - Navigation drawers & sidebars (MobileMenu, UserSidebar, UserMobileSidebar)
 * 
 * Subscribes to real-time 'notifications-updated' custom window events
 * to ensure instant reactive badge synchronization without page reloads.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserAuth } from './useUserAuth';
import notificationService, {
  NOTIFICATIONS_UPDATED_EVENT,
  NOTIFICATIONS_READ_KEY,
} from '../services/notificationService';
import orderService from '../services/orderService';
import contactService from '../services/contactService';

export const useNotificationBadge = () => {
  const { isAuthenticated, user } = useUserAuth();

  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [readIds, setReadIds] = useState(() => notificationService.getReadIds());
  const [dismissedIds, setDismissedIds] = useState(() => notificationService.getDismissedIds());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch orders and concierge inquiries for authenticated customers
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setInquiries([]);
      return;
    }

    setIsLoading(true);
    try {
      const [ordersRes, inqRes] = await Promise.allSettled([
        orderService.getMyOrders(),
        contactService.getUserInquiries(),
      ]);

      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      }
      if (inqRes.status === 'fulfilled' && Array.isArray(inqRes.value)) {
        setInquiries(inqRes.value);
      }
    } catch (err) {
      console.warn('[useNotificationBadge] Error fetching notification items:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial fetch and refetch on auth change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sync with local read/dismissed state changes across tabs and components
  useEffect(() => {
    const handleSync = () => {
      setReadIds(notificationService.getReadIds());
      setDismissedIds(notificationService.getDismissedIds());
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);

    // Refresh every 60 seconds or on window focus
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    }, 60000);

    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [fetchData]);

  // Build aggregated notification items
  const allNotifications = useMemo(() => {
    return notificationService.buildNotifications({
      orders,
      inquiries,
      user: isAuthenticated ? user : null,
    });
  }, [orders, inquiries, user, isAuthenticated]);

  // Filter out dismissed notifications
  const activeNotifications = useMemo(() => {
    return allNotifications.filter((n) => !dismissedIds.includes(n.id));
  }, [allNotifications, dismissedIds]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notificationService.calculateUnreadCount(
      activeNotifications,
      readIds,
      dismissedIds
    );
  }, [activeNotifications, readIds, dismissedIds]);

  // Top 4 preview items for dropdown popover
  const recentNotifications = useMemo(() => {
    return activeNotifications.slice(0, 4);
  }, [activeNotifications]);

  const markAsRead = useCallback((id) => {
    notificationService.markAsRead(id);
    setReadIds(notificationService.getReadIds());
  }, []);

  const markAllAsRead = useCallback(() => {
    const ids = activeNotifications.map((n) => n.id);
    notificationService.markAllAsRead(ids);
    setReadIds(notificationService.getReadIds());
  }, [activeNotifications]);

  const dismissNotification = useCallback((id) => {
    notificationService.dismissNotification(id);
    setDismissedIds(notificationService.getDismissedIds());
  }, []);

  return {
    unreadCount,
    hasUnread: unreadCount > 0,
    notifications: activeNotifications,
    recentNotifications,
    readIds,
    isLoading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    refreshNotifications: fetchData,
  };
};

export default useNotificationBadge;
