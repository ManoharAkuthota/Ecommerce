/**
 * Mobile Inventory Table & Responsive Cards Component
 * Module: components/admin/MobileTable.jsx
 * 
 * Features:
 * - Desktop View: Full semantic HTML table with hover effects and 10 detailed columns
 * - Mobile View (<1024px): Responsive card grid showcasing product image, name, price, badges, and action menu
 */

import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';
import MobileTableRow from './MobileTableRow';
import MobileStatusBadge from './MobileStatusBadge';
import MobileActionMenu from './MobileActionMenu';

// Currency formatter
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Date formatter
const formatDate = (isoString) => {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return '—';
  }
};

/**
 * Mobile Responsive Card View (< 1024px)
 */
const MobileItemCard = ({
  mobile,
  onToggleVisibility,
  onUpdateStock,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);

  const primaryImageUrl =
    mobile?.imageUrls?.[0] ||
    mobile?.images?.[0]?.imageUrl ||
    null;

  return (
    <div className="p-4 rounded-2xl bg-dark-950/70 border border-dark-800/80 backdrop-blur-xl shadow-card space-y-3.5 hover:border-dark-700 transition-colors">
      {/* Top Header: Image, Title, Price, Action Menu */}
      <div className="flex items-start gap-3.5">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-700/60 overflow-hidden flex items-center justify-center relative flex-shrink-0">
          {primaryImageUrl && !imgError ? (
            <img
              src={primaryImageUrl}
              alt={mobile.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-neutral-500 flex items-center justify-center w-full h-full bg-dark-850">
              <Smartphone className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-400">
              {mobile.brand}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-[11px] text-neutral-400 truncate">
              {mobile.ram || '—'} / {mobile.storage || '—'}
            </span>
          </div>

          <h4 className="text-sm font-bold text-white tracking-tight truncate mt-0.5">
            {mobile.name}
          </h4>

          <div className="mt-1 font-mono text-sm font-extrabold text-white">
            {formatCurrency(mobile.price)}
          </div>
        </div>

        {/* Action Menu */}
        <div className="flex-shrink-0">
          <MobileActionMenu
            mobile={mobile}
            onToggleVisibility={onToggleVisibility}
            onUpdateStock={onUpdateStock}
            onDelete={onDelete}
          />
        </div>
      </div>

      {/* Footer Badges & Date */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-800/80 text-xs">
        <div className="flex items-center gap-2">
          <MobileStatusBadge type="stock" status={mobile.stockStatus} />
          <MobileStatusBadge type="visibility" hidden={mobile.hidden} />
        </div>

        <span className="text-[11px] text-neutral-500">
          {formatDate(mobile.createdAt)}
        </span>
      </div>
    </div>
  );
};

export const MobileTable = ({
  mobiles = [],
  onToggleVisibility,
  onUpdateStock,
  onDelete,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* 1. Desktop Full Table (Visible on lg and larger) */}
      <div className="hidden lg:block rounded-2xl border border-dark-800/80 bg-dark-950/60 backdrop-blur-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800/80 bg-dark-900/50 text-[11px] font-bold text-neutral-400 uppercase tracking-wider select-none">
                <th scope="col" className="py-3.5 pl-4 pr-3">
                  Image
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Product
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Brand
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Price
                </th>
                <th scope="col" className="py-3.5 px-3">
                  RAM
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Storage
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Stock Status
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Visibility
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Created
                </th>
                <th scope="col" className="py-3.5 pl-3 pr-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/40">
              {mobiles.map((mobile) => (
                <MobileTableRow
                  key={mobile.id}
                  mobile={mobile}
                  onToggleVisibility={onToggleVisibility}
                  onUpdateStock={onUpdateStock}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Responsive Mobile Card Grid (Visible on screens < lg) */}
      <div className="block lg:hidden space-y-3">
        {mobiles.map((mobile) => (
          <MobileItemCard
            key={mobile.id}
            mobile={mobile}
            onToggleVisibility={onToggleVisibility}
            onUpdateStock={onUpdateStock}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileTable;
