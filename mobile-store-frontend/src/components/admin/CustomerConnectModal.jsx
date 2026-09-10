/**
 * Customer Connect Drawer & Quick Action Modal
 * Module: components/admin/CustomerConnectModal.jsx
 * 
 * Provides store managers with direct customer identity inspection,
 * instant phone/email dispatch, lifetime spend metrics, and one-click live chat initiation.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  Copy,
  Check,
  Package,
  Calendar,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_BADGES = {
  PENDING: { label: 'Pending', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-accent-500/10', border: 'border-accent-500/30', text: 'text-accent-400' },
  PROCESSING: { label: 'Processing', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  SHIPPED: { label: 'Shipped', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  DELIVERED: { label: 'Delivered', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' },
};

const CustomerConnectModal = ({ isOpen, onClose, customer, onStartChat }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !customer) return null;

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const ordersCount = customer.ordersCount || 0;
  const totalSpent = customer.totalSpent || 0;
  const avgOrderValue = ordersCount > 0 ? Math.round(totalSpent / ordersCount) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-dark-950/80 backdrop-blur-md"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-dark-900 border border-dark-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header Strip with Branding & Close */}
          <div className="relative px-6 pt-6 pb-5 border-b border-dark-800 bg-gradient-to-r from-dark-850 via-dark-900 to-dark-850">
            <button
              onClick={onClose}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              {/* Customer Avatar */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-glow-sm overflow-hidden flex-shrink-0">
                {customer.profileImage ? (
                  <img
                    src={customer.profileImage}
                    alt={customer.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'U'}</span>
                )}
                {customer.emailVerified && (
                  <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-white rounded-tl-lg shadow" title="Email Verified">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Customer Name & Subtitle */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-white truncate">
                    {customer.fullName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-accent-500/10 text-accent-400 border border-accent-500/30">
                    {ordersCount > 0 ? 'VIP Shopper' : 'Registered Member'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-mono">
                    ID: {customer.id?.substring(0, 8)}...
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Quick Action Hub: Call, Email, Chat */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Connect Direct Channels
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Phone Call Action */}
                <a
                  href={customer.phoneNumber ? `tel:${customer.phoneNumber}` : '#'}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                    customer.phoneNumber
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      : 'bg-dark-800/40 border-dark-800 text-neutral-500 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider">Voice Call</div>
                    <div className="text-xs font-semibold truncate">
                      {customer.phoneNumber || 'No phone'}
                    </div>
                  </div>
                </a>

                {/* 2. Direct Email Action */}
                <a
                  href={`mailto:${customer.email}`}
                  className="p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center gap-3 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider">Email Customer</div>
                    <div className="text-xs font-semibold truncate">
                      {customer.email}
                    </div>
                  </div>
                </a>

                {/* 3. Live Chat Action */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartChat(customer);
                  }}
                  className="p-3 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-600 hover:from-accent-500 hover:to-indigo-500 text-white flex items-center gap-3 transition-all shadow-glow-sm text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-accent-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Live Chat
                    </div>
                    <div className="text-xs font-extrabold truncate">
                      Open Conversation
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Lifetime Metrics Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-dark-850 border border-dark-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Total Orders
                </span>
                <span className="text-lg font-extrabold text-white mt-0.5 block">
                  {ordersCount}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-dark-850 border border-dark-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Lifetime Spend
                </span>
                <span className="text-lg font-extrabold text-accent-400 mt-0.5 block">
                  ₹{totalSpent?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-dark-850 border border-dark-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Avg Order Value
                </span>
                <span className="text-lg font-extrabold text-emerald-400 mt-0.5 block">
                  ₹{avgOrderValue?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-dark-850 border border-dark-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Primary Location
                </span>
                <span className="text-xs font-bold text-white mt-1.5 block truncate flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                  {customer.city || customer.state || 'Hyderabad (HQ)'}
                </span>
              </div>
            </div>

            {/* Contact Details Copy Row */}
            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-800/80 space-y-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Direct Contact Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-dark-750">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-neutral-200 truncate">{customer.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(customer.email, 'email')}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors shrink-0 ml-2"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-dark-750">
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-neutral-200 truncate">
                      {customer.phoneNumber || 'Not provided'}
                    </span>
                  </div>
                  {customer.phoneNumber && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(customer.phoneNumber, 'phone')}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors shrink-0 ml-2"
                      title="Copy Phone"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Purchase History ({ordersCount})
                </span>
                {ordersCount > 0 && (
                  <Link
                    to="/admin/orders"
                    onClick={onClose}
                    className="text-xs font-bold text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-colors"
                  >
                    View All in Orders <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {!customer.recentOrders || customer.recentOrders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-dark-850 border border-dark-800 text-center space-y-1">
                  <Package className="w-6 h-6 text-neutral-500 mx-auto" />
                  <p className="text-xs text-neutral-400">
                    No orders have been placed by this customer yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customer.recentOrders.map((ord) => {
                    const badge = STATUS_BADGES[ord.orderStatus] || STATUS_BADGES.CONFIRMED;
                    return (
                      <div
                        key={ord.orderId}
                        className="p-3.5 rounded-2xl bg-dark-850 border border-dark-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {ord.primaryPhoneImage ? (
                            <div className="w-10 h-12 rounded-lg bg-dark-800 border border-dark-700/60 p-1 shrink-0 flex items-center justify-center">
                              <img src={ord.primaryPhoneImage} alt="Device" className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-dark-800 border border-dark-700/60 flex items-center justify-center text-accent-400 shrink-0">
                              <Smartphone className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-accent-400">
                                {ord.orderNumber}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border} ${badge.text}`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                              {ord.primaryPhoneName || `${ord.itemsCount} smartphone items`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-white text-sm block">
                            ₹{ord.totalAmount?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Close */}
          <div className="px-6 py-4 border-t border-dark-800 bg-dark-850/50 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              MS Mobiles CRM Concierge
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-neutral-200 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomerConnectModal;
