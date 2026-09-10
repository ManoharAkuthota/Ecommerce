/**
 * Customer Settings Placeholder Page
 * Module: pages/account/SettingsPlaceholder.jsx
 * Route: /account/settings
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Lock, KeyRound, Smartphone, BellRing, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const SettingsPlaceholder = () => {
  return (
    <>
      <SEO
        title="Account Settings — MS Mobiles"
        description="Configure account preferences, password credentials, and privacy options."
        canonicalUrl="http://localhost:5173/account/settings"
      />
      <div className="space-y-8">
        {/* Header Intro */}
        <div>
          <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1.5">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Configure security authenticators, update passwords, and control communication channels.
          </p>
        </div>

        {/* Teaser Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-8 sm:p-10 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-neutral-700/30 to-neutral-800/30 border border-neutral-700/50 text-neutral-300 flex items-center justify-center mx-auto shadow-glow-sm">
            <Settings className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white">
              Settings coming later
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Granular privacy toggles, password modification, two-factor authentication, and active session revocations will be configurable from this control center.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <KeyRound className="w-5 h-5 text-accent-400 mb-2" />
              <span className="text-xs font-bold text-white">Password Change</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">BCrypt credential update</span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <Lock className="w-5 h-5 text-indigo-400 mb-2" />
              <span className="text-xs font-bold text-white">Two-Factor Auth</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">TOTP authenticator app</span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <BellRing className="w-5 h-5 text-rose-400 mb-2" />
              <span className="text-xs font-bold text-white">Email Subscriptions</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Marketing & alert filters</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/account"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-dark-800 hover:bg-dark-750 text-white border border-dark-700 transition-all select-none"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SettingsPlaceholder;
