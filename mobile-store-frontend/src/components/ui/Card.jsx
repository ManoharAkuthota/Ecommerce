import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium modular Card component with glassmorphism and subtle hover interaction.
 */
const Card = React.forwardRef(({
  children,
  hoverable = false,
  glass = true,
  glowing = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'relative rounded-2xl border transition-all duration-300 overflow-hidden';
  const glassStyle = glass
    ? 'bg-dark-900/50 backdrop-blur-xl border-dark-800/80 shadow-card'
    : 'bg-dark-900 border-dark-800';

  const hoverStyle = hoverable
    ? 'hover:border-dark-700/90 hover:shadow-card-hover cursor-pointer'
    : '';

  const glowStyle = glowing
    ? 'border-accent-500/30 shadow-glow-sm hover:border-accent-500/50'
    : '';

  const Component = hoverable ? motion.div : 'div';

  const motionProps = hoverable
    ? {
        whileHover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
      }
    : {};

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={`${baseStyles} ${glassStyle} ${hoverStyle} ${glowStyle} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`p-6 pb-3 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`text-lg sm:text-xl font-bold tracking-tight text-white ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className = '', children, ...props }) => (
  <p className={`mt-1.5 text-xs sm:text-sm text-neutral-400 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

const CardBody = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-3 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-3 border-t border-dark-800/60 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
