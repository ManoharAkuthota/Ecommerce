/**
 * Customer Wishlist Context
 * Module: context/WishlistContext.jsx
 * 
 * Provides centralized, reactive wishlist state management across the storefront:
 * - Real-time optimistic bookmarking and unbookmarking
 * - O(1) set-based lookup for heart icon states
 * - Automatic synchronization on customer sign-in/sign-out
 * - Graceful error rollback with toast alerts
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useUserAuth } from '../hooks/useUserAuth';
import { useToast } from './ToastContext';
import wishlistService from '../services/wishlistService';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useUserAuth();
  const toast = useToast();

  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Derive Set of saved mobile IDs for O(1) instantaneous lookup
  const wishlistIds = useMemo(() => {
    return new Set(wishlist.map((item) => String(item.mobileId || item.id)));
  }, [wishlist]);

  const count = wishlist.length;

  /**
   * Fetch fresh wishlist items from backend
   */
  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.warn('[WishlistContext] Failed to load customer wishlist:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Re-sync on authentication status change
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, loadWishlist]);

  /**
   * Fast check if a mobile device is in customer's wishlist
   */
  const isWishlisted = useCallback(
    (mobileId) => {
      if (!mobileId) return false;
      return wishlistIds.has(String(mobileId));
    },
    [wishlistIds]
  );

  /**
   * Optimistically add a mobile to the customer's wishlist
   */
  const addToWishlist = useCallback(
    async (mobileId, mobileData = {}) => {
      if (!mobileId) return;

      const strId = String(mobileId);
      if (wishlistIds.has(strId)) return; // Already present

      // Prepare optimistic draft item
      const optimisticItem = {
        mobileId,
        id: mobileId,
        name: mobileData.name || 'Flagship Smartphone',
        brand: mobileData.brand || 'Flagship',
        price: mobileData.price || 0,
        formattedPrice: mobileData.formattedPrice || (mobileData.price ? `$${mobileData.price}` : '$0'),
        firstImage:
          mobileData.firstImage ||
          mobileData.imageUrls?.[0] ||
          mobileData.images?.[0]?.imageUrl ||
          mobileData.image ||
          null,
        ram: mobileData.ram || '8GB',
        storage: mobileData.storage || '128GB',
        stock: mobileData.stockStatus || mobileData.stock || 'IN_STOCK',
        addedDate: new Date().toISOString(),
      };

      const previousWishlist = [...wishlist];

      // Optimistic update
      setWishlist((prev) => [optimisticItem, ...prev]);

      try {
        const response = await wishlistService.addToWishlist(mobileId);
        if (response?.items) {
          setWishlist(response.items);
        }
        toast.success(`Saved "${optimisticItem.name}" to your wishlist.`);
      } catch (err) {
        // Rollback on network failure
        setWishlist(previousWishlist);
        const errorMsg =
          err?.response?.data?.message || err?.message || 'Could not save mobile to wishlist.';
        toast.error(errorMsg);
      }
    },
    [wishlist, wishlistIds, toast]
  );

  /**
   * Optimistically remove a mobile from the customer's wishlist
   */
  const removeFromWishlist = useCallback(
    async (mobileId) => {
      if (!mobileId) return;

      const strId = String(mobileId);
      const previousWishlist = [...wishlist];
      const targetItem = wishlist.find((i) => String(i.mobileId || i.id) === strId);

      // Optimistic update
      setWishlist((prev) => prev.filter((i) => String(i.mobileId || i.id) !== strId));

      try {
        const response = await wishlistService.removeFromWishlist(mobileId);
        if (response?.items) {
          setWishlist(response.items);
        }
        if (targetItem?.name) {
          toast.info(`Removed "${targetItem.name}" from your wishlist.`);
        }
      } catch (err) {
        // Rollback on network failure
        setWishlist(previousWishlist);
        const errorMsg =
          err?.response?.data?.message || err?.message || 'Could not remove mobile from wishlist.';
        toast.error(errorMsg);
      }
    },
    [wishlist, toast]
  );

  /**
   * Convenience toggle helper for heart buttons
   */
  const toggleWishlist = useCallback(
    async (mobileIdOrObj, mobileData = {}) => {
      const mobileId = typeof mobileIdOrObj === 'object' ? (mobileIdOrObj?.id || mobileIdOrObj?.mobileId) : mobileIdOrObj;
      const data = typeof mobileIdOrObj === 'object' ? mobileIdOrObj : mobileData;
      if (!mobileId) return;

      if (isWishlisted(mobileId)) {
        await removeFromWishlist(mobileId);
      } else {
        await addToWishlist(mobileId, data);
      }
    },
    [isWishlisted, addToWishlist, removeFromWishlist]
  );

  const contextValue = {
    wishlist,
    wishlistIds,
    count,
    isLoading,
    isWishlisted,
    isInWishlist: isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist: loadWishlist,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
