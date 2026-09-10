package com.mobilestore.compare.service.impl;

import com.mobilestore.compare.dto.CompareItemResponse;
import com.mobilestore.compare.dto.CompareResponse;
import com.mobilestore.compare.entity.CompareItem;
import com.mobilestore.compare.repository.CompareRepository;
import com.mobilestore.compare.service.CompareService;
import com.mobilestore.exception.BadRequestException;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.mobile.repository.MobileRepository;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * CompareServiceImpl
 * Module: compare
 * Implementation of CompareService enforcing a maximum of 4 compared mobiles per customer,
 * idempotency, ownership validation, and DTO transformations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CompareServiceImpl implements CompareService {

    private static final int MAX_COMPARE_LIMIT = 4;

    private final CompareRepository compareRepository;
    private final MobileRepository mobileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public CompareResponse getComparison(String userEmail) {
        log.info("Fetching compare list for customer: '{}'", userEmail);
        User user = findUserByEmail(userEmail);

        List<CompareItem> items = compareRepository.findByUserOrderByCreatedAtAsc(user);
        List<CompareItemResponse> itemResponses = items.stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());

        return CompareResponse.builder()
                .items(itemResponses)
                .count(itemResponses.size())
                .maxLimit(MAX_COMPARE_LIMIT)
                .message("Comparison list retrieved successfully")
                .build();
    }

    @Override
    @Transactional
    public CompareResponse addToCompare(String userEmail, UUID mobileId) {
        log.info("Adding mobile '{}' to compare list for customer: '{}'", mobileId, userEmail);
        User user = findUserByEmail(userEmail);

        Mobile mobile = mobileRepository.findById(mobileId)
                .orElseThrow(() -> new ResourceNotFoundException("Mobile", "id", mobileId));

        // 1. Idempotency Check: if already present, return current list
        if (compareRepository.existsByUserAndMobile(user, mobile)) {
            log.info("Mobile '{}' is already in compare list for customer: '{}'", mobileId, userEmail);
            CompareResponse response = getComparison(userEmail);
            response.setMessage("Mobile is already in comparison list");
            return response;
        }

        // 2. Maximum Limit Check: enforce max 4 products
        long currentCount = compareRepository.countByUser(user);
        if (currentCount >= MAX_COMPARE_LIMIT) {
            log.warn("Customer '{}' attempted to add mobile beyond max limit of {}", userEmail, MAX_COMPARE_LIMIT);
            throw new BadRequestException("Maximum of four mobiles can be compared.");
        }

        // 3. Save new compare item
        CompareItem newEntry = CompareItem.builder()
                .user(user)
                .mobile(mobile)
                .build();
        compareRepository.save(newEntry);
        log.info("Saved mobile '{}' to comparison list for customer: '{}'", mobileId, userEmail);

        CompareResponse response = getComparison(userEmail);
        response.setMessage("Product added to comparison");
        return response;
    }

    @Override
    @Transactional
    public CompareResponse removeFromCompare(String userEmail, UUID mobileId) {
        log.info("Removing mobile '{}' from compare list for customer: '{}'", mobileId, userEmail);
        User user = findUserByEmail(userEmail);

        mobileRepository.findById(mobileId).ifPresent(mobile -> {
            compareRepository.deleteByUserAndMobile(user, mobile);
            log.info("Removed mobile '{}' from compare list for customer: '{}'", mobileId, userEmail);
        });

        CompareResponse response = getComparison(userEmail);
        response.setMessage("Product removed from comparison");
        return response;
    }

    @Override
    @Transactional
    public CompareResponse clearComparison(String userEmail) {
        log.info("Clearing all comparison items for customer: '{}'", userEmail);
        User user = findUserByEmail(userEmail);

        compareRepository.deleteAllByUser(user);

        CompareResponse response = getComparison(userEmail);
        response.setMessage("Comparison list cleared");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public long getCompareCount(String userEmail) {
        User user = findUserByEmail(userEmail);
        return compareRepository.countByUser(user);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email != null ? email.trim() : "")
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private CompareItemResponse mapToItemResponse(CompareItem compareItem) {
        Mobile m = compareItem.getMobile();

        List<String> imageUrls = new ArrayList<>();
        String firstImageUrl = null;
        if (m.getImages() != null && !m.getImages().isEmpty()) {
            for (var img : m.getImages()) {
                if (img.getImageUrl() != null && !img.getImageUrl().isBlank()) {
                    imageUrls.add(img.getImageUrl());
                }
            }
            if (!imageUrls.isEmpty()) {
                firstImageUrl = imageUrls.get(0);
            }
        }

        String stockStr = m.getStockStatus() != null ? m.getStockStatus().name() : "IN_STOCK";

        return CompareItemResponse.builder()
                .mobileId(m.getId())
                .name(m.getName())
                .brand(m.getBrand())
                .price(m.getPrice())
                .formattedPrice(formatPrice(m.getPrice()))
                .images(imageUrls)
                .firstImage(firstImageUrl)
                .ram(m.getRam())
                .storage(m.getStorage())
                .processor(m.getProcessor())
                .display(m.getDisplay())
                .battery(m.getBattery())
                .stock(stockStr)
                .stockStatus(stockStr)
                .addedDate(compareItem.getCreatedAt())
                .build();
    }

    private String formatPrice(BigDecimal price) {
        if (price == null) {
            return "$0.00";
        }
        try {
            NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.US);
            return formatter.format(price);
        } catch (Exception e) {
            return "$" + price;
        }
    }
}
