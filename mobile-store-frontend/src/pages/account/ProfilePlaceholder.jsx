/**
 * Customer Profile Placeholder Page
 * Module: pages/account/ProfilePlaceholder.jsx
 * Route: /account/profile
 */

import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Mail, Phone, MapPin, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import SEO from '../../components/common/SEO';

const ProfilePlaceholder = () => {
  const { user } = useUserAuth();

  return (
    <>
      <SEO
        title="Personal Profile — MS Mobiles"
        description="View and manage your personal profile, credentials, and contact preferences."
        canonicalUrl="http://localhost:5173/account/profile"
      />
      <div className="space-y-8">
        {/* Header Intro */}
        <div>
          <div className="flex items-center gap-2 text-accent-400 text-xs font-bold uppercase tracking-widest mb-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Profile Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personal Information
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Manage your personal contact details, delivery addresses, and account security.
          </p>
        </div>

        {/* Current Info Card */}
        <div className="rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-dark-800/80 pb-4">
            <h2 className="text-base font-bold text-white">Current Account Details</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Customer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-dark-850/60 border border-dark-800">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Full Name</span>
              <p className="text-sm font-bold text-white mt-1">{user?.fullName || 'Customer'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/60 border border-dark-800">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Email Address</span>
              <p className="text-sm font-bold text-white mt-1 font-mono">{user?.email || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/60 border border-dark-800">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Phone Number</span>
              <p className="text-sm font-bold text-white mt-1 font-mono">{user?.phoneNumber || 'Not provided yet'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/60 border border-dark-800">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Default Address</span>
              <p className="text-sm font-bold text-neutral-400 mt-1">Pending setup</p>
            </div>
          </div>
        </div>

        {/* Feature Roadmap Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-dashed border-accent-500/30 bg-accent-950/10 p-6 sm:p-8 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Profile Management coming next</h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2">
            In the upcoming release, you will be able to upload custom avatars, edit contact numbers, save multiple shipping addresses, and manage email notification preferences.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/account"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-white border border-dark-700 transition-colors"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePlaceholder;
