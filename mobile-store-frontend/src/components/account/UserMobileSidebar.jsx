/**
 * Mobile Customer Navigation Drawer Component
 * Module: components/account/UserMobileSidebar.jsx
 * 
 * Accessible slide-in navigation drawer for tablet and mobile screens (<1024px).
 * Closes automatically on backdrop click, Escape key press, or route navigation.
 */

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  Smartphone,
  LayoutDashboard,
  User,
  Heart,
  Clock,
  Bell,
  Settings,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import UserLogoutButton from './UserLogoutButton';
import { USER_NAV_ITEMS } from './UserSidebar';

const UserMobileSidebar = ({ isOpen, onClose }) => {
  const { user } = useUserAuth();
  const location = useLocation();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Automatically close drawer when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const displayName = user?.fullName || 'Customer';
  const displayEmail = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[998] lg:hidden cursor-pointer transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Customer Mobile Navigation Menu"
        className={`fixed inset-y-0 left-0 z-[999] w-[84%] max-w-xs h-full bg-dark-900 border-r border-dark-800 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto overscroll-contain select-none lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
        }`}
      >
          {/* TOP: Header Branding & Close Button */}
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-dark-800/80">
              <Link
                to="/account"
                  onClick={onClose}
                  className="flex items-center gap-3 overflow-hidden active:opacity-80"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-600 via-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm flex-shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black tracking-wider uppercase text-white font-sans">
                      MS <span className="text-accent-400 font-extrabold">Mobiles</span>
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      My Account
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close mobile navigation menu"
                  className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 border border-dark-800 focus:outline-none transition-colors active:bg-dark-750 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Mini Profile Strip */}
              <div className="py-4 flex items-center gap-3 border-b border-dark-800/60">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-600 to-sky-500 overflow-hidden flex items-center justify-center text-white text-sm font-extrabold shadow-glow-sm flex-shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-neutral-400 truncate font-mono">
                    {displayEmail}
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="mt-4 space-y-1" aria-label="Customer Mobile Links">
                <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Navigation
                </div>

                {USER_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] touch-manipulation ${
                        isActive
                          ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30 shadow-glow-sm font-semibold'
                          : 'text-neutral-300 hover:text-white hover:bg-dark-800/60 border border-transparent active:bg-dark-800'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${
                          isActive ? 'text-accent-400' : 'text-neutral-400'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* BOTTOM: Storefront Return & Logout Button */}
            <div className="pt-4 border-t border-dark-800/80 space-y-2.5">
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-800/60 border border-dark-800 transition-colors active:scale-[0.98] touch-manipulation"
                >
                  <ArrowLeft className="w-4 h-4 text-neutral-400" />
                  <span>Store Main Page</span>
                </Link>

                <Link
                  to="/about"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-800/60 border border-dark-800 transition-colors active:scale-[0.98] touch-manipulation"
                >
                  <Info className="w-4 h-4 text-neutral-400" />
                  <span>About Store Details</span>
                </Link>
              </div>

              <UserLogoutButton
                variant="outline"
                size="sm"
                fullWidth
                label="Sign Out"
              />
            </div>
          </aside>
    </>
  );
};

export default UserMobileSidebar;
