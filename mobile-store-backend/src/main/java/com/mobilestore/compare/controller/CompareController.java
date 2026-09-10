package com.mobilestore.compare.controller;

import com.mobilestore.compare.dto.CompareResponse;
import com.mobilestore.compare.service.CompareService;
import com.mobilestore.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * CompareController
 * Module: compare
 * REST controller for customer mobile comparison operations at /api/user/compare.
 * All endpoints strictly require ROLE_USER authentication.
 */
@Slf4j
@RestController
@RequestMapping("/api/user/compare")
@RequiredArgsConstructor
public class CompareController {

    private final CompareService compareService;

    /**
     * Retrieve authenticated customer's current comparison list.
     * GET /api/user/compare
     */
    @GetMapping
    public ResponseEntity<CompareResponse> getComparison(Authentication authentication) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("GET /api/user/compare called by customer: '{}'", email);

        CompareResponse response = compareService.getComparison(email);
        return ResponseEntity.ok(response);
    }

    /**
     * Add a smartphone flagship to customer's comparison list.
     * POST /api/user/compare/{mobileId}
     */
    @PostMapping("/{mobileId}")
    public ResponseEntity<CompareResponse> addToCompare(
            Authentication authentication,
            @PathVariable("mobileId") UUID mobileId
    ) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("POST /api/user/compare/{} called by customer: '{}'", mobileId, email);

        CompareResponse response = compareService.addToCompare(email, mobileId);
        return ResponseEntity.ok(response);
    }

    /**
     * Remove a single smartphone flagship from customer's comparison list.
     * DELETE /api/user/compare/{mobileId}
     */
    @DeleteMapping("/{mobileId}")
    public ResponseEntity<CompareResponse> removeFromCompare(
            Authentication authentication,
            @PathVariable("mobileId") UUID mobileId
    ) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("DELETE /api/user/compare/{} called by customer: '{}'", mobileId, email);

        CompareResponse response = compareService.removeFromCompare(email, mobileId);
        return ResponseEntity.ok(response);
    }

    /**
     * Clear all smartphone flagships from customer's comparison list.
     * DELETE /api/user/compare
     */
    @DeleteMapping
    public ResponseEntity<CompareResponse> clearComparison(Authentication authentication) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        log.info("DELETE /api/user/compare called by customer: '{}'", email);

        CompareResponse response = compareService.clearComparison(email);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieve total count of compared mobiles for customer.
     * GET /api/user/compare/count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getCompareCount(Authentication authentication) {
        verifyCustomerAuth(authentication);

        String email = authentication.getName();
        long count = compareService.getCompareCount(email);
        return ResponseEntity.ok(Map.of("count", count, "maxLimit", 4));
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
