/**
 * SpecificationTable Component
 * Module: components/mobile-details/SpecificationTable.jsx
 * 
 * Glassmorphic technical specification table displaying full hardware attributes:
 * - Brand
 * - RAM
 * - Storage
 * - Processor
 * - Display
 * - Battery
 * - Stock Status
 */

import React from 'react';
import {
  Smartphone,
  Cpu,
  HardDrive,
  Tv,
  BatteryCharging,
  Layers,
  Sparkles,
} from 'lucide-react';
import StockBadge from './StockBadge';

export const SpecificationTable = ({ mobile, className = '' }) => {
  if (!mobile) return null;

  const {
    brand = '—',
    ram = '—',
    storage = '—',
    processor = '—',
    display = '—',
    battery = '—',
    stockStatus = 'IN_STOCK',
  } = mobile;

  const specRows = [
    {
      label: 'Brand / Manufacturer',
      value: brand,
      icon: <Sparkles className="w-4 h-4 text-accent-400" />,
    },
    {
      label: 'Random Access Memory (RAM)',
      value: ram,
      icon: <HardDrive className="w-4 h-4 text-accent-400" />,
    },
    {
      label: 'Internal Storage Capacity',
      value: storage,
      icon: <HardDrive className="w-4 h-4 text-accent-400" />,
    },
    {
      label: 'Processor / Chipset',
      value: processor,
      icon: <Cpu className="w-4 h-4 text-accent-400" />,
    },
    {
      label: 'Display Technology',
      value: display,
      icon: <Tv className="w-4 h-4 text-purple-400" />,
    },
    {
      label: 'Battery & Charging',
      value: battery,
      icon: <BatteryCharging className="w-4 h-4 text-emerald-400" />,
    },
    {
      label: 'Inventory Availability',
      value: <StockBadge status={stockStatus} size="sm" />,
      icon: <Layers className="w-4 h-4 text-neutral-400" />,
      isCustom: true,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-dark-800 text-neutral-400 text-xs font-mono uppercase tracking-wider">
          <span>Technical Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Product Specifications
        </h2>
      </div>

      {/* Table Frame */}
      <div className="rounded-3xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-2xl shadow-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dark-800 text-[11px] font-mono uppercase tracking-wider text-neutral-500 bg-dark-950/40">
              <th className="py-4 px-6 font-semibold w-1/3 sm:w-2/5">Feature</th>
              <th className="py-4 px-6 font-semibold">Technical Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60 text-xs sm:text-sm">
            {specRows.map((row, index) => (
              <tr
                key={row.label}
                className={`transition-colors hover:bg-dark-850/40 ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-dark-950/20'
                }`}
              >
                <td className="py-4 px-6 text-neutral-400 font-medium">
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0">{row.icon}</span>
                    <span>{row.label}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-white font-semibold leading-relaxed">
                  {row.isCustom ? row.value : <span className="font-sans">{row.value}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecificationTable;
