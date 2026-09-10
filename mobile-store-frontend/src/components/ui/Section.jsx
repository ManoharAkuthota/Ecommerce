import React from 'react';
import Container from './Container';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';

/**
 * Standardized Section component enforcing vertical rhythm and optional section headers.
 */
const Section = ({
  badge,
  title,
  subtitle,
  centered = false,
  spacing = 'md',
  glow = false,
  containerSize = '7xl',
  className = '',
  children,
  ...props
}) => {
  const spacingMap = {
    none: 'py-0',
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16 md:py-20',
    lg: 'py-16 sm:py-24 md:py-32',
  };

  const selectedSpacing = spacingMap[spacing] || spacingMap.md;

  const hasHeader = Boolean(badge || title || subtitle);

  return (
    <section className={`relative w-full ${selectedSpacing} ${className}`} {...props}>
      {/* Optional ambient background glow */}
      {glow && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-accent-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      )}

      <Container size={containerSize}>
        {hasHeader && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className={`mb-10 sm:mb-14 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'}`}
          >
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-500/10 border border-accent-500/20 text-accent-300 mb-4">
                {badge}
              </div>
            )}
            {title && (
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </Container>
    </section>
  );
};

export default Section;
