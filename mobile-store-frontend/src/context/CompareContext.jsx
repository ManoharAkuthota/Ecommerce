/**
 * Customer Compare Context
 * Module: context/CompareContext.jsx
 * 
 * Global state management for customer side-by-side smartphone comparisons:
 * - Real-time synchronization with Spring Boot /api/user/compare endpoints
 * - Optimistic addition, removal, and clearing for zero perceived latency
 * - Strict client-side and server-side enforcement of 4 mobiles maximum limit
 * - O(1) Set-based membership lookups via isCompared(mobileId)
 * - Automatic session synchronization on customer login/logout
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useUserAuth } from '../hooks/useUserAuth';
import { useToast } from './ToastContext';
import compareService from '../services/compareService';

export const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const { isAuthenticated } = useUserAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [maxLimit, setMaxLimit] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  // Derive O(1) Set of compared mobile IDs
  const compareIds = useMemo(() => {
    return new Set(items.map((item) => String(item.mobileId || item.id)));
  }, [items]);

  /**
   * Synchronize comparison list from backend.
   */
  const refreshCompare = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const data = await compareService.getComparison();
      setItems(data?.items || []);
      setCount(data?.count ?? (data?.items?.length || 0));
      if (data?.maxLimit) setMaxLimit(data.maxLimit);
    } catch (err) {
      console.error('[CompareContext] Failed to retrieve comparison list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load comparison whenever customer authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshCompare();
    } else {
      setItems([]);
      setCount(0);
    }
  }, [isAuthenticated, refreshCompare]);

  /**
   * Fast O(1) check if a smartphone is in comparison list.
   */
  const isCompared = useCallback(
    (mobileId) => {
      if (!mobileId) return false;
      return compareIds.has(String(mobileId));
    },
    [compareIds]
  );

  /**
   * Add a smartphone to comparison list with optimistic updates.
   */
  const addToCompare = useCallback(
    async (mobileId, mobileData = {}) => {
      if (!isAuthenticated) {
        showToast('Please sign in to compare smartphones', 'info');
        return false;
      }

      if (!mobileId) return false;
      const idStr = String(mobileId);

      // Check if already compared
      if (compareIds.has(idStr)) {
        showToast('Device is already in your comparison list', 'info');
        return true;
      }

      // Check 4-mobile limit
      if (items.length >= maxLimit) {
        showToast(`Maximum of ${maxLimit} mobiles can be compared`, 'warning');
        return false;
      }

      // Save previous state for rollback
      const previousItems = [...items];
      const previousCount = count;

      // Extract image & formatted price safely
      const firstImage =
        mobileData.firstImage ||
        mobileData.imageUrls?.[0] ||
        mobileData.images?.[0]?.imageUrl ||
        mobileData.image ||
        null;

      const formattedPrice =
        mobileData.formattedPrice ||
        (mobileData.price != null
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(mobileData.price)
          : '$0.00');

      // Create optimistic item
      const optimisticItem = {
        mobileId: idStr,
        id: idStr,
        name: mobileData.name || 'Flagship Smartphone',
        brand: mobileData.brand || 'MS Mobiles',
        price: mobileData.price || 0,
        formattedPrice,
        firstImage,
        images: mobileData.images || (firstImage ? [firstImage] : []),
        ram: mobileData.ram || '8GB',
        storage: mobileData.storage || '128GB',
        processor: mobileData.processor || 'Octa-Core',
        display: mobileData.display || 'AMOLED 120Hz',
        battery: mobileData.battery || '5000 mAh',
        stock: mobileData.stockStatus || mobileData.stock || 'IN_STOCK',
        stockStatus: mobileData.stockStatus || mobileData.stock || 'IN_STOCK',
        addedDate: new Date().toISOString(),
      };

      // Optimistic update
      setItems((prev) => [...prev, optimisticItem]);
      setCount((prev) => prev + 1);

      try {
        const response = await compareService.addToCompare(idStr);
        if (response?.items) {
          setItems(response.items);
          setCount(response.count ?? response.items.length);
        }
        showToast('Added to comparison', 'success');
        return true;
      } catch (err) {
        // Rollback
        setItems(previousItems);
        setCount(previousCount);
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to add to comparison';
        showToast(errMsg, 'error');
        return false;
      }
    },
    [isAuthenticated, compareIds, items, count, maxLimit, showToast]
  );

  /**
   * Remove a single smartphone from comparison list with optimistic updates.
   */
  const removeFromCompare = useCallback(
    async (mobileId) => {
      if (!isAuthenticated) return false;
      if (!mobileId) return false;

      const idStr = String(mobileId);
      const previousItems = [...items];
      const previousCount = count;

      // Optimistic removal
      setItems((prev) => prev.filter((item) => String(item.mobileId || item.id) !== idStr));
      setCount((prev) => Math.max(0, prev - 1));

      try {
        const response = await compareService.removeFromCompare(idStr);
        if (response?.items) {
          setItems(response.items);
          setCount(response.count ?? response.items.length);
        }
        showToast('Removed from comparison', 'success');
        return true;
      } catch (err) {
        // Rollback
        setItems(previousItems);
        setCount(previousCount);
        showToast('Failed to remove from comparison', 'error');
        return false;
      }
    },
    [isAuthenticated, items, count, showToast]
  );

  /**
   * Clear all smartphones from comparison list with optimistic updates.
   */
  const clearCompare = useCallback(async () => {
    if (!isAuthenticated) return false;

    const previousItems = [...items];
    const previousCount = count;

    // Optimistic clear
    setItems([]);
    setCount(0);

    try {
      await compareService.clearComparison();
      showToast('Comparison list cleared', 'success');
      return true;
    } catch (err) {
      // Rollback
      setItems(previousItems);
      setCount(previousCount);
      showToast('Failed to clear comparison', 'error');
      return false;
    }
  }, [isAuthenticated, items, count, showToast]);

  /**
   * Toggle comparison for a mobile.
   */
  const toggleCompare = useCallback(
    async (mobileId, mobileData = {}) => {
      if (isCompared(mobileId)) {
        return removeFromCompare(mobileId);
      } else {
        return addToCompare(mobileId, mobileData);
      }
    },
    [isCompared, removeFromCompare, addToCompare]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      maxLimit,
      isLoading,
      isCompared,
      addToCompare,
      removeFromCompare,
      clearCompare,
      toggleCompare,
      refreshCompare,
    }),
    [
      items,
      count,
      maxLimit,
      isLoading,
      isCompared,
      addToCompare,
      removeFromCompare,
      clearCompare,
      toggleCompare,
      refreshCompare,
    ]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

export default CompareContext;
