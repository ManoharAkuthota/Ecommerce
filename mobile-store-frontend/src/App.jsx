import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserAuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </CartProvider>
              </CompareProvider>
            </WishlistProvider>
          </ToastProvider>
        </UserAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

