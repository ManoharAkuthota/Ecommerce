package com.mobilestore.mobile.controller;

import com.mobilestore.mobile.dto.MobileRequest;
import com.mobilestore.mobile.dto.MobileResponse;
import com.mobilestore.mobile.dto.StockUpdateRequest;
import com.mobilestore.mobile.dto.UpdateStockRequest;
import com.mobilestore.mobile.dto.UpdateVisibilityRequest;
import com.mobilestore.mobile.dto.VisibilityUpdateRequest;
import com.mobilestore.mobile.service.MobileService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * MobileController
 * Module: mobile
 * REST Controller exposing product catalog browsing, homepage showcase,
 * single product lookups, and inventory management endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/mobiles")
public class MobileController {

    private final MobileService mobileService;
    private final jakarta.validation.Validator validator;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    /**
     * Constructor injection for MobileService and Validator.
     */
    public MobileController(MobileService mobileService, jakarta.validation.Validator validator) {
        this.mobileService = mobileService;
        this.validator = validator;
    }

    /**
     * GET /api/mobiles
     * Retrieve smartphone products.
     * By default, returns only visible products for the public storefront.
     * When includeHidden=true, returns all products (for administrative management).
     *
     * @param includeHidden Optional flag to include hidden products (default: false)
     * @return HTTP 200 with list of visible or all MobileResponse DTOs
     */
    @GetMapping
    public ResponseEntity<List<MobileResponse>> getAllMobiles(
            @RequestParam(name = "includeHidden", defaultValue = "false") boolean includeHidden
    ) {
        log.info("REST request to fetch mobiles: includeHidden={}", includeHidden);
        List<MobileResponse> mobiles = includeHidden
                ? mobileService.getAllMobiles()
                : mobileService.getAllVisibleMobiles();
        return ResponseEntity.ok(mobiles);
    }

    /**
     * GET /api/mobiles/latest
     * Retrieve the latest eight visible flagship smartphones for the homepage showcase.
     * Excludes hidden products.
     *
     * @return HTTP 200 with list of 8 flagship MobileResponse DTOs
     */
    @GetMapping("/latest")
    public ResponseEntity<List<MobileResponse>> getLatestMobiles() {
        log.info("REST request to fetch latest 8 flagship mobiles for homepage showcase");
        List<MobileResponse> latestMobiles = mobileService.getLatestMobiles();
        return ResponseEntity.ok(latestMobiles);
    }

    /**
     * GET /api/mobiles/search
     * Advanced multi-criteria search and filter endpoint for storefront mobile catalog.
     * Evaluates optional query parameters (name, brand, ram, storage, processor)
     * with pagination and sorting support.
     * Centralized visibility enforcement guarantees hidden products are never returned.
     *
     * @param name Optional partial product name
     * @param brand Optional brand
     * @param ram Optional RAM capacity
     * @param storage Optional internal storage capacity
     * @param processor Optional partial processor name
     * @param page Zero-based page index (default: 0)
     * @param size Number of items per page (default: 12)
     * @param sort Sorting criteria ('latest', 'price_asc', 'price_desc', 'name_asc', 'normal')
     * @return HTTP 200 with Page of MobileResponse DTOs (empty page if no matches)
     */
    @GetMapping("/search")
    public ResponseEntity<org.springframework.data.domain.Page<MobileResponse>> searchMobiles(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String ram,
            @RequestParam(required = false) String storage,
            @RequestParam(required = false) String processor,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "normal") String sort
    ) {
        log.info("REST request to search mobiles: name='{}', brand='{}', ram='{}', storage='{}', processor='{}', page={}, size={}, sort='{}'",
                name, brand, ram, storage, processor, page, size, sort);
        org.springframework.data.domain.Page<MobileResponse> results =
                mobileService.searchMobiles(name, brand, ram, storage, processor, page, size, sort);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/mobiles/{id}
     * Retrieve a specific smartphone by its UUID.
     * Returns HTTP 404 if product does not exist.
     *
     * @param id Smartphone unique identifier
     * @return HTTP 200 with MobileResponse DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<MobileResponse> getMobileById(@PathVariable UUID id) {
        log.info("REST request to fetch mobile by ID: {}", id);
        MobileResponse mobile = mobileService.getMobileById(id);
        return ResponseEntity.ok(mobile);
    }

    /**
     * POST /api/mobiles (multipart/form-data)
     * Create and add a new smartphone product with 1 to 5 uploaded image files stored in Cloudinary.
     * Supports 'mobile' part as JSON string/blob or direct form attributes.
     *
     * @param mobileJson Optional JSON string representing the MobileRequest payload
     * @param modelRequest Optional form-bound MobileRequest
     * @param images Array of 1 to 5 multipart image files
     * @return HTTP 201 Created with saved MobileResponse DTO containing Cloudinary URLs
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MobileResponse> addMobileMultipart(
            @RequestPart(value = "mobile", required = false) String mobileJson,
            @ModelAttribute MobileRequest modelRequest,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {
        MobileRequest request = resolveMobileRequest(mobileJson, modelRequest);
        validateRequest(request);

        log.info("REST request to add mobile with multipart images: {} {}", request.getBrand(), request.getName());
        MobileResponse created = mobileService.addMobile(request, images);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * POST /api/mobiles (application/json)
     * Create and add a new smartphone product with pre-defined image URLs.
     *
     * @param request Validated product creation payload
     * @return HTTP 201 Created with saved MobileResponse DTO
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MobileResponse> addMobileJson(@Valid @RequestBody MobileRequest request) {
        log.info("REST request to add new mobile via JSON: {} {}", request.getBrand(), request.getName());
        MobileResponse created = mobileService.addMobile(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/mobiles/{id} (multipart/form-data)
     * Update an existing smartphone product and optionally upload replacement images.
     *
     * @param id Smartphone unique identifier
     * @param mobileJson Optional JSON string representing the MobileRequest payload
     * @param modelRequest Optional form-bound MobileRequest
     * @param images Optional replacement multipart image files
     * @return HTTP 200 with updated MobileResponse DTO
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MobileResponse> updateMobileMultipart(
            @PathVariable UUID id,
            @RequestPart(value = "mobile", required = false) String mobileJson,
            @ModelAttribute MobileRequest modelRequest,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {
        MobileRequest request = resolveMobileRequest(mobileJson, modelRequest);
        validateRequest(request);

        log.info("REST request to update mobile with ID via multipart: {}", id);
        MobileResponse updated = mobileService.updateMobile(id, request, images);
        return ResponseEntity.ok(updated);
    }

    /**
     * PUT /api/mobiles/{id} (application/json)
     * Update an existing smartphone product's specifications and stock status.
     *
     * @param id Smartphone unique identifier
     * @param request Validated product update payload
     * @return HTTP 200 with updated MobileResponse DTO
     */
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MobileResponse> updateMobileJson(
            @PathVariable UUID id,
            @Valid @RequestBody MobileRequest request
    ) {
        log.info("REST request to update mobile with ID via JSON: {}", id);
        MobileResponse updated = mobileService.updateMobile(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * PATCH /api/mobiles/{id}/visibility
     * Update the visibility status (hidden/visible) of a smartphone.
     * Hidden products are excluded from public catalog browsing and homepage showcase.
     *
     * @param id Smartphone unique identifier
     * @param request Visibility payload containing boolean hidden flag
     * @return HTTP 200 with updated MobileResponse DTO
     */
    @PatchMapping("/{id}/visibility")
    public ResponseEntity<MobileResponse> updateVisibility(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVisibilityRequest request
    ) {
        log.info("REST request to update visibility for mobile ID: {} to hidden={}", id, request.getHidden());
        MobileResponse updated = mobileService.updateVisibility(id, request.getHidden());
        return ResponseEntity.ok(updated);
    }

    /**
     * PATCH /api/mobiles/{id}/stock
     * Update the inventory stock status of a smartphone.
     * Allowed values: 'IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK'.
     *
     * @param id Smartphone unique identifier
     * @param request Stock update payload containing new StockStatus
     * @return HTTP 200 with updated MobileResponse DTO
     */
    @PatchMapping("/{id}/stock")
    public ResponseEntity<MobileResponse> updateStockStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStockRequest request
    ) {
        log.info("REST request to update stock status for mobile ID: {} to '{}'", id, request.getStockStatus());
        MobileResponse updated = mobileService.updateStockStatus(id, request.getStockStatus());
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/mobiles/{id}/images/{imageId}
     * Delete a specific image from a smartphone, removing it from Cloudinary and database.
     *
     * @param id Smartphone unique identifier
     * @param imageId Image unique identifier
     * @return HTTP 200 with updated MobileResponse DTO
     */
    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<MobileResponse> deleteMobileImage(
            @PathVariable UUID id,
            @PathVariable UUID imageId
    ) {
        log.info("REST request to delete image ID: {} from mobile ID: {}", imageId, id);
        MobileResponse updated = mobileService.deleteMobileImage(id, imageId);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/mobiles/{id}
     * Delete a smartphone product from the catalog.
     *
     * @param id Smartphone unique identifier
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMobile(@PathVariable UUID id) {
        log.info("REST request to delete mobile with ID: {}", id);
        mobileService.deleteMobile(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/mobiles/filters
     * Retrieve dynamic filter facets (distinct brands, RAM, and storage options)
     * to power storefront catalog filter bars.
     *
     * @return HTTP 200 with map of filter options
     */
    @GetMapping("/filters")
    public ResponseEntity<Map<String, List<String>>> getFilters() {
        log.info("REST request to fetch catalog filter facets");
        Map<String, List<String>> filters = Map.of(
                "brands", mobileService.getFilterBrands(),
                "ramOptions", mobileService.getFilterRamOptions(),
                "storageOptions", mobileService.getFilterStorageOptions()
        );
        return ResponseEntity.ok(filters);
    }

    // =========================================================================
    // Private Request Resolution & Validation Helpers
    // =========================================================================

    private MobileRequest resolveMobileRequest(String mobileJson, MobileRequest modelRequest) {
        if (mobileJson != null && !mobileJson.isBlank()) {
            try {
                return objectMapper.readValue(mobileJson, MobileRequest.class);
            } catch (Exception e) {
                throw new com.mobilestore.exception.BadRequestException(
                        "Invalid mobile JSON payload: " + e.getMessage()
                );
            }
        }
        if (modelRequest != null && modelRequest.getName() != null && !modelRequest.getName().isBlank()) {
            return modelRequest;
        }
        throw new com.mobilestore.exception.BadRequestException(
                "Mobile product data is required (either as 'mobile' JSON part or form fields)"
        );
    }

    private void validateRequest(MobileRequest request) {
        var violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new com.mobilestore.exception.BadRequestException(
                    "Validation failed: " + violations.iterator().next().getMessage()
            );
        }
    }
}
