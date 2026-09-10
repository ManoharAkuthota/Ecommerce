/**
 * Reviews Management Placeholder Page
 * Module: pages/admin/ReviewsPlaceholder.jsx
 * 
 * Standalone placeholder view for upcoming Review Management & Moderation module.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, CheckCircle, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { Card } from '../../components/ui';
import { fadeInUp, scaleIn } from '../../utils/animations';

const ReviewsPlaceholder = () => {
  const upcomingFeatures = [
    {
      icon: <Star className="w-4 h-4 text-amber-400" />,
      title: 'Customer Testimonial Auditing',
      description: 'Audit verified buyer ratings and reviews before displaying on homepage marquees.',
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      title: 'Verified Buyer Badges',
      description: 'Automatically associate customer reviews with sealed smartphone purchase records.',
    },
    {
      icon: <Filter className="w-4 h-4 text-accent-400" />,
      title: 'Rating Filters & Search',
      description: 'Filter feedback by rating thresholds (1–5 stars) and full-text testimonial queries.',
    },
    {
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      title: 'Moderation & Deletion',
      description: 'Permanently remove spam or abusive reviews via protected DELETE /api/reviews/{id}.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Customer Stories Module</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Customer Review Moderation & Management
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
          Curate verified customer experiences, inspect average satisfaction scores, and moderate public feedback.
        </p>
      </motion.div>

      {/* Main Luxury Announcement Card */}
      <motion.div variants={scaleIn} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <Card glass={true} className="p-8 sm:p-12 border-dashed border-dark-800 text-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            {/* Center Icon Badge */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-glow-sm">
              <MessageSquare className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Review Management coming in the next step.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                The Spring Boot Review APIs (`GET /api/reviews`, `DELETE /api/reviews/{id}`, `GET /api/reviews/average`)
                and JPA repository are already implemented and protected with Bearer authorization.
              </p>
            </div>

            {/* Upcoming Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
              {upcomingFeatures.map((feat) => (
                <div
                  key={feat.title}
                  className="p-4 rounded-2xl bg-dark-950/70 border border-dark-800/80 space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    {feat.icon}
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReviewsPlaceholder;
