/**
 * ReviewMarquee Component
 * Module: components/home/ReviewMarquee.jsx
 *
 * Continuous horizontal marquee ticker for verified customer testimonials:
 * - Fetches top customer reviews directly from Spring Boot GET /api/reviews/latest via homeService
 * - Fallback curated testimonials if API is empty or loading
 * - SectionHeading with luxury pill badge and trust metrics
 * - Smooth GPU-accelerated CSS marquee with hover-pause
 * - Left/right edge gradient fade masks
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, Star, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { homeService } from '../../services/homeService';
import ReviewCard, { ReviewSkeleton } from './ReviewCard';
import SectionHeading from './SectionHeading';

// Luxury fallback testimonials ensuring marquee is always visually rich
const FALLBACK_REVIEWS = [
  {
    id: 'f1',
    customerName: 'Marcus Vance',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    purchasedPhone: 'iPhone 16 Pro Max',
    rating: 5,
    reviewText: 'Flawless unboxing experience! The device arrived brand new in original sealed box with valid AppleCare warranty. MS Mobiles is unmatched.',
    createdAt: '2026-08-28T10:00:00',
  },
  {
    id: 'f2',
    customerName: 'Elena Rostova',
    customerImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    purchasedPhone: 'Galaxy S25 Ultra',
    rating: 5,
    reviewText: 'Ordered the 512GB Titanium Gray variant. Delivered in 24 hours with express tracking. The Galaxy AI features are incredible.',
    createdAt: '2026-08-30T14:30:00',
  },
  {
    id: 'f3',
    customerName: 'Devin Chen',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    purchasedPhone: 'Nothing Phone (2)',
    rating: 5,
    reviewText: 'The Glyph interface is even cooler in person. Top notch support from MS Mobiles when verifying IMEI numbers. 10/10 store.',
    createdAt: '2026-09-02T11:15:00',
  },
  {
    id: 'f4',
    customerName: 'Aria Montgomery',
    customerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    purchasedPhone: 'OnePlus 13',
    rating: 5,
    reviewText: 'Fastest charging smartphone I have ever owned. Truly authentic product and best price found anywhere online.',
    createdAt: '2026-09-03T16:45:00',
  },
  {
    id: 'f5',
    customerName: 'Julian Sterling',
    customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    purchasedPhone: 'Pixel 9 Pro XL',
    rating: 5,
    reviewText: 'Camera quality is breathtaking. Gemini AI assistant is super helpful. Outstanding white-glove customer care from MS Mobiles.',
    createdAt: '2026-09-05T09:20:00',
  },
  {
    id: 'f6',
    customerName: 'Sophia Lin',
    customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80',
    purchasedPhone: 'Xiaomi 14 Ultra',
    rating: 5,
    reviewText: 'The Leica quad camera setup is a true DSLR replacement. Device was pristine with fast courier dispatch.',
    createdAt: '2026-09-06T18:00:00',
  },
];

export const ReviewMarquee = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const data = await homeService.getLatestReviews();
        if (Array.isArray(data) && data.length > 0) {
          // If we have API reviews, combine with fallback if less than 4 for a full smooth track
          if (data.length < 4) {
            setReviews([...data, ...FALLBACK_REVIEWS]);
          } else {
            setReviews(data);
          }
        } else {
          setReviews(FALLBACK_REVIEWS);
        }
      } catch (err) {
        console.warn('Using fallback reviews due to API error:', err);
        setReviews(FALLBACK_REVIEWS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Triple items array for flawless continuous loop
  const marqueeItems = [...reviews, ...reviews, ...reviews];

  return (
    <section id="customer-reviews-section" className="relative w-full py-20 sm:py-28 overflow-hidden select-none border-t border-dark-850 bg-dark-950/40">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[22rem] bg-accent-500/6 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 text-center">
        {/* Section Heading */}
        <SectionHeading
          badge="Verified Testimonials"
          badgeIcon={MessageSquareQuote}
          title="What Our Customers Say"
          subtitle="Discover how smartphone enthusiasts rate their shopping experience, genuine device quality, fast dispatch, and dedicated support."
          alignment="center"
        />

        {/* Trust Badges Bar */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-white text-xs">4.9 / 5.0</span>
            </div>
            <span className="text-neutral-500 font-mono">Average Rating</span>
          </div>
          <span className="hidden sm:inline text-dark-700">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
            <span>
              <strong className="text-white font-semibold">100% Genuine</strong> Sealed Flagships
            </span>
          </div>
          <span className="hidden sm:inline text-dark-700">•</span>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-accent-400" />
            <span>
              <strong className="text-white font-semibold">24-Hour</strong> Express Insured Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Marquee viewport container */}
      <div className="relative w-full overflow-hidden">
        {/* Left Edge Fog Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-dark-950 via-dark-950/85 to-transparent z-20" />

        {/* Right Edge Fog Gradient Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-dark-950 via-dark-950/85 to-transparent z-20" />

        {/* Scrolling Track */}
        {isLoading ? (
          <div className="flex w-max gap-5 sm:gap-6 py-4 px-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, index) => (
              <ReviewSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex w-max gap-5 sm:gap-6 animate-marquee hover:[animation-play-state:paused] py-4 px-4">
            {marqueeItems.map((review, idx) => (
              <ReviewCard key={`${review.id || idx}-${idx}`} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewMarquee;
