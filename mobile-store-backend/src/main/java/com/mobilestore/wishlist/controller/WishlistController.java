package com.mobilestore.wishlist.controller;

import com.mobilestore.exception.InvalidCredentialsException;
import com.mobilestore.wishlist.dto.WishlistResponse;
import com.mobilestore.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * WishlistController
 * Module: wishlist
 * REST controller for customer wishlist management at /api/user/wishlist.
 * All endpoints strictly require ROLE_USER authentication.
 */
@Slf4j
@RestController
@RequestMapping("/api/user/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    /**
     * Retrieve authenticated customer's saved wishlist items.
     * GET /api/user/wishlist
     */
    @GetMapping
    public ResponseEntity<WishlistResponse> getWishlist(Authentication authentication) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("GET /api/user/wishlist called by customer: '{}'", email);

        WishlistResponse response = wishlistService.getWishlist(email);
        return ResponseEntity.ok(response);
    }

    /**
     * Add a smartphone flagship to the customer's wishlist.
     * POST /api/user/wishlist/{mobileId}
     */
    @PostMapping("/{mobileId}")
    public ResponseEntity<WishlistResponse> addToWishlist(
            Authentication authentication,
            @PathVariable("mobileId") UUID mobileId
    ) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("POST /api/user/wishlist/{} called by customer: '{}'", mobileId, email);

        WishlistResponse response = wishlistService.addToWishlist(email, mobileId);
        return ResponseEntity.ok(response);
    }

    /**
     * Remove a smartphone flagship from the customer's wishlist.
     * DELETE /api/user/wishlist/{mobileId}
     */
    @DeleteMapping("/{mobileId}")
    public ResponseEntity<WishlistResponse> removeFromWishlist(
            Authentication authentication,
            @PathVariable("mobileId") UUID mobileId
    ) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("DELETE /api/user/wishlist/{} called by customer: '{}'", mobileId, email);

        WishlistResponse response = wishlistService.removeFromWishlist(email, mobileId);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieve total count of saved wishlist items for the customer.
     * GET /api/user/wishlist/count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getWishlistCount(Authentication authentication) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        long count = wishlistService.getWishlistCount(email);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Verify customer authentication and strict ROLE_USER authority.
     */
    private void verifyCustomerAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new InvalidCredentialsException("Access denied: Not authenticated");
        }

        boolean isCustomer = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_USER".equals(a.getAuthority()));

        if (!isCustomer) {
            throw new AccessDeniedException("Access denied: Customer privileges (ROLE_USER) required");
        }
    }
}
