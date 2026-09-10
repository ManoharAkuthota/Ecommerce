/**
 * Mobiles Management Placeholder Page
 * Module: pages/admin/MobilesPlaceholder.jsx
 * 
 * Standalone placeholder view for upcoming Step 28 Mobile Management module.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Sparkles, UploadCloud, Layers, Eye, ShieldCheck } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { fadeInUp, scaleIn } from '../../utils/animations';

const MobilesPlaceholder = ({
  title = 'Mobile Management coming in the next step.',
  subtitle = 'Mobile Device Catalog Management',
  description = 'The backend REST endpoints, JPA repositories, Cloudinary pipelines, and JWT authorization are fully prepared.',
  badge = 'Next Feature Module',
}) => {
  const upcomingFeatures = [
    {
      icon: <UploadCloud className="w-4 h-4 text-accent-400" />,
      title: 'Cloudinary Multi-Image Upload',
      description: 'Upload 1–5 flagship phone shots with drag-and-drop and automatic order assignment.',
    },
    {
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      title: 'Inventory & Stock Availability',
      description: 'Toggle In Stock, Limited Stock, and Out of Stock states instantly with optimistic updates.',
    },
    {
      icon: <Eye className="w-4 h-4 text-purple-400" />,
      title: 'Catalog Visibility Controls',
      description: 'Hide or publish devices on the public storefront without deleting historical data.',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      title: 'Protected REST Mutations',
      description: 'Fully authenticated via Spring Boot JWT Bearer token authorization pipeline.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          <span>{badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {subtitle}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
          Administer flagship smartphone inventory, Cloudinary media assets, pricing tiers, and public store availability.
        </p>
      </motion.div>

      {/* Main Luxury Announcement Card */}
      <motion.div variants={scaleIn} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <Card glass={true} className="p-8 sm:p-12 border-dashed border-dark-800 text-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            {/* Center Device Icon Badge */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-accent-600 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-glow-sm">
              <Smartphone className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {description}
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

export default MobilesPlaceholder;
