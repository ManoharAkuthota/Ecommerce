/**
 * Customer Order Details & Live Tracking Stepper
 * Module: pages/account/UserOrderDetails.jsx
 * 
 * Features:
 * - Real-time 5-stage visual delivery timeline stepper
 * - Carrier tracking number and dispatch status
 * - Itemized GST Tax Invoice breakdown
 * - Cancellation modal for pending / unfulfilled orders
 * - Print invoice trigger
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  X,
  Phone,
  Mail,
  MapPin,
  Star,
} from 'lucide-react';
import orderService from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import TrackingRouteMap from '../../components/order/TrackingRouteMap';
import TrackingTimeline from '../../components/order/TrackingTimeline';
import DeliveryAgentCard from '../../components/order/DeliveryAgentCard';
import WriteReviewModal from '../../components/orders/WriteReviewModal';
import TaxInvoiceModal from '../../components/order/TaxInvoiceModal';

const TIMELINE_STAGES = [
  { key: 'CONFIRMED', label: 'Order Placed', desc: 'Order verified & inventory reserved' },
  { key: 'PROCESSING', label: 'Processing & Packaged', desc: 'Smartphone inspected & packed in sealed box' },
  { key: 'SHIPPED', label: 'Shipped & In Transit', desc: 'Handed over to courier partner' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Delivered to customer doorstep' },
];

const UserOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedReviewPhone, setSelectedReviewPhone] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getMyOrderById(id);
      setOrder(data);
    } catch (err) {
      toast.error('Failed to load order details.');
      navigate('/account/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    setIsCancelling(true);
    try {
      const updated = await orderService.cancelOrder(id, cancelReason);
      setOrder(updated);
      toast.success('Order has been cancelled successfully.');
      setShowCancelModal(false);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not cancel order.';
      toast.error(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-neutral-400">Loading order tracking details...</p>
      </div>
    );
  }

  if (!order) return null;

  // Determine current stepper index
  const stageOrder = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentIndex = stageOrder.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.orderStatus);

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Link to="/account/orders" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
            </Link>
            <span>/</span>
            <span className="text-accent-400 font-semibold">{order.orderNumber}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-3">
            Order #{order.orderNumber}
            {isCancelled && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Cancelled
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/track?order=${order.orderNumber}`}
            className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-sm"
          >
            <Truck className="w-3.5 h-3.5" />
            Live Logistics Hub
          </Link>

          <button
            type="button"
            onClick={() => setShowInvoiceModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-glow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>📄 Official GST Tax Invoice</span>
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* 1. Interactive Logistics Route Visualizer */}
      <TrackingRouteMap order={order} />

      {/* 2. Delivery Executive & Handover OTP (if not cancelled) */}
      {!isCancelled && (
        <DeliveryAgentCard order={order} />
      )}

      {/* 3. Granular Milestone Checkpoint Logger */}
      <TrackingTimeline order={order} />

      {/* 2. Order Information Cards (Address, Delivery, Payment) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Shipping Address
          </span>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent-400" />
            {order.shippingAddress?.fullName || order.customerName}
          </h4>
          <p className="text-xs text-neutral-400">
            {order.shippingAddress?.addressLine1}
            {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
          </p>
          <p className="text-xs text-neutral-400">
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
          </p>
          <p className="text-[11px] text-neutral-500 pt-1 flex items-center gap-1">
            <Phone className="w-3 h-3" /> {order.shippingAddress?.phoneNumber}
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Delivery Option
          </span>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            {order.deliveryType === 'STORE_PICKUP' ? (
              <>
                <Building2 className="w-4 h-4 text-cyan-400" />
                Showroom Demo Pickup
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 text-accent-400" />
                Express Doorstep Delivery
              </>
            )}
          </div>
          <p className="text-xs text-neutral-400">
            {order.deliveryType === 'STORE_PICKUP'
              ? 'MS Mobiles Flagship Experience Store, Cyber Towers Road'
              : 'Insured transit dispatch via Blue Dart Express'}
          </p>
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {order.shippingFee === 0 ? 'FREE Shipping' : `₹${order.shippingFee} Shipping`}
          </span>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Payment Method
          </span>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            {order.paymentMethod}
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            TXN: {order.paymentTransactionId || 'N/A (Cash on Delivery)'}
          </p>
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
              order.paymentStatus === 'PAID'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {order.paymentStatus === 'PAID' ? 'PAID IN FULL' : 'PAYMENT PENDING'}
          </span>
        </div>
      </div>

      {/* 3. Itemized Tax Invoice Card */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white border-b border-dark-800 pb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-accent-400" />
          Purchased Smartphones ({order.items?.length})
        </h2>

        <div className="divide-y divide-dark-800/80">
          {order.items?.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {item.mobileImage && (
                  <div className="w-14 h-16 rounded-xl bg-dark-800 border border-dark-700/60 p-1 shrink-0 flex items-center justify-center">
                    <img src={item.mobileImage} alt={item.mobileName} className="w-full h-full object-contain" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase text-accent-400 block">
                    {item.mobileBrand}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {item.mobileName}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {item.ram} RAM • {item.storage} Storage • 1-Year Indian Warranty
                  </p>
                  <span className="text-[11px] text-neutral-400 block sm:inline">
                    Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span className="text-sm sm:text-base font-extrabold text-white">
                  ₹{item.totalPrice?.toLocaleString('en-IN')}
                </span>
                {!isCancelled && (
                  <button
                    type="button"
                    onClick={() => setSelectedReviewPhone(item)}
                    className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-amber-400 hover:text-amber-300 border border-dark-700/80 hover:border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="hidden sm:inline">Write Review</span>
                    <span className="sm:hidden">Review</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Invoice Summary Totals */}
        <div className="pt-4 border-t border-dark-800 flex justify-end">
          <div className="w-full sm:w-80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Items Subtotal</span>
              <span className="font-semibold text-white">₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-400 font-semibold">
                <span>Promotional Discount</span>
                <span>-₹{order.discountAmount?.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-neutral-400">
              <span>GST (18% Included)</span>
              <span className="text-neutral-400">₹{order.taxAmount?.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between text-neutral-400">
              <span>Shipping Fee</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="text-emerald-400 font-bold">FREE</span>
                ) : (
                  `₹${order.shippingFee}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-base font-extrabold text-white">
              <span>Grand Total</span>
              <span className="text-accent-400 text-lg font-black">
                ₹{order.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-dark-900 border border-dark-800 rounded-3xl p-6 text-neutral-100 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  Cancel Order #{order.orderNumber}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-neutral-400">
                Are you sure you wish to cancel this order? Unfulfilled orders are cancelled immediately and inventory is returned to the showroom stock.
              </p>

              <form onSubmit={handleCancelOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Reason for Cancellation
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                  >
                    <option value="">Select a reason...</option>
                    <option value="Changed mind / Ordered by mistake">Changed mind / Ordered by mistake</option>
                    <option value="Found better price or deal">Found better price or deal</option>
                    <option value="Want to change delivery address or phone model">Want to change delivery address or phone model</option>
                    <option value="Delivery time is too long">Delivery time is too long</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                  >
                    Keep Order
                  </button>
                  <button
                    type="submit"
                    disabled={isCancelling || !cancelReason}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-50 transition-colors shadow-glow-sm"
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Write Review Dialog */}
      <WriteReviewModal
        isOpen={Boolean(selectedReviewPhone)}
        onClose={() => setSelectedReviewPhone(null)}
        phone={selectedReviewPhone}
      />

      {/* Official PDF GST Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={order}
      />
    </div>
  );
};

export default UserOrderDetails;
