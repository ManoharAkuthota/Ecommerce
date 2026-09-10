/**
 * RelatedProducts Component
 * Module: components/mobile-details/RelatedProducts.jsx
 * 
 * Displays top 4 related flagship smartphones loaded dynamically from
 * Spring Boot GET /api/mobiles/latest, strictly excluding the currently viewed device.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mobileDetailsService } from '../../services/mobileDetailsService';
import RelatedProductCard from './RelatedProductCard';

export const RelatedProducts = ({ currentMobileId, className = '' }) => {
  const [relatedMobiles, setRelatedMobiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!currentMobileId) return;
      setIsLoading(true);
      try {
        const data = await mobileDetailsService.getRelatedMobiles(currentMobileId, 4);
        setRelatedMobiles(data);
      } catch (err) {
        console.warn('Could not load related flagships:', err);
        setRelatedMobiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [currentMobileId]);

  if (!isLoading && relatedMobiles.length === 0) return null;

  return (
    <section className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-accent-400" />
            <span>Curated Recommendations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            You May Also Like
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans">
            Explore other top-rated smartphones in our curated flagship collection.
          </p>
        </div>

        <Link
          to="/mobiles"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-400 hover:text-accent-300 group transition-colors self-start sm:self-auto"
        >
          <span>View All Mobiles</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl bg-dark-900/40 border border-dark-800/60 p-4 space-y-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="w-16 h-4 bg-dark-800 rounded" />
                <div className="w-14 h-4 bg-dark-800 rounded" />
              </div>
              <div className="w-full aspect-[4/3.2] bg-dark-850 rounded-2xl" />
              <div className="space-y-2">
                <div className="w-16 h-3 bg-dark-800 rounded" />
                <div className="w-3/4 h-5 bg-dark-800 rounded" />
              </div>
              <div className="pt-3 border-t border-dark-850 flex justify-between">
                <div className="w-16 h-6 bg-dark-800 rounded" />
                <div className="w-16 h-6 bg-dark-850 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedMobiles.map((mobile) => (
            <RelatedProductCard key={mobile.id || mobile.name} mobile={mobile} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RelatedProducts;
