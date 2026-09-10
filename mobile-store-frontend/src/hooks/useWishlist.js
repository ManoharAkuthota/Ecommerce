/**
 * Custom Hook: useWishlist
 * Module: hooks/useWishlist.js
 * 
 * Provides easy, type-safe access to the global WishlistContext.
 */

import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a <WishlistProvider>');
  }
  return context;
};

export default useWishlist;
