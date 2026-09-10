import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ChevronRight, Smartphone, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserAuth } from '../hooks/useUserAuth';
import Button from './ui/Button';

/**
 * MobileMenu Component
 * Full-height slide-in navigation drawer from the right for mobile viewports (<768px).
 * Closes via backdrop click, link click, or Escape key.
 */
const MobileMenu = ({
  isOpen,
  onClose,
  navLinks,
  currentPath,
}) => {
  const { isAuthenticated, logout } = useAuth();
  const { isAuthenticated: isCustomerAuth, user: customerUser, logout: customerLogout } = useUserAuth();

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll while drawer is open
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

  // Close menu automatically on route change
  useEffect(() => {
    onClose();
  }, [currentPath]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[998] md:hidden cursor-pointer"
        />
      )}
      {isOpen && (
        <motion.aside
          key="mobile-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-y-0 right-0 z-[999] w-[84%] max-w-[320px] sm:max-w-[360px] h-full bg-dark-950 border-l border-dark-800/80 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto overscroll-contain select-none md:hidden"
        >
          {/* Top Header */}
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-dark-800/80">
              {/* Brand Logo in Menu */}
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-2 group select-none active:opacity-80"
              >
                  <div className="p-2 rounded-xl bg-accent-600 text-white shadow-glow-sm">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="text-base font-extrabold tracking-wider text-white">
                    MS <span className="text-accent-400">Mobile</span>
                  </span>
                </Link>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-900 border border-dark-800 transition-colors active:bg-dark-800 active:scale-95 touch-manipulation focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-5 space-y-1" aria-label="Mobile Secondary Navigation">
                {navLinks.map((link) => {
                  const isActive =
                    link.path === '/'
                      ? currentPath === '/'
                      : currentPath.startsWith(link.path);

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all active:scale-[0.98] touch-manipulation ${
                        isActive
                          ? 'text-white bg-accent-600/20 border border-accent-500/30 text-accent-300 shadow-glow-sm'
                          : 'text-neutral-300 hover:text-white hover:bg-dark-900/80 active:bg-dark-900'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isActive ? 'text-accent-400 translate-x-0.5' : 'text-neutral-600'
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-dark-800/80 space-y-3">
              {/* Customer Account Button (Mobile) */}
              {!isCustomerAuth ? (
                <Link to="/login" onClick={onClose}>
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    icon={<User className="w-4 h-4 text-accent-400" />}
                  >
                    Customer Sign In
                  </Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link to="/account" onClick={onClose}>
                    <Button
                      variant="secondary"
                      size="md"
                      fullWidth
                      icon={<User className="w-4 h-4 text-accent-400" />}
                    >
                      My Account ({customerUser?.fullName?.split(' ')[0] || 'Customer'})
                    </Button>
                  </Link>
                </div>
              )}

              {/* Admin Dashboard (Mobile - Staff Only when authenticated) */}
              {isAuthenticated && (
                <div className="space-y-2">
                  <Link to="/admin/dashboard" onClick={onClose}>
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      icon={<LayoutDashboard className="w-4 h-4" />}
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    icon={<LogOut className="w-4 h-4" />}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
              <p className="text-[11px] text-center text-neutral-500 tracking-wide">
                Flagship eCommerce Experience
              </p>
            </div>
          </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
