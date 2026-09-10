import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Menu, X, LayoutDashboard, LogOut, User, Heart, ArrowLeftRight, MessageSquare, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserAuth } from '../hooks/useUserAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCompare } from '../hooks/useCompare';
import { useCart } from '../hooks/useCart';
import Container from './ui/Container';
import NavLinkItem from './NavLinkItem';
import MobileMenu from './MobileMenu';
import NotificationBell from './common/NotificationBell';

/**
 * Premium Responsive Navbar
 * Inspired by luxury tech flagship platforms (Apple, Nothing, Samsung).
 * Features dynamic scroll morphing from transparent to frosted white,
 * active route indicator, and smooth slide-in mobile drawer.
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isAuthenticated, admin, logout } = useAuth();
  const { isAuthenticated: isCustomerAuth, user: customerUser } = useUserAuth();
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const { totalCount: cartCount, openDrawer } = useCart();

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      navigate(`/mobiles?name=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Mobiles', path: '/mobiles' },
    { name: 'About Us', path: '/about' },
    { name: 'Track Order', path: '/track' },
    { name: 'Contact', path: '/contact' },
  ];

  // Efficient scroll listener with passive event flag
  const handleScroll = useCallback(() => {
    const scrollOffset = window.scrollY;
    if (scrollOffset > 40) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, []);

  useEffect(() => {
    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close search and mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [currentPath]);

  // Dynamic style tokens based on scroll state
  const headerClasses = isScrolled
    ? 'bg-dark-950/90 text-white border-b border-dark-800/80 shadow-2xl backdrop-blur-xl'
    : 'bg-dark-950/70 text-white border-b border-dark-800/40 backdrop-blur-md';

  const logoClasses = 'text-white hover:text-accent-400';

  const iconBtnClasses = 'text-neutral-300 hover:text-white hover:bg-dark-850/80 border-dark-800/80 hover:border-dark-700';

  const adminBtnClasses = 'bg-accent-600/15 hover:bg-accent-600/25 text-accent-300 border-accent-500/30 hover:border-accent-500/50 shadow-glow-sm';

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${headerClasses}`}
      >
        {/* TOP UTILITY & PORTAL BAR: Direct User & Admin Switcher */}
        <div className="w-full bg-dark-950/95 border-b border-dark-800/80 py-1 px-3 sm:px-6 select-none">
          <Container size="7xl">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              {/* Left: Showroom badge & store status */}
              <div className="flex items-center gap-2 text-neutral-400 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-bold text-neutral-200 truncate">MS Mobiles Flagship Store</span>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <span className="hidden sm:inline text-neutral-400">Cyber Hills Showroom & Express Dispatch</span>
              </div>

              {/* Right: Direct User & Admin Portals */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* User Portal */}
                {isCustomerAuth ? (
                  <Link
                    to="/account"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-dark-900 hover:bg-dark-850 border border-dark-750 text-neutral-200 hover:text-white text-[11px] font-semibold transition-colors"
                    title="Customer Account Dashboard"
                  >
                    <User className="w-3 h-3 text-accent-400" />
                    <span>User: {customerUser?.fullName?.split(' ')[0] || 'Account'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-dark-900 hover:bg-dark-850 border border-dark-750 text-neutral-200 hover:text-white text-[11px] font-medium transition-colors"
                    title="Customer Sign In or Register"
                  >
                    <User className="w-3 h-3 text-accent-400" />
                    <span>New Customer? Sign In / Register</span>
                    <span className="hidden lg:inline px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-accent-500/20 text-accent-300 border border-accent-500/30">
                      🎁 ₹1,000 Voucher
                    </span>
                  </Link>
                )}

                {/* Admin Portal (Staff Only - Only visible when an administrator is actively logged in) */}
                {isAuthenticated && (
                  <>
                    <span className="text-dark-750 select-none">|</span>
                    <Link
                      to="/admin/dashboard"
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 hover:text-white text-[11px] font-semibold transition-colors shadow-sm"
                      title="Admin Control Center & Live Concierge"
                    >
                      <ShieldCheck className="w-3 h-3 text-indigo-400" />
                      <span>Admin: Dashboard</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>

        <Container size="7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* LEFT: Premium Text Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                aria-label="MS Mobile Home"
                className={`group inline-flex items-center gap-2 select-none transition-colors duration-200 ${logoClasses}`}
              >
                <span className="text-xl sm:text-2xl font-black tracking-wider uppercase font-sans">
                  MS <span className="text-accent-500 font-extrabold tracking-normal">Mobile</span>
                </span>
              </Link>
            </div>

            {/* CENTER: Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(link.path);

                return (
                  <NavLinkItem
                    key={link.path}
                    to={link.path}
                    label={link.name}
                    isActive={isActive}
                    isScrolled={isScrolled}
                  />
                );
              })}
            </nav>

            {/* RIGHT: Actions (Search, Admin Portal, Mobile Hamburger) */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Toggle Button (UI Only) */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search devices"
                className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${iconBtnClasses}`}
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Wishlist Link & Live Animated Badge (Desktop / Tablet) */}
              <Link to="/account/wishlist" className="relative hidden sm:inline-flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="My Wishlist"
                  aria-label="View saved wishlist items"
                  className={`relative p-2 sm:p-2.5 rounded-full sm:rounded-xl border transition-all duration-200 select-none ${
                    isScrolled
                      ? 'text-neutral-700 hover:text-rose-600 hover:bg-neutral-100/80 border-neutral-200/80'
                      : 'text-neutral-300 hover:text-rose-400 hover:bg-dark-850/60 border-dark-800/80'
                  }`}
                >
                  <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {wishlistCount > 0 && (
                    <motion.span
                      key={wishlistCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Compare Link & Live Animated Badge (Desktop / Tablet) */}
              <Link to="/compare" className="relative hidden sm:inline-flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Compare Mobiles"
                  aria-label="View compared smartphones"
                  className={`relative p-2 sm:p-2.5 rounded-full sm:rounded-xl border transition-all duration-200 select-none ${
                    isScrolled
                      ? 'text-neutral-700 hover:text-accent-600 hover:bg-neutral-100/80 border-neutral-200/80'
                      : 'text-neutral-300 hover:text-accent-400 hover:bg-dark-850/60 border-dark-800/80'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {compareCount > 0 && (
                    <motion.span
                      key={compareCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm"
                    >
                      {compareCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Notification Bell with Live Unread Dot / Counter Badge (Mobile & Desktop) */}
              <NotificationBell isScrolled={isScrolled} />

              {/* Shopping Cart Button & Live Counter Badge (Mobile & Desktop) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openDrawer}
                title="Shopping Bag"
                aria-label="View shopping bag"
                className={`relative p-2 sm:p-2.5 rounded-full sm:rounded-xl border transition-all duration-200 select-none ${
                  isScrolled
                    ? 'text-neutral-700 hover:text-accent-600 hover:bg-neutral-100/80 border-neutral-200/80'
                    : 'text-neutral-300 hover:text-accent-400 hover:bg-dark-850/60 border-dark-800/80'
                }`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Live Store Concierge Chat Trigger (Desktop / Tablet) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-concierge-chat'))}
                title="Open Live Store Concierge Chat"
                aria-label="Chat with store concierge"
                className={`relative hidden sm:inline-flex p-2 sm:p-2.5 rounded-full sm:rounded-xl border transition-all duration-200 select-none ${
                  isScrolled
                    ? 'text-neutral-700 hover:text-cyan-600 hover:bg-neutral-100/80 border-neutral-200/80'
                    : 'text-neutral-300 hover:text-cyan-400 hover:bg-dark-850/60 border-dark-800/80'
                }`}
              >
                <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </motion.button>

              {/* Customer Account Buttons (Desktop) */}
              {!isCustomerAuth ? (
                <Link to="/login" className="hidden sm:inline-flex">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 select-none text-neutral-200 hover:text-white bg-dark-850 hover:bg-dark-800 border-dark-750 hover:border-dark-700 shadow-sm"
                  >
                    <User className="w-4 h-4 text-accent-400" />
                    <span>Sign In</span>
                  </motion.button>
                </Link>
              ) : (
                <div className="hidden sm:inline-flex items-center gap-2">
                  <Link to="/account">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 select-none bg-dark-850 text-white border-dark-750 hover:bg-dark-800"
                    >
                      <div className="w-5 h-5 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-[10px] font-extrabold">
                        {(customerUser?.fullName || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span>{customerUser?.fullName?.split(' ')[0] || 'Account'}</span>
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Admin Portal / Dashboard Buttons (Desktop - Staff Only when authenticated) */}
              {isAuthenticated && (
                <div className="hidden sm:inline-flex items-center gap-2">
                  <Link to="/admin/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 select-none ${adminBtnClasses}`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-accent-400" />
                      <span>Dashboard</span>
                    </motion.button>
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    title="Sign Out"
                    aria-label="Sign Out"
                    className="p-2 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-dark-800/80"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              {/* Hamburger Button (Mobile <768px) */}
              <div className="md:hidden flex items-center">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  aria-expanded={mobileMenuOpen}
                  className={`p-2 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${iconBtnClasses}`}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </Container>

        {/* Expandable Search Input (UI Only) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="border-t overflow-hidden bg-dark-950/95 border-dark-800 backdrop-blur-xl"
            >
              <Container size="7xl" className="py-3">
                <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center">
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="absolute left-3.5 text-neutral-400 hover:text-accent-400 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search flagship mobiles, titanium editions, specs... (Press Enter to search)"
                    autoFocus
                    className="w-full pl-10 pr-10 py-2 rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-500 bg-dark-900 border border-dark-750 text-white placeholder-neutral-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    aria-label="Close search input"
                    className="absolute right-3 text-neutral-400 hover:text-neutral-200 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Slide-in Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        currentPath={currentPath}
      />
    </>
  );
};

export default Navbar;
