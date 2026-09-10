/**
 * Glassmorphic Form Section Card Component
 * Module: components/admin/FormSection.jsx
 * 
 * Modular container organizing form fields into visual groups with:
 * - Icon badge
 * - Section title
 * - Section descriptive subtitle
 * - Frosted glassmorphism background & subtle ambient illumination
 */

import React from 'react';
import { Card } from '../ui';

export const FormSection = ({
  icon,
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <Card
      glass={true}
      className={`p-6 sm:p-8 bg-dark-950/60 border border-dark-800/80 backdrop-blur-2xl shadow-card relative overflow-hidden ${className}`}
    >
      {/* Ambient Top Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      {(icon || title || subtitle) && (
        <div className="flex items-start gap-3.5 pb-6 mb-6 border-b border-dark-800/80">
          {icon && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-dark-800 to-dark-750 border border-dark-700/80 text-accent-400 flex items-center justify-center flex-shrink-0 shadow-card">
              {icon}
            </div>
          )}

          <div className="space-y-1">
            {title && (
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Section Content */}
      <div className="space-y-4">{children}</div>
    </Card>
  );
};

export default FormSection;
