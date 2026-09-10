/**
 * BusinessHours Component
 * Module: components/contact/BusinessHours.jsx
 * 
 * Operating hours schedule with automatic client-side current-day highlighting:
 * - Monday–Friday
 * - Saturday
 * - Sunday
 * - Active day badge and pulsing indicator
 */

import React from 'react';
import { Clock, Sparkles } from 'lucide-react';

export const BusinessHours = ({ className = '' }) => {
  // Sunday = 0, Monday = 1, ..., Saturday = 6
  const currentDayIndex = new Date().getDay();

  const schedule = [
    {
      dayLabel: 'Monday – Friday',
      hours: '9:00 AM – 8:00 PM IST',
      dayIndices: [1, 2, 3, 4, 5],
    },
    {
      dayLabel: 'Saturday',
      hours: '10:00 AM – 7:00 PM IST',
      dayIndices: [6],
    },
    {
      dayLabel: 'Sunday',
      hours: '11:00 AM – 5:00 PM IST',
      dayIndices: [0],
    },
  ];

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-2xl shadow-2xl space-y-5 select-none ${className}`}
    >
      <div className="flex items-center justify-between border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide font-mono">
            Store Business Hours
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Concierge Active</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {schedule.map((item, idx) => {
          const isCurrentDay = item.dayIndices.includes(currentDayIndex);

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl transition-all flex items-center justify-between gap-2 text-xs ${
                isCurrentDay
                  ? 'bg-accent-500/15 border border-accent-500/40 shadow-glow-sm'
                  : 'bg-dark-850/40 border border-dark-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCurrentDay && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                )}
                <span className={`font-semibold ${isCurrentDay ? 'text-white' : 'text-neutral-300'}`}>
                  {item.dayLabel}
                </span>
                {isCurrentDay && (
                  <span className="px-2 py-0.5 rounded-md bg-accent-500/20 text-accent-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Today
                  </span>
                )}
              </div>

              <span className={`font-mono ${isCurrentDay ? 'text-accent-300 font-bold' : 'text-neutral-400'}`}>
                {item.hours}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessHours;
