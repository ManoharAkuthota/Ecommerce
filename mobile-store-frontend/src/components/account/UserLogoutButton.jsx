/**
 * Customer Logout Button Component
 * Module: components/account/UserLogoutButton.jsx
 * 
 * Provides a standardized, accessible sign-out action for the customer account area.
 * Clears customer JWT session storage, resets UserAuthContext, and redirects to /login.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';

const UserLogoutButton = ({
  variant = 'ghost',
  size = 'sm',
  fullWidth = false,
  className = '',
  iconOnly = false,
  showLabel = true,
  label = 'Sign Out',
}) => {
  const { logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    xs: 'text-xs px-2.5 py-1.5 gap-1.5',
    sm: 'text-xs px-3 py-2 gap-2',
    md: 'text-sm px-4 py-2.5 gap-2.5',
  }[size] || 'text-xs px-3 py-2 gap-2';

  const variantStyles = {
    ghost:
      'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent',
    outline:
      'text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500/50 shadow-sm',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-sm shadow-rose-950',
  }[variant] || 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10';

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={handleLogout}
      title={label}
      aria-label={label}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      <LogOut className="w-4 h-4 flex-shrink-0" />
      {showLabel && !iconOnly && <span>{label}</span>}
    </motion.button>
  );
};

export default UserLogoutButton;
