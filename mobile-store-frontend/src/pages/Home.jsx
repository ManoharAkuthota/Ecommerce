/**
 * Storefront Home Page Component
 * Module: pages/Home.jsx
 *
 * Luxury public homepage for MS Mobiles in exact sequence:
 * 1. Navbar (rendered automatically via MainLayout shell)
 * 2. HeroSection (headline, subheadline, dual CTAs, glowing mockups)
 * 3. BrandMarquee (Apple, Samsung, OnePlus, Nothing, Xiaomi, etc. with hover-pause)
 * 4. FeaturedMobiles (top 8 latest flagship phones from GET /api/mobiles/latest)
 * 5. ReviewMarquee (verified customer reviews from GET /api/reviews/latest)
 * 6. Footer (rendered automatically via MainLayout shell)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useUserAuth } from '../hooks/useUserAuth';
import SEO from '../components/common/SEO';
import HeroSection from '../components/home/HeroSection';
import BrandMarquee from '../components/home/BrandMarquee';
import FeaturedMobiles from '../components/home/FeaturedMobiles';
import ReviewMarquee from '../components/home/ReviewMarquee';

const Home = () => {
  const { isAuthenticated } = useUserAuth();

  return (
    <div className="relative overflow-hidden w-full">
      <SEO
        title="MS Mobiles | Premium Smartphones & Exceptional Concierge"
        description="Discover flagship smartphones from Apple, Samsung, OnePlus, Nothing, Xiaomi, and Google at MS Mobiles. Official warranty, verified specs, and premium service."
      />
      {/* 1. Flagship Hero Section */}
      <HeroSection />

      {/* New Customer Welcome Banner (Visible for guests / unregistered visitors) */}
      {!isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12 relative z-20">
          <div className="rounded-2xl bg-gradient-to-r from-accent-600/20 via-indigo-600/20 to-sky-600/15 border border-accent-500/30 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-accent-500/20 border border-accent-500/30 text-accent-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs sm:text-sm font-black text-white">
                    New to MS Mobiles?
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-accent-500 text-white shadow-xs">
                    Welcome Offer
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Create a free customer account to claim ₹1,000 off your first flagship phone, track live deliveries, and save favorite specs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs shadow-glow-sm transition-all"
              >
                Create Account (30s)
              </Link>
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-neutral-300 hover:text-white font-medium text-xs transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Infinite Brand Marquee Section */}
      <BrandMarquee />

      {/* 3. Featured Smartphones Section (Top 8 Latest Flagships from Backend) */}
      <div id="featured-mobiles-section" className="scroll-mt-16">
        <span id="features-section" className="sr-only">Featured Smartphones</span>
        <FeaturedMobiles />
      </div>

      {/* 4. Customer Reviews Section (Infinite Testimonials Marquee from Backend) */}
      <div id="customer-reviews-section" className="scroll-mt-16">
        <ReviewMarquee />
      </div>
    </div>
  );
};

export default Home;
