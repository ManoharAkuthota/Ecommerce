import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * NavLinkItem Component
 * Handles individual desktop navigation links with hover lift and animated underline.
 */
const NavLinkItem = ({
  to,
  label,
  isActive = false,
  isScrolled = false,
  onClick,
}) => {
  // Dynamic text color matching luxury obsidian dark theme
  const textColorClass = isActive
    ? 'text-white font-bold'
    : 'text-neutral-300 hover:text-white font-medium';

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="relative flex items-center"
    >
      <Link
        to={to}
        onClick={onClick}
        className={`relative px-4 py-2 text-sm tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg select-none ${textColorClass}`}
      >
        <span>{label}</span>

        {/* Subtle Animated Active Underline */}
        {isActive && (
          <motion.div
            layoutId="navbar-active-underline"
            className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent-500 rounded-full"
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 32,
            }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default NavLinkItem;
