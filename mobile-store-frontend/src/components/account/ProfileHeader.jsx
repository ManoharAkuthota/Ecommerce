/**
 * Customer Profile Header Component
 * Module: components/account/ProfileHeader.jsx
 * 
 * Top section displaying page title, subtitle, and smooth entrance animation.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

const ProfileHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-1.5 select-none"
    >
      <div className="flex items-center gap-2 text-accent-400 text-xs font-bold uppercase tracking-widest">
        <User className="w-3.5 h-3.5" />
        <span>Personal Settings</span>
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
        My Profile
      </h1>

      <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
        Manage your personal information and account details.
      </p>
    </motion.div>
  );
};

export default ProfileHeader;
