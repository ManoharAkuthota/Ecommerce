/**
 * Customer Orders Management Page
 * Module: pages/account/UserOrders.jsx
 * 
 * Displays customer's complete purchase history:
 * - Filterable tabs: All, In Progress, Delivered, Cancelled
 * - Order status chips with distinctive color coding
 * - Device previews and direct links to live tracking stepper
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Smartphone,
  ChevronRight,
  Search,
} from 'lucide-react';
import orderService from '../../services/orderService';

const STATUS_BADGES = {
  PENDING: { label: 'Pending Payment', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  CONFIRMED: { label: 'Order Confirmed', bg: 'bg-accent-500/10', border: 'border-accent-500/30', text: 'text-accent-400' },
  PROCESSING: { label: 'Processing & Packing', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  SHIPPED: { label: 'Shipped & In Transit', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  DELIVERED: { label: 'Delivered', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' },
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | ACTIVE | DELIVERED | CANCELLED
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab === 'ACTIVE') {
      if (['DELIVERED', 'CANCELLED'].includes(order.orderStatus)) return false;
    } else if (activeTab === 'DELIVERED') {
      if (order.orderStatus !== 'DELIVERED') return false;
    } else if (activeTab === 'CANCELLED') {
      if (order.orderStatus !== 'CANCELLED') return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber?.toLowerCase().includes(q);
      const matchPhone = order.items?.some((i) => i.mobileName?.toLowerCase().includes(q));
      return matchNumber || matchPhone;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-accent-400" />
            My Orders & Tracking
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track real-time shipment status and review official GST invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 rounded-xl bg-dark-900 border border-dark-800 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-accent-500 w-52"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'ALL', label: 'All Orders' },
          { key: 'ACTIVE', label: 'Active & In Transit' },
          { key: 'DELIVERED', label: 'Delivered' },
          { key: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-accent-600 text-white shadow-glow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-dark-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List Content */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Loading your purchase history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-dark-900 border border-dark-800 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center text-neutral-500 mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No orders match your search query.'
              : "You haven't placed any smartphone orders yet."}
          </p>
          <Link
            to="/mobiles"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-accent-600 text-white text-xs font-bold hover:bg-accent-500 transition-colors"
          >
            Explore Smartphones
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = STATUS_BADGES[order.orderStatus] || STATUS_BADGES.CONFIRMED;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-lg hover:border-dark-700 transition-all group"
              >
                {/* Card Top Header */}
                <div className="px-5 py-4 border-b border-dark-800/80 bg-dark-850/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-accent-400 text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.border} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                    <span className="font-extrabold text-white text-sm">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Card Items Preview */}
                <div className="p-5 space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-lg bg-dark-800 border border-dark-700/60 p-1 shrink-0 flex items-center justify-center">
                        <img src={item.mobileImage} alt={item.mobileName} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-accent-400">
                          {item.mobileBrand}
                        </span>
                        <h4 className="text-xs font-semibold text-white truncate">
                          {item.mobileName}
                        </h4>
                        <p className="text-[11px] text-neutral-400">
                          Qty: {item.quantity} • {item.ram} / {item.storage}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-neutral-300">
                        ₹{item.totalPrice?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 border-t border-dark-800/80 bg-dark-850/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                    {order.deliveryType === 'STORE_PICKUP' ? (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Building2 className="w-3.5 h-3.5" /> Showroom Pickup
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-accent-400">
                        <Truck className="w-3.5 h-3.5" /> Express Delivery
                      </span>
                    )}
                    {order.trackingNumber && (
                      <span className="font-mono text-neutral-300">
                        (Tracking: {order.trackingNumber})
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent-400 hover:text-accent-300 transition-colors"
                  >
                    View Details & Live Stepper
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
