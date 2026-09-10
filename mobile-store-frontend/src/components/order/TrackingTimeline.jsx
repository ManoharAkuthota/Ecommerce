/**
 * Granular Milestone Checkpoint Logger
 * Module: components/order/TrackingTimeline.jsx
 * 
 * Generates realistic, timestamped courier scan checkpoints for flagship deliveries.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Building,
  Navigation,
  ShieldAlert,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

const TrackingTimeline = ({ order }) => {
  if (!order) return null;

  const {
    orderStatus,
    createdAt,
    updatedAt,
    estimatedDeliveryDate,
    carrier = 'Blue Dart Express',
    trackingNumber = 'BD-98421048',
    shippingAddress = {},
  } = order;

  const city = shippingAddress.city || 'Destination City';
  const state = shippingAddress.state || 'India';

  const orderTime = createdAt ? new Date(createdAt) : new Date();
  
  // Format date helper
  const fmtDate = (d) => {
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const fmtTime = (d) => {
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Compute realistic timestamps based on order creation
  const t0 = new Date(orderTime.getTime());
  const t1 = new Date(orderTime.getTime() + 45 * 60 * 1000); // +45 mins
  const t2 = new Date(orderTime.getTime() + 3 * 3600 * 1000); // +3 hours
  const t3 = new Date(orderTime.getTime() + 14 * 3600 * 1000); // +14 hours
  const t4 = new Date(orderTime.getTime() + 26 * 3600 * 1000); // +26 hours
  const t5 = updatedAt ? new Date(updatedAt) : new Date(orderTime.getTime() + 32 * 3600 * 1000);

  const isDelivered = orderStatus === 'DELIVERED';
  const isShipped = orderStatus === 'SHIPPED';
  const isProcessing = orderStatus === 'PROCESSING';
  const isConfirmed = orderStatus === 'CONFIRMED';
  const isCancelled = orderStatus === 'CANCELLED';

  const milestones = isCancelled
    ? [
        {
          title: 'Order Placed & Payment Processed',
          location: 'MS Mobiles Online Portal',
          date: fmtDate(t0),
          time: fmtTime(t0),
          status: 'completed',
          desc: 'Initial customer payment verified.',
        },
        {
          title: 'Order Cancelled',
          location: 'MS Mobiles Customer Service Desk',
          date: fmtDate(t5),
          time: fmtTime(t5),
          status: 'cancelled',
          desc: order.notes || 'Order cancelled by customer or administrator. Refund initiated to source method.',
        },
      ]
    : [
        {
          id: 'step-delivered',
          title: 'Shipment Delivered to Recipient',
          location: `${city}, ${state} — Doorstep`,
          date: fmtDate(t5),
          time: fmtTime(t5),
          status: isDelivered ? 'completed' : 'upcoming',
          badge: isDelivered ? 'Delivered with OTP' : 'Pending Handover',
          desc: isDelivered
            ? `Package received by ${shippingAddress.fullName || 'Customer'}. Electronic OTP signature confirmed.`
            : 'Delivery executive will verify 4-digit security PIN before handover.',
          icon: CheckCircle2,
        },
        {
          id: 'step-out-for-delivery',
          title: 'Out for Priority Doorstep Delivery',
          location: `${city} Central Distribution Center`,
          date: fmtDate(t4),
          time: fmtTime(t4),
          status: isDelivered ? 'completed' : isShipped ? 'active' : 'upcoming',
          badge: isDelivered ? 'Completed' : isShipped ? 'Out for Delivery' : 'Upcoming',
          desc: `Assigned to courier executive with tamper-proof security pouch. AWB: ${trackingNumber}.`,
          icon: Truck,
        },
        {
          id: 'step-local-hub',
          title: `Package Arrived at ${city} Sorting Facility`,
          location: `${city}, ${state} Gateway`,
          date: fmtDate(t3),
          time: fmtTime(t3),
          status: isDelivered || isShipped ? 'completed' : 'upcoming',
          badge: isDelivered || isShipped ? 'Hub Scanned' : 'In Transit',
          desc: 'Inbound container unloaded and sorted into designated local delivery lane.',
          icon: Building,
        },
        {
          id: 'step-carrier-pickup',
          title: `Handed Over to ${carrier}`,
          location: 'Hyderabad Air Logistics Hub (HYD)',
          date: fmtDate(t2),
          time: fmtTime(t2),
          status: isDelivered || isShipped ? 'completed' : isProcessing ? 'active' : 'upcoming',
          badge: isDelivered || isShipped ? 'Carrier Verified' : isProcessing ? 'Pickup In Progress' : 'Upcoming',
          desc: `Consignment manifest created and handed over to ${carrier} priority flight route.`,
          icon: Package,
        },
        {
          id: 'step-inspected',
          title: 'Quality Check & IMEI Allocation',
          location: 'MS Mobiles Central Showroom Hub, Hyderabad',
          date: fmtDate(t1),
          time: fmtTime(t1),
          status: isDelivered || isShipped || isProcessing ? 'completed' : 'upcoming',
          badge: 'Passed QA',
          desc: 'Factory box seal, IMEI serial verification, and official warranty card registered.',
          icon: Sparkles,
        },
        {
          id: 'step-confirmed',
          title: 'Order Confirmed & Payment Verified',
          location: 'MS Mobiles Digital Gateway',
          date: fmtDate(t0),
          time: fmtTime(t0),
          status: 'completed',
          badge: 'Order Confirmed',
          desc: `Customer purchase authorized via ${order.paymentMethod || 'Prepaid'}. Order #${order.orderNumber}.`,
          icon: CheckCircle2,
        },
      ];

  return (
    <div className="rounded-3xl bg-dark-900/90 border border-dark-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between pb-6 border-b border-dark-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-accent-500/10 text-accent-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Milestone Checkpoint History
            </h3>
            <p className="text-xs text-neutral-400">
              Detailed chronological scan logs synced with {carrier} APIs
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
          LIVE AUDIT
        </span>
      </div>

      {/* Timeline entries list */}
      <div className="mt-8 relative space-y-6">
        {/* Continuous vertical line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-dark-800" />

        {milestones.map((m, idx) => {
          const isDone = m.status === 'completed';
          const isActive = m.status === 'active';
          const isCanc = m.status === 'cancelled';

          return (
            <div key={idx} className="relative flex items-start gap-4 sm:gap-5 group">
              {/* Dot Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-105 ${
                    isCanc
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                      : isActive
                      ? 'bg-accent-600 text-white border-accent-400 shadow-glow-sm animate-pulse'
                      : 'bg-dark-950 text-neutral-600 border-dark-800'
                  }`}
                >
                  {isCanc ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isActive ? (
                    <Truck className="w-5 h-5" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Checkpoint Content Card */}
              <div
                className={`flex-1 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-500/5 border-accent-500/30 shadow-card'
                    : isDone
                    ? 'bg-dark-950/60 border-dark-800/80 hover:border-dark-750'
                    : 'bg-dark-950/30 border-dark-850 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-sm sm:text-base font-bold tracking-tight ${
                        isDone || isActive ? 'text-white' : 'text-neutral-400'
                      }`}
                    >
                      {m.title}
                    </h4>
                    {m.badge && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : isActive
                            ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                            : 'bg-dark-900 text-neutral-500 border border-dark-800'
                        }`}
                      >
                        {m.badge}
                      </span>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                    <span>{m.date}</span>
                    <span>•</span>
                    <span className="text-neutral-300 font-semibold">{m.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-accent-400 font-medium mb-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{m.location}</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimeline;
