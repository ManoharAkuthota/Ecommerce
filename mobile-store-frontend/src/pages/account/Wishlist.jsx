/**
 * Customer Wishlist Page
 * Module: pages/account/Wishlist.jsx
 * Route: /account/wishlist
 * 
 * Luxury flagship collection view featuring:
 * - Real-time saved device count
 * - 4-column responsive grid
 * - Interactive removal with confirmation modal
 * - Dynamic empty state with one-click catalog navigation
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import WishlistGrid from '../../components/wishlist/WishlistGrid';
import WishlistEmptyState from '../../components/wishlist/WishlistEmptyState';
import RemoveConfirmModal from '../../components/wishlist/RemoveConfirmModal';
import SEO from '../../components/common/SEO';

const Wishlist = () => {
  const { wishlist, count, isLoading, removeFromWishlist } = useWishlist();

  const [itemToRemove, setItemToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleOpenRemoveModal = (item) => {
    setItemToRemove(item);
  };

  const handleConfirmRemove = async () => {
    if (!itemToRemove) return;

    setIsRemoving(true);
    const targetId = itemToRemove.mobileId || itemToRemove.id;
    try {
      await removeFromWishlist(targetId);
      setItemToRemove(null);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <SEO
        title="My Wishlist — MS Mobiles"
        description="View and manage your saved flagship smartphones and monitored price drops."
        canonicalUrl="http://localhost:5173/account/wishlist"
      />

      <div className="space-y-8 pb-16">
        {/* 1. Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
              <span>Saved Flagships</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Wishlist
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Your favorite smartphones in one place. Monitored for restocks and price drops.
            </p>
          </div>

          {/* Count Badge */}
          {count > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-900/90 border border-dark-750 text-xs font-bold text-white shadow-sm self-start sm:self-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{count} {count === 1 ? 'Device Saved' : 'Devices Saved'}</span>
            </div>
          )}
        </motion.div>

        {/* 2. Content: Loading Skeleton, Empty State, or Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-dark-900/70 border border-dark-800 p-5 space-y-4"
              >
                <div className="h-4 bg-dark-850 rounded-lg w-20" />
                <div className="h-44 bg-dark-950/80 rounded-2xl" />
                <div className="h-5 bg-dark-850 rounded-lg w-3/4" />
                <div className="h-6 bg-dark-850 rounded-lg w-1/3" />
                <div className="h-10 bg-dark-850 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <WishlistEmptyState />
        ) : (
          <WishlistGrid
            items={wishlist}
            onRemoveItem={handleOpenRemoveModal}
          />
        )}
      </div>

      {/* 3. Remove Confirmation Modal */}
      <RemoveConfirmModal
        isOpen={Boolean(itemToRemove)}
        itemName={itemToRemove?.name || 'this smartphone'}
        onConfirm={handleConfirmRemove}
        onCancel={() => setItemToRemove(null)}
        isRemoving={isRemoving}
      />
    </>
  );
};

export default Wishlist;
