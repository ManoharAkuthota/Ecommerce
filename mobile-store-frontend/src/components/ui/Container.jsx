import React from 'react';

/**
 * Standardized responsive layout container.
 * Enforces unified margins, gutter padding, and max-widths across screen sizes.
 */
const Container = ({
  children,
  size = '7xl',
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const sizeMap = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const selectedSize = sizeMap[size] || sizeMap['7xl'];

  return (
    <Component
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${selectedSize} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
