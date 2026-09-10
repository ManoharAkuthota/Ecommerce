/**
 * Metric Inspection Modal Component
 * Module: components/admin/MetricInspectionModal.jsx
 * 
 * In-place interactive data inspection drawer/modal for the MS Mobiles Admin Dashboard.
 * Allows store administrators to inspect, search, and manage exact, accurate data
 * for each dashboard metric directly WITHOUT navigating away or redirecting.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Smartphone,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  ShoppingBag,
  ExternalLink,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '../ui';

export const MetricInspectionModal = ({
  isOpen,
  onClose,
  metricType, // 'TOTAL_MOBILES' | 'VISIBLE_MOBILES' | 'DRAFT_MOBILES' | 'REVIEWS' | 'CHATS' | 'STOCK'
  data = {},
  onToggleVisibility,
  onOpenMessenger,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset search when modal opens or metric changes
  useEffect(() => {
    setSearchQuery('');
  }, [metricType, isOpen]);

  // Format currency helper (INR)
  const formatPrice = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Metric configuration
  const config = useMemo(() => {
    switch (metricType) {
      case 'TOTAL_MOBILES':
        return {
          title: 'Total Mobile Catalog',
          subtitle: 'Complete list of all registered flagship smartphones in MS Mobiles showroom',
          icon: Smartphone,
          badgeColor: 'bg-accent-500/15 text-accent-300 border-accent-500/30',
          countLabel: 'Devices',
        };
      case 'VISIBLE_MOBILES':
        return {
          title: 'Storefront Live Products',
          subtitle: 'Active smartphones currently visible and purchasable by public customers',
          icon: Eye,
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          countLabel: 'Live',
        };
      case 'DRAFT_MOBILES':
        return {
          title: 'Staged Draft Models',
          subtitle: 'Unpublished device drafts staged by administrators, not yet visible to customers',
          icon: EyeOff,
          badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          countLabel: 'Drafts',
        };
      case 'REVIEWS':
        return {
          title: 'Verified Customer Reviews',
          subtitle: 'Authentic customer ratings, product feedback, and testimonials',
          icon: Star,
          badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          countLabel: 'Reviews',
        };
      case 'CHATS':
        return {
          title: 'Customer Communications & Chats',
          subtitle: 'Real-time live chat conversations and customer concierge messages',
          icon: MessageSquare,
          badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          countLabel: 'Threads',
        };
      case 'STOCK':
        return {
          title: 'Showroom Inventory & Stock Status',
          subtitle: 'Real-time stock availability, in-stock flagship units, and limited stock alerts',
          icon: ShoppingBag,
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          countLabel: 'Tracked',
        };
      default:
        return {
          title: 'Metric Details',
          subtitle: 'Detailed data records for selected metric',
          icon: Sparkles,
          badgeColor: 'bg-accent-500/15 text-accent-300 border-accent-500/30',
          countLabel: 'Items',
        };
    }
  }, [metricType]);

  // Filtered Items based on search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (metricType === 'TOTAL_MOBILES') {
      const list = data.mobiles || [];
      if (!q) return list;
      return list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.brand?.toLowerCase().includes(q) ||
          m.processor?.toLowerCase().includes(q)
      );
    }

    if (metricType === 'VISIBLE_MOBILES') {
      const list = data.visibleMobiles || [];
      if (!q) return list;
      return list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.brand?.toLowerCase().includes(q)
      );
    }

    if (metricType === 'DRAFT_MOBILES') {
      const list = data.hiddenMobiles || [];
      if (!q) return list;
      return list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.brand?.toLowerCase().includes(q)
      );
    }

    if (metricType === 'REVIEWS') {
      const list = data.reviews || [];
      if (!q) return list;
      return list.filter(
        (r) =>
          r.userName?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q) ||
          r.mobileName?.toLowerCase().includes(q)
      );
    }

    if (metricType === 'CHATS') {
      const list = data.communications || [];
      if (!q) return list;
      return list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.message?.toLowerCase().includes(q)
      );
    }

    if (metricType === 'STOCK') {
      const list = data.mobiles || [];
      if (!q) return list;
      return list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.brand?.toLowerCase().includes(q) ||
          m.stockStatus?.toLowerCase().includes(q)
      );
    }

    return [];
  }, [metricType, data, searchQuery]);

  if (!isOpen) return null;

  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Dialog Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-dark-900 border border-dark-750/90 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Subtle Ambient Top Glow */}
          <div className="absolute top-0 right-1/4 -mt-12 w-64 h-32 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* HEADER SECTION */}
          <div className="p-5 sm:p-6 pb-4 border-b border-dark-800 flex items-start justify-between gap-4 shrink-0 bg-dark-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-3 rounded-2xl border ${config.badgeColor} shrink-0`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black text-white truncate">
                    {config.title}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono ${config.badgeColor}`}
                  >
                    {filteredItems.length} {config.countLabel}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                  {config.subtitle}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white bg-dark-850 hover:bg-dark-800 border border-dark-750 transition-colors shrink-0"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="px-5 sm:px-6 py-3 border-b border-dark-800/80 bg-dark-950/40 flex items-center gap-3 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${config.title.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-dark-900 border border-dark-750 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500/60 focus:ring-1 focus:ring-accent-500/40 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs font-bold p-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* BODY: EXACT PROPER ACCURATE DATA LIST */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-dark-800/60">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-dark-850 border border-dark-800 flex items-center justify-center mx-auto text-neutral-500">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-neutral-300">No matching records found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No items match "${searchQuery}". Try a different keyword.`
                    : 'No items currently in this metric category.'}
                </p>
              </div>
            ) : (
              (metricType === 'TOTAL_MOBILES' ||
                metricType === 'VISIBLE_MOBILES' ||
                metricType === 'DRAFT_MOBILES' ||
                metricType === 'STOCK') &&
              filteredItems.map((m) => {
                const imgUrl = m.images?.[0]?.imageUrl || m.imageUrls?.[0];
                const isHidden = Boolean(m.hidden);
                const isLowStock =
                  m.stockStatus === 'LIMITED_STOCK' || m.stockStatus === 'OUT_OF_STOCK';

                return (
                  <div
                    key={m.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-dark-850/30 px-3 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-dark-950 border border-dark-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={m.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Smartphone className="w-6 h-6 text-neutral-600" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white group-hover:text-accent-300 transition-colors">
                            {m.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-dark-800 text-neutral-300 border border-dark-700">
                            {m.brand}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
                          <span className="font-mono text-emerald-400 font-bold text-sm">
                            {formatPrice(m.price)}
                          </span>
                          <span>•</span>
                          <span>{m.processor || 'Flagship SoC'}</span>
                          {m.ram && (
                            <>
                              <span>•</span>
                              <span>{m.ram} RAM</span>
                            </>
                          )}
                          {m.storage && (
                            <>
                              <span>•</span>
                              <span>{m.storage} Storage</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          isLowStock
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {m.stockStatus === 'LIMITED_STOCK'
                          ? 'Limited Stock'
                          : m.stockStatus === 'OUT_OF_STOCK'
                          ? 'Out of Stock'
                          : 'In Stock'}
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          isHidden
                            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {isHidden ? 'Staged Draft' : 'Storefront Live'}
                      </span>

                      {onToggleVisibility && (
                        <button
                          onClick={() => onToggleVisibility(m.id, !isHidden)}
                          title={isHidden ? 'Publish to Live Storefront' : 'Hide from Public Storefront'}
                          className={`p-2 rounded-xl border transition-all ${
                            isHidden
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-dark-800 hover:bg-dark-750 text-neutral-400 hover:text-white border-dark-700'
                          }`}
                        >
                          {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      )}

                      {!isHidden && (
                        <a
                          href={`/mobiles/${m.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-700 text-neutral-400 hover:text-white transition-colors"
                          title="View on Customer Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <a
                        href={`/admin/mobiles/edit/${m.id}`}
                        className="p-2 rounded-xl bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 border border-accent-500/25 transition-colors"
                        title="Edit Device Specifications"
                      >
                        <Edit3 className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}

            {/* REVIEWS */}
            {metricType === 'REVIEWS' &&
              filteredItems.map((r) => (
                <div
                  key={r.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group hover:bg-dark-850/30 px-3 rounded-2xl transition-all"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shrink-0 shadow-sm">
                      <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center text-xs font-bold text-white">
                        {(r.userName || 'U').charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{r.userName || 'Customer'}</span>
                        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-[11px] font-bold">
                          <span>{r.rating || 5}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </div>
                        {r.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>

                      {r.mobileName && (
                        <p className="text-[11px] text-accent-400 font-semibold">
                          Smartphone: {r.mobileName}
                        </p>
                      )}

                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        "{r.comment}"
                      </p>

                      <span className="text-[10px] font-mono text-neutral-500 block pt-0.5">
                        {formatDate(r.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

            {/* CHATS */}
            {metricType === 'CHATS' &&
              filteredItems.map((c) => (
                <div
                  key={c.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group hover:bg-dark-850/30 px-3 rounded-2xl transition-all"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shrink-0 shadow-sm">
                      <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center text-xs font-bold text-white">
                        {(c.name || 'C').charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{c.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            c.type === 'CHAT'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                          }`}
                        >
                          {c.type === 'CHAT' ? 'Live Chat' : 'Inquiry'}
                        </span>
                        {c.unread && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-accent-600 text-white animate-pulse">
                            Unread
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-400 font-mono">{c.email}</p>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-2">
                        {c.message}
                      </p>

                      <span className="text-[10px] font-mono text-neutral-500 block pt-0.5">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                  </div>

                  {onOpenMessenger && (
                    <Button
                      size="xs"
                      variant="primary"
                      onClick={() => {
                        onClose();
                        onOpenMessenger(c);
                      }}
                      className="shrink-0 self-end sm:self-center"
                      icon={<Send className="w-3 h-3" />}
                    >
                      Reply in Chat
                    </Button>
                  )}
                </div>
              ))}
          </div>

          {/* FOOTER */}
          <div className="p-4 sm:p-5 border-t border-dark-800 bg-dark-950/60 flex items-center justify-between text-xs text-neutral-400 shrink-0">
            <span>
              Showing {filteredItems.length} of {config.countLabel.toLowerCase()}
            </span>
            <Button size="xs" variant="ghost" onClick={onClose}>
              Done Inspecting
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MetricInspectionModal;
