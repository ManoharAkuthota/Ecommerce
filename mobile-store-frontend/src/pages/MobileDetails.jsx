/**
 * MobileDetails Page Component
 * Module: pages/MobileDetails.jsx
 * 
 * Luxury storefront product details page for MS Mobiles (/mobiles/:id):
 * - Breadcrumb: Home / Mobiles / {Product Name}
 * - Product Showcase: Two-column layout (Gallery on left, Product Info on right)
 * - Cloudinary-powered Image Gallery with interactive ImageZoom and ThumbnailStrip
 * - Comprehensive Technical Specification Table
 * - "You May Also Like" Related Products recommendations
 * - Loading Skeletons & Resilient Error State
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { mobileDetailsService } from '../services/mobileDetailsService';
import { recentService } from '../services/recentService';
import SEO from '../components/common/SEO';
import {
  ProductGallery,
  ProductInfo,
  SpecificationTable,
  RelatedProducts,
  ProductSkeleton,
  ErrorState,
} from '../components/mobile-details';

export const MobileDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  // Instant zero-delay load from navigation state or in-memory cache
  const initialMobile = location.state?.mobile || mobileDetailsService.getCachedMobile(id);
  const [mobile, setMobile] = useState(initialMobile);
  const [isLoading, setIsLoading] = useState(!initialMobile);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMobile = async () => {
      if (!id) return;

      // Only show full skeleton if we have zero cached data to display
      if (!mobile) {
        setIsLoading(true);
      }
      setError(null);

      // Scroll to top immediately when viewing a new product
      window.scrollTo({ top: 0, behavior: 'instant' });

      try {
        const data = await mobileDetailsService.getMobileById(id);
        if (data) {
          setMobile(data);
          recentService.addRecent(data);
        }
      } catch (err) {
        console.error('Error fetching smartphone details:', err);
        if (!mobile) {
          setError(err.response?.status === 404 ? 'not_found' : 'server_error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMobile();
  }, [id]);

  return (
    <div className="relative min-h-screen py-8 sm:py-12 select-none">
      <SEO
        title={mobile ? `${mobile.name} | MS Mobiles` : 'Smartphone Details | MS Mobiles'}
        description={
          mobile
            ? `Buy the ${mobile.name} with ${mobile.ram} RAM, ${mobile.storage} storage, and ${mobile.processor}. Official manufacturer warranty guaranteed.`
            : 'Explore flagship smartphone specifications and details at MS Mobiles.'
        }
        image={mobile?.images?.[0]?.imageUrl || mobile?.imageUrl}
        type="product"
      />

      {/* Soft Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute top-12 right-1/4 w-[40rem] h-[40rem] bg-accent-500/8 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 -left-28 w-96 h-96 bg-indigo-600/7 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {isLoading ? (
          <ProductSkeleton />
        ) : error || !mobile ? (
          <ErrorState
            title={error === 'not_found' ? 'Smartphone Not Found' : 'Unable to Load Details'}
            message={
              error === 'not_found'
                ? 'The requested flagship smartphone does not exist or has been removed from our catalog.'
                : 'A network error occurred while loading this product. Please return to the catalog and try again.'
            }
          />
        ) : (
          <>
            {/* ================= 1. BREADCRUMB ================= */}
            <motion.nav
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs font-mono text-neutral-400 overflow-x-auto whitespace-nowrap pb-1"
            >
              <Link
                to="/"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <HomeIcon className="w-3.5 h-3.5 text-neutral-500" />
                <span>Home</span>
              </Link>

              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />

              <Link to="/mobiles" className="hover:text-white transition-colors">
                Mobiles
              </Link>

              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />

              <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-md">
                {mobile.name}
              </span>
            </motion.nav>

            {/* ================= 2. PRODUCT SHOWCASE (2 COLUMNS) ================= */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
            >
              {/* Left: Interactive Cloudinary Gallery */}
              <div className="lg:col-span-6 w-full">
                <ProductGallery mobile={mobile} />
              </div>

              {/* Right: Product Information & CTAs */}
              <div className="lg:col-span-6 w-full">
                <ProductInfo mobile={mobile} />
              </div>
            </motion.section>

            {/* ================= 3. SPECIFICATIONS TABLE ================= */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="pt-6 sm:pt-8"
            >
              <SpecificationTable mobile={mobile} />
            </motion.section>

            {/* ================= 4. RELATED PRODUCTS RECOMMENDATIONS ================= */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="pt-6 sm:pt-8 border-t border-dark-850"
            >
              <RelatedProducts currentMobileId={mobile.id} />
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileDetails;
