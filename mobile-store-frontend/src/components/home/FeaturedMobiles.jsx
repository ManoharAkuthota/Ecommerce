/**
 * FeaturedMobiles Component
 * Module: components/home/FeaturedMobiles.jsx
 *
 * Renders the top 8 latest flagship smartphones loaded directly from
 * Spring Boot GET /api/mobiles/latest via homeService.
 * Features:
 * - Responsive 4-column grid (lg:grid-cols-4, sm:grid-cols-2, grid-cols-1)
 * - SectionHeading with luxury pill badge
 * - Loading shimmer skeletons (MobileCardSkeleton)
 * - Empty state with retry action
 * - Bottom "Explore All Mobiles" CTA
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, Smartphone } from 'lucide-react';
import { homeService } from '../../services/homeService';
import MobileCard, { MobileCardSkeleton } from './MobileCard';
import SectionHeading from './SectionHeading';
import CTAButton from './CTAButton';

export const FeaturedMobiles = () => {
  const [mobiles, setMobiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestMobiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await homeService.getLatestMobiles();
      // Ensure we display up to top 8 latest mobiles
      const items = Array.isArray(data) ? data.slice(0, 8) : [];
      setMobiles(items);
    } catch (err) {
      console.error('Error fetching latest mobiles:', err);
      setError('Unable to load latest flagship mobiles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestMobiles();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="featured-mobiles-section" className="relative w-full py-20 sm:py-28 overflow-hidden select-none">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 right-1/4 w-[36rem] h-[36rem] bg-accent-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-600/6 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          badge="Flagship Collection"
          badgeIcon={Sparkles}
          title="Latest Mobiles"
          subtitle="Explore the latest flagship smartphones engineered with cutting-edge silicon, studio-grade optics, and official warranties."
          alignment="center"
          className="mb-14 sm:mb-16"
        />

        {/* Product Grid Area */}
        {isLoading ? (
          // Loading Skeleton State (8 Cards)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <MobileCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          // Error State with Retry
          <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-dark-900/40 border border-dark-800 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Failed to Load Products</h3>
            <p className="text-sm text-neutral-400 mb-6">{error}</p>
            <button
              onClick={fetchLatestMobiles}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all shadow-glow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : mobiles.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-dark-900/40 border border-dark-800 text-center max-w-md mx-auto">
            <Smartphone className="w-12 h-12 text-neutral-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Mobiles Available</h3>
            <p className="text-sm text-neutral-400 mb-6">
              Flagship inventory is currently being refreshed. Please check back soon!
            </p>
            <Link
              to="/mobiles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-white text-xs font-bold border border-dark-700"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          // 8-Card Responsive Product Grid
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {mobiles.map((mobile) => (
              <motion.div key={mobile.id || mobile.name} variants={itemVariants}>
                <MobileCard mobile={mobile} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom Call to Action */}
        <div className="mt-16 text-center">
          <CTAButton
            to="/mobiles"
            variant="outline"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            Explore Complete Inventory
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMobiles;
