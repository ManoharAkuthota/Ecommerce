/**
 * Mobile Action Menu Component
 * Module: components/admin/MobileActionMenu.jsx
 * 
 * Features:
 * - Three-dot trigger button
 * - Framer Motion popover menu with glassmorphic styling
 * - Actions: Edit, Hide/Unhide, Change Stock (In Stock, Limited Stock, Out of Stock), Delete
 * - Auto-closes on outside click or Escape key
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Edit,
  Eye,
  EyeOff,
  Boxes,
  Trash2,
  Check,
  ChevronRight,
} from 'lucide-react';

export const MobileActionMenu = ({
  mobile,
  onToggleVisibility,
  onUpdateStock,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showStockSubmenu, setShowStockSubmenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowStockSubmenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setShowStockSubmenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleEdit = () => {
    setIsOpen(false);
    navigate(`/admin/mobiles/edit/${mobile.id}`);
  };

  const handleVisibilityClick = () => {
    setIsOpen(false);
    if (typeof onToggleVisibility === 'function') {
      onToggleVisibility(mobile);
    }
  };

  const handleStockClick = (newStatus) => {
    setIsOpen(false);
    setShowStockSubmenu(false);
    if (typeof onUpdateStock === 'function') {
      onUpdateStock(mobile, newStatus);
    }
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    if (typeof onDelete === 'function') {
      onDelete(mobile);
    }
  };

  const isHidden = Boolean(mobile?.hidden);
  const currentStock = mobile?.stockStatus || 'IN_STOCK';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/30"
        aria-label="Actions"
        title="Open actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Main Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-1 w-52 rounded-2xl bg-dark-900/95 border border-dark-700/80 backdrop-blur-xl shadow-2xl py-1.5 z-30 divide-y divide-dark-800"
          >
            {/* Primary Actions Group */}
            <div className="py-1">
              {/* Edit Action */}
              <button
                type="button"
                onClick={handleEdit}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-dark-800/80 transition-colors text-left"
              >
                <Edit className="w-3.5 h-3.5 text-accent-400" />
                <span>Edit Mobile</span>
              </button>

              {/* Hide / Unhide Action */}
              <button
                type="button"
                onClick={handleVisibilityClick}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-dark-800/80 transition-colors text-left"
              >
                {isHidden ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Publish (Unhide)</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Hide from Store</span>
                  </>
                )}
              </button>
            </div>

            {/* Stock Modification Submenu Section */}
            <div className="py-1">
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Change Stock Status
              </div>

              {[
                { status: 'IN_STOCK', label: 'In Stock', color: 'text-emerald-400' },
                { status: 'LIMITED_STOCK', label: 'Limited Stock', color: 'text-amber-400' },
                { status: 'OUT_OF_STOCK', label: 'Out of Stock', color: 'text-rose-400' },
              ].map((item) => (
                <button
                  key={item.status}
                  type="button"
                  onClick={() => handleStockClick(item.status)}
                  className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-dark-800/80 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                    <span>{item.label}</span>
                  </span>
                  {currentStock === item.status && (
                    <Check className="w-3 h-3 text-accent-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Danger Delete Group */}
            <div className="py-1">
              <button
                type="button"
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Mobile</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileActionMenu;
