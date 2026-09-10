/**
 * Customer Registration Page
 * Module: pages/auth/Register.jsx
 * Route: /register
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import AuthLayout from '../../components/auth/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import SEO from '../../components/common/SEO';

const Register = () => {
  const { isAuthenticated, isLoading } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/account';

  // Automatically redirect if already authenticated as customer
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, destination]);

  return (
    <>
      <SEO
        title="Create Account — MS Mobiles"
        description="Create your MS Mobiles account for authentic sealed flagship smartphones and concierge support."
        canonicalUrl="http://localhost:5173/register"
      />
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </>
  );
};

export default Register;
