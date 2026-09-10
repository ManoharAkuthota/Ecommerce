/**
 * Shopping Cart Context
 * Module: context/CartContext.jsx
 * 
 * Provides centralized, reactive shopping cart state management across MS Mobiles:
 * - Persistent storage memory in localStorage (ms_cart_items_v1)
 * - Dynamic subtotal, GST (18%), free shipping calculation (free over ₹5,000)
 * - Coupon validation & discount application (WELCOME500, MSFESTIVE, FLAGSHIP1000)
 * - Slide-over CartDrawer visibility controls
 * - Optimistic item additions with toast feedback
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';
import orderService from '../services/orderService';

export const CartContext = createContext(null);

const STORAGE_KEY = 'ms_cart_items_v1';
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING_FEE = 199;
const GST_RATE = 0.18;

export const CartProvider = ({ children }) => {
  const toast = useToast();

  // Load initial cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Slide-over Drawer visibility state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Active discount coupon
  const [coupon, setCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Persist cartItems changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn('[CartContext] Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  // Derived financial metrics
  const totalCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + (price * qty);
    }, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!coupon || !coupon.discountAmount) return 0;
    return Math.min(subtotal, Number(coupon.discountAmount));
  }, [coupon, subtotal]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [subtotal]);

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  }, [subtotal]);

  const freeShippingProgress = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [subtotal]);

  const taxAmount = useMemo(() => {
    return Math.round(subtotal * GST_RATE * 100) / 100;
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  /**
   * Add a smartphone flagship to cart
   */
  const addToCart = useCallback(
    (mobile, quantity = 1, showFeedback = true, openDrawerOnAdd = false) => {
      if (!mobile) return;

      const mobileId = mobile.id || mobile.mobileId;
      if (!mobileId) return;

      const strId = String(mobileId);
      const firstImage =
        mobile.firstImage ||
        mobile.imageUrls?.[0] ||
        mobile.images?.[0]?.imageUrl ||
        mobile.image ||
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80';

      const priceNum = Number(mobile.price) || 0;
      const qtyNum = Math.max(1, Number(quantity) || 1);

      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => String(item.mobileId || item.id) === strId);

        if (existingIndex > -1) {
          const updated = [...prev];
          const currentQty = Number(updated[existingIndex].quantity) || 1;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: currentQty + qtyNum,
          };
          return updated;
        }

        const newItem = {
          id: strId,
          mobileId: strId,
          name: mobile.name || 'Flagship Smartphone',
          brand: mobile.brand || 'Flagship',
          price: priceNum,
          image: firstImage,
          ram: mobile.ram || '8GB',
          storage: mobile.storage || '128GB',
          stockStatus: mobile.stockStatus || 'IN_STOCK',
          quantity: qtyNum,
        };

        return [newItem, ...prev];
      });

      if (showFeedback) {
        toast.success(`Added ${qtyNum}x "${mobile.name || 'Phone'}" to your cart.`);
      }

      if (openDrawerOnAdd) {
        setIsDrawerOpen(true);
      }
    },
    [toast]
  );

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback((mobileId) => {
    if (!mobileId) return;
    const strId = String(mobileId);
    setCartItems((prev) => prev.filter((item) => String(item.mobileId || item.id) !== strId));
  }, []);

  /**
   * Update quantity of an item
   */
  const updateQuantity = useCallback((mobileId, newQty) => {
    if (!mobileId) return;
    const strId = String(mobileId);
    const qty = Number(newQty);

    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => String(item.mobileId || item.id) !== strId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          String(item.mobileId || item.id) === strId ? { ...item, quantity: qty } : item
        )
      );
    }
  }, []);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCoupon(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  /**
   * Validate and apply promotional coupon
   */
  const applyCoupon = useCallback(
    async (code) => {
      if (!code || !code.trim()) return;
      setIsApplyingCoupon(true);

      try {
        const response = await orderService.validateCoupon(code.trim(), subtotal);
        if (response.valid) {
          setCoupon({
            code: response.code,
            description: response.description,
            discountAmount: response.discountAmount,
          });
          toast.success(response.message || `Coupon "${response.code}" applied successfully!`);
          return true;
        } else {
          toast.error(response.message || 'Invalid coupon code.');
          return false;
        }
      } catch (err) {
        const msg = err?.response?.data?.message || 'Could not validate coupon code.';
        toast.error(msg);
        return false;
      } finally {
        setIsApplyingCoupon(false);
      }
    },
    [subtotal, toast]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    toast.info('Discount coupon removed.');
  }, [toast]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const value = {
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
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
