/**
 * Pagination Component
 * Module: components/mobiles/Pagination.jsx
 * 
 * Accessible, luxury pagination controls connected directly to Spring Boot Page metadata:
 * - Previous / Next buttons with disabled states
 * - Dynamic page numbers with active indicators and ellipsis
 * - Item range summary: "Showing 1-12 of 24 smartphones"
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 0, // 0-indexed from Spring Boot
  totalPages = 1,
  totalElements = 0,
  pageSize = 12,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // Helper to generate page buttons array with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);

      if (currentPage <= 2) {
        start = 1;
        end = 3;
      } else if (currentPage >= totalPages - 3) {
        start = totalPages - 4;
        end = totalPages - 2;
      }

      if (start > 1) {
        pages.push('ellipsis-start');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) {
        pages.push('ellipsis-end');
      }

      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-dark-850 select-none ${className}`}
    >
      {/* Range summary */}
      <div className="text-xs text-neutral-400 font-mono">
        Showing <span className="text-white font-semibold">{startItem}</span> to{' '}
        <span className="text-white font-semibold">{endItem}</span> of{' '}
        <span className="text-white font-semibold">{totalElements}</span> smartphones
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous Page"
          className="p-2 rounded-xl bg-dark-900 border border-dark-750 text-neutral-300 hover:text-white hover:bg-dark-850 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {pages.map((p, idx) => {
          if (p === 'ellipsis-start' || p === 'ellipsis-end') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-xs text-neutral-500">
                •••
              </span>
            );
          }

          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`Page ${p + 1}`}
              className={`min-w-[36px] h-9 px-2 rounded-xl text-xs font-semibold transition-all ${
                isCurrent
                  ? 'bg-accent-600 text-white shadow-glow-sm font-bold border border-accent-500'
                  : 'bg-dark-900/80 border border-dark-750 text-neutral-400 hover:text-white hover:bg-dark-850'
              }`}
            >
              {p + 1}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          aria-label="Next Page"
          className="p-2 rounded-xl bg-dark-900 border border-dark-750 text-neutral-300 hover:text-white hover:bg-dark-850 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
