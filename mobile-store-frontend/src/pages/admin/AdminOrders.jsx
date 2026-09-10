/**
 * Admin Order Fulfillment Management Console
 * Module: pages/admin/AdminOrders.jsx
 * 
 * Enterprise administrative interface for store owners:
 * - Revenue & Order Volume KPI Metrics
 * - Multi-criteria filter tabs & fast keyword search
 * - Live Order Status updater modal (Carrier, AWB Tracking Number, Payment Status)
 * - Detailed order inspector drawer/view
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  X,
  ExternalLink,
  Edit3,
  Calendar,
  DollarSign,
  Building2,
} from 'lucide-react';
import orderService from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

const STATUS_BADGES = {
  PENDING: { label: 'Pending Payment', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-accent-500/10', border: 'border-accent-500/30', text: 'text-accent-400' },
  PROCESSING: { label: 'Processing', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  SHIPPED: { label: 'Shipped', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  DELIVERED: { label: 'Delivered', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' },
};

const AdminOrders = () => {
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Status update form state
  const [statusForm, setStatusForm] = useState({
    orderStatus: 'PROCESSING',
    paymentStatus: 'PAID',
    carrier: 'Blue Dart Express',
    trackingNumber: '',
    notes: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrdersAndMetrics();
  }, [activeStatus]);

  const fetchOrdersAndMetrics = async () => {
    setIsLoading(true);
    try {
      const [ordersData, metricsData] = await Promise.all([
        orderService.getAdminOrders({
          status: activeStatus || undefined,
          search: searchQuery.trim() || undefined,
          size: 50,
        }),
        orderService.getAdminOrderMetrics(),
      ]);

      setOrders(ordersData?.content || (Array.isArray(ordersData) ? ordersData : []));
      if (metricsData) setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      toast.error('Failed to retrieve orders catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrdersAndMetrics();
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusForm({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      carrier: order.carrier || 'Blue Dart Express',
      trackingNumber: order.trackingNumber || `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
      notes: order.notes || '',
    });
    setShowStatusModal(true);
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const updated = await orderService.updateAdminOrderStatus(selectedOrder.id, statusForm);
      toast.success(`Order ${updated.orderNumber} status updated to ${updated.orderStatus}!`);
      setShowStatusModal(false);
      fetchOrdersAndMetrics();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update order status.';
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Package className="w-7 h-7 text-accent-400" />
            Order Fulfillment & Shipping
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track customer orders, generate tracking numbers, and manage showroom pickups.
          </p>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Total Revenue
          </span>
          <span className="text-xl sm:text-2xl font-black text-accent-400">
            ₹{Number(metrics.totalRevenue || 0).toLocaleString('en-IN')}
          </span>
          <p className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Lifetime e-commerce sales
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Total Orders
          </span>
          <span className="text-xl sm:text-2xl font-black text-white">
            {metrics.totalOrders || 0}
          </span>
          <p className="text-[10px] text-neutral-500 mt-1">Processed orders</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Pending / In Transit
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400">
            {(Number(metrics.pendingOrders) || 0) + (Number(metrics.processingOrders) || 0) + (Number(metrics.shippedOrders) || 0)}
          </span>
          <p className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> Awaiting delivery
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Delivered Successfully
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400">
            {metrics.deliveredOrders || 0}
          </span>
          <p className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Fulfilled orders
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
          {[
            { key: '', label: 'All Orders' },
            { key: 'CONFIRMED', label: 'Confirmed' },
            { key: 'PROCESSING', label: 'Processing' },
            { key: 'SHIPPED', label: 'Shipped' },
            { key: 'DELIVERED', label: 'Delivered' },
            { key: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatus(tab.key)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                activeStatus === tab.key
                  ? 'bg-accent-600 text-white shadow-glow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-neutral-200 text-xs font-semibold"
          >
            Find
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-400">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-xs space-y-2">
            <Package className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="font-semibold text-white">No orders matching criteria</p>
            <p>Customer purchases will populate in this table in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dark-800 text-neutral-400 font-bold uppercase tracking-wider text-[11px] bg-dark-850/50">
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Purchased Smartphone</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Delivery</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/60">
                {orders.map((order) => {
                  const badge = STATUS_BADGES[order.orderStatus] || STATUS_BADGES.CONFIRMED;

                  return (
                    <tr key={order.id} className="hover:bg-dark-850/30 transition-colors">
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <span className="text-accent-400">{order.orderNumber}</span>
                        <span className="block text-[10px] text-neutral-400 font-sans font-normal mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">
                          {order.shippingAddress?.fullName || order.customerName}
                        </span>
                        <span className="text-[11px] text-neutral-400 block">
                          {order.shippingAddress?.phoneNumber || order.customerEmail}
                        </span>
                      </td>

                      {/* Items Preview */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <span className="text-neutral-200 font-medium truncate block">
                          {order.items?.map((i) => `${i.quantity}x ${i.mobileName}`).join(', ') || 'Smartphones'}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {order.items?.length} line item(s)
                        </span>
                      </td>

                      {/* Amount & Payment */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-white block text-sm">
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {order.paymentMethod} • <strong className={order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}>{order.paymentStatus}</strong>
                        </span>
                      </td>

                      {/* Delivery Type */}
                      <td className="py-3.5 px-4">
                        <span className="flex items-center gap-1 font-semibold text-neutral-300">
                          {order.deliveryType === 'STORE_PICKUP' ? (
                            <>
                              <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Pickup
                            </>
                          ) : (
                            <>
                              <Truck className="w-3.5 h-3.5 text-accent-400" /> Express
                            </>
                          )}
                        </span>
                        {order.trackingNumber && (
                          <span className="text-[10px] font-mono text-neutral-400 block">
                            AWB: {order.trackingNumber}
                          </span>
                        )}
                      </td>

                      {/* Status Chip */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openStatusModal(order)}
                          className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-white font-semibold text-xs border border-dark-700 flex items-center gap-1.5 ml-auto transition-colors"
                        >
                          <Edit3 className="w-3 h-3 text-accent-400" />
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-dark-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent-400" />
                    Update Order #{selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Customer: {selectedOrder.customerName} ({selectedOrder.customerEmail})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Fulfillment Status *
                    </label>
                    <select
                      value={statusForm.orderStatus}
                      onChange={(e) => setStatusForm((prev) => ({ ...prev, orderStatus: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Payment Status *
                    </label>
                    <select
                      value={statusForm.paymentStatus}
                      onChange={(e) => setStatusForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Shipping Carrier / Courier Name
                  </label>
                  <input
                    type="text"
                    value={statusForm.carrier}
                    onChange={(e) => setStatusForm((prev) => ({ ...prev, carrier: e.target.value }))}
                    placeholder="e.g. Blue Dart Express, Delhivery"
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Courier AWB / Tracking Reference Number
                  </label>
                  <input
                    type="text"
                    value={statusForm.trackingNumber}
                    onChange={(e) => setStatusForm((prev) => ({ ...prev, trackingNumber: e.target.value }))}
                    placeholder="e.g. BD-98421048"
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs font-mono focus:outline-none focus:border-accent-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Fulfillment Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={statusForm.notes}
                    onChange={(e) => setStatusForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g. Dispatched via express van. Handover OTP required."
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-dark-800">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all shadow-glow-sm disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save & Notify Customer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
