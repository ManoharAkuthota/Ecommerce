/**
 * Customer Personal Information Form Component
 * Module: components/account/ProfileForm.jsx
 * 
 * Luxury form fields for editing customer full name and phone number,
 * with read-only badges for email and membership date, plus live inline validation.
 */

import React from 'react';
import { User, Phone, Mail, Calendar, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const ProfileForm = ({
  formData,
  onChange,
  errors = {},
  disabled = false,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-dark-900/90 to-dark-950/90 border border-dark-800/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-6">
      <div className="border-b border-dark-800/80 pb-4">
        <h2 className="text-base font-bold text-white tracking-tight">Personal Information</h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Update your contact information for order deliveries and concierge communications.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {/* 1. Full Name (Editable) */}
        <div className="space-y-1.5">
          <label
            htmlFor="profile-fullName"
            className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider"
          >
            Full Name <span className="text-accent-400">*</span>
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <User className="w-4 h-4" />
            </div>

            <input
              id="profile-fullName"
              name="fullName"
              type="text"
              required
              disabled={disabled}
              value={formData.fullName || ''}
              onChange={handleChange}
              placeholder="e.g. Johnathan Doe"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-dark-950/80 text-white placeholder-neutral-500 border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:opacity-50 ${
                errors.fullName
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-dark-750 hover:border-dark-700 focus:border-accent-500'
              }`}
            />
          </div>

          {errors.fullName && (
            <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* 2. Phone Number (Editable) */}
        <div className="space-y-1.5">
          <label
            htmlFor="profile-phoneNumber"
            className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider"
          >
            Phone Number <span className="text-accent-400">*</span>
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <Phone className="w-4 h-4" />
            </div>

            <input
              id="profile-phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              disabled={disabled}
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-dark-950/80 text-white placeholder-neutral-500 border font-mono transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:opacity-50 ${
                errors.phoneNumber
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-dark-750 hover:border-dark-700 focus:border-accent-500'
              }`}
            />
          </div>

          {errors.phoneNumber && (
            <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.phoneNumber}</span>
            </p>
          )}
        </div>

        {/* 3. Email Address (Read-Only) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="profile-email"
              className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider"
            >
              Email Address
            </label>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-neutral-500" />
              Read-Only
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <Mail className="w-4 h-4" />
            </div>

            <input
              id="profile-email"
              name="email"
              type="email"
              readOnly
              disabled
              value={formData.email || ''}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-dark-950/40 text-neutral-400 border border-dark-800 font-mono cursor-not-allowed select-all"
            />
          </div>

          <p className="text-[11px] text-neutral-400 leading-normal mt-1">
            Email changes will be supported in an upcoming security release.
          </p>
        </div>

        {/* 4. Member Since (Read-Only) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="profile-memberSince"
              className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider"
            >
              Account Status
            </label>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Active
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <Calendar className="w-4 h-4" />
            </div>

            <input
              id="profile-memberSince"
              name="memberSince"
              type="text"
              readOnly
              disabled
              value={formData.memberSince || 'Active Member'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-dark-950/40 text-neutral-400 border border-dark-800 cursor-not-allowed"
            />
          </div>

          <p className="text-[11px] text-neutral-400 leading-normal mt-1">
            Account verified and protected with modern 256-bit BCrypt encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
