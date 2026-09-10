/**
 * Multi-Step Luxury Checkout Page
 * Module: pages/Checkout.jsx
 * 
 * Frictionless e-commerce checkout experience:
 * - Pre-filled customer profile details
 * - Delivery selection (Standard Express vs. Showroom Same-Day Pickup)
 * - Multi-method payment selector (UPI/QR, Credit/Debit Card, NetBanking, COD, 0% EMI)
 * - Interactive Simulated UPI QR Modal
 * - Order placement with inventory reservation and redirect to OrderSuccess
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Truck,
  Building2,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  Percent,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useUserAuth } from '../hooks/useUserAuth';
import { useToast } from '../context/ToastContext';
import orderService from '../services/orderService';
import Container from '../components/ui/Container';
import OrderPlacementAnimation from '../components/order/OrderPlacementAnimation';

const Checkout = () => {
  const {
    cartItems,
    totalCount,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    totalAmount,
    coupon,
    clearCart,
  } = useCart();

  const { isAuthenticated, user } = useUserAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartItems, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500081',
  });

  const [deliveryType, setDeliveryType] = useState('STANDARD_DELIVERY'); // STANDARD_DELIVERY | STORE_PICKUP
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI | CARD | NETBANKING | COD | EMI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiTimer, setUpiTimer] = useState(120);

  // COD Verification Captcha State
  const [codCaptcha, setCodCaptcha] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [userCodInput, setUserCodInput] = useState('');
  const [codError, setCodError] = useState('');

  // Multi-Stage Order Placement Animation State
  const [showPlacementAnim, setShowPlacementAnim] = useState(false);
  const [animStage, setAnimStage] = useState(1);
  const [createdOrderObj, setCreatedOrderObj] = useState(null);

  // EMI State
  const [emiTenure, setEmiTenure] = useState(6);

  // Update formData when user loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        phoneNumber: prev.phoneNumber || user.phoneNumber || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.email.trim()) {
      toast.error('Please provide complete recipient contact details.');
      return;
    }

    if (deliveryType === 'STANDARD_DELIVERY' && (!formData.addressLine1.trim() || !formData.city.trim() || !formData.postalCode.trim())) {
      toast.error('Please enter a valid delivery address and PIN code.');
      return;
    }

    // COD Verification Check
    if (paymentMethod === 'COD') {
      if (userCodInput.trim() !== codCaptcha) {
        setCodError(`Please enter the correct 4-digit code (${codCaptcha}) to confirm Cash on Delivery.`);
        toast.error('Please enter the 4-digit verification code to confirm COD.');
        return;
      }
    }

    // If UPI selected, trigger simulated UPI scan verification modal
    if (paymentMethod === 'UPI') {
      setShowUpiModal(true);
      return;
    }

    // Otherwise place order directly with multi-stage animation
    await executeOrderPlacement();
  };

  const executeOrderPlacement = async (transactionId = null) => {
    setIsSubmitting(true);
    setShowPlacementAnim(true);
    setAnimStage(1);

    // Advance to Stage 2 (Logistics manifest) at 1.2s
    const stage2Timer = setTimeout(() => {
      setAnimStage(2);
    }, 1200);

    try {
      const itemsPayload = cartItems.map((item) => ({
        mobileId: item.id || item.mobileId,
        quantity: item.quantity,
      }));

      const payload = {
        items: itemsPayload,
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          email: formData.email.trim(),
          addressLine1: formData.addressLine1.trim() || 'MS Mobiles Showroom Pickup Desk',
          addressLine2: formData.addressLine2.trim() || '',
          city: formData.city.trim() || 'Hyderabad',
          state: formData.state.trim() || 'Telangana',
          postalCode: formData.postalCode.trim() || '500081',
        },
        paymentMethod: paymentMethod,
        deliveryType: deliveryType,
        couponCode: coupon?.code || null,
        paymentTransactionId: transactionId || (paymentMethod !== 'COD' ? `TXN-MS-${Date.now().toString().slice(-6)}` : null),
        notes: deliveryType === 'STORE_PICKUP' ? 'Customer showroom demo & pickup' : 'Standard express dispatch',
      };

      const createdOrder = await orderService.createOrder(payload);

      // Advance to Stage 3 (Celebration) at 2.4s
      setTimeout(() => {
        setAnimStage(3);
        setCreatedOrderObj(createdOrder);
        clearCart();
        setShowUpiModal(false);
      }, 2400);
    } catch (err) {
      clearTimeout(stage2Timer);
      setShowPlacementAnim(false);
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Failed to place order. Please try again.';
      toast.error(errorMsg);
      setShowUpiModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnimComplete = () => {
    setShowPlacementAnim(false);
    if (createdOrderObj) {
      navigate(`/order-success/${createdOrderObj.id}`, { state: { order: createdOrderObj } });
    }
  };

  const finalShipping = deliveryType === 'STORE_PICKUP' ? 0 : shippingFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + finalShipping);

  return (
    <div className="py-8 sm:py-12 bg-dark-950 min-h-screen text-neutral-100">
      <Container size="7xl">
        {/* Checkout Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <Link to="/cart" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
              </Link>
              <span>/</span>
              <span className="text-accent-400 font-semibold">Secure Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              Express Checkout
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Lock className="w-3 h-3" /> 256-Bit Encrypted
              </span>
            </h1>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Checkout Sections (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Recipient & Delivery Address Card */}
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Contact & Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Ramesh Reddy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Phone Number (For Courier OTP) *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Email Address (For Tax Invoice PDF) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="customer@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                    />
                  </div>

                  {deliveryType === 'STANDARD_DELIVERY' && (
                    <>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Street Address / House / Flat No. *
                        </label>
                        <input
                          type="text"
                          name="addressLine1"
                          required={deliveryType === 'STANDARD_DELIVERY'}
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          placeholder="Plot No. 42, Hitech City Road"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required={deliveryType === 'STANDARD_DELIVERY'}
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Hyderabad"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          required={deliveryType === 'STANDARD_DELIVERY'}
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Telangana"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          required={deliveryType === 'STANDARD_DELIVERY'}
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="500081"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs focus:outline-none focus:border-accent-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 2. Delivery Option Card */}
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Choose Delivery Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      deliveryType === 'STANDARD_DELIVERY'
                        ? 'bg-accent-500/10 border-accent-500/60 shadow-glow-sm'
                        : 'bg-dark-800/60 border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value="STANDARD_DELIVERY"
                      checked={deliveryType === 'STANDARD_DELIVERY'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="mt-0.5 text-accent-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                        <Truck className="w-4 h-4 text-accent-400" />
                        Doorstep Express Delivery
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Insured courier delivery in 2-3 business days.
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400">
                        {shippingFee === 0 ? 'FREE DELIVERY' : `₹${shippingFee} Shipping Fee`}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      deliveryType === 'STORE_PICKUP'
                        ? 'bg-accent-500/10 border-accent-500/60 shadow-glow-sm'
                        : 'bg-dark-800/60 border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value="STORE_PICKUP"
                      checked={deliveryType === 'STORE_PICKUP'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="mt-0.5 text-accent-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        Same-Day Showroom Pickup
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Collect from MS Mobiles Flagship Showroom today.
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400">
                        FREE • Priority Token
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. Payment Method Card */}
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  Select Payment Option
                </h2>

                <div className="space-y-3">
                  {/* UPI / QR Code (Recommended) */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      paymentMethod === 'UPI'
                        ? 'bg-accent-500/10 border-accent-500/60 shadow-glow-sm'
                        : 'bg-dark-800/60 border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={paymentMethod === 'UPI'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 text-accent-500 focus:ring-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
                          <QrCode className="w-4 h-4 text-accent-400" />
                          UPI Instant QR / Apps (Fastest & Zero Fee)
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          Scan with Google Pay, PhonePe, Paytm, or BHIM. Instant order confirmation.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-accent-500/20 text-accent-300 font-bold shrink-0">
                      Recommended
                    </span>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'CARD'
                        ? 'bg-accent-500/10 border-accent-500/60 shadow-glow-sm'
                        : 'bg-dark-800/60 border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 text-accent-500 focus:ring-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
                        <CreditCard className="w-4 h-4 text-cyan-400" />
                        Credit / Debit Card (Visa, MasterCard, RuPay)
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        All major Indian and international bank cards supported.
                      </p>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'NETBANKING'
                        ? 'bg-accent-500/10 border-accent-500/60 shadow-glow-sm'
                        : 'bg-dark-800/60 border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="NETBANKING"
                      checked={paymentMethod === 'NETBANKING'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 text-accent-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
                        <Smartphone className="w-4 h-4 text-amber-400" />
                        Net Banking
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        HDFC, ICICI, SBI, Axis, Kotak, and 50+ other Indian banks.
                      </p>
                    </div>
                  </label>

                  {/* 0% No Cost EMI */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'EMI'
                        ? 'bg-accent-500/10 border-accent-500/60 shadow-glow-sm'
                        : 'bg-dark-800/60 border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="EMI"
                      checked={paymentMethod === 'EMI'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 text-accent-500 focus:ring-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
                        <Percent className="w-4 h-4 text-emerald-400" />
                        0% No-Cost EMI Financing
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Spread your purchase with ₹{(Math.round(grandTotal / emiTenure)).toLocaleString('en-IN')}/month over {emiTenure} months.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery (COD) Option & Animated Details Box */}
                  <div
                    className={`rounded-xl border transition-all overflow-hidden ${
                      paymentMethod === 'COD'
                        ? 'bg-gradient-to-b from-dark-900 via-dark-900 to-accent-950/20 border-accent-500/60 shadow-glow-sm'
                        : 'bg-dark-800/60 border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <label className="p-4 cursor-pointer flex items-start gap-3 w-full">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          setCodError('');
                        }}
                        className="mt-1 text-accent-500 focus:ring-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
                            <Banknote className="w-4 h-4 text-emerald-400" />
                            Cash on Delivery (Pay upon delivery)
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                            ZERO ADVANCE
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          Pay cash or scan courier UPI QR when your smartphone arrives at your doorstep.
                        </p>
                      </div>
                    </label>

                    {/* Animated Expandable COD Details Panel */}
                    <AnimatePresence>
                      {paymentMethod === 'COD' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 pb-4 pt-1 border-t border-dark-800/80 space-y-3.5"
                        >
                          {/* Cash Amount Highlight */}
                          <div className="p-3.5 rounded-xl bg-dark-950/80 border border-emerald-500/30 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                                ₹
                              </div>
                              <div>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                                  Cash to Keep Ready
                                </p>
                                <p className="text-sm font-extrabold text-white">
                                  Exact Amount: <span className="text-emerald-400 font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400">
                              Zero Extra Fee
                            </span>
                          </div>

                          {/* Doorstep Options */}
                          <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-400">
                            <div className="p-2 rounded-lg bg-dark-950 border border-dark-800">
                              <span className="block font-bold text-white mb-0.5">💵 Cash Notes</span>
                              <span>₹500 / ₹200 / ₹100</span>
                            </div>
                            <div className="p-2 rounded-lg bg-dark-950 border border-dark-800">
                              <span className="block font-bold text-white mb-0.5">📱 Courier QR</span>
                              <span>GPay / PhonePe</span>
                            </div>
                            <div className="p-2 rounded-lg bg-dark-950 border border-dark-800">
                              <span className="block font-bold text-white mb-0.5">📦 Open Box QA</span>
                              <span>Verify seal & IMEI</span>
                            </div>
                          </div>

                          {/* Interactive Human Anti-Bot Captcha */}
                          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-neutral-300">
                                Enter verification code to confirm COD order:
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-lg bg-dark-900 border border-accent-500/40 font-mono font-black text-sm tracking-widest text-accent-300 select-all">
                                  {codCaptcha}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCodCaptcha(Math.floor(1000 + Math.random() * 9000).toString())}
                                  className="text-[10px] text-accent-400 hover:underline"
                                >
                                  Refresh
                                </button>
                              </div>
                            </div>
                            <input
                              type="text"
                              maxLength={4}
                              value={userCodInput}
                              onChange={(e) => {
                                setUserCodInput(e.target.value);
                                if (codError) setCodError('');
                              }}
                              placeholder={`Type "${codCaptcha}" here to verify`}
                              className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-750 text-white text-xs font-mono tracking-widest text-center focus:outline-none focus:border-accent-500"
                            />
                            {codError && (
                              <p className="text-[11px] text-rose-400 font-semibold">{codError}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary Sticky Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 sticky top-24 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-dark-800 pb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-accent-400" />
                    Review Your Order ({totalCount})
                  </h2>
                  <Link to="/cart" className="text-xs text-accent-400 hover:underline">
                    Edit Cart
                  </Link>
                </div>

                {/* Items Mini-list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-dark-800/60">
                  {cartItems.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <div className="w-12 h-14 rounded-lg bg-dark-800 border border-dark-700/60 p-1 shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                        <p className="text-[11px] text-neutral-400">
                          Qty: {item.quantity} • {item.storage}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-white shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="pt-3 border-t border-dark-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount ({coupon?.code})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-neutral-300">
                    <span>GST (18% Included)</span>
                    <span className="font-semibold text-neutral-400">₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-300">
                    <span>Shipping & Handling</span>
                    <span>
                      {finalShipping === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        <span className="font-semibold text-white">₹{finalShipping}</span>
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-base font-extrabold text-white">
                    <span>Amount Payable</span>
                    <span className="text-accent-400 text-xl font-black">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm shadow-glow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : paymentMethod === 'UPI' ? (
                    <>
                      <span>Generate UPI QR & Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : paymentMethod === 'COD' ? (
                    <>
                      <span>Confirm Cash on Delivery Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Pay & Complete Purchase</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center space-y-1">
                  <p className="text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Official Brand Indian Warranty with GST Invoice
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    By placing your order, you agree to MS Mobiles Terms of Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>

      {/* Simulated UPI QR Modal */}
      <AnimatePresence>
        {showUpiModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpiModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl z-10 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-400 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">Scan to Pay via UPI</h3>
              <p className="text-xs text-neutral-400 mb-6">
                Payable Amount: <strong className="text-accent-400 text-sm">₹{grandTotal.toLocaleString('en-IN')}</strong>
              </p>

              {/* QR Code Container */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-md border-4 border-accent-500/30 flex items-center justify-center mb-5">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=msmobiles@icici%26pn=MSMobiles%26am=${grandTotal}%26cu=INR`}
                  alt="UPI Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* UPI Apps Badges */}
              <div className="flex items-center justify-center gap-2 mb-6 text-[10px] font-semibold text-neutral-300">
                <span className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-700">Google Pay</span>
                <span className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-700">PhonePe</span>
                <span className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-700">Paytm</span>
                <span className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-700">BHIM</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => executeOrderPlacement(`UPI-${Date.now().toString().slice(-6)}`)}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting ? 'Verifying...' : 'Simulate Payment Success (Confirm Order)'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpiModal(false)}
                  className="w-full py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel / Choose Other Method
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multi-Stage Order Placement Animation Overlay */}
      <OrderPlacementAnimation
        isOpen={showPlacementAnim}
        stage={animStage}
        order={createdOrderObj}
        paymentMethod={paymentMethod}
        totalAmount={grandTotal}
        onComplete={handleAnimComplete}
      />
    </div>
  );
};

export default Checkout;
