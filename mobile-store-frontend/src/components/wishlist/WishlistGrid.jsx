/**
 * Wishlist Product Grid Component
 * Module: components/wishlist/WishlistGrid.jsx
 * 
 * Responsive 4-column (desktop) / 2-column (tablet) / 1-column (mobile) layout
 * showcasing saved flagship smartphones.
 */

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import WishlistCard from './WishlistCard';

const WishlistGrid = ({ items = [], onRemoveItem }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      <AnimatePresence>
        {items.map((item) => (
          <WishlistCard
            key={item.mobileId || item.id}
            item={item}
            onRemoveClick={onRemoveItem}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WishlistGrid;
