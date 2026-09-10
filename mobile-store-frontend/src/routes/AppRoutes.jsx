/**
 * Application Routes Configuration
 * Module: routes/AppRoutes.jsx
 * 
 * Configures public storefront routes, administrative authentication routes,
 * and protected admin routes with React.lazy route code-splitting,
 * Suspense fallbacks, and luxury 404 error routing.
 */

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserAuth } from '../hooks/useUserAuth';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import UserDashboardLayout from '../layouts/UserDashboardLayout';

// Route Guards & Loading Fallback
import ProtectedRoute from './ProtectedRoute';
import UserProtectedRoute from './UserProtectedRoute';
import PageLoadingFallback from '../components/common/PageLoadingFallback';

// Lazy-Loaded Public Storefront Pages
const Home = lazy(() => import('../pages/Home'));
const Mobiles = lazy(() => import('../pages/Mobiles'));
const MobileDetails = lazy(() => import('../pages/MobileDetails'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Compare = lazy(() => import('../pages/Compare'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'));
const TrackOrder = lazy(() => import('../pages/TrackOrder'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Lazy-Loaded Customer Authentication Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Lazy-Loaded Customer Account Pages
const UserDashboard = lazy(() => import('../pages/account/Dashboard'));
const Profile = lazy(() => import('../pages/account/Profile'));
const Wishlist = lazy(() => import('../pages/account/Wishlist'));
const UserOrders = lazy(() => import('../pages/account/UserOrders'));
const UserOrderDetails = lazy(() => import('../pages/account/UserOrderDetails'));
const RecentlyViewed = lazy(() => import('../pages/account/RecentlyViewed'));
const Notifications = lazy(() => import('../pages/account/Notifications'));
const Settings = lazy(() => import('../pages/account/Settings'));
const UserInquiries = lazy(() => import('../pages/account/UserInquiries'));

// Lazy-Loaded Administrative Pages
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const MobileManagement = lazy(() => import('../pages/admin/MobileManagement'));
const AddMobile = lazy(() => import('../pages/admin/AddMobile'));
const EditMobile = lazy(() => import('../pages/admin/EditMobile'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const ReviewManagement = lazy(() => import('../pages/admin/ReviewManagement'));
const AdminMessages = lazy(() => import('../pages/admin/AdminMessages'));

/**
 * Public Only Route Guard (Admin)
 * Prevents authenticated admins from viewing the login screen again.
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

/**
 * Public Only Route Guard (Customer)
 * Prevents authenticated customers from viewing /login and /register screens again.
 */
const CustomerPublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserAuth();

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* Public Storefront Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/storefront" element={<Navigate to="/" replace />} />
          <Route path="/store" element={<Navigate to="/" replace />} />
          <Route path="/mobiles" element={<Mobiles />} />
          <Route path="/mobiles/:id" element={<MobileDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <UserProtectedRoute>
                <Checkout />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/order-success/:orderId"
            element={
              <UserProtectedRoute>
                <OrderSuccess />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <UserProtectedRoute>
                <Compare />
              </UserProtectedRoute>
            }
          />
          {/* Catch-all 404 Page inside MainLayout */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected Customer Account Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/account" element={<UserDashboardLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="orders/:id" element={<UserOrderDetails />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="inquiries" element={<UserInquiries />} />
            <Route path="recent" element={<RecentlyViewed />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Customer Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={
            <CustomerPublicOnlyRoute>
              <Register />
            </CustomerPublicOnlyRoute>
          }
        />

        {/* Admin Authentication (Accessible only when unauthenticated) */}
        <Route
          path="/admin/login"
          element={
            <PublicOnlyRoute>
              <AdminLogin />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Admin Console Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="mobiles" element={<MobileManagement />} />
            <Route path="mobiles/add" element={<AddMobile />} />
            <Route path="mobiles/edit/:id" element={<EditMobile />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
