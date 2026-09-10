/**
 * Customer Live Chat & Concierge Multi-Channel Console
 * Module: pages/account/UserInquiries.jsx
 * Route: /account/inquiries
 * 
 * Elite 2-Panel Conversational Console:
 * - Left Panel (Chat List):
 *   1. "MS Mobile Chat" — Direct store concierge support with showroom specialists.
 *   2. "Tracking Chat" — Real-time automated logistics bot for live order updates, AWBs, and OTPs.
 * - Right Panel (Active Conversation):
 *   - Dedicated message streams with channel isolation.
 *   - Interactive active order telemetry banner in Tracking Chat.
 *   - Real-time automated MS Logistics Bot replies.
 *   - Quick action prompt trays tailored per channel.
 *   - Responsive mobile navigation with back button.
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  Check,
  CheckCheck,
  RotateCcw,
  AlertCircle,
  Smartphone,
  Headphones,
  User,
  Info,
  MapPin,
  RefreshCw,
  Zap,
  Tag,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ArrowDown,
  Phone,
  Mail,
  Truck,
  PackageCheck,
  ExternalLink,
  Search,
  ArrowLeft,
  Lock,
  Copy,
  Radio,
  Navigation,
  Compass,
} from 'lucide-react';
import { Button } from '../../components/ui';
import Spinner from '../../components/ui/Spinner';
import chatService from '../../services/chatService';
import contactService from '../../services/contactService';
import orderService from '../../services/orderService';
import { useUserAuth } from '../../hooks/useUserAuth';
import SEO from '../../components/common/SEO';

// Quick pills for MS Mobile Chat (Store Concierge)
const SUPPORT_PILLS = [
  { label: '📦 In Stock?', text: 'Is this mobile model currently in stock at your Hyderabad showroom?' },
  { label: '🏬 Store Pickup', text: 'Can I pick up my order today directly from your counter?' },
  { label: '🛡️ 1-Yr Warranty', text: 'Does this phone include official 1-year brand warranty and GST invoice?' },
  { label: '💳 0% No-Cost EMI', text: 'What credit card discount and no-cost EMI options are currently available?' },
  { label: '🔄 Trade-in Bonus', text: 'Can I exchange my existing smartphone for an instant trade-in discount?' },
  { label: '⚡ Fast Dispatch', text: 'How quickly can you dispatch this device with same-day express delivery?' },
];

// Quick pills for Tracking Chat (Logistics Bot)
const TRACKING_PILLS = [
  { label: '🚚 Where is my order?', text: 'Where is my active order right now? Please share current status and location.' },
  { label: '🔢 Show Delivery OTP', text: 'What is my 4-digit Doorstep Handover OTP for courier verification?' },
  { label: '📍 Blue Dart Waybill', text: 'Please provide my courier carrier name and AWB tracking code.' },
  { label: '⏱️ Estimated Delivery', text: 'When is my package scheduled to arrive at my doorstep?' },
  { label: '🛡️ Anti-Tamper Seal', text: 'Has my package been quality inspected and holographic security sealed?' },
];

// Helper to parse order milestone bot messages
const parseOrderMilestone = (text) => {
  if (!text || typeof text !== 'string') return null;
  const isOrderMilestone =
    text.includes('#MS-2026-') ||
    text.startsWith('📦') ||
    text.startsWith('⚙️') ||
    text.startsWith('🚚') ||
    text.startsWith('✅') ||
    text.startsWith('❌') ||
    text.startsWith('📋') ||
    text.includes('Order Reference:');

  if (!isOrderMilestone) return null;

  const orderMatch = text.match(/MS-2026-\d{5}/);
  const orderNumber = orderMatch ? orderMatch[0] : null;
  const awbMatch = text.match(/AWB:\s*([A-Za-z0-9\-]+)/);
  const awb = awbMatch ? awbMatch[1] : null;
  const carrierMatch = text.match(/Carrier:\s*([^|\n\)]+)/);
  const carrier = carrierMatch ? carrierMatch[1].trim() : (awb ? 'Blue Dart Express' : null);

  let stage = 'CONFIRMED';
  if (text.includes('DELIVERED') || text.includes('Delivered') || text.startsWith('✅')) stage = 'DELIVERED';
  else if (text.includes('IN TRANSIT') || text.includes('Dispatched') || text.startsWith('🚚') || text.includes('SHIPPED')) stage = 'SHIPPED';
  else if (text.includes('PROCESSING') || text.startsWith('⚙️')) stage = 'PROCESSING';
  else if (text.includes('CANCELLED') || text.includes('Cancelled') || text.startsWith('❌')) stage = 'CANCELLED';

  return {
    orderNumber,
    awb,
    carrier,
    stage,
  };
};

const formatDateDivider = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
  } catch {
    return '';
  }
};

const formatTimeOnly = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(d);
  } catch {
    return '';
  }
};

const isCustomerUnread = (m) => {
  if (m.senderRole !== 'ADMIN') return false;
  if (m.isReadByCustomer !== undefined) return !m.isReadByCustomer;
  if (m.readByCustomer !== undefined) return !m.readByCustomer;
  return false;
};

export const UserInquiries = () => {
  const { user } = useUserAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChannelParam = searchParams.get('channel')?.toLowerCase();

  // Active channel: 'support' (MS Mobile Chat) or 'tracking' (Tracking Chat)
  const [activeChannel, setActiveChannel] = useState(
    activeChannelParam === 'tracking' ? 'tracking' : 'support'
  );

  // Chat stream state per channel
  const [supportMessages, setSupportMessages] = useState([]);
  const [trackingMessages, setTrackingMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Active customer orders
  const [activeOrder, setActiveOrder] = useState(null);
  const [copiedOTP, setCopiedOTP] = useState(false);

  // UI state
  const [showMobileChatView, setShowMobileChatView] = useState(Boolean(activeChannelParam));
  const [searchFilter, setSearchFilter] = useState('');

  // Scroll Refs
  const chatScrollRef = useRef(null);
  const chatBottomRef = useRef(null);
  const isScrolledUpRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [hasNewIncoming, setHasNewIncoming] = useState(false);
  const textareaRef = useRef(null);

  // Sync channel change from URL
  useEffect(() => {
    if (activeChannelParam === 'tracking') {
      setActiveChannel('tracking');
      setShowMobileChatView(true);
    } else if (activeChannelParam === 'support') {
      setActiveChannel('support');
      setShowMobileChatView(true);
    }
  }, [activeChannelParam]);

  // Load customer active order for tracking telemetry header
  useEffect(() => {
    orderService.getMyOrders()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        if (list.length > 0) {
          const ongoing = list.find((o) => ['CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.orderStatus));
          setActiveOrder(ongoing || list[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Scroll to bottom helper with multi-tick guarantee (immediate, rAF, 50ms, 180ms, 350ms)
  const scrollToBottom = useCallback((behavior = 'auto', force = false) => {
    if (force) {
      isScrolledUpRef.current = false;
      setIsScrolledUp(false);
      setHasNewIncoming(false);
    }
    isAutoScrollingRef.current = true;

    const performScroll = () => {
      if (chatScrollRef.current) {
        if (behavior === 'auto') {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        } else {
          chatScrollRef.current.scrollTo({
            top: chatScrollRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }
      if (chatBottomRef.current) {
        try {
          chatBottomRef.current.scrollIntoView({
            behavior: behavior === 'smooth' ? 'smooth' : 'auto',
            block: 'end',
          });
        } catch {}
      }
    };

    performScroll();

    requestAnimationFrame(() => {
      performScroll();
      setTimeout(performScroll, 50);
      setTimeout(performScroll, 180);
      setTimeout(() => {
        performScroll();
        isAutoScrollingRef.current = false;
      }, 350);
    });
  }, []);

  // Fetch messages for both channels
  const loadChatHistory = useCallback(async (isPolling = false) => {
    if (!isPolling) setIsLoading(true);
    try {
      const [supportData, trackingData] = await Promise.all([
        chatService.getCustomerChat('SUPPORT', activeChannel === 'support'),
        chatService.getCustomerChat('TRACKING', activeChannel === 'tracking'),
      ]);

      const supList = Array.isArray(supportData) ? supportData : [];
      const trkList = Array.isArray(trackingData) ? trackingData : [];

      setSupportMessages(supList);
      setTrackingMessages(trkList);
      setError(null);

      // On initial non-polling load, guarantee scroll to bottom
      if (!isPolling) {
        scrollToBottom('auto', true);
      }
    } catch (err) {
      console.warn('[UserInquiries] Error fetching chat messages:', err);
      if (!isPolling) setError('Unable to connect to live chat. Please retry.');
    } finally {
      if (!isPolling) setIsLoading(false);
    }
  }, [activeChannel, scrollToBottom]);

  useEffect(() => {
    loadChatHistory();
    const interval = setInterval(() => loadChatHistory(true), 3500);
    return () => clearInterval(interval);
  }, [loadChatHistory]);

  // Handle scroll detection: only mark user as scrolled up if container has content and distFromBottom > 80
  const handleScroll = useCallback(() => {
    if (!chatScrollRef.current || isAutoScrollingRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatScrollRef.current;
    if (scrollHeight <= clientHeight + 20) return;
    const distFromBottom = scrollHeight - scrollTop - clientHeight;
    const isUp = distFromBottom > 80;
    isScrolledUpRef.current = isUp;
    setIsScrolledUp(isUp);
    if (!isUp) setHasNewIncoming(false);
  }, []);

  // Current active messages
  const activeMessages = activeChannel === 'tracking' ? trackingMessages : supportMessages;

  useEffect(() => {
    if (!isLoading && activeMessages.length > 0) {
      if (!isScrolledUpRef.current) {
        scrollToBottom('auto');
      }
    }
  }, [activeChannel, activeMessages.length, isLoading, scrollToBottom]);

  // Switch channel handler: resets scroll lock and scrolls directly to latest message
  const handleSelectChannel = (channelKey) => {
    setActiveChannel(channelKey);
    setSearchParams({ channel: channelKey });
    setShowMobileChatView(true);
    setInputText('');

    // Mark channel as read on the backend
    const targetChannel = channelKey === 'tracking' ? 'TRACKING' : 'SUPPORT';
    chatService.markCustomerChatRead(targetChannel).catch(() => {});

    // Optimistically mark messages as read in local state
    if (channelKey === 'tracking') {
      setTrackingMessages((prev) =>
        prev.map((m) => ({ ...m, isReadByCustomer: true, readByCustomer: true }))
      );
    } else {
      setSupportMessages((prev) =>
        prev.map((m) => ({ ...m, isReadByCustomer: true, readByCustomer: true }))
      );
    }

    // Instantly force scroll to bottom on channel switch
    scrollToBottom('auto', true);
  };

  // Send message handler
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || isSending) return;

    setIsSending(true);
    setError(null);

    const channelPayload = activeChannel === 'tracking' ? 'TRACKING' : 'SUPPORT';

    try {
      const response = await chatService.sendCustomerMessage(cleanText, channelPayload);

      if (activeChannel === 'tracking') {
        setTrackingMessages((prev) => [...prev, response]);
      } else {
        setSupportMessages((prev) => [...prev, response]);
      }

      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Refresh to fetch instant bot reply in tracking channel
      setTimeout(() => loadChatHistory(true), 600);
      setTimeout(() => scrollToBottom('smooth'), 100);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyOTP = () => {
    if (activeOrder) {
      const raw = (activeOrder.orderNumber || '7023').replace(/\D/g, '');
      const otp = raw.length >= 4 ? raw.slice(-4) : '7023';
      navigator.clipboard.writeText(otp);
      setCopiedOTP(true);
      setTimeout(() => setCopiedOTP(false), 2000);
    }
  };

  // Channel meta summaries
  const supportLastMsg = supportMessages[supportMessages.length - 1];
  const trackingLastMsg = trackingMessages[trackingMessages.length - 1];

  // Channel unread counts: strictly unseen messages, and strictly 0 for the active channel!
  const unreadSupportCount = activeChannel === 'support' ? 0 : supportMessages.filter(isCustomerUnread).length;
  const unreadTrackingCount = activeChannel === 'tracking' ? 0 : trackingMessages.filter(isCustomerUnread).length;
  const isSupportHighlight = activeChannel !== 'support' && unreadSupportCount > 0;
  const isTrackingHighlight = activeChannel !== 'tracking' && unreadTrackingCount > 0;

  return (
    <div className="h-full flex-1 flex flex-col min-h-0 text-white overflow-hidden select-none">
      <SEO title="Live Concierge & Order Tracking Chat | MS Mobiles" />

      {/* Page Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-2 shrink-0 px-1">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/account" className="hover:text-white transition-colors">
            Account
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">Conversations & Inquiries</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/track"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-dark-900 border border-dark-800 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Public Route Tracker</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TWO-PANEL CONVERSATIONS CONSOLE (Constant Frame, Never Scrolls the Window) */}
      {/* ========================================================================= */}
      <div className="flex-1 min-h-0 rounded-2xl sm:rounded-3xl bg-dark-900/90 border border-dark-800 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col md:flex-row relative">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT PANEL: CONVERSATIONS LIST (Chat List) */}
          {/* ----------------------------------------------------------------------- */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-dark-800 flex flex-col shrink-0 bg-dark-925/70 ${
              showMobileChatView ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* List Header */}
            <div className="p-4 border-b border-dark-800/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-black text-white tracking-tight">Conversations</h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  2 Active
                </span>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter messages or orders..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-dark-950 border border-dark-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Conversations Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-dark-800/60 p-2 space-y-1">
              {/* ITEM 1: MS MOBILE CHAT (Store Concierge & Support) */}
              <div
                onClick={() => handleSelectChannel('support')}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all relative ${
                  activeChannel === 'support'
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/40 shadow-inner'
                    : isSupportHighlight
                    ? 'bg-gradient-to-r from-blue-600/25 to-indigo-600/25 border-2 border-blue-400 shadow-[0_0_22px_rgba(59,130,246,0.55)] ring-2 ring-blue-400/50 my-0.5'
                    : 'hover:bg-dark-850/60 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform ${
                        isSupportHighlight
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 scale-105 ring-2 ring-blue-400/60'
                          : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    {isSupportHighlight ? (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-85" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-400 border-2 border-dark-900 shadow-md" />
                      </span>
                    ) : (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h3
                        className={`text-xs truncate flex items-center gap-1.5 ${
                          isSupportHighlight ? 'font-black text-blue-200' : 'font-black text-white'
                        }`}
                      >
                        <span>MS Mobile Chat</span>
                      </h3>
                      {supportLastMsg && (
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          {formatTimeOnly(supportLastMsg.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-cyan-400/90 font-medium flex items-center gap-1">
                      <span>Store Concierge & Inquiries</span>
                      {isSupportHighlight && (
                        <span className="text-[10px] text-blue-300 font-bold font-mono">
                          • New
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-[11px] mt-1 truncate ${
                        isSupportHighlight ? 'text-white font-semibold' : 'text-neutral-400'
                      }`}
                    >
                      {supportLastMsg?.message ? supportLastMsg.message : 'Chat with showroom specialists...'}
                    </p>
                  </div>

                  {isSupportHighlight && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse shrink-0">
                      {unreadSupportCount}
                    </span>
                  )}
                </div>
              </div>

              {/* ITEM 2: TRACKING CHAT (Logistics & Order Tracking Bot) */}
              <div
                onClick={() => handleSelectChannel('tracking')}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all relative ${
                  activeChannel === 'tracking'
                    ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400/40 shadow-inner'
                    : isTrackingHighlight
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-2 border-cyan-400 shadow-[0_0_22px_rgba(6,182,212,0.6)] ring-2 ring-cyan-400/50 my-0.5'
                    : 'hover:bg-dark-850/60 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform ${
                        isTrackingHighlight
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-500 scale-105 ring-2 ring-cyan-400/60'
                          : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    {isTrackingHighlight ? (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-85" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-dark-900 shadow-md" />
                      </span>
                    ) : (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-dark-900" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h3
                        className={`text-xs truncate flex items-center gap-1.5 ${
                          isTrackingHighlight ? 'font-black text-cyan-200' : 'font-black text-white'
                        }`}
                      >
                        <span>Tracking Chat</span>
                      </h3>
                      {trackingLastMsg && (
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          {formatTimeOnly(trackingLastMsg.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      <span>Live Logistics Bot</span>
                      {isTrackingHighlight && (
                        <span className="text-[10px] text-cyan-300 font-bold font-mono">
                          • New
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-[11px] mt-1 truncate ${
                        isTrackingHighlight ? 'text-white font-semibold' : 'text-neutral-400'
                      }`}
                    >
                      {trackingLastMsg?.message ? trackingLastMsg.message : 'Live Blue Dart tracking & delivery OTPs...'}
                    </p>
                  </div>

                  {isTrackingHighlight && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-cyan-400 text-dark-950 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-pulse shrink-0">
                      {unreadTrackingCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Support Badge */}
            <div className="p-3.5 border-t border-dark-800/80 bg-dark-950/50 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>+91 98765 43210</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Cyber Hills Hub</span>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT PANEL: ACTIVE CONVERSATION STREAM */}
          {/* ----------------------------------------------------------------------- */}
          <div
            className={`flex-1 flex flex-col min-w-0 bg-dark-950/40 ${
              !showMobileChatView ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Conversation Header */}
            <div className="p-4 border-b border-dark-800/80 bg-dark-900/60 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile Back to List Button */}
                <button
                  type="button"
                  onClick={() => setShowMobileChatView(false)}
                  className="md:hidden p-1.5 rounded-xl bg-dark-800 text-neutral-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                    activeChannel === 'tracking'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-sm'
                      : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md'
                  }`}
                >
                  {activeChannel === 'tracking' ? <Truck className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white truncate">
                      {activeChannel === 'tracking' ? 'MS Logistics & Order Tracking Bot' : 'MS Mobiles Store Concierge'}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {activeChannel === 'tracking'
                      ? 'Automated Express Courier Gateway • 24/7 Real-Time Telematics'
                      : 'Showroom Support Specialists • Hyderabad Central'}
                  </p>
                </div>
              </div>

              {/* Channel Quick Switcher Badge */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectChannel(activeChannel === 'tracking' ? 'support' : 'tracking')}
                  className="px-3 py-1 rounded-xl bg-dark-800 hover:bg-dark-750 text-[11px] font-mono text-cyan-300 border border-dark-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">Switch to</span>
                  <span>{activeChannel === 'tracking' ? 'MS Mobile Chat' : 'Tracking Chat'}</span>
                </button>
              </div>
            </div>

            {/* TRACKING CHANNEL: PROMINENT ACTIVE ORDER STATUS CARD */}
            {activeChannel === 'tracking' && activeOrder && (
              <div className="px-4 py-2.5 bg-dark-900/90 border-b border-dark-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                  </span>
                  <span className="font-mono text-neutral-400">Order #{activeOrder.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {activeOrder.orderStatus}
                  </span>
                  <span className="hidden sm:inline text-neutral-500">•</span>
                  <span className="hidden sm:inline text-neutral-400 font-mono">
                    AWB: {activeOrder.trackingNumber || 'BD-88992200'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyOTP}
                    className="px-2.5 py-1 rounded-lg bg-dark-950 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] flex items-center gap-1.5 hover:border-cyan-400 transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    <span>OTP: {(activeOrder.orderNumber || '7023').replace(/\D/g, '').slice(-4) || '7023'}</span>
                    {copiedOTP ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-500" />}
                  </button>

                  <Link
                    to={`/track?order=${activeOrder.orderNumber}`}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Route Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Scrollable Messages Area */}
            <div
              ref={chatScrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
            >
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <Spinner size="lg" />
                  <p className="text-xs text-neutral-400 font-mono">Connecting to secure encrypted channel...</p>
                </div>
              ) : activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto p-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                    {activeChannel === 'tracking' ? <Truck className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
                  </div>
                  <h4 className="text-base font-black text-white">
                    {activeChannel === 'tracking' ? 'Welcome to Tracking Chat' : 'Welcome to MS Mobile Chat'}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    {activeChannel === 'tracking'
                      ? 'Live milestone alerts, express dispatch AWB codes, and delivery OTPs will be streamed here automatically.'
                      : 'Direct line with store specialists for instant inquiries regarding flagships, warranty, and showroom pickup.'}
                  </p>
                </div>
              ) : (
                activeMessages.map((msg, index) => {
                  const isUser = msg.senderRole === 'CUSTOMER';
                  const milestone = !isUser ? parseOrderMilestone(msg.message) : null;
                  const showDateDivider =
                    index === 0 ||
                    formatDateDivider(msg.createdAt) !== formatDateDivider(activeMessages[index - 1].createdAt);

                  return (
                    <React.Fragment key={msg.id || index}>
                      {showDateDivider && (
                        <div className="flex items-center justify-center my-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-dark-900 border border-dark-800 text-neutral-400">
                            {formatDateDivider(msg.createdAt)}
                          </span>
                        </div>
                      )}

                      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        {/* Sender Label */}
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[11px] font-bold text-neutral-400">
                            {isUser ? 'You' : msg.senderName || 'Store Specialist'}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-600">•</span>
                          <span className="text-[10px] font-mono text-neutral-500">{formatTimeOnly(msg.createdAt)}</span>
                        </div>

                        {/* Order Milestone Card or Standard Message Bubble */}
                        {milestone ? (
                          <div className="max-w-md w-full rounded-2xl bg-dark-900 border border-cyan-500/40 p-4 shadow-glow-sm space-y-3">
                            <div className="flex items-center justify-between border-b border-dark-800 pb-2">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs font-black text-white font-mono">
                                  #{milestone.orderNumber || 'MS-2026-ORDER'}
                                </span>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                  milestone.stage === 'DELIVERED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : milestone.stage === 'SHIPPED'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {milestone.stage}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed">
                              {msg.message}
                            </p>

                            <div className="pt-2 border-t border-dark-800 flex items-center justify-between gap-2">
                              {milestone.awb && (
                                <span className="text-[11px] font-mono text-neutral-400">
                                  AWB: <strong className="text-white">{milestone.awb}</strong>
                                </span>
                              )}
                              <Link
                                to={`/track?order=${milestone.orderNumber}`}
                                className="ml-auto px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                              >
                                <span>Track Live Delivery</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`max-w-md rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                              isUser
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                                : 'bg-dark-900 border border-dark-800 text-neutral-200 shadow-sm'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.message}</p>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })
              )}
              {/* Invisible bottom anchor for instant reliable auto-scroll */}
              <div ref={chatBottomRef} className="h-0 w-full shrink-0 pointer-events-none" />
            </div>

            {/* Floating 'Scroll to Latest' pill if user is scrolled up */}
            {isScrolledUp && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => scrollToBottom('smooth', true)}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center gap-1.5 transition-all cursor-pointer animate-bounce"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Scroll to Latest</span>
                </button>
              </div>
            )}

            {/* Quick Inquiry Pills Tray */}
            <div className="px-4 py-2 bg-dark-925/90 border-t border-dark-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-mono text-neutral-500 shrink-0 uppercase tracking-wider">
                Suggestions:
              </span>
              {(activeChannel === 'tracking' ? TRACKING_PILLS : SUPPORT_PILLS).map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(pill.text)}
                  className="px-2.5 py-1 rounded-xl bg-dark-900 hover:bg-dark-850 border border-dark-800 hover:border-cyan-500/40 text-[11px] text-neutral-300 hover:text-white shrink-0 transition-colors"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-dark-900/90 border-t border-dark-800/80 flex items-center gap-2.5 shrink-0">
              <input
                ref={textareaRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeChannel === 'tracking'
                    ? 'Ask about your order status, AWB, delivery date, or OTP...'
                    : 'Ask store manager about flagship stock, discounts, warranty...'
                }
                className="flex-1 py-2.5 px-4 rounded-2xl bg-dark-950 border border-dark-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

export default UserInquiries;
