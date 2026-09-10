/**
 * Centralized Notification Service
 * Module: services/notificationService.js
 * 
 * Provides unified logic for:
 * - Deriving in-app notifications from orders, concierge inquiries, security sessions, and store announcements.
 * - LocalStorage persistence of read and dismissed notification IDs.
 * - Real-time cross-tab & cross-component event broadcasting ('notifications-updated').
 */

import {
  PackageCheck,
  Layers,
  Truck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const NOTIFICATIONS_READ_KEY = 'ms_user_read_notifications';
export const NOTIFICATIONS_DISMISSED_KEY = 'ms_user_dismissed_notifications';
export const NOTIFICATIONS_UPDATED_EVENT = 'notifications-updated';

export const notificationService = {
  /**
   * Retrieve array of read notification IDs from LocalStorage
   */
  getReadIds: () => {
    try {
      const raw = window.localStorage.getItem(NOTIFICATIONS_READ_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Mark a single notification ID as read and dispatch update event
   */
  markAsRead: (id) => {
    if (!id) return;
    try {
      const existing = notificationService.getReadIds();
      if (!existing.includes(id)) {
        const updated = [...existing, id];
        window.localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, { detail: { readId: id } }));
      }
    } catch (err) {
      console.warn('[NotificationService] Failed to mark as read:', err);
    }
  },

  /**
   * Mark all provided notification IDs as read and dispatch update event
   */
  markAllAsRead: (ids = []) => {
    try {
      const existing = notificationService.getReadIds();
      const set = new Set([...existing, ...ids]);
      const updated = Array.from(set);
      window.localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, { detail: { allRead: true } }));
    } catch (err) {
      console.warn('[NotificationService] Failed to mark all as read:', err);
    }
  },

  /**
   * Retrieve array of dismissed notification IDs
   */
  getDismissedIds: () => {
    try {
      const raw = window.localStorage.getItem(NOTIFICATIONS_DISMISSED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Dismiss a single notification ID so it is no longer shown
   */
  dismissNotification: (id) => {
    if (!id) return;
    try {
      const existing = notificationService.getDismissedIds();
      if (!existing.includes(id)) {
        const updated = [...existing, id];
        window.localStorage.setItem(NOTIFICATIONS_DISMISSED_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, { detail: { dismissedId: id } }));
      }
    } catch (err) {
      console.warn('[NotificationService] Failed to dismiss notification:', err);
    }
  },

  /**
   * Aggregate and format live notifications from orders, inquiries, security, and store notices
   */
  buildNotifications: ({ orders = [], inquiries = [], user = null } = {}) => {
    const list = [];

    // 1. Order Stage-by-Stage Notifications
    if (Array.isArray(orders)) {
      orders.forEach((order) => {
        const status = order.orderStatus || 'CONFIRMED';
        const itemsSummary = order.items && order.items.length > 0
          ? order.items.map((i) => `${i.quantity}x ${i.mobileName || 'Smartphone'}`).join(', ')
          : 'Smartphone Order';
        const formattedTotal = Number(order.totalAmount || 0).toLocaleString('en-IN');
        const carrierName = order.carrier || 'Blue Dart Express';
        const awbCode = order.trackingNumber || 'BD-11431591';

        // Stage A: Order Confirmed
        list.push({
          id: `order-confirmed-${order.id}`,
          type: 'ORDER',
          orderStage: 'CONFIRMED',
          orderNumber: order.orderNumber,
          orderId: order.id,
          title: `Order Confirmed: #${order.orderNumber}`,
          message: `Your order for ${itemsSummary} (₹${formattedTotal}) has been confirmed. Allocated for dispatch.`,
          timestamp: order.createdAt,
          link: `/track?order=${order.orderNumber}`,
          linkText: 'Track Order',
          trackingNumber: order.trackingNumber,
          carrier: carrierName,
          totalAmount: order.totalAmount,
          icon: PackageCheck,
          badgeLabel: 'Order Confirmed',
          badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          accentColor: 'blue',
        });

        // Stage B: Processing & Packaging
        if (status === 'PROCESSING' || status === 'SHIPPED' || status === 'DELIVERED') {
          const procTime = status === 'PROCESSING'
            ? (order.updatedAt || order.createdAt)
            : new Date(new Date(order.createdAt).getTime() + 25 * 60000).toISOString();

          list.push({
            id: `order-processing-${order.id}`,
            type: 'ORDER',
            orderStage: 'PROCESSING',
            orderNumber: order.orderNumber,
            orderId: order.id,
            title: `Quality Checked: #${order.orderNumber}`,
            message: `IMEI scanned & diagnostic passed. Handset sealed in tamper-evident security packaging.`,
            timestamp: procTime,
            link: `/track?order=${order.orderNumber}`,
            linkText: 'Track Order',
            trackingNumber: order.trackingNumber,
            carrier: carrierName,
            totalAmount: order.totalAmount,
            icon: Layers,
            badgeLabel: 'Processing & Packed',
            badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
            accentColor: 'cyan',
          });
        }

        // Stage C: Shipped / Dispatched
        if (status === 'SHIPPED' || status === 'DELIVERED') {
          const shipTime = status === 'SHIPPED'
            ? (order.updatedAt || order.createdAt)
            : new Date(new Date(order.createdAt).getTime() + 65 * 60000).toISOString();

          list.push({
            id: `order-shipped-${order.id}`,
            type: 'ORDER',
            orderStage: 'SHIPPED',
            orderNumber: order.orderNumber,
            orderId: order.id,
            title: `Dispatched via ${carrierName}: #${order.orderNumber}`,
            message: `Package in transit (AWB: ${awbCode}) to ${order.shippingAddress?.city || 'destination'}. Keep 4-digit Delivery OTP ready.`,
            timestamp: shipTime,
            link: `/track?order=${order.orderNumber}`,
            linkText: 'Track Live Delivery',
            trackingNumber: order.trackingNumber || awbCode,
            carrier: carrierName,
            totalAmount: order.totalAmount,
            icon: Truck,
            badgeLabel: 'In Transit',
            badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
            accentColor: 'indigo',
          });
        }

        // Stage D: Delivered
        if (status === 'DELIVERED') {
          list.push({
            id: `order-delivered-${order.id}`,
            type: 'ORDER',
            orderStage: 'DELIVERED',
            orderNumber: order.orderNumber,
            orderId: order.id,
            title: `Delivered Successfully: #${order.orderNumber}`,
            message: `Delivered to ${order.shippingAddress?.fullName || 'recipient'}. 1-Year manufacturer warranty activated.`,
            timestamp: order.updatedAt || order.createdAt,
            link: `/track?order=${order.orderNumber}`,
            linkText: 'View Delivery Proof',
            trackingNumber: order.trackingNumber,
            carrier: carrierName,
            totalAmount: order.totalAmount,
            icon: CheckCircle2,
            badgeLabel: 'Delivered',
            badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            accentColor: 'emerald',
          });
        }

        // Stage E: Cancelled
        if (status === 'CANCELLED') {
          list.push({
            id: `order-cancelled-${order.id}`,
            type: 'ORDER',
            orderStage: 'CANCELLED',
            orderNumber: order.orderNumber,
            orderId: order.id,
            title: `Order Cancelled: #${order.orderNumber}`,
            message: `Order #${order.orderNumber} has been cancelled. Any pre-authorized refund has been processed.`,
            timestamp: order.updatedAt || order.createdAt,
            link: `/account/orders/${order.id}`,
            linkText: 'Order Details',
            totalAmount: order.totalAmount,
            icon: XCircle,
            badgeLabel: 'Cancelled',
            badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
            accentColor: 'rose',
          });
        }
      });
    }

    // 2. Concierge Inquiries & Replies
    if (Array.isArray(inquiries)) {
      inquiries.forEach((inq) => {
        if (inq.status === 'REPLIED' && inq.adminReply) {
          list.push({
            id: `inq-reply-${inq.id}`,
            type: 'INQUIRY',
            title: 'Store Concierge Responded to Your Inquiry',
            message: inq.adminReply,
            timestamp: inq.repliedAt || inq.createdAt,
            link: '/account/inquiries',
            linkText: 'View Reply',
            icon: MessageSquare,
            badgeLabel: 'Concierge Reply',
            badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            accentColor: 'accent',
          });
        } else if (inq.status === 'PENDING') {
          list.push({
            id: `inq-pending-${inq.id}`,
            type: 'INQUIRY',
            title: 'Inquiry Received by Concierge Team',
            message: `Your inquiry ("${inq.message?.substring(0, 60)}...") is under review by our store concierge.`,
            timestamp: inq.createdAt,
            link: '/account/inquiries',
            linkText: 'Open Chat',
            icon: Clock,
            badgeLabel: 'Pending Review',
            badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            accentColor: 'amber',
          });
        }
      });
    }

    // 3. Security Notification (If authenticated)
    if (user) {
      list.push({
        id: 'system-security-session',
        type: 'SECURITY',
        title: 'Active Security Session Verified',
        message: `Signed in as ${user.fullName || 'Customer'} (${user.email || 'customer'}). JWT authorization secured.`,
        timestamp: new Date().toISOString(),
        link: '/account/settings',
        linkText: 'Security Settings',
        icon: ShieldCheck,
        badgeLabel: 'Security Verified',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        accentColor: 'emerald',
      });
    }

    // 4. Welcome Notice
    list.push({
      id: 'system-welcome-notice',
      type: 'SYSTEM',
      title: 'Welcome to MS Mobiles Flagship Store',
      message: 'Explore 2026 flagship smartphones, compare devices side-by-side, and track orders in real-time.',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      link: '/mobiles',
      linkText: 'Explore Mobiles',
      icon: Sparkles,
      badgeLabel: 'Store Announcement',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      accentColor: 'indigo',
    });

    // Chronologically sort newest first
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  /**
   * Calculate unread notifications count given notifications list, read IDs, and dismissed IDs
   */
  calculateUnreadCount: (notifications = [], readIds = [], dismissedIds = []) => {
    return notifications.filter(
      (n) => !dismissedIds.includes(n.id) && !readIds.includes(n.id)
    ).length;
  },
};

export default notificationService;
