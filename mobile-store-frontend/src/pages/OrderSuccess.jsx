/**
 * Order Confirmation & Tax Invoice Page
 * Module: pages/OrderSuccess.jsx
 * 
 * Displayed immediately upon successful order completion:
 * - Animated celebration checkmark
 * - Human-readable order number reference
 * - Estimated delivery date & carrier badge
 * - Itemized GST Tax Invoice receipt breakdown
 * - Print / PDF invoice download trigger
 * - Direct deep-link to real-time live order tracking
 */

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  Download,
  Smartphone,
  Banknote,
} from 'lucide-react';
import orderService from '../services/orderService';
import Container from '../components/ui/Container';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && orderId) {
      setIsLoading(true);
      orderService
        .getMyOrderById(orderId)
        .then((data) => setOrder(data))
        .catch((err) => {
          console.error('Failed to load order confirmation:', err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [order, orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="py-24 bg-dark-950 min-h-[70vh] flex items-center justify-center text-center">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-400">Finalizing your tax invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 bg-dark-950 min-h-[70vh] flex items-center justify-center text-center">
        <Container size="md">
          <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 text-white space-y-4">
            <h2 className="text-xl font-bold">Order Not Found</h2>
            <p className="text-xs text-neutral-400">
              We could not locate this order. Please check your account order history.
            </p>
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 text-white text-xs font-bold"
            >
              Go to My Orders
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const deliveryDateFormatted = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : '2-3 Business Days';

  return (
    <div className="py-8 sm:py-12 bg-dark-950 min-h-screen text-neutral-100">
      <Container size="5xl">
        {/* Celebration Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-glow-sm"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Thank you for shopping with MS Mobiles. Your order has been reserved and sent to our showroom fulfillment desk.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-dark-800 text-xs text-neutral-300">
            <span>Order Number:</span>
            <strong className="text-accent-400 font-mono tracking-wider text-sm">{order.orderNumber}</strong>
          </div>
        </div>

        {/* Cash on Delivery Highlighted Alert Banner */}
        {order.paymentMethod === 'COD' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-dark-900 to-dark-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Cash on Delivery Confirmed
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PAY ON ARRIVAL
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Please keep <strong className="text-amber-400 font-mono text-sm">₹{order.totalAmount?.toLocaleString('en-IN')}</strong> ready in cash notes or via courier UPI QR scan. No online payment was charged.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-dark-950 border border-dark-800 text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Doorstep Handover OTP
              </span>
              <span className="font-mono text-lg font-black text-accent-300 tracking-widest">
                {(order.orderNumber?.replace(/\D/g, '') || '9855').slice(-4)}
              </span>
            </div>
          </motion.div>
        )}

        {/* Printable Tax Invoice Container */}
        <div id="invoice-print-area" className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          {/* Invoice Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-dark-800 pb-6 print:border-neutral-300">
            <div>
              <span className="text-xl font-black uppercase tracking-wider font-sans text-white print:text-black">
                MS <span className="text-accent-500">Mobiles</span>
              </span>
              <p className="text-xs text-neutral-400 print:text-neutral-600 mt-1">
                Authorized Flagship Smartphone Showroom & Digital Retailer
              </p>
              <p className="text-[11px] text-neutral-500 print:text-neutral-500">
                GSTIN: 36AAACM1234F1Z8 • Official Tax Invoice
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {order.paymentStatus === 'PAID' ? 'PAID IN FULL' : 'PAYMENT DUE ON DELIVERY'}
              </span>
              <p className="text-xs text-neutral-400 print:text-neutral-600 mt-1">
                Date: {new Date(order.createdAt).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Delivery & Payment Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-800 print:border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Delivery Details
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-white print:text-black">
                {order.deliveryType === 'STORE_PICKUP' ? (
                  <>
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    Same-Day Showroom Pickup
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-accent-400" />
                    Express Doorstep Delivery
                  </>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Est. Delivery: <strong className="text-white print:text-black">{deliveryDateFormatted}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-800 print:border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Payment Method
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-white print:text-black">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                {order.paymentMethod} {order.paymentTransactionId ? `(${order.paymentTransactionId})` : ''}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Status: <strong className="text-emerald-400">{order.paymentStatus}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-800 print:border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Recipient / Shipping Address
              </span>
              <h4 className="text-xs font-semibold text-white print:text-black">
                {order.shippingAddress?.fullName || order.customerName}
              </h4>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
              </p>
              <p className="text-[10px] text-neutral-500">Phone: {order.shippingAddress?.phoneNumber}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dark-800 text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-2">Item Description</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/60">
                {order.items?.map((item) => (
                  <tr key={item.id} className="text-neutral-200 print:text-black">
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-3">
                        {item.mobileImage && (
                          <div className="w-10 h-12 rounded bg-dark-800 p-1 shrink-0 flex items-center justify-center print:hidden">
                            <img src={item.mobileImage} alt={item.mobileName} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-bold uppercase text-accent-400 block">
                            {item.mobileBrand}
                          </span>
                          <span className="font-semibold text-white print:text-black">{item.mobileName}</span>
                          <span className="text-[11px] text-neutral-400 block">
                            {item.ram} RAM • {item.storage} Storage • 1-Yr Warranty
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold">{item.quantity}</td>
                    <td className="py-3.5 px-2 text-right">₹{item.unitPrice?.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-white print:text-black">
                      ₹{item.totalPrice?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end pt-4 border-t border-dark-800">
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-medium text-white print:text-black">
                  ₹{order.subtotal?.toLocaleString('en-IN')}
                </span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-₹{order.discountAmount?.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-400">
                <span>GST (18% Included)</span>
                <span className="text-neutral-400 font-medium">₹{order.taxAmount?.toLocaleString('en-IN')}</span>
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

              <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-base font-extrabold text-white print:text-black">
                <span>Grand Total Paid</span>
                <span className="text-accent-400 text-lg font-black print:text-black">
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Signoff footer */}
          <div className="pt-6 border-t border-dark-800/60 text-[11px] text-neutral-500 text-center flex items-center justify-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Original Sealed Box
            </span>
            <span>•</span>
            <span>Free 7-Day Exchange</span>
            <span>•</span>
            <span>Pan-India Priority Support</span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-dark-700 bg-dark-900 hover:bg-dark-800 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save Tax Invoice
          </button>

          <Link
            to={`/track?order=${order.orderNumber}`}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold shadow-glow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Package className="w-4 h-4" />
            Track Live Shipment
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/mobiles"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs text-neutral-400 hover:text-white transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default OrderSuccess;
