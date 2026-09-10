/**
 * Dashboard Statistic Card Component
 * Module: components/account/DashboardStatCard.jsx
 * 
 * Reusable luxury statistic widget supporting reactive hover elevation,
 * ambient glow, icon badges, and deep navigation linking.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const DashboardStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  to,
  iconGradient = 'from-accent-600 to-indigo-500',
  iconColor = 'text-accent-400',
  delay = 0,
}) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-dark-900/80 to-dark-950/80 border border-dark-800/80 p-5 backdrop-blur-xl group hover:border-dark-750 hover:shadow-lg transition-all"
    >
      {/* Ambient background glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accent-600/10 transition-all duration-300" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        {/* Left: Metric Data */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {title}
            </span>
            {badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-300 border border-accent-500/20">
                {badge}
              </span>
            )}
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </div>

          {subtitle && (
            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Icon Badge & Deep Link Arrow */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${iconGradient} p-0.5 shadow-sm`}>
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
            </div>
          </div>

          {to && (
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-accent-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          )}
        </div>
      </div>
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
};

export default DashboardStatCard;
