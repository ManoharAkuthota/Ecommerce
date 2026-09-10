/**
 * Customer Profile Summary Card Component
 * Module: components/account/UserProfileCard.jsx
 * 
 * Glassmorphic profile card displaying customer identity, contact details,
 * membership status, and quick link to full profile settings.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';

const UserProfileCard = () => {
  const { user } = useUserAuth();

  const displayName = user?.fullName || 'Valued Customer';
  const displayEmail = user?.email || 'user@example.com';
  const displayPhone = user?.phoneNumber || '+91 ••••• •••••';
  const initial = displayName.charAt(0).toUpperCase();

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : '2026';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl group hover:border-dark-750 transition-colors"
    >
      {/* Ambient background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent-600/15 transition-all duration-500" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar with Gradient Ring */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-accent-600 via-sky-500 to-indigo-500 p-0.5 shadow-glow-sm">
              <div className="w-full h-full bg-dark-950 rounded-[22px] overflow-hidden flex items-center justify-center text-accent-400 font-extrabold text-2xl sm:text-3xl select-none">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                ) : (
                  initial
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-dark-900 rounded-full border border-dark-800">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-dark-900 shadow-sm" title="Account Active" />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-600/20 text-accent-300 border border-accent-500/30">
                <Sparkles className="w-2.5 h-2.5 text-accent-400" />
                Verified
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                {displayEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                {displayPhone}
              </span>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-neutral-500">
              <Calendar className="w-3.5 h-3.5 text-neutral-600" />
              <span>Member since {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action to Profile */}
        <div className="w-full sm:w-auto flex items-center justify-end">
          <Link
            to="/account/profile"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-white border border-dark-750 hover:border-accent-500/40 shadow-sm transition-all group/btn select-none"
          >
            <span>Manage Profile</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;
