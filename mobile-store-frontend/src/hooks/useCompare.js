/**
 * useCompare Hook
 * Module: hooks/useCompare.js
 * 
 * Custom React hook exposing CompareContext state and action dispatchers.
 */

import { useContext } from 'react';
import { CompareContext } from '../context/CompareContext';

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export default useCompare;
