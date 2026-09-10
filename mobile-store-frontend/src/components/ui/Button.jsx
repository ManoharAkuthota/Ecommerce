import React from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';

/**
 * Premium interactive Button component with tactile Framer Motion feedback.
 */
const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

  const variantMap = {
    primary: 'bg-accent-600 hover:bg-accent-500 text-white shadow-glow-sm hover:shadow-glow-md focus:ring-accent-500 border border-accent-400/20',
    secondary: 'bg-dark-850 hover:bg-dark-800 text-neutral-200 hover:text-white border border-dark-800 hover:border-dark-700 focus:ring-neutral-500',
    outline: 'bg-transparent hover:bg-dark-850 text-neutral-300 hover:text-white border border-dark-700 hover:border-neutral-500 focus:ring-neutral-400',
    ghost: 'bg-transparent hover:bg-dark-800/60 text-neutral-300 hover:text-white border border-transparent focus:ring-neutral-500',
    glass: 'bg-dark-900/60 hover:bg-dark-900/90 backdrop-blur-xl border border-dark-700/80 text-white shadow-card hover:shadow-card-hover focus:ring-accent-400',
    danger: 'bg-rose-600/90 hover:bg-rose-600 text-white shadow-sm hover:shadow-rose-600/30 focus:ring-rose-500 border border-rose-500/20',
  };

  const sizeMap = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  const selectedVariant = variantMap[variant] || variantMap.primary;
  const selectedSize = sizeMap[size] || sizeMap.md;
  const widthStyle = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`${baseStyles} ${selectedVariant} ${selectedSize} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={size === 'lg' ? 'md' : 'sm'} color="white" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
