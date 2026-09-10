/**
 * Floating Store Concierge Live Chat Widget
 * Module: components/chat/FloatingChatWidget.jsx
 * 
 * Persistent, luxury floating live chat drawer anchored to the bottom-right of the storefront:
 * - Available across all public pages (Home, Mobiles, Details, Contact).
 * - Instant guest chat session initialization (1-click or with visitor name/email).
 * - Seamless authenticated customer integration via userTokenStorage.
 * - Live auto-polling (2s) for instant store manager reply streaming.
 * - Scroll-lock reading protection when scrolling up.
 * - Quick inquiry chips for flagship stock, warranty, store hours, and EMI offers.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Minus,
  Send,
  Sparkles,
  ShieldCheck,
  Smartphone,
  MapPin,
  Clock,
  Check,
  CheckCheck,
  User,
  ArrowDown,
  Loader2,
  ChevronRight,
  ExternalLink,
  Truck,
  PackageCheck,
} from 'lucide-react';
import { chatService } from '../../services/chatService';
import { userTokenStorage } from '../../services/userAuthService';
import { useUserAuth } from '../../hooks/useUserAuth';
import orderService from '../../services/orderService';
import { Button } from '../ui';

// Quick inquiry chips for 1-tap asking
const QUICK_CHIPS = [
  { label: 'iPhone 16 Pro Stock', text: 'Is the iPhone 16 Pro in Natural Titanium in stock today?' },
  { label: 'Store Location & Hours', text: 'Where is the MS Mobiles showroom in Hyderabad located and what are store hours?' },
  { label: 'Sealed Box Warranty', text: 'Do all flagship smartphones come with sealed official 1-year brand warranty?' },
  { label: '0% EMI & Offers', text: 'What credit card discount and no-cost EMI options are currently available?' },
];

const QUICK_TRACKING_CHIPS = [
  { label: '🚚 Where is my order?', text: 'Where is my active order right now? Please share current status and location.' },
  { label: '🔢 Show Delivery OTP', text: 'What is my 4-digit Doorstep Handover OTP for courier verification?' },
  { label: '📍 Blue Dart Waybill', text: 'Please provide my courier carrier name and AWB tracking code.' },
  { label: '⏱️ Estimated Delivery', text: 'When is my package scheduled to arrive at my doorstep?' },
];

// Parse order milestone bot messages
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

export const FloatingChatWidget = () => {
  const { user, isAuthenticated } = useUserAuth();

  // Widget Window State
  const [isOpen, setIsOpen] = useState(false);
  const [hasStartedSession, setHasStartedSession] = useState(() => chatService.hasSession());

  // Guest Onboarding Form State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isInitializingGuest, setIsInitializingGuest] = useState(false);

  // Chat Stream State
  const [activeChannel, setActiveChannel] = useState('support'); // 'support' or 'tracking'
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Scroll Refs
  const chatScrollRef = useRef(null);
  const chatBottomRef = useRef(null);
  const isScrolledUpRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [hasNewIncoming, setHasNewIncoming] = useState(false);
  const textareaRef = useRef(null);

  // Synchronize session state if user logs in
  useEffect(() => {
    if (isAuthenticated || chatService.hasSession()) {
      setHasStartedSession(true);
    }
  }, [isAuthenticated]);

  // Listen for global events to open or toggle concierge chat (e.g. from navbar icon)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('open-concierge-chat', handleOpen);
    window.addEventListener('toggle-concierge-chat', handleToggle);
    return () => {
      window.removeEventListener('open-concierge-chat', handleOpen);
      window.removeEventListener('toggle-concierge-chat', handleToggle);
    };
  }, []);

  // Smooth scroll to bottom with multi-tick guarantee (immediate, rAF, 50ms, 180ms, 350ms)
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

  // Handle scroll detection
  const handleScroll = useCallback(() => {
    if (!chatScrollRef.current || isAutoScrollingRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatScrollRef.current;
    if (scrollHeight <= clientHeight + 20) return;
    const scrolledUp = scrollHeight - scrollTop - clientHeight > 60;
    isScrolledUpRef.current = scrolledUp;
    setIsScrolledUp(scrolledUp);
    if (!scrolledUp) {
      setHasNewIncoming(false);
    }
  }, []);

  // Fetch live chat messages
  const fetchMessages = useCallback(async (isSilent = false) => {
    if (!chatService.hasSession()) return;
    if (!isSilent) setIsLoadingChat(true);

    try {
      const data = await chatService.getCustomerChat(activeChannel === 'tracking' ? 'TRACKING' : 'SUPPORT');
      const incoming = Array.isArray(data) ? data : [];

      setMessages((prev) => {
        const prevNonPending = prev.filter((p) => !p.isPending);

        // Check if data is identical
        if (prevNonPending.length === incoming.length) {
          const lastPrev = prevNonPending[prevNonPending.length - 1];
          const lastInc = incoming[incoming.length - 1];
          if (
            (!lastPrev && !lastInc) ||
            (lastPrev && lastInc && lastPrev.id === lastInc.id)
          ) {
            const pending = prev.filter((p) => p.isPending);
            if (pending.length === 0) return prev;
          }
        }

        // Detect if store manager replied while user was reading above
        if (isScrolledUpRef.current && incoming.length > prevNonPending.length) {
          setHasNewIncoming(true);
        }

        // If widget is closed, compute unread messages
        if (!isOpen) {
          const unread = incoming.filter(
            (m) => m.senderRole === 'ADMIN' && (m.isReadByCustomer !== undefined ? !m.isReadByCustomer : !m.readByCustomer)
          ).length;
          setUnreadCount(unread);
        } else {
          setUnreadCount(0);
        }

        const pending = prev.filter((p) => p.isPending);
        if (pending.length === 0) return incoming;
        return [...incoming, ...pending];
      });

      if (!isSilent) {
        scrollToBottom('auto', true);
      } else if (!isScrolledUpRef.current) {
        scrollToBottom('smooth');
      }
    } catch (err) {
      // Session expired or unauthorized
      if (err?.response?.status === 401) {
        userTokenStorage.removeToken();
        userTokenStorage.removeProfile();
        setHasStartedSession(false);
      }
    } finally {
      if (!isSilent) setIsLoadingChat(false);
    }
  }, [isOpen, scrollToBottom, activeChannel]);

  // Initial load when widget is opened
  useEffect(() => {
    if (isOpen && hasStartedSession) {
      fetchMessages(false);
      setUnreadCount(0);
      chatService.markCustomerChatRead().catch(() => {});
      // Account for entrance spring animation with multi-tick scroll
      setTimeout(() => scrollToBottom('auto', true), 100);
      setTimeout(() => scrollToBottom('auto', true), 320);
    }
  }, [isOpen, hasStartedSession, fetchMessages, scrollToBottom]);

  // Ensure scroll when messages change or channel changes
  useEffect(() => {
    if (isOpen && !isLoadingChat && messages.length > 0) {
      if (!isScrolledUpRef.current) {
        scrollToBottom('auto');
      }
    }
  }, [isOpen, activeChannel, messages.length, isLoadingChat, scrollToBottom]);

  // Real-time polling
  useEffect(() => {
    if (!hasStartedSession) return;

    // Fast 2s polling when open, slower 8s polling when closed
    const intervalTime = isOpen ? 2000 : 8000;
    const interval = setInterval(() => {
      fetchMessages(true);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isOpen, hasStartedSession, fetchMessages]);

  // Initialize instant guest session
  const handleStartGuestChat = async (e) => {
    if (e) e.preventDefault();
    setIsInitializingGuest(true);
    try {
      await chatService.createGuestSession({
        fullName: guestName.trim() || 'Store Visitor',
        email: guestEmail.trim() || undefined,
      });
      setHasStartedSession(true);
      setTimeout(() => {
        fetchMessages(false);
      }, 50);
    } catch (err) {
      console.error('[FloatingChatWidget] Failed to initialize guest chat:', err);
    } finally {
      setIsInitializingGuest(false);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend) => {
    const rawText = typeof textToSend === 'string' ? textToSend : inputText;
    const clean = (rawText || '').trim();
    if (!clean || !chatService.hasSession()) return;

    if (typeof textToSend !== 'string') {
      setInputText('');
    }
    setIsSending(true);

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      senderRole: 'CUSTOMER',
      senderName: user?.fullName || 'You',
      message: clean,
      isPending: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    setTimeout(() => scrollToBottom('smooth'), 20);

    try {
      const channelPayload = activeChannel === 'tracking' ? 'TRACKING' : 'SUPPORT';
      const saved = await chatService.sendCustomerMessage(clean, channelPayload);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...saved, isPending: false } : m))
      );

      // If customer asks about order tracking, check active order and post logistics bot update
      const isAskingTracking = /track|where is my order|order status|shipment|active order/i.test(clean);
      if (isAskingTracking && isAuthenticated) {
        orderService.getMyOrders().then((userOrders) => {
          if (Array.isArray(userOrders) && userOrders.length > 0) {
            const latest = userOrders[0];
            const awbText = latest.trackingNumber ? `\nCarrier: ${latest.carrier || 'Blue Dart Express'} (AWB: ${latest.trackingNumber})` : '';
            const botReply = {
              id: `bot-tracking-${Date.now()}`,
              senderRole: 'ADMIN',
              senderName: 'MS Logistics Bot',
              message: `📦 Order Milestone: #${latest.orderNumber} is ${latest.orderStatus}\nDelivery Mode: ${latest.deliveryType === 'STORE_PICKUP' ? 'Showroom Counter Pickup (Cyber Hills)' : 'Express Doorstep Delivery'}${awbText}\nExpected Delivery: Within 24-48 Hours. Keep your handover OTP ready for delivery verification.`,
              createdAt: new Date().toISOString(),
            };
            setTimeout(() => {
              setMessages((prev) => [...prev, botReply]);
              setTimeout(() => scrollToBottom('smooth'), 50);
            }, 600);
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.error('[FloatingChatWidget] Failed to send chat message:', err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  // Keydown handler
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING ACTION TRIGGER BUTTON (BOTTOM-RIGHT) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 select-none"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-accent-600 via-indigo-600 to-accent-600 bg-size-200 hover:bg-right transition-all duration-300 shadow-2xl shadow-accent-950/60 border border-accent-400/40 text-white font-bold group"
              aria-label="Open MS Mobiles Live Concierge Chat"
            >
              {/* Online Beacon */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
              </span>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent-200 group-hover:rotate-6 transition-transform" />
                <span className="text-sm font-extrabold tracking-wide hidden sm:inline">
                  Live Concierge
                </span>
                <span className="text-sm font-extrabold tracking-wide sm:hidden">
                  Chat
                </span>
              </div>

              {/* Unread Pill Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black shadow-lg animate-bounce">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. FLOATING LIVE CHAT WINDOW DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-40px)] rounded-3xl bg-dark-900/95 border border-dark-750/90 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden select-none"
          >
            {/* Ambient Lighting Gradient */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* HEADER */}
            <div className="p-4 border-b border-dark-800 bg-dark-950/70 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-600 via-indigo-500 to-sky-500 p-0.5 shrink-0 shadow-sm">
                  <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center text-accent-400 font-black text-sm">
                    MS
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-black text-white truncate flex items-center gap-1.5">
                    <span>MS Mobiles Concierge</span>
                    <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online • Cyber Hills Showroom</span>
                  </div>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                  title="Minimize chat"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BODY SECTION */}
            {!hasStartedSession ? (
              // -----------------------------------------------------------------
              // 2A. GUEST VISITOR WELCOME ONBOARDING
              // -----------------------------------------------------------------
              <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-300 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-accent-400" />
                      <span>Official Store Support</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Ask about sealed flagship stock, 1-year brand warranty, Cyber Hills Hyderabad showroom visit, or festive exchange discounts.
                    </p>
                  </div>

                  <form onSubmit={handleStartGuestChat} className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-dark-850 border border-dark-750 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500/60"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Email or Phone (Optional)
                      </label>
                      <input
                        type="text"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-dark-850 border border-dark-750 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500/60"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isInitializingGuest}
                      className="w-full shadow-glow-sm mt-2"
                    >
                      {isInitializingGuest ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <span>Start Live Chat Now</span>
                      )}
                    </Button>
                  </form>
                </div>

                <div className="pt-4 border-t border-dark-800 text-center text-xs text-neutral-400">
                  <span>Already have an account? </span>
                  <a href="/login" className="text-accent-400 font-bold hover:underline">
                    Sign In
                  </a>
                </div>
              </div>
            ) : (
              // -----------------------------------------------------------------
              // 2B. LIVE CHAT STREAM & COMPOSER
              // -----------------------------------------------------------------
              <div className="flex-1 flex flex-col min-h-0">
                {/* Segmented Channel Switcher */}
                <div className="px-3 pt-2 pb-1.5 bg-dark-950/70 border-b border-dark-800/80 flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChannel('support');
                      scrollToBottom('auto', true);
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeChannel === 'support'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-dark-900 text-neutral-400 hover:text-white border border-dark-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>MS Mobile Chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChannel('tracking');
                      scrollToBottom('auto', true);
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeChannel === 'tracking'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-dark-900 text-neutral-400 hover:text-white border border-dark-800'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Tracking Chat</span>
                  </button>
                </div>

                {/* Messages Scroll Area */}
                <div
                  ref={chatScrollRef}
                  onScroll={handleScroll}
                  className="flex-1 p-4 overflow-y-auto space-y-3 relative"
                >
                  {isLoadingChat && messages.length === 0 ? (
                    <div className="py-20 text-center space-y-2 text-neutral-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent-400" />
                      <p className="text-xs">Connecting to store concierge...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-12 text-center space-y-2 text-neutral-400">
                      <MessageSquare className="w-8 h-8 mx-auto text-neutral-600" />
                      <p className="text-xs font-bold text-neutral-300">How can we assist you today?</p>
                      <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                        Ask about phone specs, stock in Hyderabad showroom, or tap one of the quick suggestions below.
                      </p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.senderRole === 'CUSTOMER';

                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          {(() => {
                            const milestone = !isMe ? parseOrderMilestone(m.message) : null;

                            return (
                              <div
                                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                  isMe
                                    ? 'bg-gradient-to-br from-accent-600 via-indigo-600 to-indigo-700 text-white rounded-tr-none'
                                    : milestone
                                    ? 'bg-dark-850/95 border border-accent-500/30 text-neutral-100 rounded-tl-none shadow-glow-sm'
                                    : 'bg-dark-850 border border-dark-750 text-neutral-100 rounded-tl-none'
                                }`}
                              >
                                {milestone ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-dark-750">
                                      <div className="flex items-center gap-1.5">
                                        <div className="p-1 rounded-md bg-accent-500/20 text-accent-400">
                                          <Truck className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[11px] font-black text-white">Logistics Bot</span>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                                        milestone.stage === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                        milestone.stage === 'SHIPPED' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                                        milestone.stage === 'PROCESSING' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                        milestone.stage === 'CANCELLED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                      }`}>
                                        {milestone.stage}
                                      </span>
                                    </div>

                                    <p className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-neutral-200">
                                      {m.message}
                                    </p>

                                    {milestone.orderNumber && (
                                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-dark-750/70">
                                        <span className="text-[10px] font-mono font-bold text-accent-300">
                                          #{milestone.orderNumber}
                                        </span>
                                        <a
                                          href={`/track?order=${milestone.orderNumber}`}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-600 hover:bg-accent-500 text-white text-[10px] font-bold shadow-sm transition-all"
                                        >
                                          <span>Track Live</span>
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="whitespace-pre-wrap break-words">{m.message}</p>
                                )}

                                <div
                                  className={`flex items-center gap-1 mt-1.5 text-[9px] ${
                                    isMe ? 'text-accent-200 justify-end' : 'text-neutral-500 justify-start'
                                  }`}
                                >
                                  <span>{formatTime(m.createdAt)}</span>
                                  {isMe && (
                                    <span>
                                      {m.isPending ? (
                                        <Clock className="w-2.5 h-2.5 animate-pulse" />
                                      ) : (
                                        <CheckCheck className="w-3 h-3 text-sky-300" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })
                  )}

                  <div ref={chatBottomRef} />

                  {/* Floating New Incoming Reply Pill */}
                  {hasNewIncoming && (
                    <button
                      onClick={() => scrollToBottom('smooth')}
                      className="sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent-600 text-white text-[10px] font-bold shadow-lg flex items-center gap-1 animate-bounce"
                    >
                      <ArrowDown className="w-3 h-3" />
                      <span>New store reply</span>
                    </button>
                  )}
                </div>

                {/* Quick Inquiry Pills */}
                <div className="px-3 py-2 border-t border-dark-800 bg-dark-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                  {(activeChannel === 'tracking' ? QUICK_TRACKING_CHIPS : QUICK_CHIPS).map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.text)}
                      className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 text-neutral-300 hover:text-white text-[10px] font-medium whitespace-nowrap transition-colors shrink-0"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Sticky Composer */}
                <div className="p-3 border-t border-dark-800 bg-dark-950/80 shrink-0">
                  <div className="relative flex items-center gap-2">
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message to MS Mobiles..."
                      rows={1}
                      className="w-full pl-3 pr-10 py-2.5 text-xs rounded-2xl bg-dark-900 border border-dark-750 text-white placeholder-neutral-500 resize-none focus:outline-none focus:border-accent-500/60"
                    />

                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isSending}
                      className="absolute right-2 p-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 disabled:opacity-40 text-white transition-colors"
                      title="Send message (Enter)"
                    >
                      {isSending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatWidget;
