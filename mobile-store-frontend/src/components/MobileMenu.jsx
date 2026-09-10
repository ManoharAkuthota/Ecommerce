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

  // Drawer animation variants
  const drawerVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 35,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Slide-in Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative w-full max-w-[320px] sm:max-w-[360px] h-full bg-dark-950/95 border-l border-dark-800/80 shadow-2xl backdrop-blur-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto"
          >
            {/* Top Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-dark-800/80">
                {/* Brand Logo in Menu */}
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-2 group select-none"
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
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-900 border border-dark-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 space-y-1.5" aria-label="Mobile Secondary Navigation">
                {navLinks.map((link) => {
                  const isActive =
                    link.path === '/'
                      ? currentPath === '/'
                      : currentPath.startsWith(link.path);

                  return (
                    <motion.div key={link.path} variants={itemVariants}>
                      <Link
                        to={link.path}
                        onClick={onClose}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                          isActive
                            ? 'text-white bg-accent-600/15 border border-accent-500/30 text-accent-300'
                            : 'text-neutral-300 hover:text-white hover:bg-dark-900/80'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isActive ? 'text-accent-400 translate-x-0.5' : 'text-neutral-600'
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-dark-800/80 space-y-3"
            >
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
            </motion.div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
