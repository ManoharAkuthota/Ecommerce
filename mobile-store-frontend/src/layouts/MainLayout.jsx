import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatWidget from '../components/chat/FloatingChatWidget';
import CartDrawer from '../components/cart/CartDrawer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-950 text-neutral-100 selection:bg-accent-500/30 selection:text-white">
      {/* Accessible Skip Link for keyboard / screen-reader navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none font-bold text-xs"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex="-1" className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <FloatingChatWidget />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
