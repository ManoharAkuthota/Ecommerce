import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, MessageSquare, Star } from 'lucide-react';
import Container from './ui/Container';
import EmptyState from './ui/EmptyState';
import ReviewCard, { ReviewSkeleton } from './ReviewCard';
import { CUSTOMER_REVIEWS } from '../data/reviews';

/**
 * CustomerReviews Component
 * High-end infinite scrolling customer testimonials section inspired by Apple, Samsung, Nothing, Tesla, and Stripe.
 *
 * Props:
 * - reviews: Array of review objects (defaults to CUSTOMER_REVIEWS)
 * - isLoading: Boolean flag for loading state (prepares for future Spring Boot GET /api/reviews integration)
 */
const CustomerReviews = ({
  reviews = CUSTOMER_REVIEWS,
  isLoading = false,
}) => {
  // Duplicate reviews array for true 0-gap seamless continuous looping
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden select-none border-t border-b border-dark-850/80 bg-dark-950/40">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[22rem] bg-accent-500/6 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* ================= SECTION HEADER ================= */}
      <Container size="7xl" className="mb-12 sm:mb-16 text-center">
        {/* 1. Premium Label */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-fit mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-glow-sm">
            <MessageSquareQuote className="w-3.5 h-3.5 text-accent-400" />
            <span>Customer Stories</span>
          </div>
        </motion.div>

        {/* 2. Large Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
        >
          Trusted by Smartphone Enthusiasts
        </motion.h2>

        {/* 3. Elegant Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          See what our customers say about their shopping experience, genuine products, fast delivery, and excellent after-sales support.
        </motion.p>

        {/* Trust Badges Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.28, ease: 'easeOut' }}
          className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-400"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-white text-sm">4.9 / 5</span>
            </div>
            <span className="text-neutral-500">Average Rating</span>
          </div>
          <span className="hidden sm:inline text-dark-700">•</span>
          <div>
            <span className="font-bold text-white">100% Genuine</span> Sealed Products
          </div>
          <span className="hidden sm:inline text-dark-700">•</span>
          <div>
            <span className="font-bold text-white">24-Hour</span> Express Dispatch
          </div>
        </motion.div>
      </Container>

      {/* ================= 4. INFINITE HORIZONTAL REVIEW CAROUSEL ================= */}
      {isLoading ? (
        // Loading Skeletons
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max gap-5 sm:gap-6 py-4 px-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, index) => (
              <ReviewSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : reviews && reviews.length > 0 ? (
        // Infinite Marquee Track
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="relative w-full overflow-hidden"
        >
          {/* Left Edge Fog Gradient Fade Mask */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent z-20"
            aria-hidden="true"
          />

          {/* Right Edge Fog Gradient Fade Mask */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-dark-950 via-dark-950/80 to-transparent z-20"
            aria-hidden="true"
          />

          {/* Seamless Infinite Marquee Track with Pause-on-Hover */}
          <div
            className="flex w-max gap-5 sm:gap-6 animate-marquee [animation-duration:55s] hover:[animation-play-state:paused] py-4 px-4 transform-gpu will-change-transform"
          >
            {marqueeReviews.map((review, idx) => (
              <ReviewCard key={`${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </motion.div>
      ) : (
        // Empty State Fallback (Future API empty result)
        <Container size="7xl">
          <EmptyState
            icon={<MessageSquare className="w-10 h-10 text-accent-400" />}
            title="No Customer Reviews Yet"
            description="Be the first to share your experience with our flagship smartphone collection."
          />
        </Container>
      )}
    </section>
  );
};

export default CustomerReviews;
