/**
 * Customer Account Dashboard Page
 * Module: pages/Account.jsx
 * Route: /account
 * 
 * Luxury customer portal providing profile overview, active session metrics,
 * security controls, and sign-out functionality.
 */

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  Sparkles,
  Smartphone,
  Calendar,
  Heart,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useUserAuth } from '../hooks/useUserAuth';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import SEO from '../components/common/SEO';

const Account = () => {
  const { user, isAuthenticated, isLoading, logout } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const displayName = user.fullName || 'Customer';
  const displayEmail = user.email || '';
  const displayPhone = user.phoneNumber || '+91 ••••• •••••';
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : '2026';

  return (
    <>
      <SEO
        title="My Account — MS Mobiles"
        description="Manage your MS Mobiles account, profile, security settings, and saved flagships."
        canonicalUrl="http://localhost:5173/account"
      />
      <div className="min-h-screen bg-dark-950 text-neutral-100 pt-28 pb-20">
        <Container size="7xl">
          {/* Header Banner */}
          <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-800 shadow-2xl mb-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-accent-600 to-sky-500 p-0.5 shadow-glow-md">
                  <div className="w-full h-full bg-dark-950 rounded-[22px] flex items-center justify-center text-accent-400 font-extrabold text-2xl sm:text-3xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {displayName}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-mono">
                    {displayEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link to="/mobiles">
                  <Button variant="secondary" size="md" icon={<Smartphone className="w-4 h-4" />}>
                    Browse Store
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="md"
                  onClick={handleLogout}
                  icon={<LogOut className="w-4 h-4" />}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Account Details & Future Extensions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Customer Profile Specs */}
            <div className="p-6 rounded-3xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-dark-800">
                <User className="w-5 h-5 text-accent-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Profile Information
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-500 block mb-0.5">Full Name</span>
                  <span className="font-semibold text-neutral-200">{displayName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Email Address</span>
                  <span className="font-semibold text-neutral-200">{displayEmail}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Phone Number</span>
                  <span className="font-semibold text-neutral-200">{displayPhone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Account Role</span>
                  <span className="font-mono text-accent-400 font-semibold">{user.role || 'ROLE_USER'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Member Since</span>
                  <span className="font-semibold text-neutral-200">{memberSince}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Security & Session Status */}
            <div className="p-6 rounded-3xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-dark-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Security & Session
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800 flex items-center justify-between">
                  <span>JWT Session State</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Stateless • Active
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800 flex items-center justify-between">
                  <span>Password Encryption</span>
                  <span className="font-mono text-neutral-300">BCrypt (Cost 10)</span>
                </div>
                <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800 flex items-center justify-between">
                  <span>Two-Factor Protection</span>
                  <span className="text-neutral-400">Standard Tier</span>
                </div>
              </div>
            </div>

            {/* Column 3: Upcoming Platform Features */}
            <div className="p-6 rounded-3xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-dark-800">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Platform Features
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span className="text-neutral-300">Saved Wishlist</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Ready</span>
                </div>

                <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-accent-400" />
                    <span className="text-neutral-300">Order Tracking</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Ready</span>
                </div>

                <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <span className="text-neutral-300">Concierge Inquiries</span>
                  </div>
                  <Link to="/contact" className="text-accent-400 hover:text-accent-300 flex items-center gap-1 font-semibold">
                    Contact <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Account;
