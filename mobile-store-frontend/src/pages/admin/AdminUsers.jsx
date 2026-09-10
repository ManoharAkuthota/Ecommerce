/**
 * Administrative Customer Directory & CRM Management
 * Module: pages/admin/AdminUsers.jsx
 * 
 * Provides store managers with a comprehensive customer registry:
 * - Real-time customer search by name, email, or telephone
 * - Activity segmentation (All Customers, Active Shoppers, VIP High-Spenders)
 * - Quick KPI cards (Total Users, Active Shoppers, Total Lifetime Spend, Verified Profiles)
 * - Connect Action Drawer with direct phone, email, and order history
 * - One-click Chat routing straight into the Admin Live Chat console
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  RotateCcw,
  Phone,
  Mail,
  MessageSquare,
  Package,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Building2,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import Spinner from '../../components/ui/Spinner';
import customerService from '../../services/customerService';
import CustomerConnectModal from '../../components/admin/CustomerConnectModal';

export const AdminUsers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'HIGH_SPENDER'

  // Connect Modal State
  const [selectedConnectCustomer, setSelectedConnectCustomer] = useState(null);

  // 1. Fetch Customers
  const fetchCustomers = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const data = await customerService.getAdminCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[AdminUsers] Error loading customers:', err);
      setError('Failed to load customers. Please check backend connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(false);
  }, [fetchCustomers]);

  // 2. Compute Segmented List
  const filteredCustomers = useMemo(() => {
    const cleanSearch = searchQuery.trim().toLowerCase();

    return customers.filter((c) => {
      // Tab filter
      if (activeTab === 'ACTIVE' && (!c.ordersCount || c.ordersCount === 0)) {
        return false;
      }
      if (activeTab === 'HIGH_SPENDER' && (!c.totalSpent || c.totalSpent < 50000)) {
        return false;
      }

      // Search filter
      if (!cleanSearch) return true;

      const nameMatch = c.fullName?.toLowerCase().includes(cleanSearch);
      const emailMatch = c.email?.toLowerCase().includes(cleanSearch);
      const phoneMatch = c.phoneNumber?.toLowerCase().includes(cleanSearch);
      const cityMatch = c.city?.toLowerCase().includes(cleanSearch);

      return nameMatch || emailMatch || phoneMatch || cityMatch;
    });
  }, [customers, searchQuery, activeTab]);

  // 3. Compute High-Level Metrics
  const metrics = useMemo(() => {
    const totalUsers = customers.length;
    const activeShoppers = customers.filter((c) => (c.ordersCount || 0) > 0).length;
    const verifiedAccounts = customers.filter((c) => c.emailVerified).length;
    const totalRevenue = customers.reduce((sum, c) => sum + (Number(c.totalSpent) || 0), 0);

    return { totalUsers, activeShoppers, verifiedAccounts, totalRevenue };
  }, [customers]);

  // 4. Handle Direct Live Chat Navigation
  const handleStartChat = (customer) => {
    if (!customer?.id) return;
    // Route to /admin/messages with query param and location state
    navigate(`/admin/messages?customerId=${customer.id}`, {
      state: {
        customer: {
          customerId: customer.id,
          customerName: customer.fullName,
          customerEmail: customer.email,
          customerPhone: customer.phoneNumber,
          customerAvatar: customer.profileImage,
        },
      },
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Customer Management
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Registered Customers & Shoppers
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Inspect customer activity, connect via phone/email, and initiate direct live chat conversations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchCustomers(true)}
            disabled={isRefreshing || isLoading}
            className="px-3.5 py-2 rounded-xl bg-dark-900 border border-dark-800 hover:bg-dark-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Customers */}
        <div className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics.totalUsers}
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Registered user accounts
          </p>
        </div>

        {/* Active Shoppers */}
        <div className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Active Shoppers
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics.activeShoppers}
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Placed ≥ 1 smartphone order
          </p>
        </div>

        {/* Total Customer Revenue */}
        <div className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Total Lifetime Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Aggregated gross purchases
          </p>
        </div>

        {/* Verified Accounts */}
        <div className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Verified Profiles
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics.verifiedAccounts}
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Confirmed identity accounts
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-dark-900/80 border border-dark-800/80 p-3 rounded-2xl backdrop-blur-sm">
        {/* Filter Segment Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: `All (${customers.length})` },
            { key: 'ACTIVE', label: `Active Shoppers (${metrics.activeShoppers})` },
            { key: 'HIGH_SPENDER', label: 'VIP Spenders (≥ ₹50k)' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-accent-600 text-white shadow-glow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, city..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-dark-850 border border-dark-700/80 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-accent-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Customers List Content */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3 bg-dark-900/40 border border-dark-800 rounded-3xl">
          <div className="w-9 h-9 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Loading registered customer directory...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-dark-900/40 border border-rose-500/30 rounded-3xl space-y-3">
          <p className="text-sm text-rose-400 font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => fetchCustomers(false)}
            className="px-4 py-2 rounded-xl bg-dark-800 text-white text-xs font-semibold hover:bg-dark-700"
          >
            Retry Loading
          </button>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="p-16 text-center bg-dark-900/40 border border-dark-800 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center text-neutral-500 mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Customers Match Filter</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery ? `No results found for "${searchQuery}".` : 'No registered customer accounts yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (lg screens) */}
          <div className="hidden lg:block bg-dark-900/80 border border-dark-800/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-dark-800 bg-dark-850/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">Customer Profile</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-6 text-right">Direct Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/60">
                {filteredCustomers.map((customer) => {
                  const ordersCount = customer.ordersCount || 0;
                  const totalSpent = customer.totalSpent || 0;

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-dark-850/40 transition-colors group"
                    >
                      {/* Customer Profile Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0 overflow-hidden">
                            {customer.profileImage ? (
                              <img
                                src={customer.profileImage}
                                alt={customer.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>
                                {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'U'}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs group-hover:text-accent-300 transition-colors truncate">
                                {customer.fullName}
                              </span>
                              {customer.emailVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Verified Account" />
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-500 block">
                              Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info Column */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                            <span className="truncate max-w-[170px]">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                            <Phone className="w-3 h-3 text-neutral-500 shrink-0" />
                            <span>{customer.phoneNumber || 'No phone'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Orders Count Column */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            ordersCount > 0
                              ? 'bg-accent-500/10 text-accent-400 border-accent-500/30'
                              : 'bg-dark-800 text-neutral-500 border-dark-700'
                          }`}
                        >
                          {ordersCount} {ordersCount === 1 ? 'order' : 'orders'}
                        </span>
                      </td>

                      {/* Lifetime Spend Column */}
                      <td className="py-4 px-4 text-right">
                        <span className="font-extrabold text-white text-xs block">
                          ₹{Number(totalSpent).toLocaleString('en-IN')}
                        </span>
                        {ordersCount > 0 && (
                          <span className="text-[10px] text-neutral-500 block">
                            avg ₹{Math.round(totalSpent / ordersCount).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Last Activity Column */}
                      <td className="py-4 px-4">
                        {customer.lastOrderDate ? (
                          <div>
                            <span className="text-neutral-300 block">
                              {new Date(customer.lastOrderDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-accent-400 font-semibold block">
                              Status: {customer.lastOrderStatus || 'COMPLETED'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">No purchases yet</span>
                        )}
                      </td>

                      {/* Action Buttons Column */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1. Connect Option Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedConnectCustomer(customer)}
                            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-neutral-200 hover:text-white border border-dark-700/80 hover:border-dark-600 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                            title="Open Customer Connect Profile"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Connect</span>
                          </button>

                          {/* 2. Chat Option Button */}
                          <button
                            type="button"
                            onClick={() => handleStartChat(customer)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-accent-600 to-indigo-600 hover:from-accent-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-sm"
                            title="Start Live Chat with this Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (<lg screens) */}
          <div className="lg:hidden space-y-3">
            {filteredCustomers.map((customer) => {
              const ordersCount = customer.ordersCount || 0;
              const totalSpent = customer.totalSpent || 0;

              return (
                <div
                  key={customer.id}
                  className="bg-dark-900 border border-dark-800 rounded-2xl p-4 space-y-3.5 shadow-md"
                >
                  {/* Top Customer Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-accent-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 overflow-hidden">
                        {customer.profileImage ? (
                          <img
                            src={customer.profileImage}
                            alt={customer.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-white text-sm truncate">
                            {customer.fullName}
                          </h3>
                          {customer.emailVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 block truncate">
                          {customer.email}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                        ordersCount > 0
                          ? 'bg-accent-500/10 text-accent-400 border-accent-500/30'
                          : 'bg-dark-800 text-neutral-500 border-dark-700'
                      }`}
                    >
                      {ordersCount} {ordersCount === 1 ? 'order' : 'orders'}
                    </span>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-dark-850/80 border border-dark-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-semibold block uppercase">
                        Lifetime Spend
                      </span>
                      <span className="font-extrabold text-accent-400 mt-0.5 block">
                        ₹{Number(totalSpent).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 font-semibold block uppercase">
                        Contact Number
                      </span>
                      <span className="text-neutral-300 truncate mt-0.5 block">
                        {customer.phoneNumber || 'Not provided'}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Connect Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedConnectCustomer(customer)}
                      className="py-2 px-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-neutral-200 border border-dark-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Connect</span>
                    </button>

                    {/* Chat Option */}
                    <button
                      type="button"
                      onClick={() => handleStartChat(customer)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-accent-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-glow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Customer Connect Detail Modal */}
      <CustomerConnectModal
        isOpen={Boolean(selectedConnectCustomer)}
        onClose={() => setSelectedConnectCustomer(null)}
        customer={selectedConnectCustomer}
        onStartChat={handleStartChat}
      />
    </div>
  );
};

export default AdminUsers;
