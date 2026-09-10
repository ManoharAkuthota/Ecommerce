/**
 * Mobiles Storefront Catalog Page Component
 * Module: pages/Mobiles.jsx
 * 
 * Luxury flagship smartphone shopping catalog for MS Mobiles:
 * - Page Header: "Premium Smartphones" with flagship subtitle
 * - Live debounced search (300ms) wired to Spring Boot GET /api/mobiles/search
 * - Multi-criteria backend filtering: Brand, RAM, Storage
 * - Backend sorting: normal, price_asc, price_desc, latest
 * - Active filter chips with individual removal and "Clear All"
 * - Responsive layout: Desktop sticky sidebar + Mobile slide-up sheet drawer
 * - 4-column product grid with glassmorphic cards and shimmer skeleton loaders
 * - Direct Spring Boot Page pagination with range summary
 * - Full URL search params synchronization (?name=&brand=&ram=&storage=&sort=&page=)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Filter,
  SlidersHorizontal,
  Smartphone,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { mobileStoreService } from '../services/mobileStoreService';
import SEO from '../components/common/SEO';
import {
  SearchBar,
  FilterSidebar,
  SortDropdown,
  FilterChips,
  MobileGrid,
  MobileGridSkeleton,
  EmptyState,
  Pagination,
} from '../components/mobiles';

const PAGE_SIZE = 12;

export const Mobiles = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL search params for bookmarkable / shareable links
  const [searchQuery, setSearchQuery] = useState(searchParams.get('name') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedRam, setSelectedRam] = useState(searchParams.get('ram') || '');
  const [selectedStorage, setSelectedStorage] = useState(searchParams.get('storage') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'normal');
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '0', 10) || 0
  );

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Catalog data state
  const [mobiles, setMobiles] = useState([]);
  const [pageData, setPageData] = useState({
    totalPages: 0,
    totalElements: 0,
    number: 0,
    size: PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update URL Search Parameters whenever filter / page state changes
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set('name', searchQuery.trim());
    if (selectedBrand.trim()) params.set('brand', selectedBrand.trim());
    if (selectedRam.trim()) params.set('ram', selectedRam.trim());
    if (selectedStorage.trim()) params.set('storage', selectedStorage.trim());
    if (sortOption && sortOption !== 'normal') params.set('sort', sortOption);
    if (currentPage > 0) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedBrand, selectedRam, selectedStorage, sortOption, currentPage, setSearchParams]);

  // Fetch mobiles directly from Spring Boot backend
  const fetchMobiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mobileStoreService.searchMobiles({
        name: searchQuery,
        brand: selectedBrand,
        ram: selectedRam,
        storage: selectedStorage,
        sort: sortOption,
        page: currentPage,
        size: PAGE_SIZE,
      });

      setMobiles(response.content || []);
      setPageData({
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
        number: response.number || 0,
        size: response.size || PAGE_SIZE,
      });
    } catch (err) {
      console.error('Error fetching storefront mobiles catalog:', err);
      setError('Failed to load smartphones. Please check your connection and try again.');
      setMobiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedBrand, selectedRam, selectedStorage, sortOption, currentPage]);

  // Trigger catalog fetch when parameters change
  useEffect(() => {
    fetchMobiles();
    updateUrlParams();
  }, [fetchMobiles, updateUrlParams]);

  // Filter Handlers
  const handleSearch = (term) => {
    setSearchQuery(term);
    setCurrentPage(0); // Reset to first page
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'brand') setSelectedBrand(value);
    if (filterType === 'ram') setSelectedRam(value);
    if (filterType === 'storage') setSelectedStorage(value);
    setCurrentPage(0); // Reset to first page
  };

  const handleRemoveFilter = (filterKey) => {
    if (filterKey === 'name') setSearchQuery('');
    if (filterKey === 'brand') setSelectedBrand('');
    if (filterKey === 'ram') setSelectedRam('');
    if (filterKey === 'storage') setSelectedStorage('');
    setCurrentPage(0);
  };

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedRam('');
    setSelectedStorage('');
    setSortOption('normal');
    setCurrentPage(0);
  };

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Smooth scroll to top of catalog section
    const catalogTop = document.getElementById('catalog-top');
    if (catalogTop) {
      catalogTop.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeFilters = {
    name: searchQuery,
    brand: selectedBrand,
    ram: selectedRam,
    storage: selectedStorage,
  };

  const totalActiveFilters =
    (selectedBrand ? 1 : 0) + (selectedRam ? 1 : 0) + (selectedStorage ? 1 : 0);

  return (
    <div id="catalog-top" className="relative min-h-screen py-10 sm:py-14 select-none">
      <SEO
        title="Premium Smartphones Catalog | MS Mobiles"
        description="Browse and compare flagship smartphones from Apple, Samsung, OnePlus, Nothing, Xiaomi, Google, and more. Filter by RAM, storage, brand, and sort by price."
      />
      {/* Background Soft Lighting Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        <div className="absolute top-10 right-1/4 w-[38rem] h-[38rem] bg-accent-500/8 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -left-28 w-96 h-96 bg-indigo-600/7 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* ================= 1. PAGE HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center sm:text-left space-y-3"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-mono font-bold tracking-wide uppercase shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>Official Smartphone Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Premium Smartphones
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed font-sans">
            Explore the latest flagship devices from Apple, Samsung, OnePlus, Nothing, Xiaomi, Google, and more.
          </p>
        </motion.div>

        {/* ================= 2. CONTROLS & SEARCH BAR ================= */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input (Debounced 300ms) */}
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
                placeholder="Search mobiles by name..."
              />
            </div>

            {/* Mobile Filter Drawer Trigger (Hidden on desktop) */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-label="Open filter options"
              className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-dark-900/80 hover:bg-dark-900 border border-dark-750 text-xs font-bold text-white shadow-sm transition-colors"
            >
              <Filter className="w-4 h-4 text-accent-400" />
              <span>Filters</span>
              {totalActiveFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalActiveFilters}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <SortDropdown
              value={sortOption}
              onChange={handleSortChange}
              className="shrink-0"
            />
          </div>

          {/* Filter Chips Bar */}
          <FilterChips
            filters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleResetAllFilters}
          />
        </motion.div>

        {/* ================= 3. CATALOG CONTENT (SIDEBAR + GRID) ================= */}
        <div className="flex items-start gap-8">
          {/* Desktop Left Filter Sidebar */}
          <FilterSidebar
            filters={activeFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetAllFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
            totalResults={pageData.totalElements}
          />

          {/* Right Product Showcase Grid */}
          <main className="flex-1 min-w-0 space-y-8">
            {isLoading ? (
              <MobileGridSkeleton count={8} />
            ) : error ? (
              <div className="p-12 rounded-3xl bg-dark-900/40 border border-dark-800 text-center max-w-lg mx-auto space-y-4">
                <p className="text-sm text-rose-400">{error}</p>
                <button
                  type="button"
                  onClick={fetchMobiles}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all shadow-glow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              </div>
            ) : mobiles.length === 0 ? (
              <EmptyState
                title="No Smartphones Found"
                description="We could not find any flagship devices matching your criteria. Try loosening your search query or reset your filters."
                onResetFilters={handleResetAllFilters}
              />
            ) : (
              <>
                {/* 4-column responsive grid */}
                <MobileGrid mobiles={mobiles} />

                {/* Direct Spring Boot Pagination */}
                <Pagination
                  currentPage={pageData.number}
                  totalPages={pageData.totalPages}
                  totalElements={pageData.totalElements}
                  pageSize={pageData.size}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Mobiles;
