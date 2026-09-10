import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Smartphone, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import Button from '../ui/Button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Mobiles', path: '/mobiles' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark-950/80 border-b border-dark-800/80 transition-all duration-200">
      <Container size="7xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-accent-600 to-violet-500 text-white shadow-glow-sm group-hover:scale-105 group-hover:shadow-glow-md transition-all duration-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Aura<span className="text-accent-400">Mobile</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-dark-900/60 border border-dark-800/80">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-accent-600/20 text-accent-300 border border-accent-500/30 shadow-glow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-dark-800/40'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/admin/login">
              <Button
                variant="outline"
                size="sm"
                icon={<ShieldCheck className="w-4 h-4 text-accent-400" />}
              >
                Admin Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white bg-dark-900/60 border border-dark-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden border-b border-dark-800 bg-dark-950/95 backdrop-blur-2xl overflow-hidden"
          >
            <Container size="7xl" className="py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'text-accent-300 bg-accent-600/10 border border-accent-500/20'
                        : 'text-neutral-300 hover:text-white hover:bg-dark-900'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              <div className="pt-3 border-t border-dark-800">
                <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="glass"
                    size="md"
                    fullWidth
                    icon={<ShieldCheck className="w-4 h-4 text-accent-400" />}
                  >
                    Admin Portal
                  </Button>
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
