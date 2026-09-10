package com.mobilestore.mobile.service;

import com.mobilestore.mobile.dto.MobileRequest;
import com.mobilestore.mobile.dto.MobileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * MobileService
 * Module: mobile
 * Service contract for smartphone catalog management, multi-criteria search,
 * inventory controls, and storefront showcase operations.
 */
public interface MobileService {

    /**
     * Add a new smartphone product to the catalog with optional string image URLs.
     *
     * @param request Validated product creation payload
     * @return MobileResponse representation of the created product
     */
    MobileResponse addMobile(MobileRequest request);

    /**
     * Add a new smartphone product and upload 1-5 image files to Cloudinary.
     *
     * @param request Validated product creation payload
     * @param imageFiles List of 1 to 5 multipart image files
     * @return MobileResponse representation with Cloudinary secure URLs
     */
    MobileResponse addMobile(MobileRequest request, org.springframework.web.multipart.MultipartFile[] imageFiles);

    /**
     * Update an existing smartphone product's specifications and assets.
     *
     * @param id Smartphone unique identifier
     * @param request Validated product update payload
     * @return MobileResponse updated product details
     */
    MobileResponse updateMobile(UUID id, MobileRequest request);

    /**
     * Update smartphone specifications and optionally upload replacement images to Cloudinary.
     *
     * @param id Smartphone unique identifier
     * @param request Validated product update payload
     * @param newImageFiles Optional replacement image files
     * @return MobileResponse updated product details
     */
    MobileResponse updateMobile(UUID id, MobileRequest request, org.springframework.web.multipart.MultipartFile[] newImageFiles);

    /**
     * Delete a specific image belonging to a smartphone, removing it from Cloudinary and database.
     *
     * @param mobileId Smartphone unique identifier
     * @param imageId Image unique identifier
     * @return MobileResponse updated product details
     */
    MobileResponse deleteMobileImage(UUID mobileId, UUID imageId);

    /**
     * Delete a smartphone product and its associated image assets.
     *
     * @param id Smartphone unique identifier
     */
    void deleteMobile(UUID id);

    /**
     * Explicitly set the visibility status (hidden/visible) of a smartphone.
     *
     * @param id Smartphone unique identifier
     * @param hidden True to hide product from public storefront, false to show
     * @return MobileResponse updated product details
     */
    MobileResponse updateVisibility(UUID id, Boolean hidden);

    /**
     * Toggle the visibility status (hidden/visible) of a smartphone.
     *
     * @param id Smartphone unique identifier
     * @return MobileResponse updated product details
     */
    MobileResponse toggleHideMobile(UUID id);

    /**
     * Update inventory stock status for a smartphone using StockStatus enum.
     *
     * @param id Smartphone unique identifier
     * @param stockStatus New StockStatus enum value
     * @return MobileResponse updated product details
     */
    MobileResponse updateStockStatus(UUID id, com.mobilestore.mobile.entity.enums.StockStatus stockStatus);

    /**
     * Update inventory stock status for a smartphone using string representation.
     *
     * @param id Smartphone unique identifier
     * @param stockStatus New stock status value string
     * @return MobileResponse updated product details
     */
    MobileResponse updateStockStatus(UUID id, String stockStatus);

    /**
     * Retrieve a single smartphone by its unique identifier.
     *
     * @param id Smartphone unique identifier
     * @return MobileResponse product details
     */
    MobileResponse getMobileById(UUID id);

    /**
     * Retrieve the latest eight visible flagship smartphones for the homepage showcase.
     *
     * @return List of 8 latest flagship MobileResponse objects
     */
    List<MobileResponse> getLatestMobiles();

    /**
     * Retrieve all visible (non-hidden) smartphones.
     *
     * @return List of all visible MobileResponse objects
     */
    List<MobileResponse> getAllVisibleMobiles();

    /**
     * Retrieve all smartphones including hidden ones (for administrative management).
     *
     * @return List of all MobileResponse objects ordered newest first
     */
    List<MobileResponse> getAllMobiles();

    /**
     * Retrieve a paginated list of all smartphones (including hidden products, for admin console).
     *
     * @param pageable Pagination and sorting criteria
     * @return Page of MobileResponse objects
     */
    Page<MobileResponse> getAllMobiles(Pageable pageable);

    /**
     * Retrieve a paginated list of visible smartphones for public storefront browsing.
     *
     * @param pageable Pagination and sorting criteria
     * @return Page of visible MobileResponse objects
     */
    Page<MobileResponse> getVisibleMobiles(Pageable pageable);

    /**
     * Retrieve all hidden smartphones for administrative management.
     *
     * @return List of hidden MobileResponse objects ordered newest first
     */
    List<MobileResponse> getHiddenMobiles();

    /**
     * Retrieve a paginated list of hidden smartphones for administrative management.
     *
     * @param pageable Pagination and sorting criteria
     * @return Page of hidden MobileResponse objects
     */
    Page<MobileResponse> getHiddenMobiles(Pageable pageable);

    /**
     * Count total publicly visible smartphones.
     *
     * @return Total visible count
     */
    long countVisibleMobiles();

    /**
     * Count total hidden smartphones.
     *
     * @return Total hidden count
     */
    long countHiddenMobiles();

    /**
     * Multi-criteria search across keyword, brand, price range, RAM, storage, stock status, and visibility.
     *
     * @param keyword Partial match on name, brand, or processor
     * @param brand Exact brand filter
     * @param minPrice Minimum price boundary
     * @param maxPrice Maximum price boundary
     * @param ram RAM specification filter
     * @param storage Internal storage filter
     * @param stockStatus Stock status filter
     * @param hidden Visibility filter (null for all)
     * @param pageable Pagination and sorting criteria
     * @return Page of matching MobileResponse objects
     */
    Page<MobileResponse> searchMobiles(
            String keyword,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String ram,
            String storage,
            String stockStatus,
            Boolean hidden,
            Pageable pageable
    );

    /**
     * Advanced dynamic multi-criteria search for public storefront with pagination and sorting.
     * Exclusively returns visible products (hidden = false).
     *
     * @param name Optional product name substring
     * @param brand Optional manufacturer brand
     * @param ram Optional exact RAM configuration
     * @param storage Optional exact internal storage configuration
     * @param processor Optional processor name substring
     * @param page Zero-based page index
     * @param size Page size (number of items per page)
     * @param sort Sorting directive ('latest', 'price_asc', 'price_desc', 'name_asc', 'normal')
     * @return Page of MobileResponse DTOs
     */
    Page<MobileResponse> searchMobiles(
            String name,
            String brand,
            String ram,
            String storage,
            String processor,
            int page,
            int size,
            String sort
    );

    /**
     * Search visible smartphones by name, RAM, and storage specifications.
     *
     * @param name Product name search fragment
     * @param ram RAM capacity
     * @param storage Storage capacity
     * @return List of matching visible MobileResponse objects
     */
    List<MobileResponse> searchByNameRamStorage(String name, String ram, String storage);

    /**
     * Retrieve distinct brand names for storefront catalog filter facets.
     *
     * @return Alphabetically ordered list of unique brands
     */
    List<String> getFilterBrands();

    /**
     * Retrieve distinct RAM options for storefront catalog filter facets.
     *
     * @return Ordered list of available RAM configurations
     */
    List<String> getFilterRamOptions();

    /**
     * Retrieve distinct internal storage options for storefront catalog filter facets.
     *
     * @return Ordered list of available storage configurations
     */
    List<String> getFilterStorageOptions();
}
