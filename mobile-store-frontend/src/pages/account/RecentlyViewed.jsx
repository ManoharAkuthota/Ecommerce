/**
 * Recently Viewed Smartphones Page
 * Module: pages/account/RecentlyViewed.jsx
 * Route: /account/recent
 * 
 * Real-time browsing history showcase:
 * - Tracks every smartphone inspected across storefront sessions.
 * - Displays device images, technical specifications, and live pricing.
 * - Quick "Compare", "Add to Wishlist", and "View Details" actions.
 * - Individual device removal and full history wipe with confirmation.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Smartphone,
  Trash2,
  ArrowRight,
  Heart,
  ArrowLeftRight,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Cpu,
  Layers,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { recentService } from '../../services/recentService';
import { useWishlist } from '../../hooks/useWishlist';
import { useCompare } from '../../hooks/useCompare';
import SEO from '../../components/common/SEO';

const RecentlyViewed = () => {
  const [recentDevices, setRecentDevices] = useState([]);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isCompared, addToCompare, removeFromCompare, count: compareCount } = useCompare();

  // Load recently viewed devices from local memory
  const loadRecent = () => {
    const list = recentService.getRecent();
    setRecentDevices(list);
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const handleRemoveOne = (id) => {
    const updated = recentService.removeRecent(id);
    setRecentDevices(updated);
  };

  const handleClearAll = () => {
    recentService.clearRecent();
    setRecentDevices([]);
    setClearModalOpen(false);
  };

  // Format date helper
  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Recently';
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <>
      <SEO
        title="Recently Viewed — MS Mobiles"
        description="Review smartphones, specs, and flagships you recently explored."
        canonicalUrl="http://localhost:5173/account/recent"
      />

      <div className="space-y-8 pb-16">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Recently Viewed Smartphones
              </h1>
            </div>
            <p className="text-xs text-neutral-400">
              Quickly revisit devices, comparative specs, and pricing from your recent browsing activity.
            </p>
          </div>

          {recentDevices.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setClearModalOpen(true)}
              icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
              className="text-rose-300 hover:text-rose-200 border-rose-500/30 self-start sm:self-auto"
            >
              Clear History
            </Button>
          )}
        </div>

        {/* Device Grid or Empty State */}
        {recentDevices.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-dark-900/50 border border-dark-800/80 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mx-auto shadow-glow-sm">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No Browsing History Yet</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                As you browse smartphones in our flagship catalog, your inspected devices and comparative hardware stats will be saved here automatically.
              </p>
            </div>
            <Link to="/mobiles" className="inline-block pt-2">
              <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Explore Smartphone Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentDevices.map((device) => {
              const inWishlist = isWishlisted(device?.id);
              const inCompare = isCompared(device?.id);
              const displayImage =
                device.images?.[0]?.imageUrl ||
                (typeof device.images?.[0] === 'string' ? device.images[0] : null) ||
                device.imageUrl ||
                device.image ||
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80';

              return (
                <motion.div
                  key={device.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-3xl bg-dark-900/70 border border-dark-800/80 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between group hover:border-dark-700 hover:bg-dark-900 transition-all select-none"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveOne(device.id)}
                    title="Remove from history"
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-xl bg-dark-950/80 border border-dark-800 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    {/* Image Area */}
                    <Link to={`/mobiles/${device.id}`} className="block relative aspect-square rounded-2xl bg-dark-950/60 overflow-hidden mb-4 p-4 border border-dark-800/50">
                      <img
                        src={displayImage}
                        alt={device.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-dark-950/80 border border-dark-800 text-[10px] font-mono text-neutral-400">
                        {formatTimeAgo(device.viewedAt)}
                      </div>
                    </Link>

                    {/* Brand & Name */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-400">
                        {device.brand}
                      </span>
                      <Link to={`/mobiles/${device.id}`}>
                        <h3 className="text-sm font-bold text-white hover:text-accent-300 transition-colors line-clamp-1">
                          {device.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {device.ram && (
                        <span className="px-2 py-0.5 rounded-md bg-dark-950 border border-dark-800 text-[10px] font-mono text-neutral-300">
                          {device.ram} RAM
                        </span>
                      )}
                      {device.storage && (
                        <span className="px-2 py-0.5 rounded-md bg-dark-950 border border-dark-800 text-[10px] font-mono text-neutral-300">
                          {device.storage}
                        </span>
                      )}
                      {device.processor && (
                        <span className="px-2 py-0.5 rounded-md bg-dark-950 border border-dark-800 text-[10px] font-mono text-neutral-400 line-clamp-1 max-w-[140px]">
                          {device.processor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Price & Quick Actions */}
                  <div className="pt-4 mt-4 border-t border-dark-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-neutral-500 block">Price</span>
                      <span className="text-base font-black text-white font-mono">
                        ₹{Number(device.price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Compare Toggle */}
                      <button
                        onClick={() => {
                          if (inCompare) {
                            removeFromCompare(device.id);
                          } else {
                            addToCompare(device.id, device);
                          }
                        }}
                        title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
                        className={`p-2 rounded-xl border transition-all ${
                          inCompare
                            ? 'bg-accent-600/20 text-accent-400 border-accent-500/40 shadow-glow-sm'
                            : 'bg-dark-950 text-neutral-400 hover:text-white border-dark-800'
                        }`}
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Wishlist Toggle */}
                      <button
                        onClick={() => toggleWishlist(device.id, device)}
                        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        className={`p-2 rounded-xl border transition-all ${
                          inWishlist
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-glow-sm'
                            : 'bg-dark-950 text-neutral-400 hover:text-rose-400 border-dark-800'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>

                      {/* View Button */}
                      <Link to={`/mobiles/${device.id}`}>
                        <Button variant="primary" size="sm" className="px-3 py-1.5 text-xs">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {clearModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-dark-900 border border-dark-800 shadow-2xl space-y-4"
            >
              <div className="p-3 w-fit rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Clear Browsing History?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                This will remove all {recentDevices.length} smartphones from your recently viewed history across this browser.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
                <Button variant="ghost" size="sm" onClick={() => setClearModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleClearAll}>
                  Clear All Devices
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecentlyViewed;
