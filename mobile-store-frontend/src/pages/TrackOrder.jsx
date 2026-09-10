/**
 * Public Order Tracking Portal & Logistics Center
 * Module: pages/TrackOrder.jsx
 * 
 * Publicly accessible route (/track & /track-order) for tracking any MS Mobiles shipment
 * by order number or AWB tracking code with zero login requirement.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Truck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Smartphone,
  CreditCard,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import orderService from '../services/orderService';
import TrackingRouteMap from '../components/order/TrackingRouteMap';
import TrackingTimeline from '../components/order/TrackingTimeline';
import DeliveryAgentCard from '../components/order/DeliveryAgentCard';
import TrackingAlertsModal from '../components/order/TrackingAlertsModal';

const SAMPLE_ORDERS = ['MS-2026-19855', 'MS-2026-17550'];

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrder = searchParams.get('order') || '';

  const [searchQuery, setSearchQuery] = useState(initialOrder);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  // Auto-fetch if query param is present on page load
  useEffect(() => {
    if (initialOrder.trim()) {
      handleLookup(initialOrder.trim());
    }
  }, [initialOrder]);

  const handleLookup = async (orderNumberToFetch) => {
    const cleanRef = (orderNumberToFetch || searchQuery).trim();
    if (!cleanRef) {
      setError('Please enter a valid order number or tracking reference.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrder(null);

    // Sync URL param
    setSearchParams({ order: cleanRef });

    try {
      const data = await orderService.lookupOrderByNumber(cleanRef);
      setOrder(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        `No shipment record found for "${cleanRef}". Please verify your order ID and try again.`;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLookup(searchQuery);
  };

  const handleSampleClick = (sampleId) => {
    setSearchQuery(sampleId);
    handleLookup(sampleId);
  };

  const handleClear = () => {
    setSearchQuery('');
    setOrder(null);
    setError(null);
    setSearchParams({});
  };

  // Status color pill resolver
  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-accent-500/20 text-accent-300 border border-accent-500/30 flex items-center gap-1.5 shadow-sm animate-pulse">
            <Truck className="w-3.5 h-3.5" /> In Transit
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <Package className="w-3.5 h-3.5" /> Packing & QA
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 py-8 sm:py-14 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55rem] h-96 bg-accent-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-80 right-0 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <Container size="7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-white font-semibold">Track Shipment</span>
        </div>

        {/* Hero Section & Search Bar */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-glow-sm"
          >
            <Truck className="w-3.5 h-3.5 text-accent-400" />
            <span>Pan-India Live Logistics Telemetry</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4"
          >
            Track Your Flagship Package
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto mb-8"
          >
            Enter your Order ID (e.g. <strong className="text-neutral-200">MS-2026-19855</strong>) to view real-time courier milestones, delivery agent details, and dispatch routes.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="relative flex flex-col sm:flex-row items-stretch gap-3 p-2 rounded-3xl bg-dark-900/90 border border-dark-800 shadow-2xl backdrop-blur-2xl"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g., MS-2026-19855)"
                className="w-full bg-transparent pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="rounded-2xl px-7 shadow-glow-sm hover:shadow-glow-md"
            >
              {isLoading ? 'Locating...' : 'Track Order'}
            </Button>
          </motion.form>

          {/* Sample quick test chips */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-neutral-400">
            <span>Try sample order:</span>
            {SAMPLE_ORDERS.map((sampleId) => (
              <button
                key={sampleId}
                type="button"
                onClick={() => handleSampleClick(sampleId)}
                className="px-3 py-1 rounded-full bg-dark-900 hover:bg-dark-850 border border-dark-800 hover:border-accent-500/40 text-accent-300 font-mono text-[11px] transition-all hover:scale-105"
              >
                {sampleId}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
            <div className="h-32 rounded-3xl bg-dark-900/60 border border-dark-800" />
            <div className="h-72 rounded-3xl bg-dark-900/60 border border-dark-800" />
            <div className="h-96 rounded-3xl bg-dark-900/60 border border-dark-800" />
          </div>
        )}

        {/* Error / Not Found Card */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-8 rounded-3xl bg-dark-900/80 border border-rose-500/20 text-center space-y-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Order Reference Not Found</h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
              {error}
            </p>
            <div className="pt-2 text-[11px] text-neutral-400 border-t border-dark-800/80 flex items-center justify-center gap-4">
              <span>• Verify order format (e.g. MS-2026-XXXXX)</span>
              <span>• Check invoice sent to your email</span>
            </div>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => handleSampleClick('MS-2026-19855')}
                className="px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                Load Demo Order (MS-2026-19855)
              </button>
              <Link
                to="/contact"
                className="px-5 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-300 font-semibold text-xs border border-dark-750 transition-all"
              >
                Contact Concierge
              </Link>
            </div>
          </motion.div>
        )}

        {/* Order Details Loaded View */}
        {order && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Top Order Summary Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-900 to-accent-950/40 border border-dark-800 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      Order Reference
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-white">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <p className="text-xs text-neutral-400">
                    Placed on{' '}
                    <strong className="text-neutral-200">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </strong>{' '}
                    • Delivered to{' '}
                    <strong className="text-neutral-200">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </strong>
                  </p>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowAlertsModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp / SMS Alerts</span>
                  </button>

                  <Link
                    to="/contact"
                    className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-300 hover:text-white border border-dark-750 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-accent-400" />
                    <span>Need Help?</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Grid Layout: Main Route & Milestones (Left) + Sidebar Details (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Route Map & Granular Timeline */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Visual Logistics Route Map */}
                <TrackingRouteMap order={order} />

                {/* 2. Granular Milestone Checkpoints */}
                <TrackingTimeline order={order} />
              </div>

              {/* Right Column: Delivery Agent, Shipping Card & Order Items */}
              <div className="lg:col-span-4 space-y-6">
                {/* 3. Delivery Agent Profile & Security OTP */}
                <DeliveryAgentCard order={order} />

                {/* 4. Ordered Devices Card */}
                <div className="rounded-3xl bg-dark-900/90 border border-dark-800 p-6 backdrop-blur-xl shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-dark-800">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                      Package Items ({order.items?.length || 0})
                    </span>
                    <span className="text-[11px] font-mono text-accent-400 font-bold">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="divide-y divide-dark-800/80 max-h-80 overflow-y-auto pr-1">
                    {order.items?.map((item) => (
                      <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
                        <img
                          src={item.mobileImage || '/placeholder-phone.png'}
                          alt={item.mobileName}
                          className="w-14 h-14 rounded-xl object-contain bg-dark-950 p-1.5 border border-dark-800 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">
                            {item.mobileName}
                          </h5>
                          <p className="text-[11px] text-neutral-400">
                            {item.ram} • {item.storage} • Qty: {item.quantity}
                          </p>
                          <p className="text-xs font-bold text-accent-400 font-mono mt-0.5">
                            ₹{item.unitPrice?.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="pt-3 border-t border-dark-800 space-y-1.5 text-xs text-neutral-400 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-neutral-200">₹{order.subtotal?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Tax (18%)</span>
                      <span className="font-mono text-neutral-200">₹{order.taxAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
                      </span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Coupon Discount</span>
                        <span className="font-mono">-₹{order.discountAmount?.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-dark-800 flex justify-between text-sm font-bold text-white">
                      <span>Total Paid</span>
                      <span className="font-mono text-accent-400 font-black">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Destination Delivery Address */}
                <div className="rounded-3xl bg-dark-900/90 border border-dark-800 p-6 backdrop-blur-xl shadow-2xl space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-accent-400 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-dark-800">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Delivery Address</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{order.shippingAddress?.fullName}</p>
                    <p className="text-neutral-400 mt-1 leading-relaxed">
                      {order.shippingAddress?.addressLine1}
                      {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                    </p>
                    <p className="text-neutral-400">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} —{' '}
                      <strong className="font-mono text-neutral-200">{order.shippingAddress?.postalCode}</strong>
                    </p>
                    <p className="text-neutral-500 mt-1">
                      Phone: <strong className="text-neutral-300 font-mono">{order.shippingAddress?.phoneNumber}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state prompt when no order is searched yet */}
        {!order && !isLoading && !error && (
          <div className="max-w-4xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-dark-900/60 border border-dark-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 text-accent-400 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Live Courier Tracking</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Direct integration with Blue Dart Express and Delhivery air cargo networks.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-dark-900/60 border border-dark-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Doorstep Handover OTP</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                4-digit verification code guarantees physical delivery only to the intended recipient.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-dark-900/60 border border-dark-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">WhatsApp & SMS Pings</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Receive instant dispatch notifications on departure, hub arrivals, and out-for-delivery.
              </p>
            </div>
          </div>
        )}
      </Container>

      {/* WhatsApp / SMS Simulator Modal */}
      <TrackingAlertsModal
        isOpen={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
        order={order}
      />
    </div>
  );
};

export default TrackOrder;
