/**
 * Premium Mobile Management Dashboard Page
 * Module: pages/admin/MobileManagement.jsx
 * 
 * Comprehensive backoffice smartphone catalog and inventory management console.
 * Integrated with Spring Boot backend APIs:
 * - Search by name with 300ms debounce
 * - Multi-facet filtering (Brand, Stock Status, Visibility, Sort)
 * - Server-side pagination support
 * - Instant stock status changes with optimistic feedback
 * - Product hide/unhide toggling with optimistic feedback
 * - Permanent deletion with glassmorphic confirmation modal
 * - Mobile responsive card layout & skeleton loaders
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../../components/ui';
import { mobileService } from '../../services/mobileService';
import MobileSearchBar from '../../components/admin/MobileSearchBar';
import MobileFilterBar from '../../components/admin/MobileFilterBar';
import MobileTable from '../../components/admin/MobileTable';
import MobileTableSkeleton from '../../components/admin/MobileTableSkeleton';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import EmptyState from '../../components/admin/EmptyState';

export const MobileManagement = () => {
  const navigate = useNavigate();

  // Core Data State
  const [mobiles, setMobiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [selectedSort, setSelectedSort] = useState('normal');

  // Filter facets (available brands)
  const [availableBrands, setAvailableBrands] = useState([]);

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 0,
  });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    mobile: null,
    isDeleting: false,
  });

  // Feedback Toast State
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success', // 'success' | 'error'
  });
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  }, []);

  // Fetch available filter brands facet on initial load
  useEffect(() => {
    let isMounted = true;
    const loadFacets = async () => {
      try {
        const facets = await mobileService.getFilters();
        if (isMounted && facets?.brands && Array.isArray(facets.brands)) {
          setAvailableBrands(facets.brands);
        }
      } catch (err) {
        if (import.meta?.env?.DEV) {
          console.warn('[MobileManagement] Could not load brand facets:', err);
        }
      }
    };
    loadFacets();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Primary Data Fetcher
   * Intelligently queries the Spring Boot APIs:
   * - When visibility is 'all' or 'hidden', fetches admin inventory (includeHidden=true)
   * - When searching or sorting visible products, queries /api/mobiles/search
   */
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If visibility is explicitly 'hidden' or 'all', or when we need full inventory:
      if (selectedVisibility === 'hidden' || selectedVisibility === 'all') {
        const allItems = await mobileService.getMobiles();
        let filtered = Array.isArray(allItems) ? allItems : allItems?.content || [];

        // Apply visibility filter
        if (selectedVisibility === 'hidden') {
          filtered = filtered.filter((m) => Boolean(m.hidden) === true);
        } else if (selectedVisibility === 'visible') {
          filtered = filtered.filter((m) => Boolean(m.hidden) === false);
        }

        // Apply brand filter
        if (selectedBrand !== 'all') {
          filtered = filtered.filter(
            (m) => m.brand?.toLowerCase() === selectedBrand.toLowerCase()
          );
        }

        // Apply stock filter
        if (selectedStock !== 'all') {
          filtered = filtered.filter((m) => m.stockStatus === selectedStock);
        }

        // Apply search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (m) =>
              m.name?.toLowerCase().includes(q) ||
              m.brand?.toLowerCase().includes(q) ||
              m.processor?.toLowerCase().includes(q)
          );
        }

        // Apply sorting
        if (selectedSort === 'price_asc') {
          filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (selectedSort === 'price_desc') {
          filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        } else if (selectedSort === 'latest' || selectedSort === 'normal') {
          filtered.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
        }

        // Paginate slice
        const totalElements = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalElements / pagination.size));
        const start = pagination.page * pagination.size;
        const paginatedItems = filtered.slice(start, start + pagination.size);

        setMobiles(paginatedItems);
        setPagination((prev) => ({
          ...prev,
          totalPages,
          totalElements,
        }));
      } else {
        // Query Spring Boot Search endpoint directly
        const params = {
          name: searchQuery.trim() || undefined,
          brand: selectedBrand !== 'all' ? selectedBrand : undefined,
          sort: selectedSort || 'normal',
          page: pagination.page,
          size: pagination.size,
        };

        const pageData = await mobileService.searchMobiles(params);

        if (pageData && Array.isArray(pageData.content)) {
          let items = pageData.content;

          // Apply stock status filter if selected
          if (selectedStock !== 'all') {
            items = items.filter((m) => m.stockStatus === selectedStock);
          }

          setMobiles(items);
          setPagination((prev) => ({
            ...prev,
            totalPages: pageData.totalPages || 1,
            totalElements: pageData.totalElements || items.length,
          }));
        } else if (Array.isArray(pageData)) {
          setMobiles(pageData);
          setPagination((prev) => ({
            ...prev,
            totalPages: 1,
            totalElements: pageData.length,
          }));
        } else {
          setMobiles([]);
          setPagination((prev) => ({
            ...prev,
            totalPages: 1,
            totalElements: 0,
          }));
        }
      }
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.error('[MobileManagement] Fetch failed:', err);
      }
      setError(
        err?.response?.data?.message ||
          'Failed to load mobile inventory. Please verify network connectivity.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    selectedBrand,
    selectedStock,
    selectedVisibility,
    selectedSort,
    pagination.page,
    pagination.size,
  ]);

  // Trigger fetch on dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Search Input
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    if (key === 'brand') setSelectedBrand(value);
    if (key === 'stock') setSelectedStock(value);
    if (key === 'visibility') setSelectedVisibility(value);
    if (key === 'sort') setSelectedSort(value);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedStock('all');
    setSelectedVisibility('all');
    setSelectedSort('normal');
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Instant Stock Status Update with Optimistic UI
   */
  const handleUpdateStock = async (mobile, newStatus) => {
    const previousStatus = mobile.stockStatus;

    // 1. Optimistic local state update
    setMobiles((prev) =>
      prev.map((item) =>
        item.id === mobile.id ? { ...item, stockStatus: newStatus } : item
      )
    );

    try {
      await mobileService.updateStock(mobile.id, newStatus);
      showToast(
        `Stock status for "${mobile.name}" updated to ${newStatus.replace('_', ' ')}.`,
        'success'
      );
    } catch (err) {
      // 2. Rollback upon failure
      setMobiles((prev) =>
        prev.map((item) =>
          item.id === mobile.id ? { ...item, stockStatus: previousStatus } : item
        )
      );
      showToast('Failed to update stock status on server.', 'error');
    }
  };

  /**
   * Instant Visibility Toggle (Hide / Unhide) with Optimistic UI
   */
  const handleToggleVisibility = async (mobile) => {
    const currentHidden = Boolean(mobile.hidden);
    const nextHidden = !currentHidden;

    // 1. Optimistic local state update
    setMobiles((prev) =>
      prev.map((item) =>
        item.id === mobile.id ? { ...item, hidden: nextHidden } : item
      )
    );

    try {
      await mobileService.updateVisibility(mobile.id, nextHidden);
      showToast(
        nextHidden
          ? `Product "${mobile.name}" is now hidden from public storefront.`
          : `Product "${mobile.name}" is now published and visible to customers.`,
        'success'
      );
    } catch (err) {
      // 2. Rollback upon failure
      setMobiles((prev) =>
        prev.map((item) =>
          item.id === mobile.id ? { ...item, hidden: currentHidden } : item
        )
      );
      showToast('Failed to update product visibility.', 'error');
    }
  };

  /**
   * Delete Mobile Handlers
   */
  const handleOpenDeleteModal = (mobile) => {
    setDeleteModal({
      isOpen: true,
      mobile,
      isDeleting: false,
    });
  };

  const handleCloseDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        mobile: null,
        isDeleting: false,
      });
    }
  };

  const handleConfirmDelete = async () => {
    const target = deleteModal.mobile;
    if (!target) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await mobileService.deleteMobile(target.id);
      showToast(`Smartphone "${target.name}" permanently deleted.`, 'success');

      // Update local state and pagination count
      setMobiles((prev) => prev.filter((item) => item.id !== target.id));
      setPagination((prev) => ({
        ...prev,
        totalElements: Math.max(0, prev.totalElements - 1),
      }));

      handleCloseDeleteModal();
    } catch (err) {
      showToast(
        err?.response?.data?.message || 'Failed to delete smartphone from catalog.',
        'error'
      );
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedBrand !== 'all' ||
    selectedStock !== 'all' ||
    selectedVisibility !== 'all' ||
    selectedSort !== 'normal';

  return (
    <div className="space-y-6 select-text pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Mobile Management
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-bold">
              {pagination.totalElements} Products
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Manage your smartphone inventory, stock availability, and product visibility.
          </p>
        </div>

        {/* Action: Add Mobile Button */}
        <div className="flex-shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/admin/mobiles/add')}
            iconLeft={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-glow-sm"
          >
            Add Mobile
          </Button>
        </div>
      </div>

      {/* 2. Toast Notification Feedback */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-lg ${
              toast.type === 'error'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              )}
              <span>{toast.message}</span>
            </div>

            <button
              type="button"
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="text-neutral-400 hover:text-white p-1 rounded-lg"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Search and Filter Bar Controls */}
      <div className="space-y-3">
        <MobileSearchBar
          value={searchQuery}
          onSearch={handleSearch}
          placeholder="Search by mobile name, brand, or processor..."
        />

        <MobileFilterBar
          brand={selectedBrand}
          stock={selectedStock}
          visibility={selectedVisibility}
          sort={selectedSort}
          availableBrands={availableBrands}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 4. Main Content Area */}
      {isLoading ? (
        <MobileTableSkeleton rowCount={pagination.size} />
      ) : error ? (
        <div className="p-8 rounded-3xl bg-dark-950/60 border border-rose-500/20 text-center space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Connection Issue</h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
              {error}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            iconLeft={<RotateCcw className="w-3.5 h-3.5 text-accent-400" />}
            className="border-dark-700 text-xs"
          >
            Retry Fetch
          </Button>
        </div>
      ) : mobiles.length === 0 ? (
        <EmptyState
          title={isFiltered ? 'No Matching Smartphones' : 'No Smartphones in Catalog'}
          description={
            isFiltered
              ? 'Try changing your search terms or clearing your filter criteria to see more products.'
              : 'Your smartphone inventory is currently empty. Add your first flagship product to get started.'
          }
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
          onAddMobile={() => navigate('/admin/mobiles/add')}
        />
      ) : (
        <div className="space-y-4">
          <MobileTable
            mobiles={mobiles}
            onToggleVisibility={handleToggleVisibility}
            onUpdateStock={handleUpdateStock}
            onDelete={handleOpenDeleteModal}
          />

          {/* 5. Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-950/60 border border-dark-800/80 backdrop-blur-xl">
            <div className="text-xs text-neutral-400 font-medium">
              Showing page{' '}
              <span className="font-bold text-white font-mono">
                {pagination.page + 1}
              </span>{' '}
              of{' '}
              <span className="font-bold text-white font-mono">
                {pagination.totalPages}
              </span>{' '}
              ({pagination.totalElements} total items)
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                iconLeft={<ChevronLeft className="w-4 h-4" />}
                className="text-xs border-dark-700 hover:border-dark-600 disabled:opacity-40"
              >
                Previous
              </Button>

              <div className="px-3 py-1.5 rounded-xl bg-dark-900 border border-dark-700/60 font-mono text-xs font-bold text-accent-300">
                {pagination.page + 1}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                iconRight={<ChevronRight className="w-4 h-4" />}
                className="text-xs border-dark-700 hover:border-dark-600 disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Permanent Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        mobileName={deleteModal.mobile?.name || ''}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default MobileManagement;
