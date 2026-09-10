/**
 * Luxury Slide-Over Cart Drawer
 * Module: components/cart/CartDrawer.jsx
 * 
 * High-conversion slide-over cart drawer with:
 * - Animated entrance/exit via Framer Motion
 * - Free shipping progress indicator (Threshold: ₹5,000)
 * - + / - quantity incrementors and removal with feedback
 * - Clear subtotal & delivery preview
 * - Direct Checkout action with customer auth awareness
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useUserAuth } from '../../hooks/useUserAuth';

const CartDrawer = () => {
  const {
    cartItems,
    totalCount,
    subtotal,
    shippingFee,
    freeShippingRemaining,
    freeShippingProgress,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const { isAuthenticated } = useUserAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-dark-900 border-l border-dark-800 shadow-2xl flex flex-col text-neutral-100"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-dark-800 flex items-center justify-between bg-dark-900/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Shopping Bag
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-300 font-semibold">
                        {totalCount} {totalCount === 1 ? 'device' : 'devices'}
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400">MS Mobiles Flagship Store</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              {cartItems.length > 0 && (
                <div className="px-5 py-3 bg-dark-850 border-b border-dark-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                      <Truck className="w-3.5 h-3.5 text-accent-400" />
                      {freeShippingRemaining === 0 ? (
                        <span className="text-emerald-400 font-semibold">
                          🎉 You unlocked FREE Express Shipping!
                        </span>
                      ) : (
                        <span>
                          Add <strong className="text-white">₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more for FREE shipping
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-bold text-accent-400">
                      {freeShippingProgress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShippingProgress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        freeShippingRemaining === 0 ? 'bg-emerald-500' : 'bg-gradient-to-r from-accent-500 to-cyan-400'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Drawer Items Stream */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-dark-800/60">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-dark-800/80 border border-dark-700/60 flex items-center justify-center text-neutral-500 mb-4">
                      <Smartphone className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">Your cart is empty</h3>
                    <p className="text-xs text-neutral-400 max-w-xs mb-6">
                      Explore our catalog of latest flagship smartphones with brand warranty.
                    </p>
                    <Link
                      to="/mobiles"
                      onClick={closeDrawer}
                      className="px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-medium text-xs shadow-glow-sm transition-all inline-flex items-center gap-2"
                    >
                      Browse Smartphones
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 group">
                      {/* Product Thumbnail */}
                      <div className="w-18 h-20 sm:w-20 sm:h-22 rounded-xl bg-dark-800 border border-dark-700/60 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Details & Quantities */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-400">
                                {item.brand}
                              </span>
                              <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[190px]">
                                {item.name}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 rounded-lg hover:bg-dark-800 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {item.ram} RAM • {item.storage} Storage
                          </p>
                        </div>

                        {/* Price & Adjuster */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dark-800/40">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center gap-1.5 bg-dark-800 border border-dark-700/60 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 rounded flex items-center justify-center text-neutral-300 hover:text-white hover:bg-dark-700 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-neutral-300 hover:text-white hover:bg-dark-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Checkout Button */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-dark-800 bg-dark-900/95 backdrop-blur-md space-y-3">
                  {/* Financial Overview */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="text-white font-medium">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Estimated Shipping</span>
                      <span className="text-white font-medium">
                        {shippingFee === 0 ? (
                          <span className="text-emerald-400 font-semibold">FREE</span>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-dark-800 text-white font-bold">
                      <span>Total Estimated</span>
                      <span className="text-accent-400 text-base">
                        ₹{(subtotal + shippingFee).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleViewCartClick}
                      className="w-full py-2.5 px-3 rounded-xl border border-dark-700 hover:bg-dark-800 text-neutral-200 text-xs font-semibold transition-all text-center"
                    >
                      View Cart
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckoutClick}
                      className="w-full py-2.5 px-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all shadow-glow-sm flex items-center justify-center gap-1.5"
                    >
                      Checkout
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Assurance footnote */}
                  <div className="flex items-center justify-center gap-3 pt-2 text-[10px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Genuine Indian Warranty
                    </span>
                    <span>•</span>
                    <span>7-Day Replacement</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
