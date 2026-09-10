package com.mobilestore.mobile.service.impl;

import com.mobilestore.exception.BadRequestException;
import com.mobilestore.exception.ImageUploadException;
import com.mobilestore.exception.InvalidStockStatusException;
import com.mobilestore.exception.MobileNotFoundException;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.mobile.dto.MobileImageResponse;
import com.mobilestore.mobile.dto.MobileRequest;
import com.mobilestore.mobile.dto.MobileResponse;
import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.mobile.entity.MobileImage;
import com.mobilestore.mobile.entity.enums.StockStatus;
import com.mobilestore.mobile.repository.MobileImageRepository;
import com.mobilestore.mobile.repository.MobileRepository;
import com.mobilestore.mobile.service.MobileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * MobileServiceImpl
 * Module: mobile
 * Enterprise implementation of the MobileService interface.
 * Handles product catalog lifecycle, inventory management, multi-criteria search,
 * and Cloudinary media asset association.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class MobileServiceImpl implements MobileService {

    private final MobileRepository mobileRepository;
    private final MobileImageRepository mobileImageRepository;
    private final com.mobilestore.mobile.service.CloudinaryService cloudinaryService;
    private final com.mobilestore.stockalert.service.StockAlertService stockAlertService;

    /**
     * Constructor injection for required repositories, CloudinaryService, and StockAlertService.
     */
    public MobileServiceImpl(
            MobileRepository mobileRepository,
            MobileImageRepository mobileImageRepository,
            com.mobilestore.mobile.service.CloudinaryService cloudinaryService,
            com.mobilestore.stockalert.service.StockAlertService stockAlertService
    ) {
        this.mobileRepository = mobileRepository;
        this.mobileImageRepository = mobileImageRepository;
        this.cloudinaryService = cloudinaryService;
        this.stockAlertService = stockAlertService;
    }

    @Override
    @Transactional
    public MobileResponse addMobile(MobileRequest request) {
        log.info("Adding new smartphone: {} - {}", request.getBrand(), request.getName());

        validatePrice(request.getPrice());

        Mobile mobile = mapToEntity(request);

        // Process up to 5 initial image URLs
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            attachImageUrls(mobile, request.getImageUrls());
        }

        Mobile saved = mobileRepository.save(mobile);
        log.info("Mobile added successfully with ID: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public MobileResponse addMobile(MobileRequest request, org.springframework.web.multipart.MultipartFile[] imageFiles) {
        log.info("Adding new smartphone with multipart images: {} - {}", request.getBrand(), request.getName());

        validatePrice(request.getPrice());

        List<com.mobilestore.mobile.dto.ImageUploadResponse> uploadedImages = java.util.Collections.emptyList();
        if (imageFiles != null && imageFiles.length > 0) {
            if (imageFiles.length > 5) {
                throw new ImageUploadException("Maximum 5 images allowed per mobile product");
            }
            uploadedImages = cloudinaryService.uploadImages(java.util.Arrays.asList(imageFiles));
        }

        Mobile mobile = mapToEntity(request);

        for (com.mobilestore.mobile.dto.ImageUploadResponse imgUpload : uploadedImages) {
            MobileImage img = MobileImage.builder()
                    .imageUrl(imgUpload.getImageUrl())
                    .imageOrder(imgUpload.getImageOrder())
                    .build();
            mobile.addImage(img);
        }

        try {
            Mobile saved = mobileRepository.save(mobile);
            log.info("Mobile added with multipart images successfully, ID: {}", saved.getId());
            return mapToResponse(saved);
        } catch (Exception e) {
            log.error("Database persistence failed after Cloudinary upload. Initiating compensation cleanup...");
            for (com.mobilestore.mobile.dto.ImageUploadResponse imgUpload : uploadedImages) {
                if (imgUpload.getPublicId() != null) {
                    cloudinaryService.deleteImage(imgUpload.getPublicId());
                }
            }
            throw e;
        }
    }

    @Override
    @Transactional
    public MobileResponse updateMobile(UUID id, MobileRequest request) {
        return updateMobile(id, request, null);
    }

    @Override
    @Transactional
    public MobileResponse updateMobile(UUID id, MobileRequest request, org.springframework.web.multipart.MultipartFile[] newImageFiles) {
        log.info("Updating smartphone with ID: {}", id);

        Mobile mobile = mobileRepository.findById(id)
                .orElseThrow(() -> new MobileNotFoundException(id));

        validatePrice(request.getPrice());

        mobile.setBrand(request.getBrand().trim());
        mobile.setName(request.getName().trim());
        mobile.setPrice(request.getPrice());
        mobile.setRam(request.getRam().trim());
        mobile.setStorage(request.getStorage().trim());
        mobile.setProcessor(request.getProcessor().trim());
        mobile.setDisplay(request.getDisplay().trim());
        mobile.setBattery(request.getBattery().trim());

        if (request.getStockStatus() != null && !request.getStockStatus().isBlank()) {
            mobile.setStockStatus(StockStatus.fromString(request.getStockStatus()));
        }

        if (request.getHidden() != null) {
            mobile.setHidden(request.getHidden());
        }

        // Image replacement logic
        if (newImageFiles != null && newImageFiles.length > 0) {
            if (newImageFiles.length > 5) {
                throw new ImageUploadException("Maximum 5 images allowed per mobile product");
            }

            // Clean up old assets from Cloudinary
            for (MobileImage oldImg : mobile.getImages()) {
                String publicId = cloudinaryService.extractPublicId(oldImg.getImageUrl());
                if (publicId != null) {
                    cloudinaryService.deleteImage(publicId);
                }
            }
            mobile.getImages().clear();

            List<com.mobilestore.mobile.dto.ImageUploadResponse> uploadedImages =
                    cloudinaryService.uploadImages(java.util.Arrays.asList(newImageFiles));

            for (com.mobilestore.mobile.dto.ImageUploadResponse imgUpload : uploadedImages) {
                MobileImage img = MobileImage.builder()
                        .imageUrl(imgUpload.getImageUrl())
                        .imageOrder(imgUpload.getImageOrder())
                        .build();
                mobile.addImage(img);
            }
            log.info("Images replaced for mobile ID: {} ({} new assets)", id, uploadedImages.size());
        } else if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            // Explicit string imageUrls provided without new multipart files
            mobile.getImages().clear();
            attachImageUrls(mobile, request.getImageUrls());
        }
        // If neither new multipart files nor new imageUrls are provided, existing images and their order are preserved.

        Mobile updated = mobileRepository.save(mobile);
        log.info("Mobile updated successfully with ID: {} ({} {})", updated.getId(), updated.getBrand(), updated.getName());

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public MobileResponse deleteMobileImage(UUID mobileId, UUID imageId) {
        log.info("Deleting image ID: {} from mobile ID: {}", imageId, mobileId);

        Mobile mobile = mobileRepository.findById(mobileId)
                .orElseThrow(() -> new MobileNotFoundException(mobileId));

        MobileImage image = mobile.getImages().stream()
                .filter(img -> img.getId() != null && img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("MobileImage", "id", imageId));

        // Delete from Cloudinary
        String publicId = cloudinaryService.extractPublicId(image.getImageUrl());
        if (publicId != null) {
            cloudinaryService.deleteImage(publicId);
        }

        mobile.removeImage(image);

        // Re-normalize image order (1..N)
        int order = 1;
        for (MobileImage img : mobile.getImages()) {
            img.setImageOrder(order++);
        }

        Mobile updated = mobileRepository.save(mobile);
        log.info("Image ID: {} removed from mobile ID: {}", imageId, mobileId);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMobile(UUID id) {
        log.info("Deleting smartphone with ID: {}", id);

        Mobile mobile = mobileRepository.findById(id)
                .orElseThrow(() -> new MobileNotFoundException(id));

        // Clean up remote assets on Cloudinary
        if (mobile.getImages() != null) {
            for (MobileImage img : mobile.getImages()) {
                String publicId = cloudinaryService.extractPublicId(img.getImageUrl());
                if (publicId != null) {
                    cloudinaryService.deleteImage(publicId);
                }
            }
        }

        mobileRepository.delete(mobile);
        log.info("Mobile deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional
    public MobileResponse updateVisibility(UUID id, Boolean hidden) {
        if (hidden == null) {
            throw new BadRequestException("Hidden status is required");
        }

        Mobile mobile = mobileRepository.findById(id)
                .orElseThrow(() -> new MobileNotFoundException(id));

        Boolean previousState = mobile.getHidden();
        mobile.setHidden(hidden);

        Mobile saved = mobileRepository.save(mobile);
        log.info("Product visibility updated for mobile ID: {} | Action: '{}' | Previous state: hidden={} -> New state: hidden={}",
                id, hidden ? "Product Hidden" : "Product Unhidden", previousState, hidden);

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public MobileResponse toggleHideMobile(UUID id) {
        Mobile mobile = mobileRepository.findById(id)
                .orElseThrow(() -> new MobileNotFoundException(id));
        return updateVisibility(id, !Boolean.TRUE.equals(mobile.getHidden()));
    }

    @Override
    @Transactional
    public MobileResponse updateStockStatus(UUID id, StockStatus stockStatus) {
        if (stockStatus == null) {
            throw new BadRequestException("Stock status is required");
        }

        Mobile mobile = mobileRepository.findById(id)
                .orElseThrow(() -> new MobileNotFoundException(id));

        StockStatus oldStatus = mobile.getStockStatus();
        mobile.setStockStatus(stockStatus);
        Mobile saved = mobileRepository.save(mobile);

        log.info("Stock status updated for mobile ID: {} | Old Status: '{}' -> New Status: '{}'",
                id, oldStatus, stockStatus);

        // If transitioning from OUT_OF_STOCK to IN_STOCK or LIMITED_STOCK, trigger subscriber alert notifications
        if (oldStatus == StockStatus.OUT_OF_STOCK && (stockStatus == StockStatus.IN_STOCK || stockStatus == StockStatus.LIMITED_STOCK)) {
            try {
                stockAlertService.notifySubscribers(saved);
            } catch (Exception ex) {
                log.warn("Failed to dispatch restock notifications for mobile ID [{}]: {}", id, ex.getMessage());
            }
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public MobileResponse updateStockStatus(UUID id, String stockStatus) {
        return updateStockStatus(id, StockStatus.fromString(stockStatus));
    }

    @Override
    public MobileResponse getMobileById(UUID id) {
        log.debug("Fetching smartphone with ID: {}", id);
        Mobile mobile = mobileRepository.findById(id)
                .orElseThrow(() -> new MobileNotFoundException(id));
        return mapToResponse(mobile);
    }

    @Override
    public List<MobileResponse> getLatestMobiles() {
        log.debug("Fetching latest 8 visible flagship mobiles for showcase");
        return mobileRepository.findTop8ByHiddenFalseOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<MobileResponse> getAllVisibleMobiles() {
        log.debug("Fetching all visible mobiles");
        return mobileRepository.findByHiddenFalseOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<MobileResponse> getAllMobiles() {
        log.debug("Fetching all mobiles including hidden (admin)");
        return mobileRepository.findAll(org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "createdAt"
        )).stream().map(this::mapToResponse).toList();
    }

    @Override
    public Page<MobileResponse> getAllMobiles(Pageable pageable) {
        log.debug("Fetching mobiles (admin): pageable={}", pageable);
        return mobileRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public Page<MobileResponse> getVisibleMobiles(Pageable pageable) {
        log.debug("Fetching visible mobiles: pageable={}", pageable);
        return mobileRepository.findByHiddenFalse(pageable).map(this::mapToResponse);
    }

    @Override
    public List<MobileResponse> getHiddenMobiles() {
        log.debug("Fetching all hidden mobiles (admin)");
        return mobileRepository.findByHiddenTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public Page<MobileResponse> getHiddenMobiles(Pageable pageable) {
        log.debug("Fetching hidden mobiles: pageable={}", pageable);
        return mobileRepository.findByHiddenTrue(pageable).map(this::mapToResponse);
    }

    @Override
    public long countVisibleMobiles() {
        return mobileRepository.countByHiddenFalse();
    }

    @Override
    public long countHiddenMobiles() {
        return mobileRepository.countByHiddenTrue();
    }

    @Override
    public Page<MobileResponse> searchMobiles(
            String keyword,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String ram,
            String storage,
            String stockStatus,
            Boolean hidden,
            Pageable pageable
    ) {
        log.debug("Executing multi-criteria search: keyword='{}', brand='{}', minPrice={}, maxPrice={}",
                keyword, brand, minPrice, maxPrice);

        StockStatus statusEnum = (stockStatus != null && !stockStatus.isBlank())
                ? StockStatus.fromString(stockStatus)
                : null;

        return mobileRepository.searchMobiles(
                keyword,
                brand,
                minPrice,
                maxPrice,
                ram,
                storage,
                statusEnum,
                hidden,
                pageable
        ).map(this::mapToResponse);
    }

    @Override
    public Page<MobileResponse> searchMobiles(
            String name,
            String brand,
            String ram,
            String storage,
            String processor,
            int page,
            int size,
            String sort
    ) {
        if (page < 0) {
            throw new BadRequestException("Page index must not be less than zero");
        }
        if (size < 1) {
            throw new BadRequestException("Page size must not be less than one");
        }
        if (size > 100) {
            throw new BadRequestException("Page size must not exceed 100");
        }

        log.info("Executing specification search: name='{}', brand='{}', ram='{}', storage='{}', processor='{}', page={}, size={}, sort='{}'",
                name, brand, ram, storage, processor, page, size, sort);

        org.springframework.data.domain.Sort sortObj =
                com.mobilestore.util.SortBuilder.buildMobileSort(sort);
        log.info("Sorting directive parsed: '{}' -> {}", sort, sortObj);

        org.springframework.data.domain.Pageable pageable =
                org.springframework.data.domain.PageRequest.of(page, size, sortObj);

        org.springframework.data.jpa.domain.Specification<Mobile> spec =
                com.mobilestore.mobile.specification.MobileSpecification.buildSearchSpecification(
                        name, brand, ram, storage, processor
                );

        Page<Mobile> matchingMobiles = mobileRepository.findAll(spec, pageable);
        log.info("Search matched {} total products (returning page {} of {})",
                matchingMobiles.getTotalElements(), page, matchingMobiles.getTotalPages());

        return matchingMobiles.map(this::mapToResponse);
    }

    @Override
    public List<MobileResponse> searchByNameRamStorage(String name, String ram, String storage) {
        log.debug("Searching visible mobiles by name='{}', ram='{}', storage='{}'", name, ram, storage);
        return mobileRepository.searchMobiles(
                name,
                null,
                null,
                null,
                ram,
                storage,
                null,
                false,
                Pageable.unpaged()
        ).getContent().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<String> getFilterBrands() {
        return mobileRepository.findDistinctBrands();
    }

    @Override
    public List<String> getFilterRamOptions() {
        return mobileRepository.findDistinctRamOptions();
    }

    @Override
    public List<String> getFilterStorageOptions() {
        return mobileRepository.findDistinctStorageOptions();
    }

    // =========================================================================
    // Reusable Private Mapping & Validation Helpers
    // =========================================================================

    private void validatePrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Price must be greater than zero");
        }
    }

    private void attachImageUrls(Mobile mobile, List<String> imageUrls) {
        int order = 1;
        for (String url : imageUrls) {
            if (url != null && !url.isBlank() && order <= 5) {
                MobileImage image = MobileImage.builder()
                        .imageUrl(url.trim())
                        .imageOrder(order++)
                        .build();
                mobile.addImage(image);
            }
        }
    }

    private Mobile mapToEntity(MobileRequest request) {
        StockStatus stockStatus = (request.getStockStatus() != null && !request.getStockStatus().isBlank())
                ? StockStatus.fromString(request.getStockStatus())
                : StockStatus.IN_STOCK;

        Boolean hidden = request.getHidden() != null ? request.getHidden() : false;

        return Mobile.builder()
                .brand(request.getBrand().trim())
                .name(request.getName().trim())
                .price(request.getPrice())
                .ram(request.getRam().trim())
                .storage(request.getStorage().trim())
                .processor(request.getProcessor().trim())
                .display(request.getDisplay().trim())
                .battery(request.getBattery().trim())
                .stockStatus(stockStatus)
                .hidden(hidden)
                .images(new ArrayList<>())
                .build();
    }

    private MobileResponse mapToResponse(Mobile mobile) {
        List<MobileImageResponse> imageResponses = new ArrayList<>();
        List<String> imageUrls = new ArrayList<>();

        if (mobile.getImages() != null) {
            mobile.getImages().stream()
                    .sorted(Comparator.comparing(MobileImage::getImageOrder))
                    .forEach(img -> {
                        imageResponses.add(MobileImageResponse.builder()
                                .id(img.getId())
                                .imageUrl(img.getImageUrl())
                                .imageOrder(img.getImageOrder())
                                .build());
                        imageUrls.add(img.getImageUrl());
                    });
        }

        return MobileResponse.builder()
                .id(mobile.getId())
                .brand(mobile.getBrand())
                .name(mobile.getName())
                .price(mobile.getPrice())
                .ram(mobile.getRam())
                .storage(mobile.getStorage())
                .processor(mobile.getProcessor())
                .display(mobile.getDisplay())
                .battery(mobile.getBattery())
                .stockStatus(mobile.getStockStatus())
                .hidden(mobile.getHidden())
                .images(imageResponses)
                .imageUrls(imageUrls)
                .createdAt(mobile.getCreatedAt())
                .updatedAt(mobile.getUpdatedAt())
                .build();
    }
}
