/**
 * Desktop Mobile Table Row Component
 * Module: components/admin/MobileTableRow.jsx
 * 
 * Renders a single data row inside the desktop admin inventory table.
 */

import React, { useState } from 'react';
import { Smartphone, Image as ImageIcon } from 'lucide-react';
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

export const MobileTableRow = ({
  mobile,
  onToggleVisibility,
  onUpdateStock,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);

  // Extract primary image url
  const primaryImageUrl =
    mobile?.imageUrls?.[0] ||
    mobile?.images?.[0]?.imageUrl ||
    null;

  return (
    <tr className="border-b border-dark-800/60 hover:bg-dark-850/40 transition-colors group">
      {/* 1. Image Thumbnail */}
      <td className="py-3.5 pl-4 pr-3">
        <div className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-700/60 overflow-hidden flex items-center justify-center relative flex-shrink-0 group-hover:border-accent-500/40 transition-colors">
          {primaryImageUrl && !imgError ? (
            <img
              src={primaryImageUrl}
              alt={mobile.name || 'Smartphone'}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="text-neutral-500 flex items-center justify-center w-full h-full bg-dark-850">
              <Smartphone className="w-5 h-5" />
            </div>
          )}
        </div>
      </td>

      {/* 2. Product Name & Processor */}
      <td className="py-3.5 px-3">
        <div className="flex flex-col max-w-[200px]">
          <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate group-hover:text-accent-300 transition-colors">
            {mobile.name}
          </span>
          <span className="text-[11px] text-neutral-400 truncate">
            {mobile.processor || 'Flagship Architecture'}
          </span>
        </div>
      </td>

      {/* 3. Brand */}
      <td className="py-3.5 px-3">
        <span className="inline-block px-2 py-0.5 rounded-lg bg-dark-850 border border-dark-700/80 text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
          {mobile.brand}
        </span>
      </td>

      {/* 4. Price */}
      <td className="py-3.5 px-3">
        <span className="text-xs sm:text-sm font-extrabold text-white font-mono tracking-tight">
          {formatCurrency(mobile.price)}
        </span>
      </td>

      {/* 5. RAM */}
      <td className="py-3.5 px-3">
        <span className="text-xs text-neutral-300 font-mono">
          {mobile.ram || '—'}
        </span>
      </td>

      {/* 6. Storage */}
      <td className="py-3.5 px-3">
        <span className="text-xs text-neutral-300 font-mono">
          {mobile.storage || '—'}
        </span>
      </td>

      {/* 7. Stock Status */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <MobileStatusBadge type="stock" status={mobile.stockStatus} />
      </td>

      {/* 8. Visibility */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <MobileStatusBadge type="visibility" hidden={mobile.hidden} />
      </td>

      {/* 9. Created Date */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <span className="text-xs text-neutral-400 font-sans">
          {formatDate(mobile.createdAt)}
        </span>
      </td>

      {/* 10. Actions */}
      <td className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap">
        <MobileActionMenu
          mobile={mobile}
          onToggleVisibility={onToggleVisibility}
          onUpdateStock={onUpdateStock}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};

export default MobileTableRow;
