/**
 * Admin Dashboard Landing Page
 * Module: pages/admin/Dashboard.jsx
 * 
 * Central overview console for the MS Mobiles eCommerce administration.
 * Features:
 * - Personalized welcome banner with real admin profile from AuthContext
 * - 4 luxury DashboardCard metric indicators (Total Mobiles, Visible Products, Hidden Products, Reviews)
 * - Quick administrative action triggers
 * - Live infrastructure & security status telemetry
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Eye,
  EyeOff,
  MessageSquare,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Database,
  CloudLightning,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  ShoppingBag,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DashboardCard from '../../components/admin/DashboardCard';
import MetricInspectionModal from '../../components/admin/MetricInspectionModal';
import { Button, Card } from '../../components/ui';
import Spinner from '../../components/ui/Spinner';
import { mobileService } from '../../services/mobileService';
import { reviewService } from '../../services/reviewService';
import chatService from '../../services/chatService';
import contactService from '../../services/contactService';
import { fadeInUp, staggerContainer } from '../../utils/animations';

export const Dashboard = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const adminName = admin?.name || 'Store Administrator';

  // Live Data State
  const [mobiles, setMobiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [activeInspectionMetric, setActiveInspectionMetric] = useState(null);

  // In-place visibility toggling without leaving dashboard
  const handleToggleVisibility = async (mobileId, newHiddenState) => {
    try {
      await mobileService.toggleVisibility(mobileId);
      setMobiles((prev) =>
        prev.map((m) => (m.id === mobileId ? { ...m, hidden: newHiddenState } : m))
      );
    } catch (err) {
      console.error('[Dashboard] Error toggling visibility:', err);
    }
  };

  // Fetch all live administrative data concurrently
  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [mobilesRes, reviewsRes, chatsRes, inqRes] = await Promise.allSettled([
        mobileService.getMobiles(),
        reviewService.getAllReviews(),
        chatService.getAdminConversations(),
        contactService.getAllMessages(),
      ]);

      if (mobilesRes.status === 'fulfilled') {
        const mList = Array.isArray(mobilesRes.value)
          ? mobilesRes.value
          : mobilesRes.value?.content || [];
        setMobiles(mList);
      }

      if (reviewsRes.status === 'fulfilled') {
        const rList = Array.isArray(reviewsRes.value) ? reviewsRes.value : [];
        setReviews(rList);
      }

      if (chatsRes.status === 'fulfilled') {
        const cList = Array.isArray(chatsRes.value) ? chatsRes.value : [];
        setConversations(cList);
      }

      if (inqRes.status === 'fulfilled') {
        const iList = Array.isArray(inqRes.value) ? inqRes.value : [];
        setInquiries(iList);
      }

      setLastSynced(new Date());
    } catch (err) {
      console.error('[AdminDashboard] Error aggregating live metrics:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Derived Live Metrics
  const visibleMobiles = useMemo(() => mobiles.filter((m) => !m.hidden), [mobiles]);
  const hiddenMobiles = useMemo(() => mobiles.filter((m) => m.hidden), [mobiles]);
  
  const inStockMobiles = useMemo(
    () => mobiles.filter((m) => m.stockStatus === 'IN_STOCK' || !m.stockStatus),
    [mobiles]
  );
  const lowStockMobiles = useMemo(
    () => mobiles.filter((m) => m.stockStatus === 'LIMITED_STOCK' || m.stockStatus === 'OUT_OF_STOCK'),
    [mobiles]
  );

  const uniqueBrands = useMemo(() => {
    const set = new Set(mobiles.map((m) => m.brand).filter(Boolean));
    return Array.from(set);
  }, [mobiles]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return '5.0';
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const unreadChatsCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const pendingInquiriesCount = useMemo(() => {
    return inquiries.filter((i) => i.status === 'PENDING').length;
  }, [inquiries]);

  const totalUnread = unreadChatsCount + pendingInquiriesCount;
  const totalCommunications = conversations.length + inquiries.length;

  // Format currency helper (INR)
  const formatPrice = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format relative time helper
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMins = Math.floor((now - d) / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // Merge recent customer communications
  const recentCommunications = useMemo(() => {
    const list = [];
    conversations.forEach((c) => {
      list.push({
        id: `chat-${c.customerId}`,
        type: 'CHAT',
        name: c.customerName || 'Customer',
        avatar: c.customerAvatar || c.profileImage,
        email: c.customerEmail,
        message: c.lastMessage || 'Started customer live inquiry',
        createdAt: c.lastMessageTime,
        unread: (c.unreadCount || 0) > 0,
      });
    });

    inquiries.forEach((i) => {
      list.push({
        id: `inq-${i.id}`,
        type: 'INQUIRY',
        name: i.name,
        email: i.email,
        message: i.message,
        createdAt: i.createdAt,
        unread: i.status === 'PENDING',
      });
    });

    return list
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [conversations, inquiries]);

  // Latest 4 Smartphones
  const latestMobiles = useMemo(() => {
    return [...mobiles]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [mobiles]);

  return (
    <div className="space-y-8 select-none">
      {/* ========================================================================= */}
      {/* 1. WELCOME BANNER WITH ACTIONS */}
      {/* ========================================================================= */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div className="relative rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-accent-500/20 p-6 sm:p-8 shadow-card overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  <span>MS Mobiles Management Console</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Storefront Active</span>
                </span>
                {lastSynced && (
                  <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                    Synced: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Welcome back, {adminName}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                Real-time inventory telemetry, customer concierge chats, and showroom catalog operations. Click any card below to manage.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchDashboardData(true)}
                disabled={isRefreshing}
                title="Refresh all metrics"
                className="text-neutral-300 hover:text-white border border-dark-750 bg-dark-900/60"
              >
                <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-accent-400' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
              </Button>

              <Link to="/admin/mobiles/add">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<PlusCircle className="w-4 h-4" />}
                  className="shadow-glow-sm"
                >
                  + Add Smartphone
                </Button>
              </Link>

              <Link to="/admin/messages">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<MessageSquare className="w-4 h-4" />}
                  className="relative"
                >
                  <span>Live Chats</span>
                  {totalUnread > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold animate-pulse">
                      {totalUnread}
                    </span>
                  )}
                </Button>
              </Link>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-dark-900/80 hover:bg-dark-800 border border-dark-750 text-neutral-400 hover:text-white transition-colors"
                title="Open Customer Storefront"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. KEY METRICS GRID (100% Interactive & Clickable Links) */}
      {/* ========================================================================= */}
      <motion.div
        variants={staggerContainer(0.06, 0.08)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {/* Metric 1: Total Mobiles */}
        <DashboardCard
          title="Total Mobiles"
          value={isLoading ? '...' : mobiles.length}
          badgeText={uniqueBrands.length > 0 ? `${uniqueBrands.length} Brands` : 'Catalog'}
          change="Click to inspect all devices →"
          trend="up"
          icon={<Smartphone className="w-5 h-5" />}
          accentColor="accent"
          onClick={() => setActiveInspectionMetric('TOTAL_MOBILES')}
          isActive={activeInspectionMetric === 'TOTAL_MOBILES'}
          delay={0}
        />

        {/* Metric 2: Visible Products */}
        <DashboardCard
          title="Storefront Live"
          value={isLoading ? '...' : visibleMobiles.length}
          badgeText="Active"
          change="Click to inspect live devices →"
          trend="up"
          icon={<Eye className="w-5 h-5" />}
          accentColor="emerald"
          onClick={() => setActiveInspectionMetric('VISIBLE_MOBILES')}
          isActive={activeInspectionMetric === 'VISIBLE_MOBILES'}
          delay={0.05}
        />

        {/* Metric 3: Hidden Drafts */}
        <DashboardCard
          title="Staged Drafts"
          value={isLoading ? '...' : hiddenMobiles.length}
          badgeText="Unpublished"
          change={hiddenMobiles.length > 0 ? 'Click to inspect drafts →' : 'No drafts pending →'}
          trend="neutral"
          icon={<EyeOff className="w-5 h-5" />}
          accentColor="purple"
          onClick={() => setActiveInspectionMetric('DRAFT_MOBILES')}
          isActive={activeInspectionMetric === 'DRAFT_MOBILES'}
          delay={0.1}
        />

        {/* Metric 4: Customer Reviews */}
        <DashboardCard
          title="Customer Reviews"
          value={isLoading ? '...' : reviews.length}
          badgeText={`${avgRating} ★`}
          change="Click to inspect reviews →"
          trend="up"
          icon={<Star className="w-5 h-5" />}
          accentColor="amber"
          onClick={() => setActiveInspectionMetric('REVIEWS')}
          isActive={activeInspectionMetric === 'REVIEWS'}
          delay={0.15}
        />

        {/* Metric 5: Live Inquiries & Chats */}
        <DashboardCard
          title="Customer Chats"
          value={isLoading ? '...' : totalCommunications}
          badgeText={totalUnread > 0 ? `${totalUnread} Unread` : 'Clear'}
          change="Click to inspect conversations →"
          trend={totalUnread > 0 ? 'down' : 'up'}
          icon={<MessageSquare className="w-5 h-5" />}
          accentColor="cyan"
          onClick={() => setActiveInspectionMetric('CHATS')}
          isActive={activeInspectionMetric === 'CHATS'}
          delay={0.2}
        />

        {/* Metric 6: Inventory Status */}
        <DashboardCard
          title="Showroom Stock"
          value={isLoading ? '...' : inStockMobiles.length}
          badgeText={lowStockMobiles.length > 0 ? `${lowStockMobiles.length} Limited` : 'Optimal'}
          change="Click to inspect stock levels →"
          trend={lowStockMobiles.length > 0 ? 'down' : 'up'}
          icon={<ShoppingBag className="w-5 h-5" />}
          accentColor="emerald"
          onClick={() => setActiveInspectionMetric('STOCK')}
          isActive={activeInspectionMetric === 'STOCK'}
          delay={0.25}
        />
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. OPERATIONAL WORKSPACE: RECENT CHATS & RECENT INVENTORY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Cols 1-7): Live Customer Inquiries & Chats */}
        <div className="lg:col-span-7 space-y-6">
          <Card glass={true} className="p-6 sm:p-7 space-y-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Recent Customer Communications</span>
                      {totalUnread > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-600 text-white animate-pulse">
                          {totalUnread} New
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Incoming live chats and storefront concierge inquiries
                    </p>
                  </div>
                </div>

                <Link
                  to="/admin/messages"
                  className="text-xs font-bold text-accent-400 hover:text-accent-300 flex items-center gap-1 group transition-colors"
                >
                  <span>Open Messenger</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Feed List */}
              <div className="divide-y divide-dark-800/60 mt-2">
                {isLoading && recentCommunications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Spinner size="md" />
                    <p className="text-xs text-neutral-400 mt-2">Loading customer inquiries...</p>
                  </div>
                ) : recentCommunications.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-neutral-600" />
                    <p className="text-xs font-semibold text-neutral-300">No customer messages yet</p>
                    <p className="text-[11px] text-neutral-500">
                      When customers ask questions in their account or contact form, they appear here.
                    </p>
                  </div>
                ) : (
                  recentCommunications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate('/admin/messages')}
                      className="py-3.5 flex items-start justify-between gap-4 group cursor-pointer hover:bg-dark-850/40 px-2 rounded-xl transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-600 to-indigo-600 p-0.5 shrink-0 shadow-sm">
                          <div className="w-full h-full bg-dark-950 rounded-[10px] overflow-hidden flex items-center justify-center text-xs font-bold text-white">
                            {item.avatar ? (
                              <img
                                src={item.avatar}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-[10px]"
                              />
                            ) : (
                              (item.name || 'C').charAt(0).toUpperCase()
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate group-hover:text-accent-300 transition-colors">
                              {item.name}
                            </span>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                item.type === 'CHAT'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                              }`}
                            >
                              {item.type === 'CHAT' ? 'Live Chat' : 'Inquiry'}
                            </span>
                            {item.unread && (
                              <span className="w-2 h-2 rounded-full bg-accent-400 animate-ping" />
                            )}
                          </div>

                          <p className="text-[11px] text-neutral-400 font-mono truncate">
                            {item.email}
                          </p>
                          <p className="text-xs text-neutral-300 line-clamp-1">
                            {item.message}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right space-y-1">
                        <span className="text-[10px] font-mono text-neutral-500 block">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-400 group-hover:translate-x-0.5 transition-transform">
                          <span>Reply</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-xs text-neutral-400">
              <span>{totalCommunications} Total Customer Communications</span>
              <Link to="/admin/messages" className="font-bold text-accent-400 hover:text-accent-300">
                View Full Inbox →
              </Link>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (Cols 8-12): Recent Showroom Catalog Smartphones */}
        <div className="lg:col-span-5 space-y-6">
          <Card glass={true} className="p-6 sm:p-7 space-y-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Showroom Catalog</h2>
                    <p className="text-xs text-neutral-400">Latest flagship smartphones in store</p>
                  </div>
                </div>

                <Link
                  to="/admin/mobiles"
                  className="text-xs font-bold text-accent-400 hover:text-accent-300 flex items-center gap-1 group transition-colors"
                >
                  <span>Manage ({mobiles.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Mobile Devices List */}
              <div className="divide-y divide-dark-800/60 mt-2">
                {isLoading && latestMobiles.length === 0 ? (
                  <div className="py-12 text-center">
                    <Spinner size="md" />
                    <p className="text-xs text-neutral-400 mt-2">Loading smartphones...</p>
                  </div>
                ) : latestMobiles.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 space-y-2">
                    <Smartphone className="w-8 h-8 mx-auto text-neutral-600" />
                    <p className="text-xs font-semibold text-neutral-300">No phones in catalog</p>
                    <Link to="/admin/mobiles/add">
                      <Button size="xs" variant="primary" className="mt-2">
                        + Add First Device
                      </Button>
                    </Link>
                  </div>
                ) : (
                  latestMobiles.map((m) => {
                    const imgUrl = m.images?.[0]?.imageUrl || m.imageUrls?.[0];
                    const isHidden = Boolean(m.hidden);

                    return (
                      <div
                        key={m.id}
                        onClick={() => navigate(`/admin/mobiles/edit/${m.id}`)}
                        className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-dark-850/40 px-2 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Image Thumbnail */}
                          <div className="w-10 h-10 rounded-xl bg-dark-950 border border-dark-800 flex items-center justify-center overflow-hidden shrink-0">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={m.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <Smartphone className="w-4 h-4 text-neutral-600" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-xs font-bold text-white truncate group-hover:text-accent-300 transition-colors">
                              {m.name}
                            </h3>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                              <span className="font-semibold text-neutral-300">{m.brand}</span>
                              <span>•</span>
                              <span className="font-mono text-emerald-400 font-bold">
                                {formatPrice(m.price)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Tags */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isHidden
                                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            }`}
                          >
                            {isHidden ? 'Draft' : 'Live'}
                          </span>
                          <span className="text-neutral-500 group-hover:text-accent-400 transition-colors">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-xs text-neutral-400">
              <Link to="/admin/mobiles/add" className="font-bold text-accent-400 hover:text-accent-300 flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Smartphone</span>
              </Link>
              <Link to="/admin/mobiles" className="font-semibold hover:text-white">
                View All {mobiles.length} Devices →
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SYSTEM HEALTH & QUICK ADMINISTRATIVE SHORTCUTS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: System Architecture Health */}
        <div className="lg:col-span-7">
          <Card glass={true} className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent-500/10 text-accent-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">System Architecture &amp; Database Health</h3>
                  <p className="text-xs text-neutral-400">Active services powering MS Mobiles</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                100% Operational
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-dark-950/60 border border-dark-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Spring Boot 3.3.4</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-neutral-400">REST APIs &amp; Security</p>
                <span className="text-[10px] font-mono text-emerald-400 block pt-1">Active</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-dark-950/60 border border-dark-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>MySQL 8.0 Engine</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-neutral-400">{mobiles.length} Mobiles • {reviews.length} Reviews</p>
                <span className="text-[10px] font-mono text-emerald-400 block pt-1">Synchronized</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-dark-950/60 border border-dark-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Live Concierge Hub</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-neutral-400">{totalCommunications} Active Threads</p>
                <span className="text-[10px] font-mono text-emerald-400 block pt-1">Polling Active</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Quick Administrative Jump Center */}
        <div className="lg:col-span-5">
          <Card glass={true} className="p-6 sm:p-7 space-y-4">
            <div className="pb-3 border-b border-dark-800">
              <h3 className="text-sm font-bold text-white">Quick Administrative Shortcuts</h3>
              <p className="text-xs text-neutral-400">1-click navigation to key store modules</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/admin/mobiles/add"
                className="p-3 rounded-2xl bg-dark-950/60 hover:bg-dark-850 border border-dark-800 hover:border-accent-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-accent-400 mb-1">
                  <PlusCircle className="w-4 h-4" />
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs font-bold text-white">Add Smartphone</p>
                <p className="text-[10px] text-neutral-400">Launch new model</p>
              </Link>

              <Link
                to="/admin/mobiles"
                className="p-3 rounded-2xl bg-dark-950/60 hover:bg-dark-850 border border-dark-800 hover:border-accent-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <Smartphone className="w-4 h-4" />
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs font-bold text-white">Manage Catalog</p>
                <p className="text-[10px] text-neutral-400">Stock &amp; visibility</p>
              </Link>

              <Link
                to="/admin/messages"
                className="p-3 rounded-2xl bg-dark-950/60 hover:bg-dark-850 border border-dark-800 hover:border-accent-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-cyan-400 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs font-bold text-white">Live Customer Chat</p>
                <p className="text-[10px] text-neutral-400">{totalUnread > 0 ? `${totalUnread} waiting` : 'Real-time CRM'}</p>
              </Link>

              <Link
                to="/admin/reviews"
                className="p-3 rounded-2xl bg-dark-950/60 hover:bg-dark-850 border border-dark-800 hover:border-accent-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <Star className="w-4 h-4" />
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs font-bold text-white">Moderate Reviews</p>
                <p className="text-[10px] text-neutral-400">{reviews.length} feedback items</p>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. IN-PLACE METRIC DATA INSPECTION MODAL (ZERO REDIRECTS) */}
      {/* ========================================================================= */}
      <MetricInspectionModal
        isOpen={Boolean(activeInspectionMetric)}
        onClose={() => setActiveInspectionMetric(null)}
        metricType={activeInspectionMetric}
        data={{
          mobiles,
          visibleMobiles,
          hiddenMobiles,
          reviews,
          communications: recentCommunications,
          inStockMobiles,
          lowStockMobiles,
        }}
        onToggleVisibility={handleToggleVisibility}
        onOpenMessenger={() => navigate('/admin/messages')}
      />
    </div>
  );
};

export default Dashboard;
