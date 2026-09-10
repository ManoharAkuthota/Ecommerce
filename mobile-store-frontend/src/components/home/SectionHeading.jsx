/**
 * Section Heading Component
 * Module: components/home/SectionHeading.jsx
 * 
 * Reusable luxury section header featuring:
 * - Pill badge with icon or accent dot
 * - Gradient typography title
 * - Descriptive subtitle
 * - Alignment controls (center / left)
 * - Staggered Framer Motion entrance
 */

import React from 'react';
import { motion } from 'framer-motion';

export const SectionHeading = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const renderBadgeIcon = () => {
    if (!badgeIcon) {
      return (
        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
      );
    }
    if (React.isValidElement(badgeIcon)) {
      return <span className="flex-shrink-0">{badgeIcon}</span>;
    }
    if (typeof badgeIcon === 'function' || typeof badgeIcon === 'object') {
      const IconComp = badgeIcon;
      return <IconComp className="w-3.5 h-3.5 flex-shrink-0 text-accent-400" />;
    }
    return <span className="flex-shrink-0">{badgeIcon}</span>;
  };

  const isCentered = align === 'center';

  return (
    <div
      className={`space-y-3.5 ${
        isCentered ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-2xl'
      } ${className}`}
    >
      {/* Optional Pill Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-bold uppercase tracking-wider font-mono shadow-glow-sm ${
            isCentered ? 'mx-auto' : ''
          }`}
        >
          {renderBadgeIcon()}
          <span>{badge}</span>
        </motion.div>
      )}

      {/* Main Title */}
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]"
        >
          {title}
        </motion.h2>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="text-xs sm:text-sm lg:text-base text-neutral-400 leading-relaxed font-sans"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
