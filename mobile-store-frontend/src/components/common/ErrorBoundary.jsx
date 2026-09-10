/**
 * ErrorBoundary Component
 * Module: components/common/ErrorBoundary.jsx
 * 
 * Top-level React Error Boundary catching unhandled runtime exceptions.
 * Replaces white-screen crashes with a luxury branded recovery interface.
 */

import React, { Component } from 'react';
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, an error reporting service like Sentry or LogRocket could be called here:
    console.error('Unhandled Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 sm:p-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Ambient Lighting */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-[140px]" />
          </div>

          <div className="relative max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-dark-900/80 border border-rose-500/25 backdrop-blur-2xl shadow-2xl text-center space-y-6">
            {/* Warning Icon Badge */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-glow-sm">
              <AlertTriangle className="w-8 h-8 stroke-[2]" />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block">
                Application Exception
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Something Went Unexpectedly Wrong
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                An unexpected interface error occurred. You can reload the application or return to the main storefront.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold shadow-glow-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-neutral-200 hover:text-white text-xs font-bold border border-dark-700/80 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Return to Store</span>
              </button>
            </div>

            {/* Expandable Technical Details */}
            {this.state.error && (
              <div className="pt-2 border-t border-dark-800/80 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-[11px] font-mono text-neutral-400 hover:text-neutral-200 transition-colors py-1"
                >
                  <span>Technical Diagnostics</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 rounded-xl bg-dark-950 border border-dark-800 text-[10px] font-mono text-rose-300 overflow-x-auto max-h-40 leading-relaxed whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
