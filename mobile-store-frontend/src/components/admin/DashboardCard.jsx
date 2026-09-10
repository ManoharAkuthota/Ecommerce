/**
 * Dashboard Statistic Card Component
 * Module: components/admin/DashboardCard.jsx
 * 
 * Reusable metric card with luxury glassmorphism, glowing icon badge,
 * large formatted metric value, trend indicator, and tactile hover physics.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';

const DashboardCard = ({
  title,
  value,
  icon,
  change,
  trend = 'neutral', // 'up' | 'down' | 'neutral'
  badgeText = null,
  accentColor = 'accent', // 'accent' | 'emerald' | 'purple' | 'amber' | 'cyan'
  delay = 0,
  to = null,
  onClick = null,
  isActive = false,
}) => {
  const colorStyles = {
    accent: {
      iconBg: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
      hoverBorder: 'hover:border-accent-500/50 hover:shadow-accent-950/40',
      glow: 'group-hover:bg-accent-500/15',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/50 hover:shadow-emerald-950/40',
      glow: 'group-hover:bg-emerald-500/15',
    },
    purple: {
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      hoverBorder: 'hover:border-purple-500/50 hover:shadow-purple-950/40',
      glow: 'group-hover:bg-purple-500/15',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      hoverBorder: 'hover:border-amber-500/50 hover:shadow-amber-950/40',
      glow: 'group-hover:bg-amber-500/15',
    },
    cyan: {
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      hoverBorder: 'hover:border-cyan-500/50 hover:shadow-cyan-950/40',
      glow: 'group-hover:bg-cyan-500/15',
    },
  }[accentColor] || {
    iconBg: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
    hoverBorder: 'hover:border-accent-500/50 hover:shadow-accent-950/40',
    glow: 'group-hover:bg-accent-500/15',
  };

  const isClickable = Boolean(to || onClick);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={isClickable ? { y: -4, transition: { duration: 0.15 } } : {}}
      onClick={onClick}
      className={`group relative rounded-2xl sm:rounded-3xl bg-dark-900/70 backdrop-blur-xl border p-5 sm:p-6 shadow-card transition-all duration-300 ${
        isActive
          ? 'border-accent-500 shadow-glow-sm bg-dark-850'
          : 'border-dark-800/80'
      } ${
        isClickable ? `${colorStyles.hoverBorder} cursor-pointer hover:bg-dark-850/80` : ''
      } overflow-hidden select-none h-full flex flex-col justify-between`}
    >
      {/* Subtle top-right ambient hover glow */}
      <div
        className={`absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 rounded-full blur-2xl transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100 ${colorStyles.glow}`}
      />

      <div>
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 leading-tight">
              {title}
            </span>
            {isClickable && (
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 group-hover:text-accent-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            )}
          </div>

          {icon && (
            <div
              className={`p-2.5 rounded-xl border shadow-sm flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${colorStyles.iconBg}`}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3 relative z-10">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
              {value}
            </span>
            {badgeText && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-dark-800 text-neutral-300 border border-dark-700">
                {badgeText}
              </span>
            )}
          </div>
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-dark-800/60 text-xs relative z-10">
          {trend === 'up' && (
            <span className="inline-flex items-center gap-0.5 font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          )}
          {trend === 'down' && (
            <span className="inline-flex items-center gap-0.5 font-bold text-rose-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </span>
          )}
          {trend === 'neutral' && (
            <span className="inline-flex items-center gap-0.5 text-neutral-500">
              <Minus className="w-3 h-3" />
            </span>
          )}
          <span className="text-neutral-400 text-[11px] font-medium leading-normal group-hover:text-neutral-200 transition-colors">
            {change}
          </span>
        </div>
      )}
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default DashboardCard;
