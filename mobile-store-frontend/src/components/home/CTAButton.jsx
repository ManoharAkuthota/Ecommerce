/**
 * Premium CTA Button Component
 * Module: components/home/CTAButton.jsx
 * 
 * Reusable luxury button supporting React Router navigation (to)
 * or standard button actions (onClick) with hover glow and spring motion.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-accent-500 via-indigo-500 to-accent-600 hover:from-accent-400 hover:via-indigo-400 hover:to-accent-500 text-white shadow-[0_0_24px_rgba(99,102,241,0.45)] hover:shadow-[0_0_32px_rgba(99,102,241,0.65)] border border-accent-400/30',
  secondary:
    'bg-dark-900/90 hover:bg-dark-850 text-white border border-dark-700/80 hover:border-dark-600 shadow-card hover:shadow-glow-sm backdrop-blur-xl',
  outline:
    'bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white border border-dark-700 hover:border-dark-500',
  ghost:
    'bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white',
};

const SIZES = {
  sm: 'px-4 py-2 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-xs sm:text-sm rounded-2xl gap-2',
  lg: 'px-6 py-3.5 text-sm sm:text-base rounded-2xl gap-2.5 font-bold',
};

export const CTAButton = ({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  iconPosition,
  className = '',
  disabled = false,
  ...rest
}) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyles = SIZES[size] || SIZES.md;
  const combinedClass = `inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 outline-none select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={combinedClass} {...rest}>
        {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={combinedClass}
      {...rest}
    >
      {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
};

export default CTAButton;
