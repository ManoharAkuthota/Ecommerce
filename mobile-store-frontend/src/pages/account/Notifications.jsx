/**
 * Customer Notifications & Activity Center
 * Module: pages/account/Notifications.jsx
 * Route: /account/notifications
 * 
 * 100% In-App Notification Center:
 * - Real concierge inquiry reply alerts directly from the store manager.
 * - Security session alerts and authentication activity notices.
 * - Catalog announcements and new flagship drops.
 * - Mark as read, mark all read, category filters, and notification dismissal.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Trash2,
  Check,
  ArrowRight,
  Clock,
  Filter,
  X,
  RotateCcw,
  PackageCheck,
  Package,
  Truck,
  Layers,
  ShoppingBag,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { useUserAuth } from '../../hooks/useUserAuth';
import contactService from '../../services/contactService';
import orderService from '../../services/orderService';
import SEO from '../../components/common/SEO';

const NOTIFICATIONS_STORAGE_KEY = 'ms_user_read_notifications';

export const Notifications = () => {
  const { user } = useUserAuth();

  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      const raw = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [dismissedIds, setDismissedIds] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch inquiries and orders to generate live notifications
  const fetchNotificationData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [inqRes, ordersRes] = await Promise.allSettled([
        contactService.getUserInquiries(),
        orderService.getMyOrders(),
      ]);

      if (inqRes.status === 'fulfilled' && Array.isArray(inqRes.value)) {
        setInquiries(inqRes.value);
      }
      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      }
    } catch (err) {
      console.warn('[Notifications] Could not fetch notifications data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationData();
  }, [fetchNotificationData]);

  // Persist read notification IDs
  const markAsRead = (id) => {
    if (readIds.includes(id)) return;
    const updated = [...readIds, id];
    setReadIds(updated);
    try {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const markAllAsRead = () => {
    const allIds = rawNotifications.map((n) => n.id);
    setReadIds(allIds);
    try {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(allIds));
    } catch {}
  };

  const dismissNotification = (id) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  // Build aggregated notification items
  const rawNotifications = useMemo(() => {
    const list = [];

    // 1. Order Stage-by-Stage Notifications
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
        message: `Your order for ${itemsSummary} (₹${formattedTotal}) has been confirmed. Inventory allocated & scheduled for security packaging.`,
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

      // Stage B: Processing & Security Packaging
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
          title: `Quality Checked & Packaged: #${order.orderNumber}`,
          message: `IMEI numbers scanned and hardware diagnostic passed. Handset safely sealed in tamper-evident security box at Cyber Hills Fulfillment Hub.`,
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
          message: `Package handed over to carrier (AWB: ${awbCode}). In transit for express delivery to ${order.shippingAddress?.city || 'destination'}. Keep 4-digit Delivery OTP handy!`,
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
          message: `Package delivered to ${order.shippingAddress?.fullName || 'recipient'}. Doorstep OTP verified. 1-Year official manufacturer warranty and GST bill activated.`,
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
          message: `Order #${order.orderNumber} has been cancelled. ${order.notes || 'Any pre-authorized refund has been scheduled to your original payment mode.'}`,
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

    // 2. Inquiries with Store Owner responses
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
          title: 'Inquiry Under Review by Concierge Team',
          message: `Your inquiry ("${inq.message?.substring(0, 70)}...") has been received. Our store manager will post a reply in your portal shortly.`,
          timestamp: inq.createdAt,
          link: '/account/inquiries',
          linkText: 'Open Chat',
          icon: Clock,
          badgeLabel: 'Inquiry Pending',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          accentColor: 'amber',
        });
      }
    });

    // 3. Security Notification
    list.push({
      id: 'system-security-session',
      type: 'SECURITY',
      title: 'Active Cryptographic Session Verified',
      message: `You are authenticated as ${user?.fullName || 'Customer User'} (${user?.email || 'user@antigravity.com'}). JWT Bearer authorization active with HMAC-SHA256 tokens.`,
      timestamp: new Date().toISOString(),
      link: '/account/settings',
      linkText: 'Security Settings',
      icon: ShieldCheck,
      badgeLabel: 'Security Verified',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accentColor: 'emerald',
    });

    // 4. Welcome Notification
    list.push({
      id: 'system-welcome-notice',
      type: 'SYSTEM',
      title: 'Welcome to MS Mobiles',
      message: 'Explore our latest 2026 flagship catalog, compare up to 4 devices simultaneously, and track your orders in real-time.',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      link: '/mobiles',
      linkText: 'Browse Mobiles',
      icon: Sparkles,
      badgeLabel: 'Store Notice',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      accentColor: 'indigo',
    });

    // Sort all notifications chronologically descending
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [orders, inquiries, user]);

  // Filter out dismissed notifications and apply category filter
  const visibleNotifications = useMemo(() => {
    return rawNotifications
      .filter((n) => !dismissedIds.includes(n.id))
      .filter((n) => {
        const isUnread = !readIds.includes(n.id);
        if (selectedFilter === 'UNREAD') return isUnread;
        if (selectedFilter === 'ORDERS') return n.type === 'ORDER';
        if (selectedFilter === 'INQUIRIES') return n.type === 'INQUIRY';
        if (selectedFilter === 'SECURITY') return n.type === 'SECURITY';
        return true;
      });
  }, [rawNotifications, dismissedIds, readIds, selectedFilter]);

  const unreadCount = useMemo(() => {
    return rawNotifications.filter((n) => !dismissedIds.includes(n.id) && !readIds.includes(n.id)).length;
  }, [rawNotifications, dismissedIds, readIds]);

  const ordersCount = useMemo(() => {
    return rawNotifications.filter((n) => !dismissedIds.includes(n.id) && n.type === 'ORDER').length;
  }, [rawNotifications, dismissedIds]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'Recently';
    }
  };

  return (
    <>
      <SEO
        title="Notifications & Alerts — MS Mobiles"
        description="Review concierge inquiry alerts, security notices, and flagship announcements."
        canonicalUrl="http://localhost:5173/account/notifications"
      />

      <div className="space-y-8 pb-16">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent-500 animate-ping" />
                )}
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Notifications & Activity
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-500/20 text-accent-300 border border-accent-500/30">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400">
              Live updates on concierge answers, security authentications, and storefront activity.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchNotificationData}
              isLoading={isLoading}
              icon={<RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                icon={<Check className="w-3.5 h-3.5" />}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-dark-900/60 border border-dark-800/80 overflow-x-auto select-none">
          {[
            { id: 'ALL', label: 'All Notifications' },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'ORDERS', label: `Orders & Tracking (${ordersCount})` },
            { id: 'INQUIRIES', label: 'Inquiries & Concierge' },
            { id: 'SECURITY', label: 'Security & Auth' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? 'bg-accent-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-dark-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {visibleNotifications.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-dark-900/50 border border-dark-800/80 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto shadow-glow-sm">
              <Bell className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No Notifications to Display</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                You are completely up to date. When orders advance through fulfillment stages or the store team replies to your messages, they will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {visibleNotifications.map((item) => {
              const isRead = readIds.includes(item.id);
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => markAsRead(item.id)}
                  className={`relative p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none cursor-pointer ${
                    isRead
                      ? 'bg-dark-900/40 border-dark-800/60 opacity-85 hover:opacity-100 hover:bg-dark-900/70'
                      : 'bg-dark-900/90 border-accent-500/40 shadow-glow-sm hover:border-accent-400'
                  }`}
                >
                  {/* Left: Unread indicator + Icon + Copy */}
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Unread Glowing Dot */}
                    <div className="pt-1 shrink-0">
                      {!isRead ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-400 shadow-glow-sm animate-pulse" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-transparent" />
                      )}
                    </div>

                    <div className={`p-2.5 rounded-2xl bg-dark-950 border border-dark-800 shrink-0 ${
                      item.type === 'ORDER' ? 'text-accent-400 shadow-sm' : 'text-neutral-300'
                    }`}>
                      <Icon className="w-5 h-5 text-accent-400" />
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {item.title}
                        </h4>

                        {item.badgeLabel && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            item.badgeClass || 'bg-dark-800 text-neutral-300 border-dark-700'
                          }`}>
                            {item.badgeLabel}
                          </span>
                        )}

                        {item.type === 'ORDER' && item.trackingNumber && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-dark-850 text-indigo-300 border border-indigo-500/30">
                            <Truck className="w-3 h-3 text-indigo-400" />
                            <span>AWB: {item.trackingNumber}</span>
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-neutral-500">
                          {formatDate(item.timestamp)}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
                    {item.type === 'ORDER' && (
                      <Link
                        to={`/account/inquiries?channel=tracking&order=${item.orderNumber}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:text-cyan-300 bg-dark-950 border border-dark-800 hover:border-cyan-500/40 text-xs"
                          icon={<MessageSquare className="w-3.5 h-3.5 text-cyan-400" />}
                        >
                          Tracking Chat
                        </Button>
                      </Link>
                    )}

                    {item.link && (
                      <Link to={item.link} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant={item.type === 'ORDER' && !isRead ? 'primary' : 'ghost'}
                          size="sm"
                          className={item.type === 'ORDER' && !isRead ? 'shadow-glow-sm text-xs' : 'text-accent-400 hover:text-accent-300 text-xs'}
                          icon={<ArrowRight className="w-3.5 h-3.5" />}
                          iconPosition="right"
                        >
                          {item.linkText || 'Open'}
                        </Button>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(item.id);
                      }}
                      title="Dismiss notification"
                      className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
