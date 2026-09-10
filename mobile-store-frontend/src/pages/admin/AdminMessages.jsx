/**
 * Admin Live Chat & Inquiries Console
 * Module: pages/admin/AdminMessages.jsx
 * 
 * Comprehensive 2-Panel Messenger and Inquiry Console for MS Mobiles Store Managers:
 * - Tab 1: "Customer Live Chats" — Real-time interactive two-panel chat screen.
 *   - Left Panel: Customer conversation list with instant search, unread pills, relative timestamps.
 *   - Right Panel: Full scrollable chat history, customer contact bar, quick canned replies, and reply composer.
 *   - Strict containment: Headers and composer are fixed (shrink-0), only inner streams scroll (min-h-0 overflow-y-auto).
 *   - Zero scrollIntoView: scrollToBottom strictly modifies container.scrollTop without shifting the outer page.
 *   - Scroll protection: Preserves scroll position when reading earlier messages without background snap-downs.
 * - Tab 2: "Storefront Inquiries" — Traditional contact form messages with status management and reply drawer.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  ShieldCheck,
  Search,
  RotateCcw,
  AlertCircle,
  Inbox,
  Phone,
  Mail,
  Smartphone,
  CheckCheck,
  Sparkles,
  Trash2,
  X,
  ChevronDown,
  ArrowDown,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  CornerDownLeft,
} from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import Spinner from '../../components/ui/Spinner';
import chatService from '../../services/chatService';
import contactService from '../../services/contactService';

// Quick Canned Responses for Store Managers
const ADMIN_CANNED_REPLIES = [
  { label: '📦 In Stock', text: 'Yes, this mobile model is currently in stock at our Hyderabad showroom with instant availability!' },
  { label: '🏬 Store Pickup', text: 'Ready for immediate same-day store pickup today at our counter with live unboxing demo.' },
  { label: '🛡️ Warranty', text: 'Includes official 1-year brand warranty with sealed packaging and tax-paid GST invoice.' },
  { label: '💳 0% EMI', text: 'We offer 0% no-cost EMI on major credit cards with instant paperless approval.' },
  { label: '🔄 Trade-in', text: 'Instant trade-in valuation and exchange bonus available at our counter on your old phone.' },
  { label: '⚡ Fast Delivery', text: 'We offer express same-day courier dispatch with real-time tracking.' },
];

const formatDateDivider = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    }).format(d);
  } catch {
    return '';
  }
};

const formatTimeOnly = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
};

const formatRelativeSnippetTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
};

export const AdminMessages = () => {
  const [activeTab, setActiveTab] = useState('CHATS'); // 'CHATS' | 'INQUIRIES'

  // ==========================================
  // Tab 1: Live Chat State
  // ==========================================
  const [conversations, setConversations] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [chatSearch, setChatSearch] = useState('');
  const [chatFilter, setChatFilter] = useState('ALL'); // 'ALL' | 'UNREAD'
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [mobileView, setMobileView] = useState('LIST'); // 'LIST' | 'CHAT' (on mobile)

  // Scroll and view refs
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const isUserScrolledUpRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const selectedCustomerIdRef = useRef(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [hasNewIncoming, setHasNewIncoming] = useState(false);

  // Sync ref with state
  useEffect(() => {
    selectedCustomerIdRef.current = selectedCustomerId;
  }, [selectedCustomerId]);

  // Derived selected customer object from conversations array
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return conversations.find((c) => c.customerId === selectedCustomerId) || null;
  }, [conversations, selectedCustomerId]);

  // ==========================================
  // Tab 2: Legacy Contact Inquiries State
  // ==========================================
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryReplyText, setInquiryReplyText] = useState('');
  const [isSubmittingInquiryReply, setIsSubmittingInquiryReply] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, isDeleting: false });

  // Floating Toast State
  const [toast, setToast] = useState(null);
  const showToast = useCallback((text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Strict Container Scroll to bottom helper with multi-tick guarantee (NEVER uses window-shifting scrollIntoView!)
  const scrollToBottom = useCallback((behavior = 'auto', force = false) => {
    if (force) {
      isUserScrolledUpRef.current = false;
      setIsUserScrolledUp(false);
      setHasNewIncoming(false);
    }
    isAutoScrollingRef.current = true;

    const performScroll = () => {
      if (chatContainerRef.current) {
        if (behavior === 'auto') {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        } else {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
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

  // Handle user scrolling in chat stream: preserves ability to read above messages!
  const handleChatScroll = useCallback(() => {
    if (!chatContainerRef.current || isAutoScrollingRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    if (scrollHeight <= clientHeight + 20) return;
    // If more than 60px away from bottom, the admin is actively reviewing earlier messages
    const scrolledUp = scrollHeight - scrollTop - clientHeight > 60;
    isUserScrolledUpRef.current = scrolledUp;
    setIsUserScrolledUp(scrolledUp);
    if (!scrolledUp) {
      setHasNewIncoming(false);
    }
  }, []);

  // --------------------------------------------------------------------------
  // 1. Fetch Conversations (Tab 1)
  // --------------------------------------------------------------------------
  const fetchConversations = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoadingConversations(true);
    try {
      const data = await chatService.getAdminConversations();
      const list = Array.isArray(data) ? data : [];
      setConversations(list);

      // Auto-select first customer on initial load if none selected yet
      if (!selectedCustomerIdRef.current && list.length > 0) {
        setSelectedCustomerId(list[0].customerId);
      }
    } catch (err) {
      console.error('[AdminMessages] Error loading chat conversations:', err);
      if (!isSilent) showToast('Failed to load live chat conversations.', 'error');
    } finally {
      if (!isSilent) setIsLoadingConversations(false);
    }
  }, [showToast]);

  // Load chat thread for selected customer (with scroll protection)
  const loadCustomerChat = useCallback(async (customerId, isSilent = false) => {
    if (!customerId) return;
    if (!isSilent) setIsLoadingChat(true);

    try {
      const data = await chatService.getAdminCustomerChat(customerId);
      const incoming = Array.isArray(data) ? data : [];

      let hasNewMessages = false;

      setActiveChatMessages((prev) => {
        // Only consider it new if incoming has more messages
        if (incoming.length > prev.length) {
          hasNewMessages = true;
          if (isUserScrolledUpRef.current) {
            setHasNewIncoming(true);
          }
          return incoming;
        }

        // If same length, verify whether last message read status or id changed
        if (prev.length === incoming.length && prev.length > 0) {
          const lastPrev = prev[prev.length - 1];
          const lastInc = incoming[incoming.length - 1];
          if (
            lastPrev.id === lastInc.id &&
            (lastPrev.isReadByCustomer ?? lastPrev.readByCustomer) === (lastInc.isReadByCustomer ?? lastInc.readByCustomer) &&
            (lastPrev.isReadByAdmin ?? lastPrev.readByAdmin) === (lastInc.isReadByAdmin ?? lastInc.readByAdmin) &&
            lastPrev.message === lastInc.message
          ) {
            return prev; // Preserve exact object references to avoid DOM churn
          }
        }

        return incoming;
      });

      // SCROLL LOGIC:
      // 1. If not silent (initial load of customer thread), jump to bottom immediately
      if (!isSilent) {
        scrollToBottom('auto', true);
      }
      // 2. If silent and user is already at the bottom AND new messages arrived, scroll down
      else if (!isUserScrolledUpRef.current && hasNewMessages) {
        scrollToBottom('smooth');
      }
      // 3. Otherwise: DO NOT SCROLL. Preserves admin's reading position!
    } catch (err) {
      console.error('[AdminMessages] Error loading customer chat thread:', err);
      if (!isSilent) showToast('Could not load customer messages.', 'error');
    } finally {
      if (!isSilent) setIsLoadingChat(false);
    }
  }, [showToast, scrollToBottom]);

  // Explicit customer selection handler
  const handleSelectCustomer = useCallback((customerId) => {
    if (!customerId) return;
    setSelectedCustomerId(customerId);
    setMobileView('CHAT');
    setActiveChatMessages([]); // Clean slate to avoid showing previous customer's bubbles
    // Optimistically clear unread count for this customer
    setConversations((prev) =>
      prev.map((c) =>
        c.customerId === customerId ? { ...c, unreadCount: 0 } : c
      )
    );
    isUserScrolledUpRef.current = false;
    setIsUserScrolledUp(false);
    setHasNewIncoming(false);
    loadCustomerChat(customerId, false);
    scrollToBottom('auto', true);
    setTimeout(() => {
      textareaRef.current?.focus({ preventScroll: true });
    }, 100);
  }, [loadCustomerChat, scrollToBottom]);

  // Initial load
  useEffect(() => {
    fetchConversations(false);
  }, [fetchConversations]);

  // When selectedCustomerId changes on initial auto-select, trigger load
  useEffect(() => {
    if (selectedCustomerId) {
      loadCustomerChat(selectedCustomerId, false);
    }
  }, [selectedCustomerId, loadCustomerChat]);

  // Auto-scroll to bottom whenever active customer's messages mount or increase
  useEffect(() => {
    if (!isLoadingChat && activeChatMessages.length > 0) {
      if (!isUserScrolledUpRef.current) {
        scrollToBottom('auto');
      }
    }
  }, [selectedCustomerId, activeChatMessages.length, isLoadingChat, scrollToBottom]);

  // Reliable, smooth polling every 2 seconds without interval destruction
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations(true);
      const currentId = selectedCustomerIdRef.current;
      if (currentId) {
        loadCustomerChat(currentId, true);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchConversations, loadCustomerChat]);

  // Send admin reply in live chat
  const handleSendAdminReply = async (e) => {
    if (e) e.preventDefault();
    const clean = adminReplyText.trim();
    const customerId = selectedCustomerId;

    if (!clean || !customerId || isSendingReply) return;

    const tempId = `temp-${Date.now()}`;
    const nowIso = new Date().toISOString();

    setIsSendingReply(true);
    setAdminReplyText('');

    // Instant optimistic message in active chat stream
    const optimistic = {
      id: tempId,
      customerId,
      senderRole: 'ADMIN',
      senderName: 'MS Mobiles Store Concierge',
      message: clean,
      createdAt: nowIso,
      isReadByAdmin: true,
      isReadByCustomer: false,
    };
    setActiveChatMessages((prev) => [...prev, optimistic]);

    // Instant optimistic update in conversation sidebar
    setConversations((prev) =>
      prev.map((c) =>
        c.customerId === customerId
          ? {
              ...c,
              lastMessage: clean,
              lastSenderRole: 'ADMIN',
              lastMessageTime: nowIso,
              unreadCount: 0,
            }
          : c
      )
    );

    // Scroll down immediately on admin dispatch
    setTimeout(() => {
      scrollToBottom('smooth');
    }, 25);

    try {
      const saved = await chatService.sendAdminReply(customerId, clean);
      const resolved = {
        ...saved,
        createdAt: saved?.createdAt || nowIso,
      };

      setActiveChatMessages((prev) =>
        prev.map((m) => (m.id === tempId ? resolved : m))
      );
      showToast('Reply sent successfully!');
    } catch (err) {
      console.error('[AdminMessages] Failed to send admin reply:', err);
      // Roll back optimistic message and restore text so admin doesn't lose work
      setActiveChatMessages((prev) => prev.filter((m) => m.id !== tempId));
      setAdminReplyText(clean);
      showToast('Failed to send reply. Please try again.', 'error');
    } finally {
      setIsSendingReply(false);
      setTimeout(() => {
        textareaRef.current?.focus({ preventScroll: true });
      }, 50);
    }
  };

  // Canned response selection
  const handleSelectCannedReply = (text) => {
    setAdminReplyText(text);
    if (textareaRef.current) {
      textareaRef.current.focus({ preventScroll: true });
      const len = text.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  };

  // --------------------------------------------------------------------------
  // 2. Fetch Legacy Inquiries (Tab 2)
  // --------------------------------------------------------------------------
  const fetchInquiries = useCallback(async () => {
    setIsLoadingInquiries(true);
    try {
      const data = await contactService.getAllMessages();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[AdminMessages] Error loading inquiries:', err);
      showToast('Failed to load contact inquiries.', 'error');
    } finally {
      setIsLoadingInquiries(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeTab === 'INQUIRIES') {
      fetchInquiries();
    }
  }, [activeTab, fetchInquiries]);

  // Reply to legacy inquiry
  const handleReplyToInquiry = async (e) => {
    e.preventDefault();
    if (!selectedInquiry || !inquiryReplyText.trim()) return;

    setIsSubmittingInquiryReply(true);
    try {
      const updated = await contactService.replyToMessage(selectedInquiry.id, {
        replyMessage: inquiryReplyText.trim(),
        status: 'REPLIED',
      });
      setInquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedInquiry(updated);
      showToast('In-app response successfully published to customer portal!');
    } catch (err) {
      showToast('Failed to post reply.', 'error');
    } finally {
      setIsSubmittingInquiryReply(false);
    }
  };

  // Delete legacy inquiry
  const handleDeleteInquiry = async () => {
    if (!deleteModal.item) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await contactService.deleteMessage(deleteModal.item.id);
      setInquiries((prev) => prev.filter((item) => item.id !== deleteModal.item.id));
      if (selectedInquiry?.id === deleteModal.item.id) setSelectedInquiry(null);
      setDeleteModal({ isOpen: false, item: null, isDeleting: false });
      showToast('Inquiry deleted successfully.');
    } catch (err) {
      showToast('Failed to delete inquiry.', 'error');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // --------------------------------------------------------------------------
  // Filters & Search
  // --------------------------------------------------------------------------
  const unreadTotal = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    let result = conversations;
    if (chatFilter === 'UNREAD') {
      result = result.filter((c) => (c.unreadCount || 0) > 0);
    }
    if (!chatSearch.trim()) return result;
    const q = chatSearch.toLowerCase().trim();
    return result.filter(
      (c) =>
        c.customerName?.toLowerCase().includes(q) ||
        c.customerEmail?.toLowerCase().includes(q) ||
        c.lastMessage?.toLowerCase().includes(q)
    );
  }, [conversations, chatFilter, chatSearch]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter !== 'ALL' && inq.status !== statusFilter) return false;
      if (inquirySearch.trim()) {
        const q = inquirySearch.toLowerCase().trim();
        return (
          inq.name?.toLowerCase().includes(q) ||
          inq.email?.toLowerCase().includes(q) ||
          inq.message?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inquiries, statusFilter, inquirySearch]);

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-2.5 text-xs font-bold backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50'
                : 'bg-dark-900/95 border-accent-500/40 text-accent-300 shadow-accent-950/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-accent-400 shrink-0" />
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="p-1.5 rounded-xl bg-accent-500/15 text-accent-400 border border-accent-500/25 shadow-glow-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Customer Live Chat & Inquiries
            </h1>
          </div>
          <p className="text-[11px] text-neutral-400">
            Real-time conversational messaging and inquiry management for MS Mobiles.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-dark-900 border border-dark-800 p-1 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('CHATS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'CHATS'
                ? 'bg-gradient-to-r from-accent-600 to-indigo-600 text-white shadow-glow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Live Chats</span>
            {unreadTotal > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                {unreadTotal}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('INQUIRIES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'INQUIRIES'
                ? 'bg-gradient-to-r from-accent-600 to-indigo-600 text-white shadow-glow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Store Inquiries</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 2-PANEL LIVE CHAT CONSOLE */}
      {/* ========================================================================= */}
      {activeTab === 'CHATS' && (
        <div className="rounded-2xl bg-dark-900/95 border border-dark-800 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col lg:grid lg:grid-cols-12 h-[calc(100vh-175px)] min-h-[500px] max-h-[780px]">
          
          {/* LEFT PANEL: Customer Conversation List (Cols 1-4) */}
          <div
            className={`lg:col-span-4 border-r border-dark-800 flex flex-col h-full min-h-0 overflow-hidden bg-dark-950/90 ${
              mobileView === 'CHAT' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Left Header with Search & Filter Pills */}
            <div className="p-3.5 border-b border-dark-800 space-y-2.5 bg-dark-950 shrink-0 select-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-accent-400" />
                  <span>Customer Threads</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400 bg-dark-850 px-2 py-0.5 rounded-full border border-dark-750">
                  {conversations.length} Active
                </span>
              </div>

              {/* Filter Pills: All vs Unread */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-dark-900 border border-dark-800">
                <button
                  type="button"
                  onClick={() => setChatFilter('ALL')}
                  className={`py-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    chatFilter === 'ALL'
                      ? 'bg-accent-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>All Chats</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      chatFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-dark-800 text-neutral-400'
                    }`}
                  >
                    {conversations.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setChatFilter('UNREAD')}
                  className={`py-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    chatFilter === 'UNREAD'
                      ? 'bg-accent-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>Unread</span>
                  {unreadTotal > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold animate-pulse">
                      {unreadTotal}
                    </span>
                  )}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer name, email..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 bg-dark-900 border border-dark-750 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500/70 transition-colors"
                />
                {chatSearch && (
                  <button
                    type="button"
                    onClick={() => setChatSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversation Threads Scroll Area */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-dark-850/80">
              {isLoadingConversations && conversations.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Spinner size="md" />
                  <p className="text-xs text-neutral-400">Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center space-y-2 text-neutral-400">
                  <MessageSquare className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs font-semibold text-neutral-300">No conversations found</p>
                  <p className="text-[11px] text-neutral-500">
                    {chatFilter === 'UNREAD'
                      ? 'No unread messages right now.'
                      : 'Customer chats from the storefront live concierge will appear here.'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedCustomerId === conv.customerId;
                  const initial = (conv.customerName || 'C').charAt(0).toUpperCase();
                  const unreadNum = isSelected ? 0 : (conv.unreadCount || 0);
                  const hasUnread = unreadNum > 0;

                  return (
                    <button
                      key={conv.customerId}
                      type="button"
                      onClick={() => handleSelectCustomer(conv.customerId)}
                      className={`w-full text-left p-3.5 transition-all flex items-start gap-3 select-none relative group ${
                        isSelected
                          ? 'bg-gradient-to-r from-accent-600/25 to-indigo-600/15 border-l-4 border-l-accent-500 shadow-inner'
                          : hasUnread
                          ? 'bg-emerald-500/15 border-2 border-emerald-400 shadow-[0_0_22px_rgba(52,211,153,0.4)] ring-1 ring-emerald-400/50 my-1 rounded-xl'
                          : 'hover:bg-dark-900/70 border-l-4 border-l-transparent'
                      }`}
                    >
                      {/* Avatar with Ring */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-10 h-10 rounded-xl p-0.5 shadow-sm transition-all ${
                            isSelected
                              ? 'bg-gradient-to-tr from-accent-500 via-indigo-500 to-sky-400 ring-2 ring-accent-500/40'
                              : hasUnread
                              ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 ring-2 ring-emerald-400/60 scale-105'
                              : 'bg-dark-800'
                          }`}
                        >
                          <div className="w-full h-full bg-dark-950 rounded-[10px] overflow-hidden flex items-center justify-center text-xs font-black text-white">
                            {conv.customerAvatar || conv.profileImage ? (
                              <img
                                src={conv.customerAvatar || conv.profileImage}
                                alt={conv.customerName}
                                className="w-full h-full object-cover rounded-[10px]"
                              />
                            ) : (
                              initial
                            )}
                          </div>
                        </div>
                        {hasUnread && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-85" />
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-dark-950 shadow-md" />
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <h3
                            className={`text-xs truncate flex items-center gap-1.5 ${
                              hasUnread
                                ? 'font-black text-emerald-200'
                                : isSelected
                                ? 'font-black text-white'
                                : 'font-semibold text-neutral-200'
                            }`}
                          >
                            <span>{conv.customerName}</span>
                            {hasUnread && (
                              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                                New
                              </span>
                            )}
                          </h3>
                          <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                            {formatRelativeSnippetTime(conv.lastMessageTime)}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-400 font-mono truncate">
                          {conv.customerEmail}
                        </p>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <p
                            className={`text-xs truncate flex-1 ${
                              hasUnread ? 'font-bold text-white' : 'text-neutral-400'
                            }`}
                          >
                            {conv.lastSenderRole === 'ADMIN' && (
                              <span className="text-accent-400 font-semibold mr-1">You:</span>
                            )}
                            {conv.lastMessage || 'Started conversation'}
                          </p>
                          {hasUnread && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500 text-dark-950 shadow-[0_0_12px_rgba(52,211,153,0.5)] animate-pulse shrink-0">
                              {unreadNum}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Active Chat History & Reply Composer (Cols 5-12) */}
          <div
            className={`lg:col-span-8 flex flex-col h-full min-h-0 overflow-hidden bg-dark-950/50 relative ${
              mobileView === 'LIST' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {selectedCustomer ? (
              <>
                {/* Active Chat Header - shrink-0 (NEVER SCROLLS AWAY!) */}
                <div className="p-3 sm:p-3.5 bg-dark-950 border-b border-dark-800 flex items-center justify-between select-none shadow-sm shrink-0 z-10">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button
                      type="button"
                      onClick={() => setMobileView('LIST')}
                      className="lg:hidden p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-900 transition-colors"
                      title="Back to conversation list"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-600 via-indigo-600 to-sky-500 p-0.5 shrink-0 shadow-glow-sm">
                      <div className="w-full h-full bg-dark-950 rounded-[10px] overflow-hidden flex items-center justify-center text-xs font-black text-accent-400">
                        {selectedCustomer.customerAvatar || selectedCustomer.profileImage ? (
                          <img
                            src={selectedCustomer.customerAvatar || selectedCustomer.profileImage}
                            alt={selectedCustomer.customerName}
                            className="w-full h-full object-cover rounded-[10px]"
                          />
                        ) : (
                          (selectedCustomer.customerName || 'C').charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xs sm:text-sm font-black text-white tracking-tight">
                          {selectedCustomer.customerName}
                        </h2>
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Store Concierge Active</span>
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono text-neutral-400 bg-dark-850 border border-dark-750">
                          {activeChatMessages.length} msgs
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono mt-0.5 flex-wrap">
                        <a
                          href={`mailto:${selectedCustomer.customerEmail}`}
                          className="flex items-center gap-1 hover:text-accent-300 transition-colors"
                          title="Click to email customer"
                        >
                          <Mail className="w-3 h-3 text-neutral-500" />
                          <span>{selectedCustomer.customerEmail}</span>
                        </a>
                        {selectedCustomer.customerPhone && (
                          <a
                            href={`tel:${selectedCustomer.customerPhone}`}
                            className="flex items-center gap-1 hover:text-accent-300 transition-colors"
                            title="Click to call customer"
                          >
                            <Phone className="w-3 h-3 text-neutral-500" />
                            <span>{selectedCustomer.customerPhone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadCustomerChat(selectedCustomer.customerId, false)}
                      className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-dark-800 transition-colors"
                      title="Refresh Chat Thread"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isLoadingChat ? 'animate-spin text-accent-400' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Chat Bubble Stream Container with Scroll Lock Protection */}
                <div className="relative flex-1 min-h-0 flex flex-col">
                  <div
                    ref={chatContainerRef}
                    onScroll={handleChatScroll}
                    className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3 bg-gradient-to-b from-dark-950/70 via-dark-950/30 to-dark-950/70"
                  >
                    {/* Header info showing start of conversation */}
                    {activeChatMessages.length > 0 && (
                      <div className="flex items-center justify-center my-2 select-none">
                        <div className="px-3 py-1 rounded-full bg-dark-900/90 border border-dark-800 text-[10px] font-mono text-neutral-500 uppercase tracking-wider shadow-xs">
                          Start of conversation history ({activeChatMessages.length} messages) • Scroll up/down freely
                        </div>
                      </div>
                    )}

                    {isLoadingChat && activeChatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-2">
                        <Spinner size="lg" />
                        <p className="text-xs text-neutral-400">Loading conversation history...</p>
                      </div>
                    ) : activeChatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-2">
                        <MessageSquare className="w-10 h-10 text-neutral-600" />
                        <p className="text-sm font-semibold text-neutral-300">No messages exchanged yet</p>
                        <p className="text-xs text-neutral-500 max-w-sm">
                          Type a message below or tap a quick reply chip to begin assisting {selectedCustomer.customerName}.
                        </p>
                      </div>
                    ) : (
                      activeChatMessages.map((m, idx) => {
                        const isAdmin = m.senderRole === 'ADMIN';
                        const prevMsg = idx > 0 ? activeChatMessages[idx - 1] : null;
                        const currDivider = formatDateDivider(m.createdAt);
                        const prevDivider = prevMsg ? formatDateDivider(prevMsg.createdAt) : null;
                        const showDateDivider = !prevMsg || currDivider !== prevDivider;

                        return (
                          <React.Fragment key={m.id || idx}>
                            {showDateDivider && (
                              <div className="flex items-center justify-center my-2.5 select-none">
                                <div className="px-3 py-0.5 rounded-full bg-dark-900/90 border border-dark-800 text-[10px] font-mono text-neutral-400 uppercase tracking-wider shadow-xs">
                                  {currDivider}
                                </div>
                              </div>
                            )}

                            <div
                              className={`flex items-end gap-2.5 ${
                                isAdmin ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              {!isAdmin && (
                                <div className="w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 overflow-hidden flex items-center justify-center text-[11px] font-bold text-accent-400 shrink-0 mb-1 shadow-sm">
                                  {m.customerAvatar || m.profileImage || selectedCustomer?.customerAvatar || selectedCustomer?.profileImage ? (
                                    <img
                                      src={m.customerAvatar || m.profileImage || selectedCustomer?.customerAvatar || selectedCustomer?.profileImage}
                                      alt={m.senderName || 'Customer'}
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  ) : (
                                    (m.senderName || 'C').charAt(0).toUpperCase()
                                  )}
                                </div>
                              )}

                              <div
                                className={`max-w-[86%] sm:max-w-[76%] ${
                                  isAdmin ? 'items-end' : 'items-start'
                                }`}
                              >
                                <div
                                  className={`p-3 sm:p-3.5 rounded-2xl shadow-md text-[13px] leading-relaxed select-text break-words transition-all ${
                                    isAdmin
                                      ? 'bg-gradient-to-br from-accent-600 via-indigo-600 to-indigo-700 text-white rounded-br-xs shadow-accent-950/40 border border-indigo-400/30'
                                      : 'bg-dark-850/95 border border-dark-750 text-neutral-100 rounded-bl-xs shadow-black/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3 mb-1 pb-1 border-b border-white/10 text-[11px] font-bold select-none text-neutral-300">
                                    <span>
                                      {isAdmin ? 'MS Mobiles Store Concierge (You)' : (m.senderName || 'Customer')}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-80">
                                      {formatTimeOnly(m.createdAt)}
                                    </span>
                                  </div>
                                  
                                  <p className="whitespace-pre-wrap">{m.message}</p>

                                  {/* Inline Delivery Status */}
                                  <div
                                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono select-none ${
                                      isAdmin ? 'text-indigo-200/90' : 'text-neutral-500'
                                    }`}
                                  >
                                    <span>{formatTimeOnly(m.createdAt)}</span>
                                    {isAdmin && <CheckCheck className="w-3.5 h-3.5 text-sky-300" title="Delivered" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    )}
                  </div>

                  {/* Floating Jump to Latest Button with Badge */}
                  <AnimatePresence>
                    {isUserScrolledUp && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        onClick={() => scrollToBottom('smooth')}
                        className={`absolute bottom-3 right-5 z-30 px-3.5 py-1.5 rounded-full border shadow-2xl flex items-center gap-2 text-xs font-bold backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                          hasNewIncoming
                            ? 'bg-accent-600 text-white border-accent-400 shadow-accent-950/80 animate-bounce'
                            : 'bg-dark-900/95 text-neutral-200 hover:text-white border-dark-700 shadow-black/80'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-accent-300" />
                        <span>{hasNewIncoming ? 'New customer message received ↓' : 'Jump to latest message'}</span>
                        {hasNewIncoming && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick Canned Responses Tray - shrink-0 (NEVER PUSHED OFF!) */}
                <div className="bg-dark-950 border-t border-dark-800/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none shrink-0 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent-400" />
                    <span>Quick Reply:</span>
                  </span>
                  {ADMIN_CANNED_REPLIES.map((canned, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectCannedReply(canned.text)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-neutral-300 hover:text-white bg-dark-900 border border-dark-750 hover:border-accent-500/60 hover:bg-dark-850 whitespace-nowrap transition-all duration-150 shrink-0 shadow-xs flex items-center gap-1 active:scale-95"
                      title={canned.text}
                    >
                      <span>{canned.label}</span>
                    </button>
                  ))}
                </div>

                {/* Bottom Reply Composer - shrink-0 (ALWAYS VISIBLE AT BOTTOM!) */}
                <div className="p-3 sm:p-3.5 bg-dark-950 border-t border-dark-800 shrink-0 z-20">
                  <form onSubmit={handleSendAdminReply} className="space-y-1.5">
                    <div className="flex items-end gap-2 p-1.5 rounded-xl bg-dark-900 border border-dark-750 focus-within:border-accent-500/70 focus-within:ring-2 focus-within:ring-accent-500/20 transition-all shadow-inner">
                      <textarea
                        ref={textareaRef}
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendAdminReply();
                          }
                        }}
                        placeholder={`Reply directly to ${selectedCustomer.customerName}... (Enter to send)`}
                        rows={1}
                        className="flex-1 bg-transparent px-2.5 py-1.5 text-xs sm:text-[13px] text-white placeholder-neutral-500 resize-none focus:outline-none max-h-28 min-h-[36px] leading-relaxed"
                      />

                      <button
                        type="submit"
                        disabled={!adminReplyText.trim() || isSendingReply}
                        className="px-3.5 py-2 rounded-lg bg-gradient-to-tr from-accent-600 to-indigo-600 hover:from-accent-500 hover:to-indigo-500 disabled:opacity-40 disabled:hover:from-accent-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-glow-sm transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
                      >
                        {isSendingReply ? (
                          <Spinner size="xs" />
                        ) : (
                          <>
                            <span>Send</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[10px] text-neutral-400 font-medium select-none">
                      <span>Delivers in real-time to {selectedCustomer.customerName}'s portal chat.</span>
                      <span className="hidden sm:inline">Press Enter ↵ to send • Shift+Enter for new line</span>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-neutral-700" />
                <h3 className="text-base font-bold text-white">Select a Customer Conversation</h3>
                <p className="text-xs text-neutral-400 max-w-sm">
                  Choose a customer thread from the left panel to review message history and reply directly in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STOREFRONT INQUIRIES LIST (Legacy Contact Submissions) */}
      {/* ========================================================================= */}
      {activeTab === 'INQUIRIES' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-dark-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-dark-950 border border-dark-750 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500/60"
              />
            </div>

            <div className="flex items-center gap-2">
              {['ALL', 'PENDING', 'REPLIED', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-accent-600 text-white shadow-sm'
                      : 'bg-dark-950 text-neutral-400 hover:text-white border border-dark-800'
                  }`}
                >
                  {st}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchInquiries}
                className="text-neutral-400 hover:text-white"
              >
                <RotateCcw className={`w-4 h-4 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Inquiries Cards */}
          {isLoadingInquiries ? (
            <div className="p-16 text-center">
              <Spinner size="lg" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-dark-900/60 border border-dark-800 space-y-2">
              <Inbox className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No inquiries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-2xl bg-dark-900 border border-dark-800 p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{inq.name}</span>
                        <span className="text-xs font-mono text-neutral-400">({inq.email})</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500">
                        Submitted: {formatTimestamp(inq.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === 'REPLIED'
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                            : inq.status === 'RESOLVED'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {inq.status || 'PENDING'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(inq)}
                        className="px-3 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-colors"
                      >
                        Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteModal({ isOpen: true, item: inq, isDeleting: false })}
                        className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-400 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-200 whitespace-pre-wrap">{inq.message}</p>

                  {inq.adminReply && (
                    <div className="p-3 rounded-xl bg-accent-600/10 border border-accent-500/30 text-xs space-y-1">
                      <div className="flex items-center justify-between text-accent-300 font-bold text-[11px]">
                        <span>Store Response</span>
                        <span className="font-mono text-[10px]">{formatTimestamp(inq.repliedAt)}</span>
                      </div>
                      <p className="text-white">{inq.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-dark-900 border border-dark-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Delete Customer Inquiry?</h3>
            <p className="text-xs text-neutral-400">
              This will permanently delete the inquiry from {deleteModal.item?.name}.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, item: null, isDeleting: false })}
                className="px-3 py-1.5 rounded-xl bg-dark-800 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteInquiry}
                disabled={deleteModal.isDeleting}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                {deleteModal.isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Reply Drawer Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-dark-900 border border-dark-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-dark-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Reply to {selectedInquiry.name}</h3>
                <p className="text-xs font-mono text-neutral-400">{selectedInquiry.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs text-neutral-300 max-h-36 overflow-y-auto">
              {selectedInquiry.message}
            </div>

            <form onSubmit={handleReplyToInquiry} className="space-y-3">
              <textarea
                value={inquiryReplyText}
                onChange={(e) => setInquiryReplyText(e.target.value)}
                rows={4}
                placeholder="Type your reply to the customer..."
                className="w-full p-3 bg-dark-950 border border-dark-750 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-3 py-2 rounded-xl bg-dark-800 text-neutral-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!inquiryReplyText.trim() || isSubmittingInquiryReply}
                  className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {isSubmittingInquiryReply ? 'Sending...' : 'Publish Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
