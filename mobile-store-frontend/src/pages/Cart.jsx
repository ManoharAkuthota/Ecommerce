/**
 * Dedicated Shopping Cart Page
 * Module: pages/Cart.jsx
 * 
 * Full storefront shopping cart view:
 * - Comprehensive itemized table with specifications
 * - Quantity adjusters and instant subtotals
 * - Promotional coupon validator (WELCOME500, MSFESTIVE, FLAGSHIP1000)
 * - Free shipping progress tracker
 * - Direct navigation to multi-step checkout
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import Container from '../components/ui/Container';

const Cart = () => {
  const {
    cartItems,
    totalCount,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    totalAmount,
    freeShippingRemaining,
    freeShippingProgress,
    coupon,
    isApplyingCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyCoupon(couponInput.trim());
    if (ok) setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 bg-dark-950 min-h-[70vh] flex items-center">
        <Container size="4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-dark-900 border border-dark-800 rounded-3xl p-10 sm:p-16 shadow-xl max-w-xl mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-accent-500/10 border border-accent-500/20 text-accent-400 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your Shopping Cart is Empty</h1>
            <p className="text-neutral-400 text-sm mb-8">
              You haven't added any flagship smartphones to your cart yet. Explore the showroom catalog to find the latest devices with brand warranty.
            </p>
            <Link
              to="/mobiles"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm shadow-glow-sm transition-all"
            >
              Browse Smartphone Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-dark-950 min-h-screen text-neutral-100">
      <Container size="7xl">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-accent-400">Shopping Cart</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              Your Shopping Cart
              <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-accent-500/20 text-accent-300 font-semibold border border-accent-500/30">
                {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-neutral-400 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-dark-800 hover:bg-dark-900 transition-colors"
            >
              Clear Cart
            </button>
            <Link
              to="/mobiles"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg bg-dark-900 border border-dark-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-dark-900 border border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-neutral-200 font-medium">
                {freeShippingRemaining === 0 ? (
                  <span className="text-emerald-400 font-bold">
                    Congratulations! Your order qualifies for FREE Express Doorstep Delivery.
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-accent-400">₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more to unlock FREE Express Delivery!
                  </span>
                )}
              </p>
              <p className="text-[11px] text-neutral-400">
                Guaranteed dispatch within 24 hours with transit insurance.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48 shrink-0">
            <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  freeShippingRemaining === 0 ? 'bg-emerald-500' : 'bg-gradient-to-r from-accent-500 to-cyan-400'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Grid Layout: Cart Items Table + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Items List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-dark-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                <span className="col-span-6">Smartphone Device</span>
                <span className="col-span-2 text-center">Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
              </div>

              <div className="divide-y divide-dark-800/80 p-4 sm:p-0">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="sm:grid sm:grid-cols-12 gap-4 sm:px-6 sm:py-5 flex flex-col sm:items-center group"
                  >
                    {/* Device Thumbnail & Spec */}
                    <div className="sm:col-span-6 flex items-center gap-4">
                      <div className="w-16 h-18 sm:w-20 sm:h-22 rounded-xl bg-dark-850 border border-dark-700/60 p-1.5 shrink-0 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-400">
                          {item.brand}
                        </span>
                        <h3 className="text-sm font-bold text-white truncate max-w-[240px]">
                          <Link to={`/mobiles/${item.id}`} className="hover:text-accent-400 transition-colors">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {item.ram} RAM • {item.storage} Storage
                        </p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          1-Year Brand Warranty Included
                        </span>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 text-left sm:text-center text-xs sm:text-sm font-medium text-neutral-300">
                      <span className="sm:hidden text-neutral-500 mr-2">Unit Price:</span>
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>

                    {/* Quantity Modifier */}
                    <div className="sm:col-span-2 flex items-center sm:justify-center gap-2">
                      <div className="flex items-center gap-1 bg-dark-800 border border-dark-700/60 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded flex items-center justify-center text-neutral-300 hover:text-white hover:bg-dark-700 disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded flex items-center justify-center text-neutral-300 hover:text-white hover:bg-dark-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-dark-800 transition-colors ml-1"
                        title="Remove device"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="sm:col-span-2 text-left sm:text-right font-bold text-white text-sm sm:text-base">
                      <span className="sm:hidden text-neutral-500 mr-2">Total:</span>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Guarantees Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-accent-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">100% Genuine Devices</h4>
                  <p className="text-[11px] text-neutral-400">Direct from authorized brands</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">7-Day Replacement</h4>
                  <p className="text-[11px] text-neutral-400">Hassle-free defective exchange</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Safe & Secure Payments</h4>
                  <p className="text-[11px] text-neutral-400">Encrypted UPI & Card checkouts</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Card (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 sticky top-24 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-dark-800 pb-3">
                Order Summary
              </h2>

              {/* Promo Coupon Box */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Have a Promo / Gift Coupon?
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-accent-500/10 border border-accent-500/30 text-accent-300">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-accent-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase">{coupon.code}</p>
                        <p className="text-[10px] text-accent-400">{coupon.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-400 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try: WELCOME500"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-accent-500 uppercase"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold disabled:opacity-50 transition-colors shrink-0"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                <p className="text-[10px] text-neutral-500 mt-1.5">
                  Available coupons: <strong className="text-neutral-400">WELCOME500</strong> (₹500 off) • <strong className="text-neutral-400">MSFESTIVE</strong> (₹2,000 off &gt; ₹50k)
                </p>
              </div>

              {/* Financial Calculation Lines */}
              <div className="space-y-2.5 pt-4 border-t border-dark-800 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Cart Items Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span>Promotional Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-300">
                  <span>Estimated GST (18% Included)</span>
                  <span className="font-semibold text-neutral-400">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <span>Express Doorstep Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      <span className="font-semibold text-white">₹{shippingFee}</span>
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-base font-extrabold text-white">
                  <span>Grand Total</span>
                  <span className="text-accent-400 text-xl font-black">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-6 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm shadow-glow-sm flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Bank-grade 256-bit SSL encrypted checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Cart;
