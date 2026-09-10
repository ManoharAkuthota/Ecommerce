/**
 * Customer Account Landing Dashboard Page
 * Module: pages/account/Dashboard.jsx
 * Route: /account
 * 
 * Luxury landing experience featuring:
 * - Welcome greeting banner with customer name
 * - Profile summary card integration
 * - Interactive metric statistics cards
 * - Quick Action cards with reactive hover micro-interactions
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Clock,
  Bell,
  MessageSquare,
  Smartphone,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  Package,
  Truck,
} from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useWishlist } from '../../hooks/useWishlist';
import orderService from '../../services/orderService';
import UserProfileCard from '../../components/account/UserProfileCard';
import DashboardStatCard from '../../components/account/DashboardStatCard';
import DashboardLiveOrderTracking from '../../components/account/DashboardLiveOrderTracking';
import SEO from '../../components/common/SEO';

const QUICK_ACTIONS = [
  {
    title: 'Track Orders & Invoices',
    description: 'Track ongoing courier shipments, download GST invoices, and review order history.',
    icon: Package,
    to: '/account/orders',
    gradient: 'from-blue-600 to-indigo-600',
    color: 'text-blue-400',
  },
  {
    title: 'Browse Mobiles',
    description: 'Explore the full flagship smartphone collection with interactive filters.',
    icon: Smartphone,
    to: '/mobiles',
    gradient: 'from-accent-600 to-sky-500',
    color: 'text-accent-400',
  },
  {
    title: 'View Wishlist',
    description: 'Review your saved flagships, price drop monitors, and wishlisted models.',
    icon: Heart,
    to: '/account/wishlist',
    gradient: 'from-rose-500 to-pink-500',
    color: 'text-rose-400',
  },
  {
    title: 'Update Profile',
    description: 'Manage personal details, verified phone numbers, and delivery addresses.',
    icon: User,
    to: '/account/profile',
    gradient: 'from-emerald-500 to-teal-500',
    color: 'text-emerald-400',
  },
  {
    title: 'Live Concierge Chat',
    description: 'Chat directly with store managers for real-time stock and inquiry replies.',
    icon: MessageSquare,
    to: '/account/inquiries',
    gradient: 'from-purple-500 to-indigo-500',
    color: 'text-purple-400',
  },
];

const Dashboard = () => {
  const { user } = useUserAuth();
  const { count: wishlistCount } = useWishlist();
  const [ordersSummary, setOrdersSummary] = useState({ total: 0, active: 0 });

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Valued Customer';

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const active = list.filter((o) =>
          ['CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.orderStatus)
        ).length;
        setOrdersSummary({ total: list.length, active });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO
        title="Account Dashboard — MS Mobiles"
        description="Manage your MS Mobiles account, profile, saved smartphones, and preferences."
        canonicalUrl="http://localhost:5173/account"
      />

      <div className="space-y-8 pb-10">
        {/* 1. Welcome Greeting Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-800 p-6 sm:p-8 shadow-xl"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-accent-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>MS Mobiles Customer Portal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {firstName}.
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Manage your profile, saved mobiles, notifications, and account preferences.
            </p>
          </div>
        </motion.div>

        {/* 2. Live Order Tracking Telemetry (Renders automatically when customer has orders) */}
        <DashboardLiveOrderTracking />

        {/* 3. Customer Profile Summary Card */}
        <UserProfileCard />

        {/* 4. Key Account Statistics Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
              Overview & Activity
            </h2>
            <span className="text-xs text-neutral-500 font-mono">Live Session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <DashboardStatCard
              title="My Orders"
              value={ordersSummary.total}
              subtitle={ordersSummary.active > 0 ? `${ordersSummary.active} in-transit` : ordersSummary.total > 0 ? 'All delivered' : '0 orders placed'}
              icon={Package}
              badge={ordersSummary.active > 0 ? `${ordersSummary.active} Active` : 'Orders'}
              to="/account/orders"
              iconGradient="from-blue-500/20 to-indigo-500/20"
              iconColor="text-blue-400"
              delay={0.02}
            />

            <DashboardStatCard
              title="Wishlist"
              value={wishlistCount}
              subtitle={wishlistCount === 1 ? '1 saved flagship' : `${wishlistCount} saved flagships`}
              icon={Heart}
              badge={wishlistCount > 0 ? `${wishlistCount} items` : 'Empty'}
              to="/account/wishlist"
              iconGradient="from-rose-500/20 to-pink-500/20"
              iconColor="text-rose-400"
              delay={0.05}
            />

            <DashboardStatCard
              title="Recently Viewed"
              value="History"
              subtitle="Flagships inspected"
              icon={Clock}
              badge="Active"
              to="/account/recent"
              iconGradient="from-sky-500/20 to-blue-500/20"
              iconColor="text-sky-400"
              delay={0.1}
            />

            <DashboardStatCard
              title="Notifications"
              value="0"
              subtitle="Unread system alerts"
              icon={Bell}
              badge="Latest"
              to="/account/notifications"
              iconGradient="from-amber-500/20 to-yellow-500/20"
              iconColor="text-amber-400"
              delay={0.15}
            />

            <DashboardStatCard
              title="Live Chat"
              value="Online"
              subtitle="Direct store messaging"
              icon={MessageSquare}
              badge="Active"
              to="/account/inquiries"
              iconGradient="from-purple-500/20 to-indigo-500/20"
              iconColor="text-purple-400"
              delay={0.2}
            />
          </div>
        </div>

        {/* 4. Quick Actions Grid */}
        <div className="space-y-4 pt-2">
          <div className="px-1">
            <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
              Quick Actions
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Jump directly into shopping or manage your account configuration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_ACTIONS.map((action, idx) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                >
                  <Link
                    to={action.to}
                    className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-b from-dark-900/80 to-dark-950/80 border border-dark-800/80 hover:border-dark-750 backdrop-blur-xl group shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${action.gradient} p-0.5 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                          <Icon className={`w-6 h-6 ${action.color}`} />
                        </div>
                      </div>

                      <div className="space-y-1 min-w-0">
                        <h3 className="text-sm font-bold text-white group-hover:text-accent-300 transition-colors truncate">
                          {action.title}
                        </h3>
                        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-dark-850 flex items-center justify-center border border-dark-800 text-neutral-500 group-hover:text-accent-400 group-hover:border-accent-500/30 group-hover:translate-x-1 transition-all flex-shrink-0 ml-3">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
