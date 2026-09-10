/**
 * Customer Sign In Page
 * Module: pages/auth/Login.jsx
 * Route: /login
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import SEO from '../../components/common/SEO';

const Login = () => {
  return (
    <>
      <SEO
        title="Sign In — MS Mobiles"
        description="Sign in to your MS Mobiles account to view orders, wishlist, and concierge flagship support."
        canonicalUrl="http://localhost:5173/login"
      />
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default Login;
