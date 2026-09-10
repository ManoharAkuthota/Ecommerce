package com.mobilestore.wishlist.service.impl;

import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.mobile.entity.MobileImage;
import com.mobilestore.mobile.repository.MobileRepository;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.repository.UserRepository;
import com.mobilestore.wishlist.dto.WishlistItemResponse;
import com.mobilestore.wishlist.dto.WishlistResponse;
import com.mobilestore.wishlist.entity.Wishlist;
import com.mobilestore.wishlist.repository.WishlistRepository;
import com.mobilestore.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * WishlistServiceImpl
 * Module: wishlist
 * Implementation of WishlistService managing customer saved devices,
 * idempotent additions, graceful removals, and count metrics.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final MobileRepository mobileRepository;

    @Override
    @Transactional(readOnly = true)
    public WishlistResponse getWishlist(String userEmail) {
        log.info("Retrieving saved wishlist for customer: '{}'", userEmail);
        User user = findUserByEmail(userEmail);

        List<Wishlist> entries = wishlistRepository.findByUserOrderByCreatedAtDesc(user);
        List<WishlistItemResponse> items = entries.stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());

        return WishlistResponse.builder()
                .items(items)
                .count(items.size())
                .message("Wishlist retrieved successfully")
                .build();
    }

    @Override
    @Transactional
    public WishlistResponse addToWishlist(String userEmail, UUID mobileId) {
        log.info("Adding mobile '{}' to customer '{}' wishlist", mobileId, userEmail);
        User user = findUserByEmail(userEmail);

        Mobile mobile = mobileRepository.findById(mobileId)
                .orElseThrow(() -> new ResourceNotFoundException("Mobile", "id", mobileId));

        // Idempotency: only persist if not already present
        if (!wishlistRepository.existsByUserAndMobile(user, mobile)) {
            Wishlist newEntry = Wishlist.builder()
                    .user(user)
                    .mobile(mobile)
                    .build();
            wishlistRepository.save(newEntry);
            log.info("Saved mobile '{}' to wishlist for customer '{}'", mobileId, userEmail);
        } else {
            log.info("Mobile '{}' is already in wishlist for customer '{}'", mobileId, userEmail);
        }

        WishlistResponse response = getWishlist(userEmail);
        response.setMessage("Product saved to wishlist");
        return response;
    }

    @Override
    @Transactional
    public WishlistResponse removeFromWishlist(String userEmail, UUID mobileId) {
        log.info("Removing mobile '{}' from customer '{}' wishlist", mobileId, userEmail);
        User user = findUserByEmail(userEmail);

        // Gracefully look up mobile and delete if present
        mobileRepository.findById(mobileId).ifPresent(mobile -> {
            wishlistRepository.findByUserAndMobile(user, mobile)
                    .ifPresent(entry -> {
                        wishlistRepository.delete(entry);
                        log.info("Removed mobile '{}' from customer '{}' wishlist", mobileId, userEmail);
                    });
        });

        WishlistResponse response = getWishlist(userEmail);
        response.setMessage("Product removed from wishlist");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public long getWishlistCount(String userEmail) {
        User user = findUserByEmail(userEmail);
        return wishlistRepository.countByUser(user);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email != null ? email.trim() : "")
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private WishlistItemResponse mapToItemResponse(Wishlist wishlist) {
        Mobile m = wishlist.getMobile();

        // Extract primary showcase image URL
        String firstImageUrl = null;
        if (m.getImages() != null && !m.getImages().isEmpty()) {
            firstImageUrl = m.getImages().get(0).getImageUrl();
        }

        return WishlistItemResponse.builder()
                .mobileId(m.getId())
                .name(m.getName())
                .brand(m.getBrand())
                .price(m.getPrice())
                .formattedPrice(formatPrice(m.getPrice()))
                .firstImage(firstImageUrl)
                .ram(m.getRam())
                .storage(m.getStorage())
                .stock(m.getStockStatus() != null ? m.getStockStatus().name() : "IN_STOCK")
                .addedDate(wishlist.getCreatedAt())
                .build();
    }

    private String formatPrice(BigDecimal price) {
        if (price == null) {
            return "$0.00";
        }
        try {
            NumberFormat nf = NumberFormat.getCurrencyInstance(Locale.US);
            return nf.format(price);
        } catch (Exception e) {
            return "$" + price;
        }
    }
}
