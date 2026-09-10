import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Smartphone } from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import MobileCard, { MobileCardSkeleton } from './MobileCard';
import { FEATURED_MOBILES } from '../data/featuredMobiles';

/**
 * FeaturedMobiles Component
 * Renders the latest 8 flagship devices in a 4-column responsive grid
 * with staggered motion animations, loading skeleton fallback, and empty state.
 */
const FeaturedMobiles = ({
  mobiles = FEATURED_MOBILES,
  isLoading = false,
}) => {
  // Container & Stagger Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden select-none">
      {/* Subtle Ambient Glow Effect */}
      <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-accent-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-600/6 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Container size="7xl">
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* 1. Premium Label */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-fit mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-glow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>Latest Collection</span>
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
            Featured Smartphones
          </motion.h2>

          {/* 3. Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="mt-4 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed"
          >
            Explore our latest flagship smartphones featuring cutting-edge technology, powerful performance, premium cameras, and official warranty.
          </motion.p>
        </div>

        {/* ================= 4. RESPONSIVE PRODUCT GRID ================= */}
        {isLoading ? (
          // Loading Skeleton State (8 Cards)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <MobileCardSkeleton key={index} />
            ))}
          </div>
        ) : mobiles && mobiles.length > 0 ? (
          // Loaded Cards Grid
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {mobiles.map((mobile) => (
              <motion.div key={mobile.id} variants={itemVariants}>
                <MobileCard mobile={mobile} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty State Fallback
          <EmptyState
            icon={<Smartphone className="w-10 h-10 text-accent-400" />}
            title="No Featured Mobiles Available"
            description="Our curators are updating the latest catalog. Please check back shortly for new flagship smartphone arrivals."
            action={
              <Link to="/mobiles">
                <Button variant="secondary" size="md">
                  Explore Full Catalog
                </Button>
              </Link>
            }
          />
        )}

        {/* ================= 5. VIEW ALL BUTTON ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          className="mt-14 sm:mt-16 text-center"
        >
          <Link to="/mobiles">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="shadow-glow-md"
            >
              View All Mobiles
            </Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};

export default FeaturedMobiles;
