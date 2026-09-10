/**
 * Luxury Decorative Divider
 * Module: components/auth/SocialDivider.jsx
 * 
 * Minimalist divider with subtle gradient lines and centered text label.
 */

import React from 'react';

const SocialDivider = ({ label = 'Fast & Secure Authentication' }) => {
  return (
    <div className="relative my-6 select-none">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-dark-800" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider font-mono">
        <span className="bg-dark-900 px-3 text-neutral-400">
          {label}
        </span>
      </div>
    </div>
  );
};

export default SocialDivider;
