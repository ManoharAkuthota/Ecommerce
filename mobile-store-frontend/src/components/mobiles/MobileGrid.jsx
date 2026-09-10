/**
 * MobileGrid Component
 * Module: components/mobiles/MobileGrid.jsx
 * 
 * Responsive product showcase grid:
 * - Desktop: 4 columns (or 3 columns next to sidebar)
 * - Tablet: 2 columns
 * - Mobile: 1 column
 * - Staggered Framer Motion entrance
 */

import React from 'react';
import { motion } from 'framer-motion';
import MobileCard from './MobileCard';

export const MobileGrid = ({ mobiles = [], className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {mobiles.map((mobile) => (
        <motion.div key={mobile.id || mobile.name} variants={itemVariants}>
          <MobileCard mobile={mobile} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MobileGrid;
