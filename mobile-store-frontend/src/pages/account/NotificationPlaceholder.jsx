/**
 * Customer Notifications Placeholder Page
 * Module: pages/account/NotificationPlaceholder.jsx
 * Route: /account/notifications
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ShieldCheck, Mail, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const NotificationPlaceholder = () => {
  return (
    <>
      <SEO
        title="Notifications & Alerts — MS Mobiles"
        description="Stay informed on orders, concierge inquiries, and product launch announcements."
        canonicalUrl="http://localhost:5173/account/notifications"
      />
      <div className="space-y-8">
        {/* Header Intro */}
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>Activity & Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Real-time notifications regarding concierge inquiries, stock alerts, and security events.
          </p>
        </div>

        {/* Teaser Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-8 sm:p-10 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-glow-sm">
            <Bell className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white">
              Notifications coming later
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We are engineering a centralized notification center to deliver immediate updates when new flagships arrive or our concierge answers your requests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <MessageSquare className="w-5 h-5 text-accent-400 mb-2" />
              <span className="text-xs font-bold text-white">Concierge Replies</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Direct answers from our team</span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <Sparkles className="w-5 h-5 text-amber-400 mb-2" />
              <span className="text-xs font-bold text-white">Exclusive Drops</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">VIP launch announcements</span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-850/50 border border-dark-800 flex flex-col items-center text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <span className="text-xs font-bold text-white">Security Alerts</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">Sign-in & credential notices</span>
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

export default NotificationPlaceholder;
