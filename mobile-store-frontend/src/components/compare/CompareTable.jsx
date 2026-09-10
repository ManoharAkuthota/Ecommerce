/**
 * Desktop Compare Table Component
 * Module: components/compare/CompareTable.jsx
 * 
 * True side-by-side specification comparison matrix for desktop & tablet:
 * - Aligned specification rows (Price, Processor, RAM, Storage, Display, Battery, Stock)
 * - Sticky spec labels column with subtle row striping
 * - Subtle difference highlight between values across devices
 * - Responsive column sizing for 1 to 4 smartphones
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  HardDrive,
  Tv,
  BatteryCharging,
  DollarSign,
  PackageCheck,
  Smartphone,
} from 'lucide-react';
import CompareColumn from './CompareColumn';
import { StockBadge } from '../mobiles/MobileCard';

const SPEC_ROWS = [
  {
    key: 'price',
    label: 'Price',
    icon: DollarSign,
    getValue: (item) => item.formattedPrice || `$${item.price || 0}`,
    isHighlight: true,
  },
  {
    key: 'processor',
    label: 'Processor',
    icon: Cpu,
    getValue: (item) => item.processor || '—',
  },
  {
    key: 'ram',
    label: 'RAM Memory',
    icon: HardDrive,
    getValue: (item) => item.ram || '—',
  },
  {
    key: 'storage',
    label: 'Storage Capacity',
    icon: HardDrive,
    getValue: (item) => item.storage || '—',
  },
  {
    key: 'display',
    label: 'Display Screen',
    icon: Tv,
    getValue: (item) => item.display || '—',
  },
  {
    key: 'battery',
    label: 'Battery & Charging',
    icon: BatteryCharging,
    getValue: (item) => item.battery || '—',
  },
  {
    key: 'stock',
    label: 'Availability',
    icon: PackageCheck,
    render: (item) => <StockBadge status={item.stockStatus || item.stock} />,
  },
];

const CompareTable = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const colCount = items.length;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[720px] rounded-3xl bg-dark-900/50 border border-dark-800 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* 1. Header Row: Product Thumbnails & Basic Info */}
        <div className="grid grid-cols-[180px_repeat(var(--cols),1fr)] p-4 sm:p-6 border-b border-dark-800/80 items-stretch gap-4"
             style={{ '--cols': colCount }}>
          {/* Top Left Corner */}
          <div className="flex flex-col justify-end p-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent-400 font-bold">
              Flagship Spec Matrix
            </span>
            <h4 className="text-sm font-bold text-white mt-1">
              Side-by-Side Review
            </h4>
          </div>

          {/* Product Header Cards */}
          {items.map((item) => (
            <CompareColumn key={item.mobileId || item.id} item={item} />
          ))}
        </div>

        {/* 2. Specification Rows */}
        <div className="divide-y divide-dark-850/80">
          {SPEC_ROWS.map((row, idx) => {
            const Icon = row.icon;
            const values = items.map((item) => row.getValue ? row.getValue(item) : '');
            // Check if all values are identical or differing
            const hasDifference = new Set(values).size > 1;

            return (
              <div
                key={row.key}
                className={`grid grid-cols-[180px_repeat(var(--cols),1fr)] p-4 sm:p-5 items-center gap-4 transition-colors ${
                  idx % 2 === 0 ? 'bg-dark-900/30' : 'bg-dark-850/20'
                } hover:bg-dark-800/30`}
                style={{ '--cols': colCount }}
              >
                {/* Spec Label */}
                <div className="flex items-center gap-2.5 text-neutral-400">
                  <div className="p-1.5 rounded-lg bg-dark-800 text-accent-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-200 block">
                      {row.label}
                    </span>
                    {hasDifference && (
                      <span className="text-[10px] text-accent-400/80 font-mono block">
                        Differs
                      </span>
                    )}
                  </div>
                </div>

                {/* Compared Mobile Values */}
                {items.map((item) => {
                  const targetId = item.mobileId || item.id;
                  if (row.render) {
                    return (
                      <div key={targetId} className="px-2">
                        {row.render(item)}
                      </div>
                    );
                  }

                  const val = row.getValue(item);

                  return (
                    <div
                      key={targetId}
                      className={`px-2 text-xs sm:text-sm font-medium ${
                        row.isHighlight
                          ? 'text-white font-extrabold text-base sm:text-lg'
                          : 'text-neutral-300'
                      }`}
                    >
                      <span>{val}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompareTable;
