import React from 'react';

/**
 * Premium SVG loading spinner component with scalable dimensions.
 */
const Spinner = ({
  size = 'md',
  color = 'accent',
  className = '',
  label = 'Loading...',
}) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorMap = {
    accent: 'text-accent-500',
    white: 'text-white',
    muted: 'text-neutral-400',
  };

  const selectedSize = sizeMap[size] || sizeMap.md;
  const selectedColor = colorMap[color] || colorMap.accent;

  return (
    <div role="status" className={`inline-flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${selectedSize} ${selectedColor}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className="opacity-85"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
